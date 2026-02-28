package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"

	"github.com/ashish5180/ai-decision-review/internal/ai"
	"github.com/ashish5180/ai-decision-review/internal/models"
	"github.com/ashish5180/ai-decision-review/internal/store"
)

// DecisionHandler handles all /api/decisions endpoints.
type DecisionHandler struct {
	store  *store.DynamoStore
	gemini *ai.GeminiClient
}

// NewDecisionHandler creates a new handler with all dependencies.
func NewDecisionHandler(s *store.DynamoStore, g *ai.GeminiClient) *DecisionHandler {
	return &DecisionHandler{
		store:  s,
		gemini: g,
	}
}

// CreateDecision handles POST /api/decisions
func (h *DecisionHandler) CreateDecision(w http.ResponseWriter, r *http.Request) {
	var req models.CreateDecisionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Title == "" {
		writeError(w, http.StatusBadRequest, "Title is required")
		return
	}

	now := time.Now().UTC()
	decision := &models.Decision{
		ID:           uuid.New().String(),
		Title:        req.Title,
		Architecture: req.Architecture,
		APIDesign:    req.APIDesign,
		DataModel:    req.DataModel,
		TechStack:    req.TechStack,
		TechChoices:  req.TechChoices,
		Status:       "pending",
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	// Save to DynamoDB first with pending status
	if err := h.store.PutDecision(r.Context(), decision); err != nil {
		log.Printf("ERROR saving decision: %v", err)
		writeError(w, http.StatusInternalServerError, "Failed to save decision")
		return
	}

	// Call AI analysis (synchronous for MVP — Phase 1)
	feedback, err := h.gemini.AnalyzeDecision(r.Context(), decision)
	if err != nil {
		log.Printf("WARN AI analysis failed: %v", err)
		decision.Status = "failed"
		decision.UpdatedAt = time.Now().UTC()
		_ = h.store.PutDecision(r.Context(), decision)
		// Still return the decision, just without AI feedback
		writeJSON(w, http.StatusCreated, decision)
		return
	}

	// Update decision with AI feedback
	decision.AIFeedback = feedback
	decision.Status = "reviewed"
	decision.UpdatedAt = time.Now().UTC()

	if err := h.store.PutDecision(r.Context(), decision); err != nil {
		log.Printf("ERROR updating decision with feedback: %v", err)
	}

	writeJSON(w, http.StatusCreated, decision)
}

// ListDecisions handles GET /api/decisions
func (h *DecisionHandler) ListDecisions(w http.ResponseWriter, r *http.Request) {
	decisions, err := h.store.ListDecisions(r.Context())
	if err != nil {
		log.Printf("ERROR listing decisions: %v", err)
		writeError(w, http.StatusInternalServerError, "Failed to list decisions")
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"decisions": decisions,
		"count":     len(decisions),
	})
}

// GetDecision handles GET /api/decisions/{id}
func (h *DecisionHandler) GetDecision(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "Decision ID is required")
		return
	}

	decision, err := h.store.GetDecision(r.Context(), id)
	if err != nil {
		log.Printf("ERROR getting decision: %v", err)
		writeError(w, http.StatusInternalServerError, "Failed to get decision")
		return
	}

	if decision == nil {
		writeError(w, http.StatusNotFound, "Decision not found")
		return
	}

	writeJSON(w, http.StatusOK, decision)
}
