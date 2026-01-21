import { ArticlePrompt, GeneratedArticle } from '@/types/meeting';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Get API key from environment or throw error
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please add your Gemini API key in project settings.');
  }
  return apiKey;
};

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

export const generateArticleWithGemini = async (
  transcript: string,
  prompt: ArticlePrompt
): Promise<GeneratedArticle> => {
  const apiKey = getApiKey();
  
  const systemPrompt = `You are an expert content writer who transforms meeting transcripts into professional articles.

Based on the transcript provided, generate a comprehensive article with the following specifications:
- Style: ${prompt.style}
- Tone: ${prompt.tone}
- Length: ${prompt.length} (short: 400-600 words, medium: 600-900 words, long: 900-1200 words)
- Target Audience: ${prompt.audience || 'general professional audience'}

Your response MUST be valid JSON with this exact structure:
{
  "title": "A compelling, SEO-friendly title based on key themes",
  "summary": "A 150-200 word overview of the session",
  "sections": [
    {
      "heading": "Section heading",
      "content": "2-3 paragraphs of detailed content for this section"
    }
  ],
  "takeaways": [
    "Key actionable insight 1",
    "Key actionable insight 2",
    "Key actionable insight 3"
  ],
  "hashtags": ["Hashtag1", "Hashtag2", "Hashtag3"]
}

Generate 4-6 sections based on the content.
Include 3-5 actionable takeaways.
Generate 8-12 relevant hashtags optimized for LinkedIn.

IMPORTANT: Respond ONLY with valid JSON, no additional text or markdown.`;

  const userPrompt = `Here is the meeting transcript to transform into an article:\n\n${transcript}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error('No content generated from Gemini API');
    }

    // Parse the JSON response, handling potential markdown code blocks
    let jsonText = textContent.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const article: GeneratedArticle = JSON.parse(jsonText);
    
    // Validate required fields
    if (!article.title || !article.summary || !article.sections) {
      throw new Error('Invalid article structure returned from API');
    }

    return article;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

export const askQuestionWithGemini = async (
  transcript: string,
  question: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> => {
  const apiKey = getApiKey();

  const systemPrompt = `You are a helpful AI assistant that answers questions about meeting transcripts.

You have access to the following meeting transcript:
---
${transcript}
---

Answer questions based on the content of this transcript. Be specific and reference actual content from the meeting when possible. If the question cannot be answered from the transcript, say so politely and suggest what information is available.

Keep responses concise but informative. Use a friendly, professional tone.`;

  // Build conversation context
  const conversationParts = conversationHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          ...conversationParts,
          {
            role: 'user',
            parts: [{ text: question }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error('No response generated from Gemini API');
    }

    return textContent;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};
