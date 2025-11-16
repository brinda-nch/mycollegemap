# Python Scripts for MyCollegeMap

This directory contains Python scripts that provide AI-powered analysis for student profiles.

## Setup

### 1. Install Python Dependencies

```bash
cd scripts
pip3 install -r requirements.txt
```

Or using a virtual environment (recommended):

```bash
cd scripts
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Set Up OpenAI API Key

Add your OpenAI API key to the `.env.local` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

You can get an API key from: https://platform.openai.com/api-keys

## Scripts

### analyze_profile.py

Analyzes a student's activities and honors to identify their academic "spike" and provide personalized recommendations.

**Features:**
- Identifies primary and secondary areas of excellence
- Recommends relevant college majors with reasoning
- Suggests activities to strengthen the profile
- Generates mission statement ideas for essays
- Provides overall assessment with strengths and areas for growth
- Strategic admissions advice

**Usage:**

The script is called automatically by the Next.js API route at `/api/analyze-profile`. It receives student data via stdin and outputs JSON results.

**Manual Testing:**

```bash
cd scripts
echo '{"activities": [{"activityName": "Debate Team", "category": "Academic", "leadershipPosition": "Captain"}], "honorsAwards": [{"title": "National Debate Champion", "level": "National"}]}' | OPENAI_API_KEY=your_key python3 analyze_profile.py
```

## API Integration

The Python scripts are integrated with the Next.js application through the API route at:
`/app/api/analyze-profile/route.ts`

This route:
1. Receives student activities and honors from the frontend
2. Spawns the Python script as a child process
3. Passes data via stdin
4. Returns the AI analysis as JSON

## Model

The script uses OpenAI's **GPT-4** model for high-quality analysis. You can modify the model in `analyze_profile.py` if needed.

## Error Handling

- If the OpenAI API key is not set, the API will return a 500 error
- If the Python script fails, error details are logged and returned
- Network errors and timeouts are handled gracefully

## Cost Considerations

Each analysis typically costs $0.01-0.03 in OpenAI API credits, depending on the length of the student's profile. The script uses GPT-4 which provides the best quality insights for college admissions analysis.

## Troubleshooting

**Python not found:**
- Make sure Python 3.7+ is installed
- The script assumes `python3` command is available

**Import errors:**
- Run `pip3 install -r requirements.txt`
- Check that the OpenAI library is version 1.0.0 or higher

**API errors:**
- Verify your OpenAI API key is valid and has available credits
- Check your OpenAI account rate limits
