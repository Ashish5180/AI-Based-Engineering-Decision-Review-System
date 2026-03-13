package logger

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
	"time"
)

// Level represents a log severity level.
type Level int

const (
	DEBUG Level = iota
	INFO
	WARN
	ERROR
)

func (l Level) String() string {
	switch l {
	case DEBUG:
		return "DEBUG"
	case INFO:
		return "INFO"
	case WARN:
		return "WARN"
	case ERROR:
		return "ERROR"
	default:
		return "UNKNOWN"
	}
}

// LogEntry represents a single structured log entry.
type LogEntry struct {
	Timestamp string                 `json:"timestamp"`
	Level     string                 `json:"level"`
	Message   string                 `json:"message"`
	RequestID string                 `json:"request_id,omitempty"`
	Component string                 `json:"component,omitempty"`
	Duration  string                 `json:"duration,omitempty"`
	Fields    map[string]interface{} `json:"fields,omitempty"`
}

// Logger provides structured, leveled logging.
type Logger struct {
	mu        sync.Mutex
	minLevel  Level
	component string
	output    *log.Logger
}

var (
	defaultLogger *Logger
	once          sync.Once
)

// Init initializes the global logger. Safe to call multiple times — only first call takes effect.
func Init(component string, minLevel Level) {
	once.Do(func() {
		defaultLogger = &Logger{
			minLevel:  minLevel,
			component: component,
			output:    log.New(os.Stdout, "", 0),
		}
	})
}

// Default returns the global logger instance. Initializes with defaults if not already done.
func Default() *Logger {
	if defaultLogger == nil {
		Init("app", INFO)
	}
	return defaultLogger
}

// WithComponent returns a new Logger that tags entries with the given component name.
func WithComponent(component string) *Logger {
	d := Default()
	return &Logger{
		minLevel:  d.minLevel,
		component: component,
		output:    d.output,
	}
}

func (l *Logger) log(level Level, msg string, requestID string, fields map[string]interface{}) {
	if level < l.minLevel {
		return
	}

	entry := LogEntry{
		Timestamp: time.Now().UTC().Format(time.RFC3339Nano),
		Level:     level.String(),
		Message:   msg,
		RequestID: requestID,
		Component: l.component,
		Fields:    fields,
	}

	l.mu.Lock()
	defer l.mu.Unlock()

	data, err := json.Marshal(entry)
	if err != nil {
		l.output.Printf("LOG_MARSHAL_ERROR: %v | original: %s", err, msg)
		return
	}
	l.output.Println(string(data))
}

// Info logs an informational message.
func (l *Logger) Info(msg string, fields ...map[string]interface{}) {
	f := mergeFields(fields)
	l.log(INFO, msg, "", f)
}

// Warn logs a warning message.
func (l *Logger) Warn(msg string, fields ...map[string]interface{}) {
	f := mergeFields(fields)
	l.log(WARN, msg, "", f)
}

// Error logs an error message.
func (l *Logger) Error(msg string, fields ...map[string]interface{}) {
	f := mergeFields(fields)
	l.log(ERROR, msg, "", f)
}

// Debug logs a debug message.
func (l *Logger) Debug(msg string, fields ...map[string]interface{}) {
	f := mergeFields(fields)
	l.log(DEBUG, msg, "", f)
}

// WithRequest logs with a request ID for correlation.
func (l *Logger) WithRequest(requestID string) *RequestLogger {
	return &RequestLogger{logger: l, requestID: requestID}
}

// RequestLogger binds a request ID for correlated log entries.
type RequestLogger struct {
	logger    *Logger
	requestID string
}

// Info logs an informational message with request correlation.
func (rl *RequestLogger) Info(msg string, fields ...map[string]interface{}) {
	f := mergeFields(fields)
	rl.logger.log(INFO, msg, rl.requestID, f)
}

// Warn logs a warning message with request correlation.
func (rl *RequestLogger) Warn(msg string, fields ...map[string]interface{}) {
	f := mergeFields(fields)
	rl.logger.log(WARN, msg, rl.requestID, f)
}

// Error logs an error message with request correlation.
func (rl *RequestLogger) Error(msg string, fields ...map[string]interface{}) {
	f := mergeFields(fields)
	rl.logger.log(ERROR, msg, rl.requestID, f)
}

// Debug logs a debug message with request correlation.
func (rl *RequestLogger) Debug(msg string, fields ...map[string]interface{}) {
	f := mergeFields(fields)
	rl.logger.log(DEBUG, msg, rl.requestID, f)
}

// Infof logs a formatted informational message.
func (l *Logger) Infof(format string, args ...interface{}) {
	l.log(INFO, fmt.Sprintf(format, args...), "", nil)
}

// Warnf logs a formatted warning message.
func (l *Logger) Warnf(format string, args ...interface{}) {
	l.log(WARN, fmt.Sprintf(format, args...), "", nil)
}

// Errorf logs a formatted error message.
func (l *Logger) Errorf(format string, args ...interface{}) {
	l.log(ERROR, fmt.Sprintf(format, args...), "", nil)
}

func mergeFields(fields []map[string]interface{}) map[string]interface{} {
	if len(fields) == 0 {
		return nil
	}
	merged := make(map[string]interface{})
	for _, f := range fields {
		for k, v := range f {
			merged[k] = v
		}
	}
	return merged
}
