import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

// Resilient Model Fallback Ladder ordered by availability and latency
export const MODEL_FALLBACK_LADDER = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
] as const;

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Resilient content generator that tries each model in the fallback ladder
 * sequentially if recoverable errors (503, 429, 404, 500) occur.
 */
export async function generateContentWithFallback(
  contents: any,
  systemInstruction?: string,
  configOverrides?: Record<string, any>
): Promise<{ text: string; modelUsed: string }> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  let lastError: any = null;

  for (const model of MODEL_FALLBACK_LADDER) {
    try {
      const response: GenerateContentResponse = await client.models.generateContent({
        model,
        contents,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          ...configOverrides,
        },
      });

      const text = response.text || '';
      return { text, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.statusCode || (err?.message?.includes('503') ? 503 : undefined);
      const isRecoverable =
        status === 503 ||
        status === 429 ||
        status === 404 ||
        status === 500 ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('NOT_FOUND');

      console.warn(`[Gemini Fallback] Model ${model} failed with error: ${err.message}. Recoverable: ${isRecoverable}`);
      if (!isRecoverable) {
        // Still try next fallback model just in case it's model-specific
        continue;
      }
    }
  }

  throw new Error(`All models in fallback ladder failed. Last error: ${lastError?.message || 'Unknown'}`);
}
