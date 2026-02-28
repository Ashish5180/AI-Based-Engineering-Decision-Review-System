# 🚀 AI Decision Review — Go Backend

## Folder Structure

```
Backend/
├── main.go                        # Entry point — only starts the server
├── go.mod / go.sum                # Go module dependencies
├── .env.example                   # Environment variable template
├── .gitignore
├── README.md
└── internal/
    ├── config/
    │   └── config.go              # Loads env vars into Config struct
    ├── models/
    │   └── decision.go            # Data models (Decision, AIFeedback, Request DTOs)
    ├── store/
    │   └── dynamo.go              # DynamoDB CRUD operations
    ├── ai/
    │   └── gemini.go              # Google Gemini AI client & prompt engineering
    ├── handler/
    │   ├── decisions.go           # HTTP handlers for /api/decisions
    │   ├── health.go              # Health check handler
    │   └── response.go            # JSON response helpers
    ├── middleware/
    │   ├── cors.go                # CORS middleware for frontend
    │   └── logging.go             # Request logging middleware
    └── server/
        └── server.go              # Wires everything together, registers routes
```

## API Endpoints

| Method | Path                    | Description               |
|--------|-------------------------|---------------------------|
| GET    | `/api/health`           | Health check              |
| POST   | `/api/decisions`        | Submit a new decision     |
| GET    | `/api/decisions`        | List all decisions        |
| GET    | `/api/decisions/{id}`   | Get decision by ID        |

## Quick Start

### 1. Set up environment

```bash
cp .env.example .env
# Edit .env with your AWS credentials and Gemini API key
```

### 2. Get a free Gemini API key

Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create a free API key.

### 3. Run the server

```bash
# Load env vars and run
source .env && go run main.go
```

Server starts at `http://localhost:8080`

### 4. Test the API

```bash
# Health check
curl http://localhost:8080/api/health

# Submit a decision
curl -X POST http://localhost:8080/api/decisions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Commerce Microservices",
    "architecture": "Microservices with API Gateway",
    "api_design": "REST with JWT auth",
    "data_model": "Users, Orders, Products collections",
    "tech_stack": "Node.js, MongoDB, Redis",
    "tech_choices": ["Microservices", "Cloud Native"]
  }'

# List all decisions
curl http://localhost:8080/api/decisions

# Get a specific decision
curl http://localhost:8080/api/decisions/{id}
```

## Tech Stack

- **Go 1.24** — Backend language
- **AWS DynamoDB** — NoSQL storage
- **Google Gemini 2.0 Flash** — Free AI analysis engine
- **net/http** — Standard library HTTP server (no external framework)
