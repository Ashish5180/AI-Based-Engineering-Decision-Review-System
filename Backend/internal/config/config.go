package config

import "os"

// Config holds all application configuration loaded from environment variables.
type Config struct {
	AWSRegion    string
	DynamoTable  string
	GeminiAPIKey string
}

// Load reads environment variables and returns a Config.
// Defaults are provided for local development.
func Load() *Config {
	return &Config{
		AWSRegion:    getEnv("AWS_REGION", "us-east-1"),
		DynamoTable:  getEnv("DYNAMO_TABLE", "Decisions"),
		GeminiAPIKey: getEnv("GEMINI_API_KEY", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
