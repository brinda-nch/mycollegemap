# Profile Analysis Feature Documentation

## Overview

The My Profile page now features a comprehensive AI-powered analysis system that helps students identify their "spike" and receive personalized recommendations for college applications.

## Architecture

### 1. Frontend (`app/profile/page.tsx`)

The profile page provides two modes of analysis:

#### **Basic Analysis (Rule-Based)**
- Automatically calculates spike based on activity categories
- Counts hours invested, leadership positions, and honors
- Provides major recommendations based on category mappings
- Generates mission statements using templates
- **No API key required**

#### **AI-Powered Analysis (OpenAI GPT-4)**
- Click "AI-Powered Analysis" button to trigger
- Sends activities and honors to backend API
- Receives sophisticated analysis from GPT-4
- Displays enhanced recommendations with reasoning
- Shows "AI-Powered" badge on results

### 2. Backend API (`app/api/analyze-profile/route.ts`)

Next.js API route that:
- Receives student activities and honors via POST request
- Validates input data
- Spawns Python script as child process
- Passes data via stdin
- Returns AI analysis as JSON
- Handles errors gracefully

### 3. Python Script (`scripts/analyze_profile.py`)

Python script that:
- Reads student data from stdin
- Constructs detailed prompt for OpenAI
- Calls GPT-4 API with structured output request
- Parses and validates response
- Outputs JSON analysis

## Data Flow

```
User clicks "AI Analysis"
    ↓
Frontend (profile/page.tsx)
    ↓
POST /api/analyze-profile
    ↓
API Route (analyze-profile/route.ts)
    ↓
Spawn Python Process
    ↓
Python Script (analyze_profile.py)
    ↓
OpenAI GPT-4 API
    ↓
JSON Response
    ↓
Display in UI
```

## Analysis Output Structure

```typescript
{
  primarySpike: {
    category: string          // e.g., "STEM", "Leadership"
    strength: number          // 1-100 score
    description: string       // 2-3 sentences explaining the spike
    keyActivities: string[]   // Most impressive activities
  },
  secondaryStrengths: [{
    category: string
    description: string
  }],
  recommendedMajors: [{
    major: string
    relevance: number         // 1-100 match score
    reasoning: string         // Why this major fits
  }],
  suggestedActivities: [{
    activity: string
    reasoning: string
    priority: "high" | "medium" | "low"
  }],
  missionStatements: string[], // 4 ready-to-use statements
  overallAssessment: {
    strengths: string[]       // 3-4 key strengths
    areasForGrowth: string[]  // 2-3 improvement areas
    admissionsAdvice: string  // Strategic advice
  }
}
```

## Key Features

### Spike Identification
- Analyzes all activities and honors together
- Considers time investment, leadership, and recognition
- Identifies depth vs. breadth of involvement
- Provides qualitative assessment of impact

### Major Recommendations
- Suggests 6+ relevant majors with match percentages
- Explains how each major aligns with the profile
- Considers both primary and secondary strengths
- Uses context-aware reasoning (not just category mapping)

### Activity Suggestions
- Identifies gaps in the profile
- Recommends high-priority next steps
- Suggests activities to deepen the spike
- Considers what admissions officers look for

### Mission Statements
- Generates 4 unique statements
- Incorporates specific activities and honors
- Tailored to the student's spike
- Ready for essays and personal statements

### Overall Assessment
- Lists 3-4 key strengths with specifics
- Identifies 2-3 areas for growth
- Provides strategic admissions advice
- Expert-level insights from AI analysis

## UI/UX Features

### Toggle Between Analyses
- Switch between Basic and AI analysis
- Compare results side-by-side
- "AI-Powered" badge indicates active mode

### Loading States
- Animated spinner during analysis
- Button text changes to "Analyzing..."
- Disabled state prevents multiple requests

### Error Handling
- Toast notifications for errors
- Detailed error messages in console
- Graceful fallback to basic analysis

### Visual Indicators
- Color-coded strength scores
- Priority badges on suggestions
- Relevance percentages for majors
- Icons for different categories

## File Structure

