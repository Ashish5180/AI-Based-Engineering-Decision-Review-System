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
	// Initialize MongoDB store
	mongo, err := store.NewMongoStore(cfg)
	if err != nil {
		return nil, err
	}

	// Initialize AI client
	openaiClient := ai.NewOpenAIClient(cfg.OpenAIAPIKey)

	// Initialize handlers
	decisionHandler := handler.NewDecisionHandler(mongo, openaiClient)
	patternHandler := handler.NewPatternHandler(mongo, openaiClient)

	// Setup routes
	mux := http.NewServeMux()

	// Health & Readiness
	mux.HandleFunc("GET /api/health", handler.HealthCheck)
	mux.HandleFunc("GET /api/ready", handler.ReadinessCheck)
	mux.HandleFunc("GET /api/metrics", middleware.MetricsHandler)

	// Decisions
	mux.HandleFunc("POST /api/decisions", decisionHandler.CreateDecision)
	mux.HandleFunc("GET /api/decisions", decisionHandler.ListDecisions)
	mux.HandleFunc("GET /api/decisions/{id}", decisionHandler.GetDecision)

	// Patterns
	mux.HandleFunc("GET /api/patterns", patternHandler.ListPatterns)
	mux.HandleFunc("GET /api/patterns/{id}", patternHandler.GetPattern)
	mux.HandleFunc("POST /api/patterns/tailor", patternHandler.TailorPattern)

	// Apply middleware chain: Logger → Metrics → CORS → Router
	var h http.Handler = mux
	h = middleware.CORS(h)
	h = middleware.Metrics(h)
	h = middleware.Logger(h)

	return &Server{handler: h}, nil
}

// Run starts the HTTP server on the given address.
func (s *Server) Run(addr string) error {
	return http.ListenAndServe(addr, s.handler)
}
