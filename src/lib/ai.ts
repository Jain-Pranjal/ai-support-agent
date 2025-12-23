/*
IMPORTANT NOTE:

IT MAY BE POSSIBLE THAT THE GEMINI API IS OVERLOADED OR UNAVAILABLE AT TIMES, ESPECIALLY DURING PEAK HOURS. IF YOU EXPERIENCE ISSUES, PLEASE TRY AGAIN LATER OR DURING OFF-PEAK HOURS.
*/

import { GoogleGenAI } from '@google/genai'
import { readFileSync } from 'fs'
import path from 'path'

const promptPath = path.join(process.cwd(), 'src', 'lib', 'prompt.md')
const systemPrompt = readFileSync(promptPath, 'utf-8')

let ai: GoogleGenAI | null = null

function getAI() {
    if (!ai) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error(
                'GEMINI_API_KEY is not set in environment variables'
            )
        }
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    }
    return ai
}

export async function AiChatSupport(userMessage: string) {
    try {
        const aiInstance = getAI()
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            config: {
                systemInstruction: systemPrompt,
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        })

        return response.text || 'No response generated.'
    } catch (error) {
        console.error('Error in AiChatSupport:', error)
        return 'Sorry, I encountered an error processing your request.'
    }
}

// New streaming function that yields chunks
export async function* AiChatSupportStream(userMessage: string) {
    try {
        const aiInstance = getAI()
        const response = await aiInstance.models.generateContentStream({
            model: 'gemini-2.5-flash-lite',
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            config: {
                systemInstruction: systemPrompt,
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        })

        for await (const chunk of response) {
            if (chunk.text) {
                yield chunk.text
            }
        }
    } catch (error) {
        console.error('Error in AiChatSupportStream:', error)
        yield 'I apologize for the inconvenience. Our AI service is temporarily unavailable. Please try again in a moment.'
    }
}

// using the gemini-2.5-flash model for chat support(free api key has access to this model)
