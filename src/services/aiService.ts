import { ArticlePrompt, GeneratedArticle } from '@/types/meeting';

// Simulated AI service - ready for integration with actual AI backend
export const generateArticle = async (
  transcript: string,
  prompt: ArticlePrompt
): Promise<GeneratedArticle> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract meaningful content from transcript
  const words = transcript.split(/\s+/).filter(w => w.length > 0);
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Extract key themes by finding frequently mentioned words (excluding common words)
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'when', 'where', 'why', 'how']);
  
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length > 3 && !commonWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });
  
  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);

  // Generate contextual title based on top themes
  const titleTemplates = [
    `Insights on ${topWords[0] || 'Key Topics'}`,
    `Understanding ${topWords[0] || 'Core Themes'}`,
    `Exploring ${topWords[0] || 'Important Concepts'}`,
    `${topWords[0] ? topWords[0].charAt(0).toUpperCase() + topWords[0].slice(1) : 'Session'} Discussion Highlights`,
  ];
  const generatedTitle = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

  // Extract actual content snippets for overview
  const firstSentences = sentences.slice(0, 3).join('. ').substring(0, 200);
  
  // Generate overview based on transcript content
  const sessionOverview = `This ${prompt.style} session explored several key areas related to ${topWords.slice(0, 3).join(', ')}. The discussion covered practical applications and theoretical foundations, providing ${prompt.audience || 'participants'} with actionable insights and deeper understanding.

${firstSentences}${firstSentences.endsWith('.') ? '' : '...'} The session emphasized collaborative learning and knowledge sharing among attendees.`;

  // Generate sub-topics based on content themes
  const subTopicTemplates = [
    { 
      heading: `Understanding ${topWords[0] || 'Core Concepts'}`, 
      content: `The session opened with an exploration of ${topWords[0] || 'fundamental topics'}. Participants examined how these concepts apply in practical scenarios, discussing both challenges and opportunities.\n\nKey points included the importance of ${topWords[1] || 'strategic thinking'} and how it connects to ${topWords[2] || 'daily operations'}. The group shared real examples that illustrated these principles in action.`
    },
    { 
      heading: `Practical Applications`, 
      content: `Moving from theory to practice, the discussion highlighted concrete ways to implement these ideas. Participants explored how ${topWords[0] || 'core concepts'} translate into actionable steps.\n\nThe team identified specific strategies for ${topWords[1] || 'implementation'}, considering resource constraints and organizational dynamics. This practical focus ensured the insights could be applied immediately.`
    },
    { 
      heading: `Key Challenges and Solutions`, 
      content: `The conversation addressed potential obstacles related to ${topWords[2] || 'implementation'}. Participants candidly discussed barriers they've encountered and shared strategies that proved effective.\n\nBy addressing these challenges proactively, the group developed practical solutions that strengthen the overall approach and increase likelihood of success.`
    },
    { 
      heading: `Collaborative Insights`, 
      content: `The session demonstrated the power of collective intelligence around ${topWords[0] || 'shared goals'}. Diverse perspectives converged to create solutions more robust than any individual could develop alone.\n\n> "The best insights come from bringing different viewpoints together and finding common ground."\n\nThis collaborative energy will carry forward into implementation phases.`
    },
    { 
      heading: `Moving Forward`, 
      content: `Participants left with clarity on next steps regarding ${topWords[0] || 'key initiatives'}. The group established concrete action items and accountability structures to maintain momentum.\n\nFollow-up sessions were scheduled to assess progress and adapt strategies based on learnings. This ensures continued alignment and effective execution.`
    },
  ];

  const sectionCount = prompt.length === 'short' ? 4 : prompt.length === 'medium' ? 5 : 6;
  const sections = subTopicTemplates.slice(0, sectionCount);

  // Generate takeaways based on themes
  const takeaways = [
    `Focus on ${topWords[0] || 'core principles'} to drive meaningful progress and alignment across teams`,
    `Implement ${topWords[1] || 'key strategies'} systematically while remaining flexible to adapt as needed`,
    `Leverage collaborative approaches that bring diverse perspectives to problem-solving`,
    `Establish clear communication and regular check-ins to maintain momentum`,
    `Document insights and decisions to build institutional knowledge for future reference`,
  ].slice(0, prompt.length === 'short' ? 3 : prompt.length === 'medium' ? 4 : 5);

  // Generate hashtags based on content
  const contentHashtags = topWords.slice(0, 4).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  );
  const genericHashtags = ['SessionInsights', 'ProfessionalDevelopment', 'TeamCollaboration', 'KnowledgeSharing', 'ContinuousLearning', 'ActionableInsights'];
  
  const allHashtags = [...contentHashtags, ...genericHashtags];
  const hashtagCount = 8 + Math.floor(Math.random() * 5);
  const selectedHashtags = allHashtags
    .sort(() => Math.random() - 0.5)
    .slice(0, hashtagCount);

  return {
    title: generatedTitle,
    summary: sessionOverview,
    sections,
    takeaways,
    hashtags: selectedHashtags,
  };
};

export const generateImage = async (description: string): Promise<string> => {
  // Simulate image generation delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Return varied placeholder images to simulate unique graphics per session
  const imageOptions = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
  ];
  
  return imageOptions[Math.floor(Math.random() * imageOptions.length)];
};
