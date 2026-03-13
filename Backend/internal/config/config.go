package config

import "os"

// Config holds all application configuration loaded from environment variables.
type Config struct {
	MongoURI     string
	MongoDB      string
	OpenAIAPIKey string
}

// Load reads environment variables and returns a Config.
// Defaults are provided for local development.
func Load() *Config {
	return &Config{
		MongoURI:     getEnv("MONGO_URI", "mongodb://localhost:27017"),
		MongoDB:      getEnv("MONGO_DB", "ai_decision_review"),
		OpenAIAPIKey: getEnv("OPENAI_API_KEY", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
