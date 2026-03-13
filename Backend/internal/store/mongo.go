package store

import (
	"context"
	"fmt"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"

	"github.com/ashish5180/ai-decision-review/internal/config"
	"github.com/ashish5180/ai-decision-review/internal/models"
)

// MongoStore handles all MongoDB operations for decisions with integrated caching.
type MongoStore struct {
	client     *mongo.Client
	collection *mongo.Collection

	// Cache layer
	mu         sync.RWMutex
	listCache  []models.Decision
	itemCache  map[string]*models.Decision
	lastUpdate time.Time

	// Patterns
	pColl *mongo.Collection
}

// NewMongoStore connects to MongoDB and returns a ready-to-use store.
func NewMongoStore(cfg *config.Config) (*MongoStore, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		return nil, fmt.Errorf("mongo connect: %w", err)
	}

	// Verify connectivity
	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("mongo ping: %w", err)
	}

	collection := client.Database(cfg.MongoDB).Collection("decisions")
	pColl := client.Database(cfg.MongoDB).Collection("patterns")

	s := &MongoStore{
		client:     client,
		collection: collection,
		pColl:      pColl,
		itemCache:  make(map[string]*models.Decision),
	}

	// Seed patterns if empty
	go s.SeedPatterns(context.Background())

	return s, nil
}

// Close gracefully disconnects from MongoDB.
func (s *MongoStore) Close(ctx context.Context) error {
	return s.client.Disconnect(ctx)
}

// PutDecision inserts or replaces a decision in MongoDB and invalidates the cache.
func (s *MongoStore) PutDecision(ctx context.Context, d *models.Decision) error {
	filter := bson.M{"_id": d.ID}
	opts := options.Replace().SetUpsert(true)

	_, err := s.collection.ReplaceOne(ctx, filter, d, opts)
	if err != nil {
		return fmt.Errorf("upsert decision: %w", err)
	}

	// Invalidate and update cache
	s.mu.Lock()
	defer s.mu.Unlock()
	s.listCache = nil // Invalidate list cache
	s.itemCache[d.ID] = d
	s.lastUpdate = time.Now()

	return nil
}

// GetDecision retrieves a single decision by ID, using cache if available.
func (s *MongoStore) GetDecision(ctx context.Context, id string) (*models.Decision, error) {
	s.mu.RLock()
	if d, ok := s.itemCache[id]; ok {
		s.mu.RUnlock()
		return d, nil
	}
	s.mu.RUnlock()

	filter := bson.M{"_id": id}

	var d models.Decision
	err := s.collection.FindOne(ctx, filter).Decode(&d)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // not found
		}
		return nil, fmt.Errorf("find decision: %w", err)
	}

	// Update cache
	s.mu.Lock()
	s.itemCache[id] = &d
	s.mu.Unlock()

	return &d, nil
}

// ListDecisions returns all decisions from the collection, using cache if available.
func (s *MongoStore) ListDecisions(ctx context.Context) ([]models.Decision, error) {
	s.mu.RLock()
	if s.listCache != nil {
		defer s.mu.RUnlock()
		return s.listCache, nil
	}
	s.mu.RUnlock()

	cursor, err := s.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("find decisions: %w", err)
	}
	defer cursor.Close(ctx)

	var decisions []models.Decision
	if err := cursor.All(ctx, &decisions); err != nil {
		return nil, fmt.Errorf("decode decisions: %w", err)
	}

	if decisions == nil {
		decisions = []models.Decision{}
	}

	// Update cache
	s.mu.Lock()
	s.listCache = decisions
	s.mu.Unlock()

	return decisions, nil
}

// Patterns API

func (s *MongoStore) ListPatterns(ctx context.Context) ([]models.Pattern, error) {
	cursor, err := s.pColl.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var patterns []models.Pattern
	if err := cursor.All(ctx, &patterns); err != nil {
		return nil, err
	}

	if patterns == nil {
		patterns = []models.Pattern{}
	}
	return patterns, nil
}

func (s *MongoStore) GetPattern(ctx context.Context, id string) (*models.Pattern, error) {
	var p models.Pattern
	err := s.pColl.FindOne(ctx, bson.M{"_id": id}).Decode(&p)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (s *MongoStore) SeedPatterns(ctx context.Context) {
	count, _ := s.pColl.CountDocuments(ctx, bson.M{})
	if count > 0 {
		return
	}

	patterns := []models.Pattern{
		{
			ID:         "1",
			Title:      "Asynchronous Communication",
			Category:   "Architecture",
			Icon:       "Network",
			Problem:    "Tight coupling between microservices through synchronous REST calls leads to failure cascades.",
			Solution:   "Implement message queues (RabbitMQ, Kafka) to decouple services and ensure eventual consistency.",
			Difficulty: "Intermediate",
			CreatedAt:  time.Now(),
		},
		{
			ID:         "2",
			Title:      "Database Partitioning",
			Category:   "Data",
			Icon:       "Database",
			Problem:    "Large monolithic tables causing query performance degradation as data grows linearly.",
			Solution:   "Horizontal sharding or partitioning by tenant/date to distribute load and improve index efficiency.",
			Difficulty: "Advanced",
			CreatedAt:  time.Now(),
		},
		{
			ID:         "3",
			Title:      "Idempotent API Designs",
			Category:   "API",
			Icon:       "Zap",
			Problem:    "Network retries leading to duplicate resource creation or invalid state transitions.",
			Solution:   "Utilize Idempotency Keys in headers to ensure requests are processed only once regardless of retries.",
			Difficulty: "Beginner",
			CreatedAt:  time.Now(),
		},
		{
			ID:         "4",
			Title:      "Circuit Breaker Pattern",
			Category:   "Resiliency",
			Icon:       "ShieldCheck",
			Problem:    "Repetitive calls to a failing downstream service consuming system resources and causing latency.",
			Solution:   "Wrap service calls in a circuit breaker that fails fast when error thresholds are met.",
			Difficulty: "Intermediate",
			CreatedAt:  time.Now(),
		},
	}

	for _, p := range patterns {
		_, _ = s.pColl.ReplaceOne(ctx, bson.M{"_id": p.ID}, p, options.Replace().SetUpsert(true))
	}
}
