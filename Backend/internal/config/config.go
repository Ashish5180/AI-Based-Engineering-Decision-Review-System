package config

import "os"

// Config holds all application configuration loaded from environment variables
type Config struct {
	MongoURI     string
	MongoDB      string
	OpenAIAPIKey string
}

// Load reads environment variables and returns a Config.
func Load() *Config {
	return &Config{
		MongoURI:     os.Getenv("MONGO_URI"),
		MongoDB:      getEnv("MONGO_DB", "ai_decision_review"),
		OpenAIAPIKey: os.Getenv("OPENAI_API_KEY"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
