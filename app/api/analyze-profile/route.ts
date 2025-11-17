import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 second timeout for comprehensive analysis
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      activities,
      honorsAwards,
      gpaEntries,
      testScores,
      essays,
    } = body

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    // Calculate average GPA
    const averageGPA = gpaEntries && gpaEntries.length > 0
      ? (gpaEntries.reduce((sum: number, entry: any) => sum + entry.gpa, 0) / gpaEntries.length).toFixed(2)
      : null

    // Get best test scores
    const bestSAT = testScores?.find((score: any) => score.testType === "SAT")
    const bestACT = testScores?.find((score: any) => score.testType === "ACT")
    const bestAP = testScores?.filter((score: any) => score.testType === "AP").sort((a: any, b: any) => (b.score || 0) - (a.score || 0))

    // Get essay quality assessment
    const essayCount = essays?.length || 0
    const essayStatuses = essays?.map((e: any) => e.status) || []
    const completedEssays = essayStatuses.filter((s: string) => s === "completed" || s === "final").length

    // Build comprehensive prompt
    const prompt = `You are an expert college admissions counselor analyzing a high school student's complete academic and extracurricular profile to provide comprehensive admissions guidance.

STUDENT PROFILE:

ACADEMIC PERFORMANCE:
${averageGPA ? `- Average GPA: ${averageGPA}` : "- GPA: Not provided"}
${bestSAT ? `- Best SAT Score: ${bestSAT.score}` : ""}
${bestACT ? `- Best ACT Score: ${bestACT.score}` : ""}
${bestAP && bestAP.length > 0 ? `- AP Scores: ${bestAP.slice(0, 5).map((s: any) => `${s.testName || 'AP'}: ${s.score}`).join(", ")}` : ""}

ESSAYS:
${essayCount > 0 ? `- Total Essays: ${essayCount}` : "- Essays: None provided"}
${completedEssays > 0 ? `- Completed Essays: ${completedEssays}` : ""}
${essays && essays.length > 0 ? essays.map((e: any, i: number) => `  ${i + 1}. ${e.title || 'Untitled'} (${e.status || 'draft'}) - ${e.wordCount || 0} words`).join("\n") : ""}

ACTIVITIES (${activities?.length || 0} total):
${activities && activities.length > 0 ? activities.map((activity: any, i: number) => {
  let activityText = `${i + 1}. ${activity.activityName || 'Unknown Activity'}`
  if (activity.category) activityText += ` (Category: ${activity.category})`
  if (activity.leadershipPosition) activityText += ` - Leadership: ${activity.leadershipPosition}`
  if (activity.description) activityText += `\n   Description: ${activity.description}`
  if (activity.hoursPerWeek && activity.weeksPerYear && activity.yearsParticipated) {
    const totalHours = activity.hoursPerWeek * activity.weeksPerYear * activity.yearsParticipated
    activityText += `\n   Time Commitment: ${activity.hoursPerWeek}h/week × ${activity.weeksPerYear}w/year × ${activity.yearsParticipated} years = ${totalHours} total hours`
  }
  return activityText
}).join("\n\n") : "None provided"}

HONORS & AWARDS (${honorsAwards?.length || 0} total):
${honorsAwards && honorsAwards.length > 0 ? honorsAwards.map((honor: any, i: number) => {
  let honorText = `${i + 1}. ${honor.title || 'Unknown Honor'}`
  if (honor.level) honorText += ` (${honor.level} level)`
  if (honor.description) honorText += `\n   Description: ${honor.description}`
  if (honor.dateReceived) honorText += `\n   Date: ${honor.dateReceived}`
  return honorText
}).join("\n\n") : "None provided"}

ANALYSIS REQUIRED:

Please provide a comprehensive analysis in the following JSON format. Analyze the DESCRIPTIONS, not just categories, to understand the student's true interests, achievements, and potential:

{
  "academicSpike": {
    "category": "The main area of academic/expertise excellence (e.g., STEM, Humanities, Arts, Leadership, etc.)",
    "strength": 85,
    "description": "2-3 sentence explanation based on DESCRIPTIONS of activities and honors, not just categories. What makes this their spike?",
    "keyEvidence": ["List 2-3 specific activities/honors with descriptions that prove this spike"]
  },
  "recommendedMajors": [
    {
      "major": "Specific major name (e.g., 'Biomedical Engineering', not just 'Engineering')",
      "relevance": 95,
      "reasoning": "Why this major fits based on their DESCRIPTIONS, GPA, test scores, and essay themes"
    }
  ],
  "suggestedNextSteps": [
    {
      "step": "Specific actionable recommendation",
      "reasoning": "Why this would strengthen their profile based on gaps or opportunities",
      "priority": "high/medium/low"
    }
  ],
  "missionStatements": [
    "4 different mission statement options that synthesize their activities, honors, academic performance, and essay themes into a compelling narrative"
  ],
  "overallStrength": {
    "score": 85,
    "tier": "competitive/highly competitive/exceptional",
    "strengths": ["List 3-4 key strengths based on DESCRIPTIONS and academic performance"],
    "areasForGrowth": ["List 2-3 specific areas to improve"],
    "admissionsAdvice": "2-3 sentences of strategic advice for college applications based on their complete profile"
  }
}

CRITICAL: 
- Analyze DESCRIPTIONS of activities and honors, not just categories
- Consider GPA and test scores in your assessment
- Consider essay themes and quality
- Be specific and insightful
- Focus on what top-tier college admissions officers look for
- Provide ONLY the JSON response, no additional text.`

    console.log('🎯 [PROFILE ANALYSIS] Starting analysis...', {
      activitiesCount: activities?.length || 0,
      honorsCount: honorsAwards?.length || 0,
      gpaEntriesCount: gpaEntries?.length || 0,
      testScoresCount: testScores?.length || 0,
      essaysCount: essays?.length || 0,
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert college admissions counselor with deep knowledge of what top universities look for in applicants. Analyze student profiles comprehensively, focusing on descriptions and details, not just categories."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error("No response from OpenAI")
    }

    const analysis = JSON.parse(responseText)

    console.log('✅ [PROFILE ANALYSIS] Analysis complete')

    return NextResponse.json({
      success: true,
      analysis,
    })

  } catch (error: any) {
    console.error('❌ [PROFILE ANALYSIS] Error:', {
      error: error.message,
      stack: error.stack?.substring(0, 200),
    })

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze profile",
      },
      { status: 500 }
    )
  }
}

