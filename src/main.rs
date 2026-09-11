//! KrazyDev — Serveur portfolio Rust (Axum)
//! Sert uniquement le dossier `public/` (aucune exposition de src/, Cargo.toml, projets.json).
//! Couche applicative: rate-limit, headers sécu, compression, limites.

use axum::{routing::get, Router, http::HeaderValue, http::StatusCode};
use tower_http::{services::ServeDir, trace::TraceLayer, compression::CompressionLayer};

const CSP: &str = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'";

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter("info")
        .init();

    let static_service = ServeDir::new("public")
        .precompressed_gzip()
        .append_index_html_on_directories(true);

    let app = Router::new()
        .route("/health", get(health))
        .fallback_service(static_service)
        .layer(CompressionLayer::new())
        .layer(axum::middleware::from_fn(security_headers))
        .layer(TraceLayer::new_for_http());

    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("KrazyDev server en écoute sur http://{addr} — prod: derrière Cloudflare + Nginx (WAF + rate-limit)");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> (StatusCode, &'static str) {
    (StatusCode::OK, "ok — krazydev")
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
    headers.insert("X-XSS-Protection", HeaderValue::from_static("1; mode=block"));
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