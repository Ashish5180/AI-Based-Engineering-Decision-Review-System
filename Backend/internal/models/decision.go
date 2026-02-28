package models

import "time"

// Decision represents an engineering decision submitted for AI review.
type Decision struct {
	ID           string      `json:"id" dynamodbav:"id"`
	Title        string      `json:"title" dynamodbav:"title"`
	Architecture string      `json:"architecture" dynamodbav:"architecture"`
	APIDesign    string      `json:"api_design" dynamodbav:"api_design"`
	DataModel    string      `json:"data_model" dynamodbav:"data_model"`
	TechStack    string      `json:"tech_stack" dynamodbav:"tech_stack"`
	TechChoices  []string    `json:"tech_choices" dynamodbav:"tech_choices"`
	Status       string      `json:"status" dynamodbav:"status"` // pending | reviewed | failed
	AIFeedback   *AIFeedback `json:"ai_feedback,omitempty" dynamodbav:"ai_feedback,omitempty"`
	CreatedAt    time.Time   `json:"created_at" dynamodbav:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at" dynamodbav:"updated_at"`
}

// AIFeedback holds the structured AI analysis response.
type AIFeedback struct {
	RiskLevel       string       `json:"risk_level" dynamodbav:"risk_level"`
	Scalability     string       `json:"scalability" dynamodbav:"scalability"`
	Maintainability string       `json:"maintainability" dynamodbav:"maintainability"`
	HighRisks       int          `json:"high_risks" dynamodbav:"high_risks"`
	Insights        []string     `json:"insights" dynamodbav:"insights"`
	ActionPlan      []ActionItem `json:"action_plan" dynamodbav:"action_plan"`
}

// ActionItem is a single suggested action from the AI.
type ActionItem struct {
	Category    string `json:"category" dynamodbav:"category"` // e.g. "Immediate Fix", "Optimization"
	Description string `json:"description" dynamodbav:"description"`
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
