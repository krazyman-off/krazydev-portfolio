# KrazyDev — chiffrement hybride RSA-2048 (OAEP) + AES-256-CBC + HMAC-SHA256.
# Pourquoi hybride : RSA seul ne peut chiffrer que ~200 octets. Ici chaque
# fichier reçoit 2 clés aléatoires (AES-256 + HMAC-256), enveloppées par RSA.
# Format par fichier : vault/<chemin>.bin (chiffré brut) + .meta.json
#   { v, rsa_b64, iv_b64, hmac_b64, sha256, size, mtime }.
# PowerShell 5.1 + .NET Framework uniquement, aucune dépendance.
param(
  [ValidateSet("keygen", "protect", "unprotect")]
  [string]$Action = "",
  [string]$Repo = "",
  [string]$PubKey = "",
  [string]$PrivKey = "",
  [string]$Vault = "",
  [string]$Plain = "",
  [string]$Restore = ""
)

$ErrorActionPreference = "Stop"
$SecureDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($Repo))    { $Repo    = Split-Path -Parent $SecureDir }
if ([string]::IsNullOrWhiteSpace($PubKey))  { $PubKey  = Join-Path $SecureDir "keys\public.xml" }
if ([string]::IsNullOrWhiteSpace($PrivKey)) { $PrivKey = Join-Path $SecureDir "keys\private.xml" }
if ([string]::IsNullOrWhiteSpace($Vault))   { $Vault   = Join-Path $SecureDir "vault" }
if ([string]::IsNullOrWhiteSpace($Plain))   { $Plain   = Join-Path $SecureDir "origin-plain" }
if ([string]::IsNullOrWhiteSpace($Restore)) { $Restore = Join-Path $SecureDir "restore-check" }

function New-Rsa([string]$xmlPath) {
  $rsa = New-Object Security.Cryptography.RSACryptoServiceProvider(2048)
  $rsa.PersistKeyInCsp = $false
  $rsa.FromXmlString([IO.File]::ReadAllText($xmlPath))
  return $rsa
}

function Get-Sha256Hex([byte[]]$bytes) {
  $h = [Security.Cryptography.SHA256]::Create()
  try { return ([BitConverter]::ToString($h.ComputeHash($bytes)) -replace "-", "").ToLower() }
  finally { $h.Dispose() }
}

function Compare-Bytes([byte[]]$a, [byte[]]$b) {
  if ($a.Length -ne $b.Length) { return $false }
  $d = 0
  for ($i = 0; $i -lt $a.Length; $i++) { $d = $d -bor ($a[$i] -bxor $b[$i]) }
  return ($d -eq 0)
}

function Invoke-Keygen {
  $kd = Split-Path -Parent $PubKey
  if (-not (Test-Path -LiteralPath $kd)) { New-Item -ItemType Directory -Path $kd | Out-Null }
  if ((Test-Path -LiteralPath $PubKey) -or (Test-Path -LiteralPath $PrivKey)) {
    throw "Clés déjà présentes ($PubKey). Supprime-les à la main pour régénérer."
  }
  $rsa = New-Object Security.Cryptography.RSACryptoServiceProvider(2048)
  try {
    $rsa.PersistKeyInCsp = $false
    [IO.File]::WriteAllText($PrivKey, $rsa.ToXmlString($true))
    [IO.File]::WriteAllText($PubKey, $rsa.ToXmlString($false))
  } finally { $rsa.Dispose() }
  $fp = Get-Sha256Hex ([Text.Encoding]::UTF8.GetBytes([IO.File]::ReadAllText($PubKey)))
  Write-Output "OK clés RSA-2048 générées."
  Write-Output "  publique  : $PubKey"
  Write-Output "  privée    : $PrivKey  (NE JAMAIS la commiter ni l'envoyer)"
  Write-Output "  empreinte : $fp"
}

function Protect-OneFile([string]$src, [string]$bin, [string]$meta, $rsa) {
  $plain = [IO.File]::ReadAllBytes($src)
  $aes = New-Object Security.Cryptography.AesManaged
  try {
    $aes.KeySize = 256; $aes.Mode = [Security.Cryptography.CipherMode]::CBC
    $aes.Padding = [Security.Cryptography.PaddingMode]::PKCS7
    $aes.GenerateKey(); $aes.GenerateIV()
    # Snapshot AVANT Dispose (Dispose remet Key/IV à zéro).
    $keyBytes = [byte[]]$aes.Key.Clone()
    $ivBytes = [byte[]]$aes.IV.Clone()
    $enc = $aes.CreateEncryptor()
    try { $ct = $enc.TransformFinalBlock($plain, 0, $plain.Length) }
    finally { $enc.Dispose() }
    $macKey = New-Object byte[] 32
    $rng = [Security.Cryptography.RNGCryptoServiceProvider]::Create()
    try { $rng.GetBytes($macKey) } finally { $rng.Dispose() }
    $hm = New-Object Security.Cryptography.HMACSHA256
    try {
      $hm.Key = $macKey
      $tag = $hm.ComputeHash([byte[]]($ivBytes + $ct))
    } finally { $hm.Dispose() }
    $wrap = $rsa.Encrypt([byte[]]($keyBytes + $macKey), $true)  # OAEP
  } finally { $aes.Dispose() }
  $bd = Split-Path -Parent $bin
  if (-not (Test-Path -LiteralPath $bd)) { New-Item -ItemType Directory -Path $bd | Out-Null }
  [IO.File]::WriteAllBytes($bin, $ct)
  $fi = Get-Item -LiteralPath $src
  $m = [ordered]@{
    v = 1; alg = "RSA-2048-OAEP/AES-256-CBC/HMAC-SHA256"
    rsa_b64 = [Convert]::ToBase64String($wrap)
    iv_b64 = [Convert]::ToBase64String($ivBytes)
    hmac_b64 = [Convert]::ToBase64String($tag)
    sha256 = Get-Sha256Hex $plain
    size = $plain.Length
    mtime = $fi.LastWriteTimeUtc.ToString("o")
  }
  [IO.File]::WriteAllText($meta, ($m | ConvertTo-Json))
}

