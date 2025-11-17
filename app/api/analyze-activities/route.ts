import { NextResponse } from "next/server"
import OpenAI from "openai"

const SYSTEM_MESSAGE = `You are an expert college admissions officer. Evaluate student activities/essays holistically.

KEY EVALUATION CRITERIA:
- Impact & initiative (not just titles/hours)
- Leadership, creativity, problem-solving
- Context-aware assessment
- Quality over quantity
- Authentic voice (for essays)

SCORING (provide JSON):
1. public_flagship (1-5): Large public university lens
2. highly_selective (1-5): Elite/Ivy institution lens  
3. essay_quality (1-6): Only for essays
4. overall (1-10): Holistic admissions impact

OUTPUT FORMAT (JSON only):
{
  "summary": "2-3 sentence assessment",
  "strengths": ["3 key strengths"],
  "improvements": ["3 specific improvements"],
  "scores": {"public_flagship": 3, "highly_selective": 2, "essay_quality": 4, "overall": 6}
}`

export async function POST(request: Request) {
  const startTime = Date.now()
  console.log('🚀 [ANALYZER] Starting analysis request...')
  
  try {
    const { input, type } = await request.json()
    console.log('📝 [ANALYZER] Input received:', { 
      type, 
      inputLength: input?.length || 0,
      inputPreview: input?.substring(0, 100) + '...'
    })

    if (!input || !type) {
      console.error('❌ [ANALYZER] Missing input or type')
      return NextResponse.json({ error: "Missing input or type" }, { status: 400 })
    }

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('❌ [ANALYZER] No API key found in environment')
      return NextResponse.json({ error: "OpenAI API key not configured. Please set OPENAI_API_KEY in .env.local" }, { status: 500 })
    }

    console.log('🔑 [ANALYZER] API key found:', {
      prefix: apiKey.substring(0, 7),
      length: apiKey.length,
      format: apiKey.startsWith('sk-') ? 'Valid format' : '⚠️ Invalid format (should start with sk-)'
    })

    // Initialize OpenAI with API key from environment variable
    console.log('⚙️ [ANALYZER] Initializing OpenAI client...')
    const openai = new OpenAI({
      apiKey: apiKey,
      timeout: 30000, // 30 second timeout
    })

    const userMessage = type === "activity" 
      ? `Analyze this activity:\n\n${input}`
      : `Analyze this essay:\n\n${input}`

    console.log('📤 [ANALYZER] Sending request to OpenAI...', {
      model: 'gpt-3.5-turbo-1106',
      messageLength: userMessage.length,
      maxTokens: 800
    })

    const openaiStartTime = Date.now()
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: userMessage }
      ],
      temperature: 0.5,
      max_tokens: 800,
      response_format: { type: "json_object" },
    })
    const openaiDuration = Date.now() - openaiStartTime

    console.log('✅ [ANALYZER] OpenAI response received:', {
      duration: `${openaiDuration}ms`,
      usage: completion.usage,
      finishReason: completion.choices[0]?.finish_reason
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      console.error('❌ [ANALYZER] Empty response from OpenAI')
      throw new Error("No response from OpenAI")
    }

    console.log('📥 [ANALYZER] Response content:', {
      length: responseText.length,
      preview: responseText.substring(0, 200) + '...'
    })

    // Parse the JSON response
    const result = JSON.parse(responseText)
    
    const totalDuration = Date.now() - startTime
    console.log('🎉 [ANALYZER] Analysis complete!', {
      totalDuration: `${totalDuration}ms`,
      openaiDuration: `${openaiDuration}ms`,
      otherProcessing: `${totalDuration - openaiDuration}ms`
    })

    return NextResponse.json({ result })
    
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('💥 [ANALYZER] Error occurred:', {
      duration: `${duration}ms`,
      errorType: error?.constructor?.name,
      errorCode: error?.code,
      errorStatus: error?.status,
      errorMessage: error?.message,
      fullError: error
    })
    
    // More specific error messages
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: "❌ OpenAI API quota exceeded. Your API key has no credits left. Please add credits at platform.openai.com/account/billing" },
        { status: 402 }
      )
    }
    
    if (error?.status === 401 || error?.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: "❌ Invalid OpenAI API key. Please check your API key in .env.local file." },
        { status: 401 }
      )
    }

    if (error?.code === 'ENOTFOUND' || error?.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: "❌ Network error: Cannot reach OpenAI API. Check your internet connection." },
        { status: 503 }
      )
    }

    if (error?.message?.includes('timeout')) {
      return NextResponse.json(
        { error: "⏱️ Request timed out. OpenAI API took too long to respond. Try again with shorter text." },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: `❌ ${error?.message || "Failed to analyze. Please try again."}` },
      { status: 500 }
    )
  }
}

