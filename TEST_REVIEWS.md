# 🧪 Test Reviews — AI Engineering Decision Review System

Use the following sample data to test the review submission flow at `/review/new`.  
Each review covers all 4 steps: **Architecture → API Design → Data Model → Tech Stack**.

---

## ✅ Review 1 — Real-Time Analytics Platform

### Step 1: Architecture

**Project Title:**
```
Next-Gen Real-Time Analytics Platform
```

**Architecture Description:**
```
The system follows a microservices architecture with event-driven communication between services. 
The core components include an Ingestion Service that collects raw event streams, a Processing 
Service that performs aggregations using Apache Kafka consumers, and a Query Service that exposes 
pre-computed metrics to the frontend.

Services communicate asynchronously via Kafka topics. Each service owns its own database 
(polyglot persistence). An API Gateway (Kong) handles authentication, rate limiting, and 
routing. The system is deployed on AWS EKS with auto-scaling enabled per service. 
A centralized observability stack (Prometheus + Grafana + Loki) handles metrics, 
traces, and logs across all pods.
```

---

### Step 2: API Design

**API Design & Patterns:**
```
REST API with versioned endpoints (/api/v1/). Authentication via OAuth2 bearer tokens 
(JWT, 15-min expiry, refresh token rotation). All responses follow a standard envelope:
{ "data": {}, "meta": { "page": 1, "total": 100 }, "error": null }

Key Endpoints:
- POST /api/v1/events          → Ingest raw event data (batch support up to 1000 events)
- GET  /api/v1/metrics         → Query aggregated metrics with filter params
- GET  /api/v1/dashboards/:id  → Fetch a specific dashboard configuration
- POST /api/v1/alerts          → Create threshold-based alert rules
- GET  /api/v1/reports/export  → Export reports as CSV/JSON (async via job queue)

Rate limiting: 1000 req/min per API key. Webhooks support for alert delivery.
Error codes are standard HTTP with detailed JSON error bodies.
```

---

### Step 3: Data Model

**Data Models & Schema:**
```
Events Collection (MongoDB):
{
  _id: ObjectId,
  source_id: string,       // originating service/device
  event_type: string,      // e.g. "page_view", "purchase", "error"
  properties: object,      // flexible key-value payload
  timestamp: datetime,
  ingested_at: datetime,
  ttl: 90 days             // auto-expire raw events
}

Metrics Collection (TimescaleDB):
{
  id: bigint PK,
  metric_name: string,
  dimensions: jsonb,       // flexible dimension grouping
  value: float8,
  aggregated_at: timestamp
}
Hypertable partitioned by aggregated_at (hourly chunks)
Index on (metric_name, aggregated_at DESC)

Users Table (PostgreSQL):
{
  id: uuid PK,
  email: varchar(255) UNIQUE NOT NULL,
  org_id: uuid FK,
  role: enum('admin', 'viewer', 'editor'),
  created_at: timestamptz,
  last_login: timestamptz
}
```

---

### Step 4: Tech Stack

**Architecture Style (select these chips):**
- ✅ Microservices
- ✅ Event-Driven
- ✅ Cloud Native

**Additional Tech Stack Details:**
```
Go (backend services), React + TypeScript (dashboard frontend), Apache Kafka (event streaming), 
MongoDB (raw events), TimescaleDB (metrics), PostgreSQL (user/auth data), Redis (caching + 
sessions), AWS EKS (Kubernetes), AWS S3 (report exports), Kong API Gateway, Prometheus + 
Grafana (observability), GitHub Actions (CI/CD), Terraform (infrastructure as code)
```

---
---

## ✅ Review 2 — E-Commerce Order Management System

### Step 1: Architecture

**Project Title:**
```
Scalable E-Commerce Order Management System
```

**Architecture Description:**
```
A monolithic-first architecture transitioning to modular services. The core Order Service 
handles the entire order lifecycle: cart, checkout, payment, fulfillment, and returns. 
It integrates with third-party providers: Stripe for payments, ShipBob for fulfillment, 
and SendGrid for transactional emails.

The system uses a CQRS pattern — writes go to a PostgreSQL primary and reads are served 
from a read replica with an additional Redis cache for product catalog and inventory levels. 
A background job processor (Sidekiq) handles async tasks: email triggers, webhook retries, 
PDF invoice generation. The frontend is a Next.js SSR app deployed on Vercel, connecting 
to a GraphQL API.
```

---

### Step 2: API Design

**API Design & Patterns:**
```
GraphQL API (Apollo Server) as the primary interface for the frontend client.
REST webhooks exposed for Stripe payment confirmation callbacks and ShipBob 
fulfillment status updates.

Key GraphQL Operations:
- Query: orders(filter, pagination) → paginated list of orders
- Query: order(id) → full order detail with line items and shipment tracking
- Mutation: createOrder(input) → validates cart, reserves inventory, initiates payment
- Mutation: cancelOrder(id, reason) → triggers refund + restocks inventory
- Mutation: updateShippingAddress(orderId, address) → allowed pre-fulfillment only
- Subscription: orderStatusChanged(orderId) → real-time status updates (WS)

Auth: Session-based (HTTP-only cookies) for web, JWT for mobile clients.
Rate limit: 200 req/min per session. Admin endpoints require 2FA via TOTP.
```

---

### Step 3: Data Model