function Unprotect-OneFile([string]$bin, [string]$meta, [string]$dest, $rsa) {
  $m = Get-Content -LiteralPath $meta -Raw | ConvertFrom-Json
  $wrap = [Convert]::FromBase64String($m.rsa_b64)
  $iv = [Convert]::FromBase64String($m.iv_b64)
  $tag = [Convert]::FromBase64String($m.hmac_b64)
  $ct = [IO.File]::ReadAllBytes($bin)
  $keys = $rsa.Decrypt($wrap, $true)
  if ($keys.Length -ne 64) { throw "Enveloppe RSA invalide pour $bin" }
  $ek = [byte[]]$keys[0..31]; $mk = [byte[]]$keys[32..63]
  $hm = New-Object Security.Cryptography.HMACSHA256
  try {
    $hm.Key = $mk
    $calc = $hm.ComputeHash([byte[]]($iv + $ct))
  } finally { $hm.Dispose() }
  if (-not (Compare-Bytes $calc $tag)) { throw "HMAC invalide (fichier altéré) : $bin" }
  $aes = New-Object Security.Cryptography.AesManaged
  try {
    $aes.KeySize = 256; $aes.Mode = [Security.Cryptography.CipherMode]::CBC
    $aes.Padding = [Security.Cryptography.PaddingMode]::PKCS7
    $aes.Key = $ek; $aes.IV = $iv
    $dec = $aes.CreateDecryptor()
    try { $pt = $dec.TransformFinalBlock($ct, 0, $ct.Length) }
    finally { $dec.Dispose() }
  } finally { $aes.Dispose() }
  if ((Get-Sha256Hex $pt) -ne $m.sha256) { throw "SHA256 post-déchiffrement invalide : $bin" }
  $dd = Split-Path -Parent $dest
  if (-not (Test-Path -LiteralPath $dd)) { New-Item -ItemType Directory -Path $dd | Out-Null }
  [IO.File]::WriteAllBytes($dest, $pt)
}

function Get-TrackedFiles {
  $out = & git -C $Repo ls-files 2>$null
  if (-not $?) { throw "git ls-files a échoué (Repo=$Repo)" }
  return $out | Where-Object { $_ -notmatch "^secure/" -and $_ -ne ".git" }
}

function Invoke-Protect {
  $rsa = New-Rsa $PubKey
  try {
    $files = Get-TrackedFiles
    $n = 0
    foreach ($rel in $files) {
      $rel = $rel -replace "/", "\"
      $src = Join-Path $Repo $rel
      if (-not (Test-Path -LiteralPath $src)) { continue }
      if ((Get-Item -LiteralPath $src) -is [IO.DirectoryInfo]) { continue }
      $bin = Join-Path $Vault ($rel + ".bin")
      $meta = Join-Path $Vault ($rel + ".meta.json")
      Protect-OneFile $src $bin $meta $rsa
      $pd = Join-Path $Plain $rel
      $pp = Split-Path -Parent $pd
      if (-not (Test-Path -LiteralPath $pp)) { New-Item -ItemType Directory -Path $pp | Out-Null }
      Copy-Item -LiteralPath $src -Destination $pd -Force
      $n++
    }
    Write-Output "OK $n fichiers chiffrés -> $Vault | clone en clair -> $Plain"
  } finally { $rsa.Dispose() }
}

function Invoke-Unprotect {
  $rsa = New-Rsa $PrivKey
  try {
    $metas = Get-ChildItem -LiteralPath $Vault -Filter "*.meta.json" -Recurse -File
    $n = 0
    foreach ($mf in $metas) {
      $rel = $mf.FullName.Substring($Vault.Length + 1) -replace "\.meta\.json$", ""
      $bin = Join-Path $Vault ($rel + ".bin")
      $dest = Join-Path $Restore $rel
      Unprotect-OneFile $bin $mf.FullName $dest $rsa
      $n++
    }
    Write-Output "OK $n fichiers déchiffrés et vérifiés (HMAC+SHA256) -> $Restore"
  } finally { $rsa.Dispose() }
}

switch ($Action) {
  "keygen"    { Invoke-Keygen }
  "protect"   { Invoke-Protect }
  "unprotect" { Invoke-Unprotect }
  default     { throw "Action inconnue. Usage : crypto.ps1 -Action keygen|protect|unprotect" }
}
