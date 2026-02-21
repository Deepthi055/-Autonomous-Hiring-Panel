# System Architecture & Flow Diagram

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      REACT APPLICATION                          │
│                      (localhost:5173)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────▼──────┐      ┌────▼──────┐
              │   App.jsx   │      │ State Mgmt │
              │  (Main Comp)│      │ (useState) │
              └─────┬──────┘      └────┬──────┘
                    │                   │
        ┌───────────┼───────────────────┤
        │           │                   │
        │           │           ┌───────▼──────────┐
        │           │           │ API Integration  │
        │           │           │ (fetch POST)     │
        │           │           └───────┬──────────┘
        │           │                   │
        │           │       ┌───────────┴──────────┐
        │           │       │                      │
        │      ┌────▼─────┴──────┬──────────────┬──┴────────┐
        │      │        │        │        │              │
      ┌─▼─┐ ┌─▼──┐ ┌──▼───┐ ┌──▼────┐ ┌──▼──────┐ ┌──▼─────┐
      │HDR│ │FORM│ │SUMM  │ │PERF   │ │RESULTS │ │ERROR   │
      │   │ │    │ │CARD  │ │CHART  │ │DASH    │ │ALERT   │
      └───┘ └────┘ └──────┘ └───────┘ └────────┘ └────────┘
       Comp1 Comp2 Comp3    Comp4     Comp5     Built-in
```

## Component Hierarchy

```
App.jsx (Root)
├── Header.jsx
│   └── Sparkles Icon
└── Main Container
    ├── EvaluationForm.jsx
    │   ├── Text Inputs (3)
    │   ├── Submit Button w/ ArrowRight Icon
    │   ├── Loading Spinner
    │   └── Error Alert w/ AlertTriangle Icon
    │
    └── Results (Conditional Render)
        ├── SummaryCard.jsx
        │   ├── RadialBarChart (Recharts)
        │   ├── Score Percentage
        │   ├── Recommendation Badge
        │   └── Confidence Level
        │
        ├── PerformanceChart.jsx
        │   ├── BarChart (Recharts)
        │   ├── Custom Tooltip
        │   └── Score Grid
        │
        └── ResultsDashboard.jsx
            ├── AgentCard (Resume)
            │   ├── Icon (FileText)
            │   ├── Score Badge
            │   ├── Strengths List
            │   ├── Concerns List
            │   ├── Gaps List
            │   └── Contradictions List
            │
            ├── AgentCard (Technical)
            │   └── [Same structure]
            │
            ├── AgentCard (Behavioral)
            │   └── [Same structure]
            │
            ├── AgentCard (Claims)
            │   └── [Same structure]
            │
            └── AgentCard (Consensus)
                └── [Same structure]
```

## Data Flow

```
USER INPUT
    │
    ▼
┌─────────────────────────────────┐
│ EvaluationForm.jsx              │
│ - resume: string                │
│ - transcript: string            │
│ - jobDescription: string        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ App.jsx - handleEvaluate()      │
│ - Validation                    │
│ - API Call (fetch POST)         │
│ - Loading state = true          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ BACKEND API                     │
│ POST /api/evaluate              │
│ (localhost:5000)                │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Backend Response                │
│ {                               │
│   candidateAssessment,          │
│   rawAgentOutputs: [            │
│     {agent, score, comments}    │
│   ]                             │
│ }                               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ App.jsx - transformResponse()   │
│ - Parse rawAgentOutputs         │
│ - Convert scores (0-1) → (0-100)│
│ - Map to component structure    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ results state = {               │
│   resume: {...},                │
│   technical: {...},             │
│   behavioral: {...},            │
│   claims: {...},                │
│   consensus: {...}              │
│ }                               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Conditional Rendering           │
│ {results &&                     │
│   - SummaryCard                 │
│   - PerformanceChart            │
│   - ResultsDashboard            │
│ }                               │
└────────────┬────────────────────┘
             │
             ▼
        DISPLAY RESULTS
```

## API Integration Flow

```
FRONTEND                           BACKEND
──────────                        ───────

┌──────────────┐
│ EvalForm     │ 1. User fills form
│ + Submit Btn │    (resume, transcript, jobDescription)
└──────┬───────┘
       │ 2. POST /api/evaluate
       │    (with JSON body)
       ▼
┌──────────────────────┐
│ Fetch Request        │          ┌─────────────────┐
│ Headers:             │─────────>│ evaluationCtrl  │
│ Content-Type: JSON   │          │ - Validate      │
│ Body:                │          │ - Call Agents   │
│ {resume, transcript, │          │ - Run Consensus │
│  jobDescription}     │          │ - Build Report  │
└──────────────────────┘          └────────┬────────┘
       ▲                                   │
       │                                   │
       │ 3. Response (200 OK)              │
       │    JSON:                          │
       │    {                              │
       │      candidateAssessment,         │
       │      rawAgentOutputs,             │
       │      chartData,                   │
       │      discrepancyLog,              │
       │      agentInteractionTrace        │
       │    }                              │
       │                                   │
       └───────────────────────────────────┘
       │
       │ 4. Response in App.jsx
       │    loading = false
       │    results = transformed data
       │
       ▼
    RENDER UI
    with results
```

## Score Transformation

```
Backend Data (0-1 scale)       Frontend Display (0-100 scale)
─────────────────────────────  ─────────────────────────────

ResumeAgent score: 0.68   ────>  68%
TechnicalAgent score: 0.85 ──>  85%
BehavioralAgent score: 0.72 ──> 72%
ClaimAgent score: 0.90   ────>  90%

Consensus average: 0.7625 ──>  76%  (Hire ✓)