```
mycollegemap/
├── app/
│   ├── profile/
│   │   └── page.tsx                    # Main profile page with analysis
│   └── api/
│       └── analyze-profile/
│           └── route.ts                # API endpoint
├── scripts/
│   ├── analyze_profile.py              # Python analysis script
│   ├── requirements.txt                # Python dependencies
│   └── README.md                       # Script documentation
├── AI_SETUP_GUIDE.md                   # Setup instructions
└── PROFILE_ANALYSIS_DOCS.md            # This file
```

## Dependencies

### Frontend
- React, Next.js 15
- Framer Motion (animations)
- Lucide React (icons)
- Sonner (toast notifications)

### Backend
- Next.js API Routes
- Node.js child_process

### Python
- openai >= 1.0.0 (OpenAI API client)

## Configuration

### Environment Variables

Required in `.env.local`:
```env
OPENAI_API_KEY=sk-...
```

### OpenAI Model

Current model: **gpt-4o**

Can be changed in `scripts/analyze_profile.py`:
```python
response = client.chat.completions.create(
    model="gpt-4o",  # Change here
    # ...
)
```

## Cost Considerations

- **Per Analysis:** ~$0.01-0.03
- **Model:** GPT-4 (more expensive but higher quality)
- **Optimization:** Response format set to JSON for efficiency
- **Token Usage:** ~1000-2000 tokens per request

## Performance

- **Analysis Time:** 5-10 seconds typical
- **Timeout:** None set (uses OpenAI's default ~60s)
- **Rate Limits:** Depends on OpenAI account tier
- **Caching:** Not implemented (each click = new request)

## Security

### API Key Protection
- Stored in `.env.local` (not committed)
- Only accessible server-side
- Not exposed to client

### Input Validation
- Checks for required fields
- Validates data types
- Sanitizes JSON before processing

### Error Handling
- Errors logged server-side only
- Generic error messages to client
- No sensitive data in error responses

## Future Enhancements

### Potential Improvements
1. **Caching:** Store analyses to reduce API calls
2. **Comparison:** Compare multiple students (for counselors)
3. **History:** Track how profile changes over time
4. **PDF Export:** Generate downloadable reports
5. **Batch Analysis:** Analyze multiple profiles at once
6. **Custom Prompts:** Allow counselors to customize analysis criteria
7. **Model Selection:** Let users choose between GPT-4 and GPT-3.5
8. **Cost Tracking:** Display API usage and costs

### Known Limitations
1. Analysis quality depends on input detail
2. Requires internet connection
3. Costs money per use
4. May hit rate limits with heavy usage
5. No real-time collaboration features

## Testing

### Manual Testing Steps

1. **Basic Flow:**
   - Add 2-3 activities with different categories
   - Add 1-2 honors
   - Navigate to My Profile
   - Click "AI-Powered Analysis"
   - Verify analysis displays

2. **Error Cases:**
   - Try with no activities (should show error)
   - Disconnect internet (should show error)
   - Invalid API key (should show error)

3. **Toggle Feature:**
   - Run AI analysis
   - Click "Show Basic Analysis"
   - Verify basic analysis shows
   - Click "AI-Powered Analysis" again

### Test Data Example

```json
{
  "activities": [
    {
      "activityName": "Robotics Team",
      "category": "Academic",
      "leadershipPosition": "Team Captain",
      "description": "Led team of 15 students to build competition robot",
      "hoursPerWeek": 12,
      "weeksPerYear": 40,
      "yearsParticipated": 3
    }
  ],
  "honorsAwards": [
    {
      "title": "First Place - State Robotics Championship",
      "level": "State",
      "description": "Won 1st place among 50+ teams"
    }
  ]
}
```

## Troubleshooting Guide

See [AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md) for detailed troubleshooting steps.

## Changelog

### v1.0.0 (Current)
- ✅ AI-powered spike identification
- ✅ Major recommendations with reasoning
- ✅ Activity suggestions with priorities
- ✅ Mission statement generation
- ✅ Overall assessment with strategic advice
- ✅ Toggle between basic and AI analysis
- ✅ Loading states and error handling
- ✅ Visual polish with animations

---

**Built with ❤️ for students pursuing their college dreams**

