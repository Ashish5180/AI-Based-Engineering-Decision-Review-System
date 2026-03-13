package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/ashish5180/ai-decision-review/internal/models"
)

const openAIEndpoint = "https://api.openai.com/v1/chat/completions"

// OpenAIClient communicates with the OpenAI Chat Completions API.
type OpenAIClient struct {
	apiKey     string
	httpClient *http.Client
}

// NewOpenAIClient creates a new OpenAI client.
func NewOpenAIClient(apiKey string) *OpenAIClient {
	return &OpenAIClient{
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

// AnalyzeDecision sends the decision details to OpenAI and returns structured AI feedback.
func (c *OpenAIClient) AnalyzeDecision(ctx context.Context, d *models.Decision) (*models.AIFeedback, error) {
	prompt := buildPrompt(d)

	reqBody := openAIRequest{
		Model: "gpt-4o-mini",
		Messages: []message{
			{
				Role:    "system",
				Content: "You are an expert software architect. You analyze engineering decisions and respond ONLY with valid JSON. No markdown, no extra text.",
			},
			{
				Role:    "user",
				Content: prompt,
			},
		},
		Temperature:    0.7,
		MaxTokens:      2048,
		ResponseFormat: &responseFormat{Type: "json_object"},
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, openAIEndpoint, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("openai request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("openai returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return parseOpenAIResponse(respBody)
}

// TailorPattern generates a technology-specific implementation for an architectural pattern.
func (c *OpenAIClient) TailorPattern(ctx context.Context, p *models.Pattern, techStack string) (*models.PatternTailoredResponse, error) {
	prompt := fmt.Sprintf(`Tailor the following architectural pattern to this specific technology stack: "%s"

Pattern Title: %s
Pattern Problem: %s
Pattern Solution: %s

Please provide high-quality, practical implementation details.
Respond ONLY with valid JSON in this exact format:
{
  "implementation": "A professional architectural guide. USE Markdown headers (##, ###), bullet points, and TRIPLE-BACKTICK code blocks for examples. Break topics into clear sections.",
  "best_practices": ["Bullet point 1", "Bullet point 2"]
}

No markdown outside the JSON object.`, techStack, p.Title, p.Problem, p.Solution)

	reqBody := openAIRequest{
		Model: "gpt-4o-mini",
		Messages: []message{
			{
				Role:    "system",
				Content: "You are a world-class system architect and polyglot engineer. You provide precise, practical, and technology-specific implementation advice.",
			},
			{
				Role:    "user",
				Content: prompt,
			},
		},
		Temperature:    0.3,
		MaxTokens:      3000,
		ResponseFormat: &responseFormat{Type: "json_object"},
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, openAIEndpoint, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var openAIResp openAIResponse
	if err := json.Unmarshal(respBody, &openAIResp); err != nil {
		return nil, err
	}

	if len(openAIResp.Choices) == 0 {
		return nil, fmt.Errorf("no response from AI")
	}

	rawText := openAIResp.Choices[0].Message.Content
	var tailored models.PatternTailoredResponse
	if err := json.Unmarshal([]byte(rawText), &tailored); err != nil {
		return nil, err
	}

	return &tailored, nil
}

// buildPrompt creates a structured prompt for the AI to analyze.
func buildPrompt(d *models.Decision) string {
	techChoices := "N/A"
	if len(d.TechChoices) > 0 {
		techChoices = strings.Join(d.TechChoices, ", ")
	}

	return fmt.Sprintf(`Analyze the following engineering decision and provide a structured JSON review:

**Project Title:** %s

**Architecture Description:**
%s

**API Design & Patterns:**
%s

**Data Model & Schema:**
%s

**Technology Stack:** %s
**Tech Choices:** %s

---

Respond ONLY with valid JSON in this exact format:
{
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "scalability": "Poor" | "Moderate" | "Good" | "Excellent",
  "maintainability": "Poor" | "Moderate" | "Good" | "Excellent",
  "high_risks": <number of high risk items found>,
  "insights": [
    "insight 1 - be specific about the risk and which part of the architecture it affects",
    "insight 2",
    "insight 3"
  ],
  "action_plan": [
    {"category": "Immediate Fix", "description": "specific actionable suggestion"},
    {"category": "Optimization", "description": "specific optimization recommendation"},
    {"category": "Long-term", "description": "long-term architectural improvement"}
  ]
}

Be specific, technical, and actionable. Focus on real engineering tradeoffs.`,
		d.Title,
		nonEmpty(d.Architecture, "Not provided"),
		nonEmpty(d.APIDesign, "Not provided"),
		nonEmpty(d.DataModel, "Not provided"),
		nonEmpty(d.TechStack, "Not provided"),
		techChoices,
	)
}

func nonEmpty(s, fallback string) string {
	if strings.TrimSpace(s) == "" {
		return fallback
	}
	return s
}

// parseOpenAIResponse extracts the AIFeedback from the OpenAI JSON response.
func parseOpenAIResponse(body []byte) (*models.AIFeedback, error) {
	var openAIResp openAIResponse
	if err := json.Unmarshal(body, &openAIResp); err != nil {
		return nil, fmt.Errorf("unmarshal openai response: %w", err)
	}

	if len(openAIResp.Choices) == 0 {
		return nil, fmt.Errorf("no choices in openai response")
	}

	rawText := openAIResp.Choices[0].Message.Content

	// Clean potential markdown fences around JSON
	rawText = strings.TrimSpace(rawText)
	rawText = strings.TrimPrefix(rawText, "```json")
	rawText = strings.TrimPrefix(rawText, "```")
	rawText = strings.TrimSuffix(rawText, "```")
	rawText = strings.TrimSpace(rawText)

	var feedback models.AIFeedback
	if err := json.Unmarshal([]byte(rawText), &feedback); err != nil {
		return nil, fmt.Errorf("unmarshal AI feedback JSON: %w (raw: %s)", err, rawText)
	}

	return &feedback, nil
}

// --- OpenAI API types ---

type openAIRequest struct {
	Model          string          `json:"model"`
	Messages       []message       `json:"messages"`
	Temperature    float64         `json:"temperature"`
	MaxTokens      int             `json:"max_tokens"`
	ResponseFormat *responseFormat `json:"response_format,omitempty"`
}

type message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type responseFormat struct {
	Type string `json:"type"`
}

type openAIResponse struct {
	Choices []choice `json:"choices"`
}

type choice struct {
	Message message `json:"message"`
}
