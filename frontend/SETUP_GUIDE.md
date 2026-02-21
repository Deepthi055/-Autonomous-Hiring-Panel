# Dashboard Setup & Installation Guide

## Quick Start

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install
```

### 2. Start the Application

```bash
# Terminal 1: Start Backend (if not already running)
cd backend
npm install
node server.js
# Should output: "Server running on port 5000"

# Terminal 2: Start Frontend
cd frontend
npm run dev
# Should output: "VITE v7.3.1  ready in XXX ms"
# Local: http://localhost:5173/
```

### 3. Test the Dashboard

1. Open `http://localhost:5173/` in your browser
2. Fill in the three fields:
   - **Resume**: Paste a sample resume
   - **Transcript**: Paste academic/professional transcript
   - **Job Description**: Paste the job description
3. Click "Evaluate Candidate"
4. View the comprehensive evaluation results

---

## Installed Packages

### Core Dependencies
- `react@19.2.0` - React library
- `react-dom@19.2.0` - React DOM bindings
- `tailwindcss@3.4.1` - Utility-first CSS framework
- `recharts@2.10.3` - Charting library
- `lucide-react@0.344.0` - Icon library

### Dev Dependencies
- `vite@7.3.1` - Build tool and dev server
- `@vitejs/plugin-react@5.1.1` - React plugin for Vite
- `postcss@8.4.33` - CSS transpiler
- `autoprefixer@10.4.17` - CSS vendor prefixing
- `eslint@9.39.1` - Code linter
- And other dev tools for type checking and linting

---

## File Structure

```
frontend/
├── index.html                  # HTML entry point
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.js             # Vite configuration
├── eslint.config.js           # ESLint configuration
├── FRONTEND_README.md         # Feature documentation
├── SETUP_GUIDE.md             # This file
├── public/                    # Static assets
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Main app component
    ├── App.css               # App styles (minimal)
    ├── index.css             # Global styles & Tailwind
    ├── assets/               # Image/asset directory
    └── components/
        ├── Header.jsx        # Gradient header component
        ├── EvaluationForm.jsx   # Input form component
        ├── SummaryCard.jsx   # Score summary display
        ├── PerformanceChart.jsx # Bar chart for agents
        └── ResultsDashboard.jsx # Agent detail cards
```

---

## Component Overview

### Header.jsx
- Displays the application title and description
- Gradient background (indigo to purple)
- Animated Sparkles icon

### EvaluationForm.jsx
- Three textarea inputs: Resume, Transcript, Job Description
- Evaluate button with loading state
- Error alert display
- Input validation

### SummaryCard.jsx
- Radial bar chart showing final score percentage
- Recommendation badge (Hire/Borderline/No Hire)
- Confidence level display
- Summary description

### PerformanceChart.jsx
- Bar chart showing each agent's score
- Custom tooltip on hover
- Color-coded bars for each agent
- Score grid display below chart

### ResultsDashboard.jsx
- Five agent cards (Resume, Technical, Behavioral, Claims, Consensus)
- Each card shows:
  - Agent name and icon
  - Score percentage
  - Strengths (green bullets)
  - Concerns (red bullets)
  - Gaps (orange bullets)
  - Contradictions (purple bullets)

---

## Key Features

### Responsive Layout
- Works on mobile, tablet, desktop
- Grid layouts adapt to screen size
- Touch-friendly buttons and inputs

### Real-time Evaluation
- Instant feedback from backend
- Loading spinner during processing
- Error handling with user messages

### Data Transformation
The frontend transforms backend response (0-1 scale) to percentages:
```javascript
// Backend: score = 0.68 (0-1 scale)
// Frontend: scorePercentage = Math.round(0.68 * 10) = 68%
```

### Color Coding
- **Green**: Good scores, strengths, hire recommendations
- **Yellow**: Borderline results, warnings
- **Red**: Poor scores, concerns, no hire recommendations
- **Purple**: Secondary information, contradictions
- **Indigo**: Primary actions and highlights

---

## Development

### Add a New Component

1. Create file in `src/components/MyComponent.jsx`
2. Import required libraries:
   ```jsx
   import { SomeIcon } from 'lucide-react';
   
   export default function MyComponent() {
     return (
       <div className="rounded-2xl shadow-lg p-6">
         {/* Your component */}
       </div>
     );
   }
   ```
3. Import in App.jsx and use it

### Style with Tailwind

Use Tailwind utility classes:
```jsx
<button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl shadow-lg">
  Click me
</button>
```

### Add New Chart

1. Import from Recharts:
   ```jsx
   import { BarChart, Bar, XAxis, YAxis } from 'recharts';
   ```
2. Create chart data array
3. Render with ResponsiveContainer

---

## API Endpoints

### Evaluation Endpoint
```
POST /api/evaluate

Request:
{
  "resume": "string (required)",
  "transcript": "string (required)",
  "jobDescription": "string (required)"
}

Response:
{
  "candidateAssessment": {
    "verdict": "Hire|No-Hire",
    "summary": "string"
  },
  "rawAgentOutputs": [
    {
      "agent": "ResumeAgent|TechnicalAgent|BehavioralAgent|ClaimAgent",
      "score": 0.0-1.0,
      "comments": "string",
      "strengths": ["string"],
      "concerns": ["string"],
      "gaps": ["string"],
      "contradictions": ["string"]
    }
  ],
  "discrepancyLog": {...},
  "agentInteractionTrace": [],
  "failedAgents": []
}
```

---

## Troubleshooting

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules package-lock.json

# Reinstall
npm install
```

### Port 5173 already in use
```bash
# Use different port
npm run dev -- --port 3000
```

### Backend connection fails
1. Check backend is running: `node backend/server.js`
2. Verify port 5000 is accessible
3. Check browser console for network errors
4. Ensure CORS is enabled in backend

### Tailwind classes not showing
```bash
# Restart dev server
npm run dev

# Or rebuild CSS
npm run build
```

### Charts not displaying
1. Check recharts is installed: `npm list recharts`
2. Verify data structure matches chart expectations
3. Check browser console for errors

---

## Build for Production

```bash
# Create optimized production build
npm run build

# Output in dist/ directory
# Test production build locally
npm run preview

# Opens preview at http://localhost:4173/
```

---

## Environment Variables

Currently using direct API calls to `/api/evaluate`. For production deployment:

1. Create `.env` file:
   ```
   VITE_API_URL=https://api.yourdomain.com
   ```

2. Update App.jsx:
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   const response = await fetch(`${apiUrl}/api/evaluate`, {...});
   ```

---

## Performance Optimization

- Vite provides fast HMR (Hot Module Replacement)
- Recharts uses React.memo for chart optimization
- CSS is tree-shaken by Tailwind
- Images should be optimized before adding to public/

---

## Support

For questions or issues:
1. Check browser console for errors
2. Review backend logs
3. Verify all dependencies are installed
4. Ensure both frontend and backend are running

Happy evaluating!
