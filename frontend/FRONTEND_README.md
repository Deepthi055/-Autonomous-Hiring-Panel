# AI Multi-Agent Candidate Evaluation Dashboard

A modern, responsive React dashboard for evaluating job candidates using multi-agent AI analysis.

## Features

- **Real-time Candidate Evaluation**: Submit resume, transcript, and job description for instant analysis
- **Multi-Agent Analysis**: Five specialized AI agents evaluate different aspects:
  - Resume Agent: Evaluates resume quality and alignment
  - Technical Agent: Assesses technical skills and keywords
  - Behavioral Agent: Evaluates soft skills and team fit
  - Claims Agent: Verifies authenticity of claims
  - Consensus Agent: Synthesizes findings into final recommendation

- **Interactive Visualizations**:
  - Radial bar chart showing final score
  - Agent performance breakdown bar chart
  - Detailed agent cards with strengths, concerns, gaps, and contradictions

- **Professional SaaS Design**:
  - Indigo-to-purple gradient header
  - Glass-style cards with subtle shadows
  - Fully responsive mobile-first layout
  - Smooth animations and transitions

## Tech Stack

- **Frontend**: React 19.2 + Vite
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.10
- **Icons**: Lucide React 0.344

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Development

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## API Integration

The dashboard communicates with the backend API at:
- **Endpoint**: `POST /api/evaluate`
- **Base URL**: Proxied to `http://localhost:5000` during development

### Request Format
```json
{
  "resume": "string",
  "transcript": "string",
  "jobDescription": "string"
}
```

### Response Format
The backend returns a comprehensive evaluation with:
- Candidate assessment and verdict
- Individual agent scores (0-1 scale, displayed as percentages)
- Agent-specific analysis (strengths, concerns, gaps, contradictions)
- Consensus decision and confidence level
- Interaction trace and discrepancy log

## Component Structure

```
src/
├── components/
│   ├── Header.jsx              # Header with gradient background
│   ├── EvaluationForm.jsx      # Input form for candidate data
│   ├── SummaryCard.jsx         # Final score and recommendation
│   ├── PerformanceChart.jsx    # Agent performance bar chart
│   └── ResultsDashboard.jsx    # Detailed agent analysis cards
├── App.jsx                      # Main application component
├── index.css                    # Tailwind CSS imports and globals
└── main.jsx                     # React entry point
```

## Key Features

### Score Conversion
- Backend returns scores on 0-1 scale
- Frontend converts to 0-100 percentage for display
- Score >= 70%: "Hire" (Green)
- Score 50-70%: "Borderline" (Yellow)
- Score < 50%: "No Hire" (Red)

### Error Handling
- User-friendly error messages
- Loading states during evaluation
- Input validation on client side
- Network error handling with detailed feedback

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interfaces
- Optimized layouts for all screen sizes

## Configuration

### Development Proxy
The Vite dev server proxies API calls to the backend:
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

### Tailwind Configuration
Custom colors and utilities defined in `tailwind.config.js`:
- Indigo-600: Primary color
- Purple-600: Secondary color
- Glass-card and gradient-header utilities

## Production Build

```bash
npm run build
```

This generates optimized assets in the `dist/` directory. The production build:
- Minifies CSS and JavaScript
- Code splitting for optimal loading
- Asset optimization with Vite

## Troubleshooting

### Backend Connection Issues
1. Ensure backend is running on port 5000
2. Check browser console for CORS errors
3. Verify backend has CORS headers enabled
4. Check network tab for request/response

### Empty Results
- Ensure all form fields have sufficient content
- Check backend logs for evaluation errors
- Verify agent implementations in backend

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild Tailwind: `npm run dev` restarts with fresh CSS
- Check for conflicting CSS in index.css

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

- Results are cached after each evaluation
- Recharts uses React.memo for optimization
- Lazy loading of components possible with Suspense
- Minimal bundle size with Vite

## License

Proprietary - AI Multi-Agent Candidate Evaluation System

## Contact

For issues or questions about the frontend, check the main project repository.
