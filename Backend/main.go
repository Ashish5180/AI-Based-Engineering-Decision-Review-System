package main

import (
	"log"
	"os"

	"github.com/ashish5180/ai-decision-review/internal/config"
	"github.com/ashish5180/ai-decision-review/internal/server"
)

func main() {
	cfg := config.Load()

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