**Data Models & Schema:**
```
orders table (PostgreSQL):
{
  id: uuid PK,
  customer_id: uuid FK → customers.id,
  status: enum('pending','paid','processing','shipped','delivered','cancelled','refunded'),
  subtotal_cents: int,
  tax_cents: int,
  shipping_cents: int,
  total_cents: int,
  currency: char(3) DEFAULT 'USD',
  stripe_payment_intent_id: varchar,
  created_at: timestamptz,
  updated_at: timestamptz
}

order_items table:
{
  id: uuid PK,
  order_id: uuid FK → orders.id,
  product_id: uuid FK → products.id,
  sku: varchar(100),
  quantity: int CHECK(quantity > 0),
  unit_price_cents: int,
  discount_cents: int DEFAULT 0
}

products table:
{
  id: uuid PK,
  name: varchar(255),
  slug: varchar(255) UNIQUE,
  description: text,
  inventory_count: int DEFAULT 0,
  price_cents: int,
  is_active: boolean DEFAULT true,
  created_at: timestamptz
}

Indexes: orders(customer_id), orders(status, created_at DESC), order_items(order_id)
```

---

### Step 4: Tech Stack

**Architecture Style (select these chips):**
- ✅ Monolithic
- ✅ Cloud Native

**Additional Tech Stack Details:**
```
Ruby on Rails (API backend), Next.js + TypeScript (frontend), GraphQL via Apollo Server, 
PostgreSQL (primary DB), Redis (cache + Sidekiq queues), Sidekiq (background jobs), 
Stripe (payments), ShipBob (fulfillment), SendGrid (email), Vercel (frontend hosting), 
Heroku (backend hosting), AWS S3 (media/invoices), Datadog (APM + logging)
```

---
---

## ✅ Review 3 — AI-Powered Document Processing Pipeline

### Step 1: Architecture

**Project Title:**
```
AI-Powered Document Processing & Extraction Pipeline
```

**Architecture Description:**
```
A serverless, event-driven pipeline for intelligent document processing. Users upload 
documents (PDF, DOCX, images) via a pre-signed S3 URL. An S3 PUT event triggers an 
AWS Lambda "Orchestrator" function which fans out processing tasks to a Step Functions 
state machine.

The state machine coordinates: (1) OCR extraction via AWS Textract, (2) entity extraction 
via a fine-tuned GPT-4 model hosted on Azure OpenAI, (3) validation against a JSON schema, 
(4) storage to DynamoDB, and (5) webhook notification to the calling application.

Failed documents are routed to a Dead Letter Queue (SQS DLQ) with retry logic (3 attempts, 
exponential backoff). The entire infrastructure is defined in AWS CDK. A lightweight 
REST API (API Gateway + Lambda) handles document status queries and webhook management.
```

---

### Step 2: API Design

**API Design & Patterns:**
```
REST API via AWS API Gateway. Auth: API Key per client (passed via X-API-Key header) 
+ optional HMAC webhook signing for callback security.

Endpoints:
- POST /v1/documents/upload-url   → Returns a pre-signed S3 URL + document_id (valid 5 min)
- GET  /v1/documents/:id          → Poll processing status and retrieve extracted data
- GET  /v1/documents              → List documents with filter by status, date range
- POST /v1/webhooks               → Register a callback URL for async result delivery
- DELETE /v1/webhooks/:id         → Remove a webhook registration
- GET  /v1/usage                  → Monthly token and document processing usage stats

Webhook Payload (POST to client URL):
{
  "event": "document.processed",
  "document_id": "doc_xxxx",
  "status": "success" | "failed",
  "extracted_data": { ... },
  "timestamp": "ISO8601"
}

All requests authenticated. Idempotency keys supported on upload-url endpoint.
```

---

### Step 3: Data Model

**Data Models & Schema:**
```
DynamoDB Table: Documents (single-table design)

PK: DOC#<document_id>    SK: METADATA
Attributes:
{
  document_id: string,
  client_id: string,
  original_filename: string,
  s3_key: string,
  mime_type: string,
  status: 'uploaded' | 'processing' | 'completed' | 'failed',
  page_count: number,
  extracted_data: map,        // structured extraction result
  confidence_score: float,    // 0.0 - 1.0 AI confidence
  error_message: string?,
  processing_started_at: ISO8601,
  processing_completed_at: ISO8601,
  created_at: ISO8601,
  ttl: epoch                  // auto-delete after 180 days
}

GSI-1: client_id (PK) + created_at (SK)  → List documents by client
GSI-2: status (PK) + created_at (SK)     → Monitor pipeline health by status

Webhooks Table (DynamoDB):
{
  webhook_id: string PK,
  client_id: string,
  url: string,
  events: string[],
  secret: string,       // HMAC signing secret (hashed)
  is_active: boolean,
  created_at: ISO8601
}
```

---

### Step 4: Tech Stack

**Architecture Style (select these chips):**
- ✅ Serverless
- ✅ Event-Driven
- ✅ Cloud Native

**Additional Tech Stack Details:**
```
Python 3.12 (Lambda functions), AWS Lambda (compute), AWS Step Functions (orchestration), 
AWS S3 (document storage), AWS Textract (OCR), Azure OpenAI GPT-4 (entity extraction), 
DynamoDB (metadata store), SQS (queues + DLQ), API Gateway (REST API), AWS CDK (IaC), 
CloudWatch (logging + alarms), TypeScript (CDK infrastructure code), GitHub Actions (CI/CD)
```

---

## 📋 Quick Reference — Form Fields Summary

| Field | Step | Type |
|---|---|---|
| Project Title | Step 1 | Text input |
| Architecture Description | Step 1 | Textarea |
| API Design & Patterns | Step 2 | Textarea |
| Data Models & Schema | Step 3 | Textarea |
| Architecture Style | Step 4 | Multi-select chips |
| Additional Tech Stack Details | Step 4 | Text input |

> **Tip:** Navigate between steps using the **"Next step"** button. On Step 4, click **"Analyse design"** to submit.
