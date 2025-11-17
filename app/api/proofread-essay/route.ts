import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('📝 [PROOFREADER] Starting proofreading request...')

  try {
    const { essay, wordLimit } = await request.json()

    console.log('📄 [PROOFREADER] Input received:', {
      essayLength: essay?.length || 0,
      wordLimit: wordLimit || 'none',
      essayPreview: essay?.substring(0, 100) + '...'
    })

    if (!essay || essay.trim().length === 0) {
      return NextResponse.json(
        { error: "Essay content is required" },
        { status: 400 }
      )
    }

    // Get OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      console.error('❌ [PROOFREADER] OpenAI API key not found')
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    console.log('🔑 [PROOFREADER] API key found:', {
      prefix: apiKey.substring(0, 7),
      length: apiKey.length,
      format: apiKey.startsWith('sk-') ? 'Valid format' : '⚠️ Invalid format'
    })

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey })

    // Count words
    const wordCount = essay.trim().split(/\s+/).filter((w: string) => w.length > 0).length

    // Create the system prompt
    const SYSTEM_MESSAGE = `You are an expert college admissions essay editor. Analyze the essay for:
1. Grammar & spelling errors
2. Clarity & readability issues
3. Clichés and overused phrases
4. Tone and voice (should be authentic and personal)
5. Structure and flow
6. Word choice improvements
7. College essay best practices

Respond ONLY with valid JSON in this exact format:
{
  "overallScore": 85,
  "wordCount": ${wordCount},
  "issues": [
    {"type": "grammar", "text": "...", "suggestion": "...", "explanation": "..."},
    {"type": "style", "text": "...", "suggestion": "...", "explanation": "..."}
  ],
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "tone": "authentic/generic/formal",
  "summary": "Brief overall assessment"
}`

    console.log('📤 [PROOFREADER] Sending request to OpenAI...')
    const openaiStartTime = Date.now()

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: `Essay:\n\n${essay}${wordLimit ? `\n\nWord limit: ${wordLimit}` : ''}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500,
      timeout: 30000, // 30 second timeout
    })

    const openaiDuration = Date.now() - openaiStartTime
    console.log('✅ [PROOFREADER] OpenAI response received:', {
      duration: `${openaiDuration}ms`,
      usage: completion.usage,
      finishReason: completion.choices[0]?.finish_reason
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      console.error('❌ [PROOFREADER] No content in OpenAI response')
      return NextResponse.json(
        { error: "OpenAI returned an empty response. Please try again." },
        { status: 500 }
      )
    }

    let result
    try {
      result = JSON.parse(responseContent)
    } catch (parseError: any) {
      console.error('❌ [PROOFREADER] JSON parse error:', {
        error: parseError.message,
        contentPreview: responseContent.substring(0, 200)
      })
      return NextResponse.json(
        { error: "Failed to parse OpenAI response. Please try again." },
        { status: 500 }
      )
    }

    const totalDuration = Date.now() - startTime
    console.log('🎉 [PROOFREADER] Proofreading complete:', {
      totalDuration: `${totalDuration}ms`,
      issuesFound: result.issues?.length || 0,
      overallScore: result.overallScore
    })

    return NextResponse.json({ result }, { status: 200 })

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('❌ [PROOFREADER] Error:', {
      duration: `${duration}ms`,
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      errorStatus: error.status,
      stack: error.stack?.substring(0, 500)
    })

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return NextResponse.json(
        { error: "OpenAI API quota exceeded. Please check your API key billing." },
        { status: 429 }
      )
    }

    if (error.code === 'invalid_api_key' || error.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key. Please check your configuration." },
        { status: 401 }
      )
    }

    // Handle timeout
    if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 }
      )
    }

    // Handle OpenAI API errors
    if (error.response) {
      const status = error.response.status
      const errorMessage = error.response.data?.error?.message || error.message
      console.error('❌ [PROOFREADER] OpenAI API error:', {
        status,
        message: errorMessage
      })
      return NextResponse.json(
        { error: `OpenAI API error: ${errorMessage}` },
        { status: status || 500 }
      )
    }

    // Generic error with more details in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to proofread essay: ${error.message}` 
      : "Failed to proofread essay. Please try again."

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

