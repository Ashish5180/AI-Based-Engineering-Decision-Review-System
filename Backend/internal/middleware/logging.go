package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/ashish5180/ai-decision-review/internal/logger"
	"github.com/google/uuid"
)

type contextKey string

const RequestIDKey contextKey = "request_id"

// Logger logs incoming requests with method, path, status, and duration in a structured format.
func Logger(next http.Handler) http.Handler {
	l := logger.WithComponent("http")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Generate or extract request ID
		requestID := r.Header.Get("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}

		// Add request ID back to response and context
		w.Header().Set("X-Request-ID", requestID)
		ctx := context.WithValue(r.Context(), RequestIDKey, requestID)
		r = r.WithContext(ctx)

		wrapped := &statusWriter{ResponseWriter: w, status: http.StatusOK}

		next.ServeHTTP(wrapped, r)

		l.WithRequest(requestID).Info("HTTP Request handled", map[string]interface{}{
			"method":   r.Method,
			"path":     r.URL.Path,
			"status":   wrapped.status,
			"duration": time.Since(start).Round(time.Millisecond).String(),
			"remote":   r.RemoteAddr,
		})
	})
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}
