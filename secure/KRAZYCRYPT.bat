@echo off
REM KrazyDev — KRAZYCRYPT : chiffrement hybride RSA-2048 + AES-256.
REM 1 = generer les cles | 2 = chiffrer | 3 = dechiffrer
setlocal
set SCRIPT=%~dp0crypto.ps1
set DEFKEY=%~dp0keys

:menu
echo.
echo  ===== KRAZYCRYPT =====
echo   1. Generer les cles (publique=chiffrement, privee=dechiffrement)
echo   2. Chiffrer le repo -^> secure\vault (+ clone clair secure\origin-plain)
echo   3. Dechiffrer le vault -^> secure\restore-check
echo   4. Quitter
echo  ======================
set /p CHOIX=Option [1-4] :
if "%CHOIX%"=="1" goto keygen
if "%CHOIX%"=="2" goto protect
if "%CHOIX%"=="3" goto unprotect
if "%CHOIX%"=="4" exit /b 0
echo Choix invalide.
goto menu

:keygen
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" -Action keygen
pause
goto menu

:protect
set /p PUB=Cle publique [%DEFKEY%\public.xml] :
if "%PUB%"=="" set PUB=%DEFKEY%\public.xml
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" -Action protect -PubKey "%PUB%"
pause
goto menu

:unprotect
set /p PRIV=Cle privee [%DEFKEY%\private.xml] :
if "%PRIV%"=="" set PRIV=%DEFKEY%\private.xml
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" -Action unprotect -PrivKey "%PRIV%"
pause
goto menu
