# ArchGuard AI - Frontend

ArchGuard is a premium, AI-powered Engineering Decision Review System designed to validate architectural and design choices before implementation. This frontend is built with high-end aesthetics, focusing on developer experience and architectural clarity.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Design System**: Custom Glassmorphism with a Deep-Space Dark Theme

## 📁 Directory Structure & Routes

The application follows the Next.js App Router convention. Below are the key routes and their functionalities:

### 1. Landing Page (`/`)
- **File**: `app/page.tsx`
- **Purpose**: Introduces the platform's value proposition.
- **Features**: 
    - Hero section with high-impact visuals.
    - Feature highlights (Deep Analysis, Instant Feedback, Best Practices).
    - Team impact statistics (Tech debt reduction, faster reviews).

### 2. New Engineering Review (`/review/new`)
- **File**: `app/review/new/page.tsx`
- **Purpose**: The core interaction point where engineers submit designs for review.
- **Workflow**:
    - **Step 1: Architecture**: Describe high-level system components and communication.
    - **Step 2: API Design**: Define endpoints, protocols (REST/gRPC), and auth strategies.
    - **Step 3: Data Model**: Outline schemas, relationships, and indexing strategies.
    - **Step 4: Tech Stack**: Select infrastructure and technology preferences.
- **AI Analysis View**: Once submitted, it displays a detailed report highlighting:
    - **High Risks**: Potential bottlenecks and critical failure points.
    - **Scalability**: Evaluation of growth potential.
    - **Insights**: Specific AI-driven suggestions (e.g., suggesting Event-Driven over direct API calls).
    - **Action Plan**: Immediate fixes and long-term optimizations.

### 3. Decision History Dashboard (`/dashboard`)
- **File**: `app/dashboard/page.tsx`
- **Purpose**: A centralized repository for all historical design reviews.
- **Features**:
    - Statistical overview (Total reviews, risk distribution).
    - Searchable history of past decisions.
    - Status tracking (Critical Risks, Approved, Pending).

### 4. Engineering Patterns Library (`/patterns`)
- **File**: `app/patterns/page.tsx`
- **Purpose**: An educational bridge for junior and mid-level engineers.
- **Content**:
    - Catalog of common architectural patterns (Circuit Breakers, Idempotency, etc.).
    - Problem vs. Solution breakdown for each pattern.
    - AI-curated best practices.

## 🎨 Global Styles & UI Components

- **`app/globals.css`**: Contains the core design system tokens, including the `--primary` violet theme, glassmorphism utilities (`.glass`), and custom gradient border effects.
- **`components/Navbar.tsx`**: A responsive, animated navigation bar with mobile support.
- **`components/Hero.tsx`**: Reusable hero section for high-level marketing content.
- **`lib/utils.ts`**: Utility for dynamic Tailwind class merging (`cn`).

## 🛠 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔒 Security & Performance
- Standardized SEO meta tags in `layout.tsx`.
- Responsive design for all screen sizes (Mobile / Tablet / Desktop).
- GPU-accelerated animations for smooth transitions.
