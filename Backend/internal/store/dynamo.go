package store

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"

	"github.com/ashish5180/ai-decision-review/internal/config"
	"github.com/ashish5180/ai-decision-review/internal/models"
)

// DynamoStore handles all DynamoDB operations for decisions.
type DynamoStore struct {
	client    *dynamodb.Client
	tableName string
}

// NewDynamoStore initializes the DynamoDB client and ensures the table exists.
func NewDynamoStore(cfg *config.Config) (*DynamoStore, error) {
	awsCfg, err := awsconfig.LoadDefaultConfig(context.TODO(),
		awsconfig.WithRegion(cfg.AWSRegion),
	)
	if err != nil {
		return nil, fmt.Errorf("unable to load AWS config: %w", err)
	}

	client := dynamodb.NewFromConfig(awsCfg)

	store := &DynamoStore{
		client:    client,
		tableName: cfg.DynamoTable,
	}

	// Create table if it doesn't exist (for local development / first run)
	if err := store.ensureTable(context.TODO()); err != nil {
		return nil, fmt.Errorf("ensure table: %w", err)
	}

	return store, nil
}

// ensureTable creates the Decisions table if it doesn't already exist.
func (s *DynamoStore) ensureTable(ctx context.Context) error {
	_, err := s.client.DescribeTable(ctx, &dynamodb.DescribeTableInput{
		TableName: aws.String(s.tableName),
	})
	if err == nil {
		return nil // table already exists
	}

	_, err = s.client.CreateTable(ctx, &dynamodb.CreateTableInput{
		TableName: aws.String(s.tableName),
		KeySchema: []types.KeySchemaElement{
			{AttributeName: aws.String("id"), KeyType: types.KeyTypeHash},
		},
		AttributeDefinitions: []types.AttributeDefinition{
			{AttributeName: aws.String("id"), AttributeType: types.ScalarAttributeTypeS},
		},
		BillingMode: types.BillingModePayPerRequest,
	})
	if err != nil {
		return fmt.Errorf("create table: %w", err)
	}
	return nil
}

// PutDecision saves a decision to DynamoDB.
func (s *DynamoStore) PutDecision(ctx context.Context, d *models.Decision) error {
	item, err := attributevalue.MarshalMap(d)
	if err != nil {
		return fmt.Errorf("marshal decision: %w", err)
	}

	_, err = s.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(s.tableName),
		Item:      item,
	})
	return err
}

// GetDecision retrieves a single decision by ID.
func (s *DynamoStore) GetDecision(ctx context.Context, id string) (*models.Decision, error) {
	result, err := s.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(s.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("get item: %w", err)
	}
	if result.Item == nil {
		return nil, nil // not found
	}

	var d models.Decision
	if err := attributevalue.UnmarshalMap(result.Item, &d); err != nil {
		return nil, fmt.Errorf("unmarshal decision: %w", err)
	}
	return &d, nil
}

// ListDecisions returns all decisions using a table scan.
func (s *DynamoStore) ListDecisions(ctx context.Context) ([]models.Decision, error) {
	result, err := s.client.Scan(ctx, &dynamodb.ScanInput{
		TableName: aws.String(s.tableName),
	})
	if err != nil {
		return nil, fmt.Errorf("scan table: %w", err)
	}

	var decisions []models.Decision
	if err := attributevalue.UnmarshalListOfMaps(result.Items, &decisions); err != nil {
		return nil, fmt.Errorf("unmarshal decisions: %w", err)
	}
	return decisions, nil
}
