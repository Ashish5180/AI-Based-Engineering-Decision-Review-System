package models

import "time"

// Decision represents an engineering decision submitted for AI review.
type Decision struct {
	ID           string      `json:"id" bson:"_id"`
	Title        string      `json:"title" bson:"title"`
	Architecture string      `json:"architecture" bson:"architecture"`
	APIDesign    string      `json:"api_design" bson:"api_design"`
	DataModel    string      `json:"data_model" bson:"data_model"`
	TechStack    string      `json:"tech_stack" bson:"tech_stack"`
	TechChoices  []string    `json:"tech_choices" bson:"tech_choices"`
	Status       string      `json:"status" bson:"status"` // pending | reviewed | failed
	AIFeedback   *AIFeedback `json:"ai_feedback,omitempty" bson:"ai_feedback,omitempty"`
	CreatedAt    time.Time   `json:"created_at" bson:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at" bson:"updated_at"`
}

// AIFeedback holds the structured AI analysis response.
type AIFeedback struct {
	RiskLevel       string       `json:"risk_level" bson:"risk_level"`
	Scalability     string       `json:"scalability" bson:"scalability"`
	Maintainability string       `json:"maintainability" bson:"maintainability"`
	HighRisks       int          `json:"high_risks" bson:"high_risks"`
	Insights        []string     `json:"insights" bson:"insights"`
	ActionPlan      []ActionItem `json:"action_plan" bson:"action_plan"`
}

// ActionItem is a single suggested action from the AI.
type ActionItem struct {
	Category    string `json:"category" bson:"category"` // e.g. "Immediate Fix", "Optimization"
	Description string `json:"description" bson:"description"`
}

// CreateDecisionRequest is the expected payload from the frontend.
type CreateDecisionRequest struct {
	Title        string   `json:"title"`
	Architecture string   `json:"architecture"`
	APIDesign    string   `json:"api_design"`
	DataModel    string   `json:"data_model"`
	TechStack    string   `json:"tech_stack"`
	TechChoices  []string `json:"tech_choices"`
}
