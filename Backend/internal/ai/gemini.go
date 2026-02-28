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

const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

// GeminiClient communicates with the free Google Gemini API.
type GeminiClient struct {
	apiKey     string
	httpClient *http.Client
}

// NewGeminiClient creates a new Gemini AI client.
func NewGeminiClient(apiKey string) *GeminiClient {
	return &GeminiClient{
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

// AnalyzeDecision sends the decision details to Gemini and returns structured AI feedback.
func (c *GeminiClient) AnalyzeDecision(ctx context.Context, d *models.Decision) (*models.AIFeedback, error) {
	prompt := buildPrompt(d)

	reqBody := geminiRequest{
		Contents: []content{
			{
				Parts: []part{
					{Text: prompt},
				},
			},
		},
		GenerationConfig: generationConfig{
			Temperature:  0.7,
			MaxTokens:    2048,
			ResponseMime: "application/json",
		},
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}

	url := fmt.Sprintf("%s?key=%s", geminiEndpoint, c.apiKey)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("gemini request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("gemini returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return parseGeminiResponse(respBody)
}

// buildPrompt creates a structured prompt for the AI to analyze.
func buildPrompt(d *models.Decision) string {
	techChoices := "N/A"
	if len(d.TechChoices) > 0 {
		techChoices = strings.Join(d.TechChoices, ", ")
	}

	return fmt.Sprintf(`You are an expert software architect reviewing an engineering decision.

Analyze the following decision and provide a structured JSON review:

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

// parseGeminiResponse extracts the AIFeedback from the Gemini JSON response.
func parseGeminiResponse(body []byte) (*models.AIFeedback, error) {
	var geminiResp geminiResponse
	if err := json.Unmarshal(body, &geminiResp); err != nil {
		return nil, fmt.Errorf("unmarshal gemini response: %w", err)
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("no content in gemini response")
	}

	rawText := geminiResp.Candidates[0].Content.Parts[0].Text

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

// --- Gemini API types ---

type geminiRequest struct {
	Contents         []content        `json:"contents"`
	GenerationConfig generationConfig `json:"generationConfig"`
}

type content struct {
	Parts []part `json:"parts"`
}

type part struct {
	Text string `json:"text"`
}

type generationConfig struct {
	Temperature  float64 `json:"temperature"`
	MaxTokens    int     `json:"maxOutputTokens"`
	ResponseMime string  `json:"responseMimeType,omitempty"`
}

type geminiResponse struct {
	Candidates []candidate `json:"candidates"`
}

type candidate struct {
	Content content `json:"content"`
}
