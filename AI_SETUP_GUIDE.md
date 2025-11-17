# AI-Powered Profile Analysis Setup Guide

This guide will help you set up the AI-powered profile analysis feature for MyCollegeMap.

## Prerequisites

- Python 3.7 or higher installed on your system
- Node.js and npm/pnpm installed
- OpenAI API account with available credits

## Step 1: Install Python Dependencies

Navigate to the scripts directory and install the required packages:

```bash
cd scripts
pip3 install -r requirements.txt
```

**Recommended: Use a virtual environment**

```bash
cd scripts
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Step 2: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the generated key (you won't be able to see it again!)

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root (if it doesn't exist):

```bash
touch .env.local
```

Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=sk-your_actual_api_key_here
```

**Important:** Never commit your `.env.local` file to version control!

## Step 4: Test the Setup

Start your development server:

```bash
npm run dev
# or
pnpm dev
```

## Step 5: Use the AI Analysis

1. Navigate to the **Extracurriculars** page
2. Add at least one activity and/or honor
3. Go to the **My Profile** page
4. Click the **"AI-Powered Analysis"** button
5. Wait for the analysis (usually 5-10 seconds)
6. View your personalized recommendations!

## Features

The AI analysis provides:

✅ **Primary Spike Identification** - Your strongest area of excellence
✅ **Recommended Majors** - Top 6 majors that match your profile
✅ **Suggested Activities** - Next steps to strengthen your application
✅ **Mission Statements** - 4 ready-to-use statements for essays
✅ **Overall Assessment** - Key strengths and areas for growth
✅ **Strategic Advice** - Admissions insights from an AI counselor

## Cost Information

- Each analysis uses OpenAI's GPT-4 model
- Typical cost: $0.01 - $0.03 per analysis
- Cost varies based on profile length and detail

## Troubleshooting

### Python Script Not Found

**Error:** `Python script exited with code 1`

**Solution:** Make sure the script is executable:
```bash
chmod +x scripts/analyze_profile.py
```

### Import Error: No module named 'openai'

**Error:** `ModuleNotFoundError: No module named 'openai'`

**Solution:** Install the OpenAI package:
```bash
pip3 install openai
```

### Invalid API Key

**Error:** `OpenAI API key not configured` or `Invalid API key`

**Solutions:**
1. Check that your `.env.local` file exists in the project root
2. Verify the API key is correct (should start with `sk-`)
3. Make sure there are no extra spaces or quotes around the key
4. Restart your dev server after adding the key

### Python Version Issues

**Error:** `python3: command not found`

**Solutions:**
- On macOS: Install Python via Homebrew: `brew install python3`
- On Windows: Download from [python.org](https://www.python.org/downloads/)
- On Linux: `sudo apt-get install python3` or `sudo yum install python3`

### Rate Limit Errors

**Error:** `Rate limit exceeded`

**Solutions:**
1. Wait a few seconds and try again
2. Check your OpenAI usage limits at [platform.openai.com](https://platform.openai.com/usage)
3. Upgrade your OpenAI plan if needed

### Analysis Taking Too Long

If the analysis takes more than 30 seconds:
1. Check your internet connection
2. Verify OpenAI API status at [status.openai.com](https://status.openai.com)
3. Check browser console for error messages

## Alternative: Manual Analysis

If you prefer not to use AI analysis, the profile page provides a built-in rule-based analysis that works without any API keys. Simply view your profile to see basic insights!

## Security Notes

- **Never share your API key** with anyone
- Add `.env.local` to `.gitignore` (it should already be there)
- Monitor your OpenAI usage regularly
- Set up usage limits in your OpenAI account settings

## Support

For issues specific to:
- **OpenAI API:** Visit [OpenAI Help Center](https://help.openai.com)
- **Application bugs:** Open an issue in the project repository
- **Setup questions:** Check the scripts/README.md file

---

**Happy analyzing! 🎓✨**

