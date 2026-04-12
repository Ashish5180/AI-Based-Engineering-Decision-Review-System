package models

import "time"

// Pattern represents an architectural pattern in the knowledge base.
type Pattern struct {
	ID         string    `json:"id" bson:"_id"`
	Title      string    `json:"title" bson:"title"`
	Category   string    `json:"category" bson:"category"`
	Icon       string    `json:"icon" bson:"icon"` // Name of the lucide icon
	Problem    string    `json:"problem" bson:"problem"`
	Solution   string    `json:"solution" bson:"solution"`
	Difficulty string    `json:"difficulty" bson:"difficulty"`
	CreatedAt  time.Time `json:"created_at" bson:"created_at"`
}

// PatternTailorRequest is used for the unique "Tailor to my Stack" feature.
type PatternTailorRequest struct {
	PatternID string `json:"pattern_id"`
	TechStack string `json:"tech_stack"`
}

// PatternTailoredResponse holds the AI-tailored implementation details.
type PatternTailoredResponse struct {
	Implementation string   `json:"implementation"`
	BestPractices  []string `json:"best_practices"`
}
