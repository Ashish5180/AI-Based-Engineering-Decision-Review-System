package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ashish5180/ai-decision-review/internal/ai"
	"github.com/ashish5180/ai-decision-review/internal/models"
	"github.com/ashish5180/ai-decision-review/internal/store"
)

// PatternHandler handles all /api/patterns endpoints.
type PatternHandler struct {
	store  *store.MongoStore
	openai *ai.OpenAIClient
}

// NewPatternHandler creates a new handler with all dependencies.
func NewPatternHandler(s *store.MongoStore, o *ai.OpenAIClient) *PatternHandler {
	return &PatternHandler{
		store:  s,
		openai: o,
	}
}

// ListPatterns handles GET /api/patterns
func (h *PatternHandler) ListPatterns(w http.ResponseWriter, r *http.Request) {
	patterns, err := h.store.ListPatterns(r.Context())
	if err != nil {
		log.Printf("ERROR listing patterns: %v", err)
		writeError(w, http.StatusInternalServerError, "Failed to list patterns")
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"patterns": patterns,
		"count":    len(patterns),
	})
}

// GetPattern handles GET /api/patterns/{id}
func (h *PatternHandler) GetPattern(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "Pattern ID is required")
		return
	}

	pattern, err := h.store.GetPattern(r.Context(), id)
	if err != nil {
		log.Printf("ERROR getting pattern: %v", err)
		writeError(w, http.StatusInternalServerError, "Failed to get pattern")
		return
	}

	if pattern == nil {
		writeError(w, http.StatusNotFound, "Pattern not found")
		return
	}

	writeJSON(w, http.StatusOK, pattern)
}

// TailorPattern handles POST /api/patterns/tailor
// This is the UNIQUE STANDOUT FEATURE: AI-Based Pattern Tailoring
func (h *PatternHandler) TailorPattern(w http.ResponseWriter, r *http.Request) {
	var req models.PatternTailorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.PatternID == "" || req.TechStack == "" {
		writeError(w, http.StatusBadRequest, "Pattern ID and Tech Stack are required")
		return
	}

	// Fetch the pattern first
	pattern, err := h.store.GetPattern(r.Context(), req.PatternID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to fetch pattern")
		return
	}
	if pattern == nil {
		writeError(w, http.StatusNotFound, "Pattern not found")
		return
	}

	// Tailor using AI
	tailored, err := h.openai.TailorPattern(r.Context(), pattern, req.TechStack)
	if err != nil {
		log.Printf("ERROR tailoring pattern: %v", err)
		writeError(w, http.StatusInternalServerError, "AI failed to tailor pattern")
		return
	}

	writeJSON(w, http.StatusOK, tailored)
}
