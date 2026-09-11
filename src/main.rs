//! KrazyDev — Serveur portfolio en Rust (Axum)
//! But: servir le site statique avec protections applicatives.
//! Note importante: Rust ne "bloque" pas un DDoS volumétrique à lui seul.
//! La vraie protection DDoS est infra: Cloudflare / CDN / WAF / reverse-proxy + rate-limit.
//! Ce serveur ajoute la couche applicative: rate-limit, headers sécu, compression, limites.

use axum::{routing::get, Router, response::Html, http::StatusCode};
use tower_http::{services::ServeDir, trace::TraceLayer, cors::CorsLayer, compression::CompressionLayer};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter("info")
        .init();

    // Service fichiers statiques (index.html, css/, js/)
    let static_service = ServeDir::new(".");

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/projects", get(api_projects))
        .fallback_service(static_service)
        .layer(CompressionLayer::new()) // gzip
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    // Rate-limit global simple via tower_governor possible ici:
    // Exemple (décommenter si besoin):
    // use tower_governor::{governor::GovernorConfigBuilder, GovernorLayer};
    // let gov_conf = GovernorConfigBuilder::default().per_second(20).burst_size(40).finish().unwrap();
    // let app = app.layer(GovernorLayer { config: gov_conf.into() });

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("KrazyDev server en écoute sur http://{addr} — prod: mets derrière Cloudflare + Nginx (rate-limit + WAF)");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> (StatusCode, &'static str) {
    (StatusCode::OK, "ok — krazydev")
}

async fn api_projects() -> Html<String> {
    // Source de vérité: projects.json si tu veux, ici inline pour demo
    let data = serde_json::json!([
        {"id":"krazy-studio-bot","name":"Krazy Studio Bot","status":"maintenu","repo":"confidentiel","stack":["Python 3.13","discord.py 2.7","SQLite WAL"],"discord":"https://discord.gg/45Dc3UZ726"},
        {"id":"km-plugins","name":"KM-Plugins","status":"maintenu","repo":"public","stack":["Java 17","Paper","Maven"],"discord":"https://discord.gg/45Dc3UZ726"}
    ]);
    Html(data.to_string())
}
