# Quick Reference & Commands Guide

## NPM Scripts

### Development
```bash
npm run dev       # Start dev server (hot reload)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Common Commands

#### Install Dependencies
```bash
npm install
npm i              # shorthand
```

#### Clear Node Modules
```bash
rm -r node_modules package-lock.json
npm install
```

#### Update Specific Package
```bash
npm install some-package@latest
```

#### Check Outdated Packages
```bash
npm outdated
```

---

## Ports Used

```
Frontend Dev Server:  http://localhost:5173
Backend API Server:   http://localhost:5000
Vite API Proxy:       /api → localhost:5000
```

---

## Directory Navigation

```bash
# Frontend setup
cd sample/frontend
npm install
npm run dev

# Backend setup
cd sample/backend
npm install
node server.js

# Both running - fast iteration
# Terminal 1: npm run dev (from backend - or node server.js)
# Terminal 2: npm run dev (from frontend)
```

---

## Component File Locations

```
sample/frontend/src/components/
├── Header.jsx                    # Line 1-23
├── EvaluationForm.jsx            # Line 1-80
├── SummaryCard.jsx               # Line 1-100
├── PerformanceChart.jsx          # Line 1-110
└── ResultsDashboard.jsx          # Line 1-120
```

---

## Environment Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] npm installed (v9+)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] CORS enabled in backend
- [ ] Both terminals open and monitored

---

## Testing Flow

### 1. Complete Fresh Install
```bash
# Backend
cd backend
npm install
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 2. Test with Sample Data
**Resume:**
```
John Smith
Senior Software Engineer
12 years experience
JavaScript, React, Node.js, AWS
Led teams of 5+
```

**Transcript:**
```
BS Computer Science
GPA 3.8
Experience: Senior Dev at Google
Skills: JavaScript, Python, AWS, Team Lead
```

**Job Description:**
```
Senior Full Stack Developer
Requirements: 5+ years JavaScript/React/Node.js
Team leadership preferred
AWS experience required
```

### 3. Expected Results
- Loading spinner appears for 1-3 seconds
- Summary card shows ~70-80% score
- "Hire" recommendation appears
- 4 charts show agent scores
- 5 agent cards display with details

---

## Keyboard Shortcuts (Dev)

```
Ctrl+S              Save file
Ctrl+Shift+Delete   Clear cache
Ctrl+Shift+K        Kill terminal
Cmd+K (Mac)         Clear console
F12                 Open DevTools
Ctrl+1              Switch tab
Ctrl+Tab            Next tab
Alt+Tab             Switch app
```

---

## Common Git Workflow

```bash
# Check status
git status

# Stage all changes
git add .

# Commit
git commit -m "Add dashboard frontend"

# Push
git push origin [branch-name]

# Check log
git log --oneline -5

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main
```

---

## Debugging Tips

### Browser DevTools
```
F12                    Open Inspector
Ctrl+Shift+C           Element inspector
Ctrl+Shift+J           Console
Ctrl+Shift+I           Full DevTools
Network tab            See API calls
Application tab        Clear localStorage
```

### Console Logging
```javascript
// In App.jsx
console.log('results:', results);
console.log('data received:', data);
console.error('Error:', error);
```

### Network Debugging
1. Open DevTools (F12)
2. Go to Network tab
3. Submit evaluation
4. Look for POST /api/evaluate request
5. Check Response tab for data
6. Check Headers for CORS

### React DevTools Extension
- Install: React Developer Tools (Chrome/Firefox)
- View component props and state
- Track re-renders
- Profile performance

---

## File Size Optimization

### Check Bundle Size
```bash
npm run build
# Check dist/ folder size

npm run build -- --report
# Detailed size report
```

### Before Production
- [ ] Images optimized
- [ ] CSS minified (automatic)
- [ ] JS minified (automatic)
- [ ] Code comments removed
- [ ] Console.logs removed (in production build)

---

## Environment Variables (For Production)

Create `.env` file in `frontend/`:
```
VITE_API_URL=https://api.example.com
VITE_ENV=production
```

Update `App.jsx`:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## API Response Examples

### Success (200)
```json
{
  "candidateAssessment": {
    "verdict": "Hire",
    "summary": "Average score: 0.76"
  },
  "rawAgentOutputs": [
    {
      "agent": "ResumeAgent",
      "agentName": "ResumeAgent",
      "score": 0.68,
      "comments": "Parsed resume...",
      "details": {...}
    },
    ...
  ],
  "chartData": {...},
  "discrepancyLog": {...},
  "agentInteractionTrace": [...]
}
```

