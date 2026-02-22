# AI Interview Agent Feature

## Overview
The AI Interview Agent is a new conversational interview step that asks questions one at a time and waits for candidate responses before proceeding to the next question.

## Features

### ✅ One Question at a Time
- AI displays one question from the generated question pool
- Waits for candidate to provide answer
- Only proceeds after receiving response

### ✅ Interactive Chat Interface
- Clean chat-style UI with AI and user messages
- Questions appear in white boxes on the left
- User answers appear in purple gradient boxes on the right
- Auto-scroll to latest message

### ✅ Progress Tracking
- Shows "Question X of 5" at the top
- Visual progress bar
- Limited to 5 questions maximum

### ✅ Multiple Input Methods
- **Type**: Standard text input with textarea
- **Voice**: Click microphone button to use speech-to-text
- **Keyboard Shortcut**: Press Enter to send, Shift+Enter for new line

### ✅ Question Categories
- Each question displays its category badge (Technical, Behavioral, etc.)
- Categories use color coding matching the QuestionGenerator

### ✅ Interview Completion
- After 5 questions, shows completion message
- "Continue to Evaluation" button appears
- Conversation history is saved and passed to next step

## User Flow

1. **Job Setup** → Set role and description
2. **Resume Upload** → Upload/paste resume
3. **AI Questions** → Generate interview questions
4. **AI Interview Agent** (NEW) → Interactive Q&A session
5. **Recording** → Optional audio recording
6. **Evaluation** → View results

## Technical Details

### Component Location
`frontend/src/components/wizard/AIInterviewAgent.jsx`

### Props
- `data`: Contains questions array from QuestionGenerator
- `onNext`: Callback when interview complete (passes conversation history)
- `onBack`: Navigate to previous step

### State Management
- `currentQuestionIndex`: Tracks which question is being asked
- `conversationHistory`: Array of all messages (agent + user)
- `userAnswer`: Current user input
- `isProcessing`: Loading state between questions
- `isListening`: Voice input active state

### Data Passed Forward
```javascript
{
  interviewConversation: [...conversationHistory],
  completedAt: new Date().toISOString()
}
```

## Styling
- Uses Tailwind CSS classes
- Gradient purple-to-blue theme matching app design
- Responsive layout
- Smooth animations and transitions

## Browser Compatibility
- Voice input requires browsers supporting Web Speech API
- Fallback to text input if voice not supported
- Works on Chrome, Edge, Safari (partial), Firefox (no voice)

## Future Enhancements (Optional)
- AI-generated follow-up questions based on answers
- Real-time answer analysis and scoring
- Time limits per question
- Question skip functionality
- Save/resume interview sessions