Formula:
scorePercentage = Math.round(score * 10)
```

## File Organization

```
FRONTEND
├── public/
│   └── [Static assets]
│
├── src/
│   ├── components/          ← Component Layer
│   │   ├── Header.jsx
│   │   ├── EvaluationForm.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── PerformanceChart.jsx
│   │   └── ResultsDashboard.jsx
│   │
│   ├── App.jsx              ← Application Logic
│   │   (State + API Integration)
│   │
│   ├── main.jsx             ← Entry Point
│   ├── index.css            ← Global Styles
│   └── App.css              ← App Styles (minimal)
│
├── Configuration Files
│   ├── package.json         ← Dependencies
│   ├── vite.config.js       ← Build Config + Proxy
│   ├── tailwind.config.js   ← Styling Config
│   ├── postcss.config.js    ← CSS Processing
│   └── eslint.config.js     ← Linting Config
│
└── Documentation
    ├── FRONTEND_README.md
    ├── SETUP_GUIDE.md
    └── index.html           ← HTML Template
```

## State Management

```
App.jsx State:
┌─────────────────────────────────┐
│ useState Hooks                  │
├─────────────────────────────────┤
│ results:                        │
│ {                               │
│   resume: {...},                │
│   technical: {...},             │
│   behavioral: {...},            │
│   claims: {...},                │
│   consensus: {...}              │
│ }                               │
│                                 │
│ loading: boolean (default false)│
│                                 │
│ error: string (default null)    │
└─────────────────────────────────┘
        │
        ├──> Passed to EvaluationForm
        ├──> Conditionally renders Results
        └──> Used to control UI state
```

## Styling Layer

```
Tailwind CSS (Utility-First)
─────────────────────────────
┌──────────────────────┐
│ tailwind.config.js   │
├──────────────────────┤
│ Custom colors:       │
│ - Indigo-600         │
│ - Purple-600         │
│ Custom utilities:    │
│ - gradient-header    │
│ - glass-card         │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ index.css            │
├──────────────────────┤
│ @tailwind directives│
│ .gradient-header {}│
│ .glass-card {}    │
└──────────────────────┘
        │
        ▼
  Components (JSX)
  ├── className="..."
  ├── Tailwind utilities
  └── Custom classes
```

## Error Handling Flow

```
User Action / API Call
        │
        ▼
┌─────────────────────┐
│ Error Occurs?       │
├─────────────────────┤
│ - Network error     │
│ - Invalid response  │
│ - Validation error  │
│ - Backend error     │
└────────┬────────────┘
         │ Yes
         ▼
┌─────────────────────┐
│ catch(err) block    │
├─────────────────────┤
│ setError(message)   │
│ loading = false     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ EvaluationForm      │
│ displays:           │
│ <AlertTriangle />   │
│ Error message       │
└─────────────────────┘
         │
         ▼
User sees friendly error
and can retry
```

## Browser to Server Timeline

```
Time:   Browser         →        Vite Dev Server       →        Backend
──────────────────────────────────────────────────────────────────────

0ms    ┌──────────────┐
       │ User opens   │
       │ localhost... │
       │ :5173        │
       └─────┬────────┘
             │ GET /
             ▼
        ┌─────────────────────┐
        │ Serves index.html   │
        │ + React bundles     │
        └──────────┬──────────┘
                   │ [~500ms bundle load]
                   │ HMR websocket connected
         ┌─────────▼──────────┐
         │ App renders        │
         │ Header + Form      │
         │ Ready for input    │
         └────┬───────────────┘
              │ User fills form & clicks
              │ handleEvaluate() called
              ▼
         ┌──────────────────────┐
         │ POST /api/evaluate   │──────────────┐
         │ (via proxy)          │              │
         └──────────────────────┘              │
              │                               │
              │[Proxied to localhost:5000]   │
              │                               │
         ┌────────────────────────────────────▼──────┐
         │              Backend Processes            │
         │              - Run 5 agents              │
         │              - Calculate consensus       │
         │              - Build report              │
         │              [~1-3 seconds]              │
         └────────────────┬───────────────────────┘
              ◄────────────┘
              │ Response 200 OK + JSON
         ┌────▼──────────────┐
         │ Parse Response    │
         │ Transform Data    │
         │ setState(results) │
         └────┬─────────────┘
              │
              ▼
         ┌──────────────┐
         │ Re-render    │
         │ with Results │
         │ - Summary    │
         │ - Charts     │
         │ - Cards      │
         └──────────────┘
              │
              ▼
         ┌──────────────┐
         │ User sees    │
         │ full eval    │
         │ dashboard    │
         └──────────────┘

Total Time: ~2-5 seconds
```

## Key Technologies Integration

```
React 19.2
    │
    ├─> Vite 7.3
    │   └─> HMR + Proxy
    │       └─> Recharts 2.10
    │           └─> BarChart, RadialBarChart
    │
    ├─> Tailwind CSS 3.4
    │   ├─> PostCSS 8.4
    │   └─> Autoprefixer
    │
    ├─> Lucide React 0.344
    │   └─> 5 Icons (Sparkles, FileText, Code, Users, etc)
    │
    └─> Fetch API
        └─> POST to Backend (localhost:5000)
            └─> Express.js API

```

## Responsive Breakpoints

```
Mobile (< 768px)
├─> Single column layout
├─> Full-width form
├─> Stack results vertically
└─> Touch-friendly buttons

Tablet (768px - 1024px)
├─> 2-column grid for some sections
├─> Smaller header
├─> Optimized spacing
└─> Still touch-friendly

Desktop (> 1024px)
├─> 3+ column grids
├─> Full header
├─> Side-by-side layouts
└─> Cursor interactions
```

---

This architecture ensures:
✓ Clean separation of concerns
✓ Scalable component structure
✓ Efficient data flow
✓ Robust error handling
✓ Professional user experience
