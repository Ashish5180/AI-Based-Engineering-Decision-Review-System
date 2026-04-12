package middleware

import (
	"fmt"
	"net/http"
	"sync"
	"time"
)

var (
	requestCount  int
	errorCount    int
	totalDuration time.Duration
	mu            sync.RWMutex
)

// Metrics is a simple middleware to track basic API metrics.
func Metrics(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		wrapped := &statusWriter{ResponseWriter: w, status: http.StatusOK}

		next.ServeHTTP(wrapped, r)

		duration := time.Since(start)

		mu.Lock()
		requestCount++
		if wrapped.status >= 400 {
			errorCount++
		}
		totalDuration += duration
		mu.Unlock()
	})
}

// MetricsHandler handles GET /api/metrics
func MetricsHandler(w http.ResponseWriter, r *http.Request) {
	mu.RLock()
	defer mu.RUnlock()

	avgDuration := "0s"
	if requestCount > 0 {
		avgDuration = (totalDuration / time.Duration(requestCount)).Round(time.Millisecond).String()
	}

	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprintf(w, "# HELP http_requests_total Total number of HTTP requests\n")
	fmt.Fprintf(w, "http_requests_total %d\n", requestCount)
	fmt.Fprintf(w, "# HELP http_errors_total Total number of HTTP errors (4xx+)\n")
	fmt.Fprintf(w, "http_errors_total %d\n", errorCount)
	fmt.Fprintf(w, "# HELP http_average_duration_ms Average request duration\n")
	fmt.Fprintf(w, "http_average_duration %s\n", avgDuration)
}
