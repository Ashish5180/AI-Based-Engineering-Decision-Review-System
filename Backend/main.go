package main

import (
	"log"
	"os"

	"github.com/ashish5180/ai-decision-review/internal/config"
	"github.com/ashish5180/ai-decision-review/internal/logger"
	"github.com/ashish5180/ai-decision-review/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file for local development
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, assuming environment variables are set manually")
	}
	// Initialize structured logging
	logger.Init("ai-decision-review", logger.INFO)
	l := logger.Default()

	cfg := config.Load()
	l.Info("Configuration loaded successfully")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv, err := server.New(cfg)
	if err != nil {
		log.Fatalf("❌ Failed to initialize server: %v", err)
	}

	log.Printf("🚀 Server starting on :%s", port)
	if err := srv.Run(":" + port); err != nil {
		log.Fatalf("❌ Server error: %v", err)
	}
}
