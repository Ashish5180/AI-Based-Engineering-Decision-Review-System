package handler

import "net/http"

// HealthCheck handles GET /api/health (Liveness)
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status":  "healthy",
		"service": "ai-decision-review",
	})
}

// ReadinessCheck handles GET /api/ready
func ReadinessCheck(w http.ResponseWriter, r *http.Request) {
	// For now, if we can reach this, we are ready.
	// In a real app, check DB connectivity here.
	writeJSON(w, http.StatusOK, map[string]string{
		"status":  "ready",
		"service": "ai-decision-review",
	})
}
