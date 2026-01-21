import { ArticlePrompt, GeneratedArticle } from '@/types/meeting';
import { generateArticleWithGemini } from './geminiService';

// Real AI service using Google Gemini
export const generateArticle = async (
  transcript: string,
  prompt: ArticlePrompt
): Promise<GeneratedArticle> => {
  // Validate transcript has enough content
  if (!transcript || transcript.trim().length < 50) {
    throw new Error('Transcript is too short. Please record more content before generating an article.');
  }

  try {
    const article = await generateArticleWithGemini(transcript, prompt);
    return article;
  } catch (error) {
    console.error('Article generation error:', error);
    throw error;
  }
};

export const generateImage = async (description: string): Promise<string> => {
  // Image generation still uses placeholder since Gemini doesn't support image generation
  // This can be upgraded to use a dedicated image generation API later
  await new Promise(resolve => setTimeout(resolve, 1500));

  const imageOptions = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
  ];
  
  return imageOptions[Math.floor(Math.random() * imageOptions.length)];
};
