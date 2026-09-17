//! KrazyDev — Serveur portfolio Rust (Axum)
//! Sert uniquement le dossier `public/` (aucune exposition de src/, Cargo.toml, yml racine).
//! Couche applicative réelle: rate-limit global, concurrence bornée, timeout,
//! corps de requête borné, headers sécu, compression.
//! Le rate-limit par IP / WAF reste au edge (Cloudflare + Nginx en prod).

use std::time::Duration;

use axum::{error_handling::HandleErrorLayer, extract::DefaultBodyLimit, routing::get, Router, http::HeaderValue, http::StatusCode};
use tower::{buffer::BufferLayer, limit::{ConcurrencyLimitLayer, RateLimitLayer}, timeout::TimeoutLayer};
use tower_http::{map_response_body::MapResponseBodyLayer, services::ServeDir, trace::TraceLayer, compression::CompressionLayer};

// NOTE: pas de 'unsafe-inline' en script-src — le site n'utilise plus aucun
// handler inline ni <script> inline (voir js/app.js + js/secret-particles.js).
// style-src garde 'unsafe-inline' (attributs style="" massifs dans le HTML).
const CSP: &str = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://formsubmit.co; base-uri 'self'; form-action 'self' https://formsubmit.co; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests";

const MAX_BODY_BYTES: usize = 1024 * 1024; // 1 Mio — le site ne fait que du GET statique
const RATE_PER_SEC: u64 = 200; // seau global : 200 req/s (le par-IP est au edge)
const MAX_CONCURRENT: usize = 128;
const REQ_TIMEOUT_SECS: u64 = 15;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter("info")
        .init();

    let static_service = ServeDir::new("public")
        .precompressed_gzip()
        .append_index_html_on_directories(true);

    // Corps borné : garde-fou Clone-compatible, appliqué au routeur.
    let router = Router::new()
        .route("/health", get(health))
        .fallback_service(static_service)
        .layer(DefaultBodyLimit::max(MAX_BODY_BYTES));

    // RateLimit n'est pas Clone (requis par axum::serve) : BufferLayer isole
    // la partie non-Clone dans une tâche de fond et rend toute la pile Clone.
    // ServiceBuilder : première couche = la plus externe.
    // Trace/Compression changent le type du body : MapResponseBodyLayer le
    // renormalise en axum::body::Body (exigé par axum::serve).
    // Requête: body → trace → headers → compression → erreurs → buffer → rate-limit → concurrence → timeout → routeur.
    // Seul Timeout peut échouer (tout le reste est Infallible) → 503, headers sécu inclus.
    let app = tower::ServiceBuilder::new()
        .layer(MapResponseBodyLayer::new(axum::body::Body::new))
        .layer(TraceLayer::new_for_http())
        .layer(axum::middleware::from_fn(security_headers))
        .layer(CompressionLayer::new())
        .layer(HandleErrorLayer::new(handle_layer_error))
        .layer(BufferLayer::new(1024))
        .layer(RateLimitLayer::new(RATE_PER_SEC, Duration::from_secs(1)))
        .layer(ConcurrencyLimitLayer::new(MAX_CONCURRENT))
        .layer(TimeoutLayer::new(Duration::from_secs(REQ_TIMEOUT_SECS)))
        .service(router);

    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("KrazyDev server en écoute sur http://{addr} — prod: derrière Cloudflare + Nginx (WAF + rate-limit)");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    // Shared clone le service par connexion (possible grâce à BufferLayer).
    axum::serve(listener, tower::make::Shared::new(app)).await.unwrap();
}

async fn health() -> (StatusCode, &'static str) {
    (StatusCode::OK, "ok — krazydev")
}

/// Convertit les erreurs des couches (en pratique : Timeout) en 503.
/// Jamais de détail interne exposé au client.
async fn handle_layer_error(_err: axum::BoxError) -> (StatusCode, &'static str) {
    (StatusCode::SERVICE_UNAVAILABLE, "service temporairement saturé — réessaie")
}

async fn security_headers(
    req: axum::extract::Request,
    next: axum::middleware::Next,
) -> axum::response::Response {
    let mut res = next.run(req).await;

    let headers = res.headers_mut();
    headers.insert("X-Frame-Options", HeaderValue::from_static("DENY"));
    headers.insert("X-Content-Type-Options", HeaderValue::from_static("nosniff"));
    headers.insert("Referrer-Policy", HeaderValue::from_static("no-referrer"));
    // HSTS : actif uniquement en HTTPS (inoffensif en local HTTP).
    headers.insert(
        "Strict-Transport-Security",
        HeaderValue::from_static("max-age=63072000; includeSubDomains; preload"),
    );
    headers.insert(
        "Permissions-Policy",
        HeaderValue::from_static("camera=(), microphone=(), geolocation=()"),
    );
    headers.insert(
        "Content-Security-Policy",
        HeaderValue::from_static(CSP),
    );

    res
}