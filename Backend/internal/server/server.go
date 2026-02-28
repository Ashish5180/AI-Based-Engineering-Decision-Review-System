package server

import (
	"net/http"

	"github.com/ashish5180/ai-decision-review/internal/ai"
	"github.com/ashish5180/ai-decision-review/internal/config"
	"github.com/ashish5180/ai-decision-review/internal/handler"
	"github.com/ashish5180/ai-decision-review/internal/middleware"
	"github.com/ashish5180/ai-decision-review/internal/store"
)

// Server is the main HTTP server wrapper.
type Server struct {
	handler http.Handler
}

// New initializes the server with all dependencies wired together.
func New(cfg *config.Config) (*Server, error) {
	// Initialize DynamoDB store
	dynamo, err := store.NewDynamoStore(cfg)
	if err != nil {
		return nil, err
	}

	// Initialize AI client
	gemini := ai.NewGeminiClient(cfg.GeminiAPIKey)

	// Initialize handlers
	decisionHandler := handler.NewDecisionHandler(dynamo, gemini)

	// Setup routes
	mux := http.NewServeMux()

	// Health
	mux.HandleFunc("GET /api/health", handler.HealthCheck)

	// Decisions
	mux.HandleFunc("POST /api/decisions", decisionHandler.CreateDecision)
	mux.HandleFunc("GET /api/decisions", decisionHandler.ListDecisions)
	mux.HandleFunc("GET /api/decisions/{id}", decisionHandler.GetDecision)

	// Apply middleware chain: Logger → CORS → Router
	var h http.Handler = mux
	h = middleware.CORS(h)
	h = middleware.Logger(h)

	return &Server{handler: h}, nil
}

// Run starts the HTTP server on the given address.
func (s *Server) Run(addr string) error {
	return http.ListenAndServe(addr, s.handler)
}
