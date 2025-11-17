#!/usr/bin/env python3
"""
Profile Analysis Script using OpenAI API
Analyzes student activities and honors to identify spikes and provide recommendations
"""

import os
import sys
import json
from openai import OpenAI

def analyze_student_profile(activities, honors_awards):
    """
    Analyze student's activities and honors to identify their spike and provide recommendations
    
    Args:
        activities: List of activity dictionaries
        honors_awards: List of honor/award dictionaries
        
    Returns:
        dict: Analysis results with spike, majors, activities, and mission statements
    """
    
    # Initialize OpenAI client
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set")
    
    client = OpenAI(api_key=api_key)
    
    # Prepare the prompt with student data
    prompt = f"""You are an expert college admissions counselor analyzing a student's extracurricular profile to identify their "spike" - the area where they show exceptional depth and achievement.

STUDENT PROFILE:

Activities ({len(activities)} total):
"""
    
    for i, activity in enumerate(activities, 1):
        prompt += f"\n{i}. {activity.get('activityName', 'Unknown Activity')}"
        if activity.get('category'):
            prompt += f" (Category: {activity['category']})"
        if activity.get('leadershipPosition'):
            prompt += f" - {activity['leadershipPosition']}"
        if activity.get('description'):
            prompt += f"\n   Description: {activity['description']}"
        if activity.get('hoursPerWeek') and activity.get('weeksPerYear') and activity.get('yearsParticipated'):
            total_hours = activity['hoursPerWeek'] * activity['weeksPerYear'] * activity['yearsParticipated']
            prompt += f"\n   Time Commitment: {activity['hoursPerWeek']}h/week, {activity['weeksPerYear']}w/year, {activity['yearsParticipated']} years (Total: {total_hours} hours)"
    
    prompt += f"\n\nHonors & Awards ({len(honors_awards)} total):"
    
    for i, honor in enumerate(honors_awards, 1):
        prompt += f"\n{i}. {honor.get('title', 'Unknown Honor')}"
        if honor.get('level'):
            prompt += f" ({honor['level']} level)"
        if honor.get('description'):
            prompt += f"\n   Description: {honor['description']}"
        if honor.get('dateReceived'):
            prompt += f"\n   Date: {honor['dateReceived']}"
    
    prompt += """

ANALYSIS REQUIRED:

Please analyze this student's profile and provide a comprehensive assessment in the following JSON format:

{
  "primarySpike": {
    "category": "The main area of excellence (e.g., STEM, Leadership, Arts, Athletics, Community Service, etc.)",
    "strength": "Score from 1-100 indicating how strong this spike is",
    "description": "2-3 sentence explanation of why this is their spike and what makes it compelling",
    "keyActivities": ["List 2-3 most impressive activities that define this spike"]
  },
  "secondaryStrengths": [
    {
      "category": "Secondary area of strength",
      "description": "Brief explanation"
    }
  ],
  "recommendedMajors": [
    {
      "major": "Specific major name",
      "relevance": "Score 1-100",
      "reasoning": "Why this major fits their profile"
    }
  ],
  "suggestedActivities": [
    {
      "activity": "Specific activity suggestion",
      "reasoning": "Why this would strengthen their profile",
      "priority": "high/medium/low"
    }
  ],
  "missionStatements": [
    "4 different mission statement options they could use in essays/applications"
  ],
  "overallAssessment": {
    "strengths": ["List 3-4 key strengths"],
    "areasForGrowth": ["List 2-3 areas to improve"],
    "admissionsAdvice": "2-3 sentences of strategic advice for college applications"
  }
}

Provide ONLY the JSON response, no additional text. Be specific, insightful, and consider what top-tier college admissions officers look for. Focus on depth over breadth, leadership, impact, and uniqueness.
"""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert college admissions counselor with deep knowledge of what makes students stand out in the admissions process. Provide detailed, actionable insights."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        analysis = json.loads(response.choices[0].message.content)
        
        return {
            "success": True,
            "analysis": analysis
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def main():
    """Main function to run the script"""
    
    # Read input from stdin (passed from Node.js)
    try:
        input_data = json.loads(sys.stdin.read())
        activities = input_data.get('activities', [])
        honors_awards = input_data.get('honorsAwards', [])
        
        # Perform analysis
        result = analyze_student_profile(activities, honors_awards)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)


if __name__ == "__main__":
    main()