### Error (400)
```json
{
  "error": "Invalid input: Resume is required"
}
```

---

## Troubleshooting Matrix

| Problem | Solution |
|---------|----------|
| Port 5173 in use | `npm run dev -- --port 3000` |
| Port 5000 in use | `lsof -i :5000` → `kill -9 PID` |
| Module not found | `npm install` + restart server |
| CORS error | Check backend has CORS middleware |
| Blank page | Check browser console (F12) |
| Styles missing | Restart dev server (`npm run dev`) |
| API 404 | Check `vite.config.js` proxy config |
| Charts not showing | Verify recharts installed |
| Old styles cached | Clear browser cache (Ctrl+Shift+Delete) |

---

## Performance Metrics

```
Build Time:           ~5-10 seconds
Dev Server Start:     ~2-3 seconds
HMR Reload:           < 200ms
Evaluation Request:   1-3 seconds (backend dependent)
Page Load:            < 1 second (cached)
Bundle Size:          ~50KB gzipped
```

---

## Code Review Checklist

- [ ] All components properly imported
- [ ] No console.errors or warnings
- [ ] Props properly validated
- [ ] Error boundaries in place
- [ ] Loading states handled
- [ ] Responsive design tested
- [ ] Accessibility checked
- [ ] No hardcoded values
- [ ] Comments explain complex logic
- [ ] Files organized properly

---

## Deployment Checklist

### Before Deploying
- [ ] Build passes: `npm run build`
- [ ] No errors in production: `npm run preview`
- [ ] All tests pass
- [ ] Code reviewed
- [ ] CORS configured for prod domain
- [ ] API URL updated for production
- [ ] Environment variables set
- [ ] Analytics configured
- [ ] Error tracking set up
- [ ] Performance baseline established

### Deploy Process
1. Merge to main branch
2. Run `npm run build`
3. Test with `npm run preview`
4. Upload `dist/` folder to hosting
5. Point domain to deployment
6. Monitor for errors

### Post-Deployment
- [ ] Check site loads
- [ ] Test main flow
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Get user feedback

---

## Learning Resources

### React
- React Docs: https://react.dev
- Hooks Guide: https://react.dev/reference/react

### Tailwind CSS
- Tailwind Docs: https://tailwindcss.com/docs
- Config Guide: https://tailwindcss.com/docs/configuration

### Recharts
- Recharts Docs: https://recharts.org
- Examples: https://recharts.org/examples

### Vite
- Vite Docs: https://vitejs.dev
- Building: https://vitejs.dev/guide/build.html

### Lucide Icons
- Icon Browser: https://lucide.dev
- Usage Guide: https://lucide.dev/guide/installation

---

## Common Errors & Fixes

### Error: "Cannot find module 'recharts'"
```bash
npm install recharts
npm run dev  # Restart
```

### Error: "Module not found: 'lucide-react'"
```bash
npm install lucide-react
npm run dev  # Restart
```

### Error: "Tailwind classes not applying"
```bash
# Restart dev server
npm run dev

# Or check tailwind.config.js content paths
```

### Error: "CORS error in console"
Backend fix in `server.js`:
```javascript
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
```

### Error: "Cannot POST /api/evaluate"
Check:
1. Backend running on port 5000
2. `vite.config.js` has proxy configured
3. Route exists in `evaluationRoutes.js`

---

## Useful Links

### Package.json Info
```bash
npm outdated               # Check for updates
npm ls react              # Check react version
npm cache clean --force   # Clear cache
```

### Git Useful Commands
```bash
git log --oneline         # See commits
git diff                  # See changes
git reset --hard HEAD^    # Undo last commit
git stash                 # Temporarily save changes
```

---

## Final Checklist

Before considering the dashboard complete:

- [ ] All 5 components created
- [ ] App.jsx integrated with backend
- [ ] Responsive design verified
- [ ] Error handling tested
- [ ] Loading states working
- [ ] Charts displaying correctly
- [ ] Data transformation working
- [ ] CORS configured
- [ ] Documentation complete
- [ ] Project ready for production

---

**Remember:**
- Always run `npm install` after pulling new code
- Keep backend and frontend terminals visible
- Check browser console (F12) for errors
- Use React DevTools for debugging
- Test on multiple screen sizes
- Monitor network requests for API issues

Happy coding! 🚀
