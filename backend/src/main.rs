use axum::{Router, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct ScrapeRequest { url: String }
#[derive(Serialize)]
struct Recipe { title: String, ingredients: Vec<String>, instructions: Vec<String>, prep_time: String, cook_time: String, servings: u32 }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = Router::new()
        .route("/", axum::routing::get(root))
        .route("/health", axum::routing::get(health))
        .route("/scrape", axum::routing::post(scrape_recipe))
        .layer(tower_http::cors::CorsLayer::permissive());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    tracing::info!("justtherecipe backend running on :{}", port);
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Json<serde_json::Value> { Json(serde_json::json!({"service": "justtherecipe", "status": "running"})) }
async fn health() -> Json<serde_json::Value> { Json(serde_json::json!({"status": "healthy"})) }

async fn scrape_recipe(Json(req): Json<ScrapeRequest>) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "title": "Delicious Recipe",
        "ingredients": ["2 cups flour", "1 cup sugar", "3 eggs", "1/2 cup butter"],
        "instructions": ["Preheat oven to 350F", "Mix dry ingredients", "Add wet ingredients", "Bake for 30 minutes"],
        "prep_time": "15 min",
        "cook_time": "30 min",
        "servings": 4,
        "source_url": req.url
    }))
}
