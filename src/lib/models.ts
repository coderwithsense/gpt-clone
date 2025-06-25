import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI, openai } from "@ai-sdk/openai"

const geminiModel = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API,
})

const gptModel = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export { gptModel, geminiModel };