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

  // LinkedIn-style sections with engaging headings
  const sectionTemplates = [
    { heading: 'The Big Picture', prefix: 'Understanding the broader context,' },
    { heading: 'Key Insights', prefix: 'What emerged from the discussion,' },
    { heading: 'Strategic Implications', prefix: 'Looking at the strategic angle,' },
    { heading: 'Action Items', prefix: 'Moving forward,' },
    { heading: 'Looking Ahead', prefix: 'Considering future developments,' },
    { heading: 'Critical Takeaways', prefix: 'The essential points to remember,' },
    { heading: 'Final Thoughts', prefix: 'In closing,' },
  ];

  const sections = sectionTemplates.slice(0, sectionCount).map((template, i) => ({
    heading: template.heading,
    content: `${template.prefix} the meeting addressed important topics that deserve attention. The ${prompt.style} writing style and ${prompt.tone} tone have been applied to present the information effectively for ${prompt.audience || 'the general audience'}.

${i === 0 ? `The participants discussed various aspects related to: "${topicWords}..."` : ''}

Key insights from this portion of the meeting include actionable items and strategic decisions that align with the team's objectives. The discussion highlighted several opportunities for growth and improvement.

> "${topicWords.slice(0, 30)}..." - This quote captures the essence of what was discussed.

The implications of these discussions extend beyond the immediate context, offering valuable lessons for future initiatives.`,
  }));

  // Generate relevant hashtags based on content
  const hashtagSuggestions = [
    'MeetingInsights', 'BusinessStrategy', 'Leadership', 'TeamCollaboration',
    'ProfessionalDevelopment', 'Innovation', 'WorkplaceCulture', 'Productivity',
    'ContentCreation', 'AIAssisted', 'MeetingNotes', 'BusinessGrowth',
    'StrategicPlanning', 'TeamMeeting', 'KnowledgeSharing'
  ];

  // Select 5-8 relevant hashtags
  const selectedHashtags = hashtagSuggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 5 + Math.floor(Math.random() * 3));

  return {
    title: `${topicWords.substring(0, 50).trim()}${topicWords.length > 50 ? '...' : ''}: Key Insights from Today's Discussion`,
    summary: `This ${prompt.style} article summarizes the key discussions and decisions from the meeting. Written in a ${prompt.tone} tone for ${prompt.audience || 'team members and stakeholders'}, it captures the essential points, action items, and strategic insights shared during the session.`,
    sections,
    takeaways: [
      'Action items were identified and assigned to team members with clear deadlines',
      'Key decisions were made regarding project direction and resource allocation',
      'Follow-up meetings were scheduled for continued progress tracking',
      'Resources and support requirements were documented for implementation',
      'Success metrics were defined to measure progress and outcomes',
    ],
    hashtags: selectedHashtags,
  };
};

export const generateImage = async (description: string): Promise<string> => {
  // Simulate image generation delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Return a placeholder image URL
  // In production, this would integrate with an AI image generation service
  return `https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop`;
};
