# 🧠 Adaptive Goal Agent (AGA)

An Agentic AI system that helps users achieve New Year's goals by autonomously monitoring, reasoning, deciding, acting, and learning—not merely responding to user commands.

## 🎯 Core Principle

> "The agent manages the process of goal achievement on behalf of the user."

## 📋 Table of Contents

- [Architecture](#architecture)
- [Agent Flow](#agent-flow)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Design](#api-design)
- [Comet Integration](#comet-integration)
- [Sample Agent Output](#sample-agent-output)

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADAPTIVE GOAL AGENT                        │
│                    (Primary Agent)                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Responsibilities:                                         │  │
│  │  • Maintain user goals (productivity, focus, learning)     │  │
│  │  • Track user context (work hours, focus state)            │  │
│  │  • Decide which sub-agent should act                       │  │
│  │  • Evaluate outcomes over time                             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            AI EMAIL PRIORITY AGENT                        │  │
│  │                  (Sub-Agent)                              │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  • Monitor incoming emails                          │  │  │
│  │  │  • Analyze importance (multi-factor scoring)        │  │  │
│  │  │  • Decide when/how to interrupt user                │  │  │
│  │  │  • Learn from user feedback                         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    COMET LOGGER                           │  │
│  │  • Agent traces & decision audit                          │  │
│  │  • Performance metrics                                     │  │
│  │  • Learning weight adjustments                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── components/
│   ├── landing/           # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── WhyDifferentSection.tsx
│   │   ├── DemoPreviewSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/         # Dashboard components
│   │   ├── PriorityInbox.tsx
│   │   ├── DecisionCard.tsx
│   │   ├── AnalyticsPanel.tsx
│   │   ├── GoalsPanel.tsx
│   │   └── AgentStatusBar.tsx
│   ├── pages/            # Page compositions
│   │   ├── LandingPage.tsx
│   │   └── DashboardPage.tsx
│   └── AdaptiveGoalAgent.tsx  # Main app component
├── lib/
│   ├── agent/            # Agent logic
│   │   ├── adaptive-goal-agent.ts
│   │   └── email-priority-agent.ts
│   ├── comet-logger.ts   # Observability
│   ├── mock-data.ts      # Demo data
│   └── utils.ts
├── contexts/
│   └── AgentContext.tsx  # State management
├── types/
│   └── agent.ts          # TypeScript definitions
└── hooks/
    └── use-mobile.tsx
```

---

## 🔄 Agent Flow

Every agent action follows the **OCDAL Loop**:

```
┌─────────┐    ┌──────────────┐    ┌────────┐    ┌────────┐    ┌──────┐    ┌───────┐
│ OBSERVE │───▶│ CONTEXTUALIZE│───▶│ REASON │───▶│ DECIDE │───▶│ ACT  │───▶│ LEARN │
└─────────┘    └──────────────┘    └────────┘    └────────┘    └──────┘    └───────┘
     │                                                                           │
     └───────────────────────────────────────────────────────────────────────────┘
                              (Continuous Loop)
```

### Step Details

| Step | Description | Data |
|------|-------------|------|
| **Observe** | Extract email metadata | Sender, subject, body, timestamp |
| **Contextualize** | Add user context | Work hours, focus mode, goals, history |
| **Reason** | Multi-factor scoring | 5 weighted factors → priority score |
| **Decide** | Choose action | Notify / Delay / Batch / Ignore |
| **Act** | Execute decision | Send notification or queue |
| **Learn** | Update weights | Based on user feedback |

---

## ⚙️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** for icons

### State Management
- React Context API
- Custom hooks

### Agent System
- Rule-based + heuristic hybrid scoring
- Weighted multi-factor model
- Adaptive learning from feedback

### Observability
- Comet ML integration (mock for MVP)
- Agent trace logging
- Metrics dashboard

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd adaptive-goal-agent

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
# Google OAuth (Gmail API)
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_CLIENT_SECRET=your_client_secret

# Comet ML
VITE_COMET_API_KEY=your_api_key
VITE_COMET_PROJECT_NAME=adaptive-goal-agent
```

---

## 📡 API Design

### Core Endpoints (Backend - Future)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/gmail/connect` | POST | Initiate Gmail OAuth |
| `/emails/fetch` | GET | Fetch new emails |
| `/agent/email/analyze` | POST | Analyze single email |
| `/agent/email/decision` | POST | Get agent decision |
| `/agent/feedback` | POST | Submit user feedback |
| `/analytics/agent-performance` | GET | Get analytics data |

### Request/Response Examples

```typescript
// POST /agent/email/analyze
Request:
{
  "emailId": "email_123",
  "sender": { "name": "CEO", "email": "ceo@company.com" },
  "subject": "URGENT: Meeting Tomorrow",
  "body": "Please confirm attendance..."
}

Response:
{
  "emailId": "email_123",
  "priorityScore": 92,
  "confidenceScore": 88,
  "decision": "notify_immediately",
  "reasoning": "High priority (92/100). VIP sender detected...",
  "factors": {
    "senderImportance": { "score": 95, "reason": "VIP sender" },
    "contentRelevance": { "score": 88, "matchedGoals": ["AI Project"] },
    "actionRequired": { "score": 80, "detected": true },
    "timingContext": { "score": 90, "isWorkHours": true },
    "historicalBehavior": { "score": 85, "openRate": 0.9 }
  }
}
```

---

## 📊 Comet Integration

### Logged Data

1. **Agent Traces**
   - Each loop step (Observe → Learn)
   - Processing time
   - Decision summaries

2. **Metrics**
   - Notification precision/recall
   - False positive rate
   - User override count
   - Confidence vs outcome

3. **Dashboards**
   - Decision audit log
   - Time saved estimates
   - Learning weight evolution

### Sample Comet Log

```typescript
{
  experimentKey: "exp_1234567890",
  trace: {
    id: "trace_001",
    emailId: "email_123",
    loops: [
      { step: "observe", data: {...}, timestamp: "..." },
      { step: "contextualize", data: {...}, timestamp: "..." },
      { step: "reason", data: {...}, timestamp: "..." },
      { step: "decide", data: {...}, timestamp: "..." },
      { step: "act", data: {...}, timestamp: "..." }
    ],
    finalDecision: "notify_immediately",
    metrics: { processingTime: 45, confidenceScore: 88 }
  }
}
```

---

## 📝 Sample Agent Decision Output

```
┌────────────────────────────────────────────────────────────────┐
│ 📧 Email: "URGENT: Q1 Strategy Meeting Tomorrow"               │
│ 👤 From: CEO John Smith <ceo@company.com>                      │
│ ⏰ Received: 30 minutes ago                                    │
├────────────────────────────────────────────────────────────────┤
│ 🎯 AGENT DECISION: NOTIFY IMMEDIATELY                          │
│ 📊 Priority Score: 92/100                                      │
│ 🔒 Confidence: 88%                                             │
├────────────────────────────────────────────────────────────────┤
│ 💭 REASONING:                                                  │
│ "High priority email (92/100) with high confidence. VIP        │
│ sender detected. Content matches active goal: 'Complete AI     │
│ Project'. Action or response appears to be required. Email     │
│ is recent. Recommending immediate notification despite         │
│ focus mode due to sender importance threshold override."       │
├────────────────────────────────────────────────────────────────┤
│ 📈 SCORING BREAKDOWN:                                          │
│ • Sender Importance:   ████████████████████ 95% (VIP)          │
│ • Content Relevance:   █████████████████░░░ 88% (Goal match)   │
│ • Action Required:     ████████████████░░░░ 80% (Detected)     │
│ • Timing Context:      ██████████████████░░ 90% (Work hours)   │
│ • Historical Behavior: █████████████████░░░ 85% (High engage)  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Decision Outcomes

| Decision | Criteria | Behavior |
|----------|----------|----------|
| **Notify Immediately** | Score ≥75, Confidence ≥60 | Instant notification |
| **Delay Notification** | Score 50-74 | Wait for focus mode end |
| **Batch Notification** | Score 25-49 | Include in hourly digest |
| **Ignore** | Score <25 | No notification |

---

## 🔄 Learning & Feedback

The agent adapts based on user actions:

| User Action | Agent Learning |
|-------------|----------------|
| **Opened** | Reinforce current weights |
| **Dismissed** | Reduce sender importance weight |
| **Ignored** | Increase timing context weight |
| **Reclassified** | Adjust based on target decision |

---

## 📱 Pages & Features

### Landing Page
- Hero with value proposition
- How It Works (visual agent loop)
- Feature comparison
- Interactive demo preview
- CTA sections

### Dashboard
- Priority inbox with scored emails
- Decision explanation cards
- Analytics panel
- Goals management
- Focus mode toggle

---

## 🙏 Acknowledgments

Built for the hackathon with:
- Comet ML for observability
- shadcn/ui for components
- Tailwind CSS for styling

---

## 📄 License

MIT License - see LICENSE file for details.
