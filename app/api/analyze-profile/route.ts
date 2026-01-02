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
    const prompt = `You are an expert college admissions counselor with extensive knowledge of college admissions data, analyzing a high school student's complete profile to provide highly personalized, data-driven guidance.

STUDENT PROFILE:

ACADEMIC PERFORMANCE:
${averageGPA ? `- Average GPA: ${averageGPA} (Weighted)` : "- GPA: Not provided"}
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

Provide a comprehensive, data-driven analysis in JSON format. Be SPECIFIC and PERSONALIZED - reference their actual activities, GPA, test scores, and achievements. Avoid generic advice.

{
  "academicSpike": {
    "category": "Main area of excellence (e.g., 'Biomedical Research', 'Social Justice Advocacy', not just 'STEM')",
    "strength": 85,
    "description": "2-3 sentences explaining their SPECIFIC spike based on THEIR activities and honors",
    "keyEvidence": ["Reference SPECIFIC activities/honors from their profile that prove this"]
  },
  "recommendedMajors": [
    {
      "major": "Specific major (e.g., 'Computational Biology', not just 'Biology')",
      "relevance": 95,
      "reasoning": "Why THIS major fits THEIR specific profile, mentioning their GPA/scores/activities",
      "careerPaths": ["3-4 specific career paths this major leads to"],
      "coursesYouWillTake": ["4-5 example courses they'll take in this major"],
      "whyItFitsYou": "Personalized explanation connecting THEIR activities to this major"
    }
  ],
  "collegeRecommendations": {
    "safety": [
      {
        "name": "Specific college name",
        "location": "City, State",
        "acceptanceRate": "Approximate %",
        "averageGPA": "Range",
        "averageSAT": "Range",
        "whyGoodFit": "Specific programs/opportunities at THIS school that match THEIR profile",
        "strengthsForThisSchool": ["2-3 specific aspects of their profile that make them competitive here"]
      }
    ],
    "target": [
      {
        "name": "Specific college name",
        "location": "City, State",
        "acceptanceRate": "Approximate %",
        "averageGPA": "Range",
        "averageSAT": "Range",
        "whyGoodFit": "Specific programs/opportunities at THIS school that match THEIR profile",
        "strengthsForThisSchool": ["2-3 specific aspects of their profile that make them competitive here"],
        "areasToStrengthen": ["1-2 areas where they could improve their chances"]
      }
    ],
    "reach": [
      {
        "name": "Specific college name",
        "location": "City, State",
        "acceptanceRate": "Approximate %",
        "averageGPA": "Range",
        "averageSAT": "Range",
        "whyGoodFit": "Specific programs/opportunities at THIS school that match THEIR profile",
        "strengthsForThisSchool": ["What makes them a potential candidate despite the selectivity"],
        "whatWouldMakeYouStandOut": ["Specific achievements or improvements that would significantly boost their chances"]
      }
    ]
  },
  "personalizedInsights": [
    {
      "insight": "Specific observation about THEIR profile",
      "actionable": "Concrete action they can take based on this insight",
      "impact": "How this will specifically help their applications"
    }
  ],
  "suggestedNextSteps": [
    {
      "step": "Specific, actionable recommendation tailored to THEIR profile",
      "reasoning": "Why THIS step matters for THEIR specific spike/goals",
      "priority": "high/medium/low",
      "timeline": "When they should do this (e.g., 'This summer', 'Junior year')"
    }
  ],
  "overallStrength": {
    "score": 85,
    "tier": "competitive/highly competitive/exceptional",
    "strengths": ["SPECIFIC strengths from THEIR profile, not generic"],
    "areasForGrowth": ["SPECIFIC areas THEY should improve"],
    "admissionsAdvice": "2-3 sentences of strategic advice specific to THEIR profile and goals"
  }
}

CRITICAL INSTRUCTIONS:
- Be SPECIFIC: Reference their actual GPA (${averageGPA || 'N/A'}), test scores, and activities by name
- No generic advice: Every insight must be personalized to THIS student
- College recommendations must match their academic stats and interests
- Safety schools: Where their stats are above the 75th percentile
- Target schools: Where their stats are in the middle 50%
- Reach schools: Where their stats are below median but profile is still competitive
- Include 3-4 schools in each category (safety/target/reach)
- For majors: Include career paths and specific courses
- Provide ONLY valid JSON, no additional text.`

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
          content: "You are an expert college admissions counselor with deep knowledge of US college admissions data, acceptance rates, and what universities look for. You provide personalized, data-driven guidance tailored to each student's specific profile."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000, // Increased for detailed college recommendations
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

