import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  // Only throw at runtime, not during build type-checking
  if (process.env.NODE_ENV === 'production') {
    throw new Error('GEMINI_API_KEY environment variable is required')
  }
}

export const geminiClient = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ?? 'placeholder-for-build'
)

export const generationModel = geminiClient.getGenerativeModel({
  model: 'gemini-2.5-flash',
})
