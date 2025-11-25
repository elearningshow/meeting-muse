import { ArticlePrompt, GeneratedArticle } from '@/types/meeting';

// Simulated AI service - ready for integration with actual AI backend
export const generateArticle = async (
  transcript: string,
  prompt: ArticlePrompt
): Promise<GeneratedArticle> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock article based on transcript length
  const words = transcript.split(' ').filter(w => w.length > 0);
  const topicWords = words.slice(0, 10).join(' ');

  const lengthMap = {
    short: 3,
    medium: 5,
    long: 7,
  };

  const sectionCount = lengthMap[prompt.length];

  const sections = Array.from({ length: sectionCount }, (_, i) => ({
    heading: `Section ${i + 1}: Key Points`,
    content: `Based on the meeting discussion, this section covers important topics that were addressed. The ${prompt.style} writing style and ${prompt.tone} tone have been applied to present the information effectively for ${prompt.audience || 'the general audience'}.

The participants discussed various aspects related to: "${topicWords}..."

Key insights from this portion of the meeting include actionable items and strategic decisions that align with the team's objectives.`,
  }));

  return {
    title: `Meeting Summary: ${topicWords.substring(0, 50)}...`,
    summary: `This ${prompt.style} article summarizes the key discussions and decisions from the meeting. Written in a ${prompt.tone} tone for ${prompt.audience || 'team members'}, it captures the essential points and action items discussed.`,
    sections,
    takeaways: [
      'Action items were identified and assigned to team members',
      'Key decisions were made regarding project direction',
      'Follow-up meetings were scheduled for continued progress',
      'Resources and support requirements were documented',
    ],
  };
};

export const generateImage = async (description: string): Promise<string> => {
  // Simulate image generation delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Return a placeholder image URL
  // In production, this would integrate with an AI image generation service
  return `https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop`;
};
