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

  // Generate AI-style title based on content themes
  const titleOptions = [
    `Unlocking Innovation: Key Insights from Today's Session`,
    `Strategic Perspectives: A Deep Dive into ${topicWords.substring(0, 30)}`,
    `Transforming Ideas into Action: Session Highlights`,
    `The Path Forward: Essential Takeaways from Our Discussion`,
    `Building Momentum: Collaborative Insights and Next Steps`,
  ];
  const generatedTitle = titleOptions[Math.floor(Math.random() * titleOptions.length)];

  // Generate 4-6 sub-topics aligned with LinkedIn article style
  const subTopicTemplates = [
    { 
      heading: 'Setting the Stage', 
      content: `The session began with a comprehensive overview of the current landscape. Participants explored the foundational concepts that would guide the discussion, establishing a shared understanding of the challenges and opportunities at hand.

Understanding the context is crucial for meaningful progress. The team identified key priorities and aligned on the strategic direction, ensuring everyone was prepared to contribute effectively to the conversation.`
    },
    { 
      heading: 'Core Insights and Discoveries', 
      content: `Several breakthrough insights emerged during the session. The discussion revealed patterns and opportunities that had previously gone unnoticed, offering fresh perspectives on longstanding challenges.

> "The most impactful ideas often come from unexpected connections between different disciplines and perspectives."

These discoveries underscore the value of collaborative exploration and open dialogue in driving innovation and problem-solving.`
    },
    { 
      heading: 'Practical Applications', 
      content: `Moving from theory to practice, the group identified concrete ways to apply these insights. The focus shifted to actionable strategies that could be implemented immediately, with clear ownership and timelines.

Each application was evaluated against real-world constraints, ensuring that the proposed solutions were both ambitious and achievable within existing resource frameworks.`
    },
    { 
      heading: 'Challenges and Considerations', 
      content: `No meaningful discussion is complete without acknowledging potential obstacles. The team candidly assessed the challenges that could impact implementation, from technical constraints to organizational dynamics.

By addressing these considerations proactively, the group developed contingency plans and mitigation strategies that strengthen the overall approach.`
    },
    { 
      heading: 'Collaborative Momentum', 
      content: `The session demonstrated the power of collective intelligence. Diverse perspectives converged to create solutions more robust than any individual could develop alone.

This collaborative energy will carry forward as the team moves into implementation, with each member bringing unique strengths to the shared mission.`
    },
    { 
      heading: 'Looking Ahead', 
      content: `The session concluded with a clear vision for the future. Participants left with renewed clarity on priorities and a shared commitment to driving meaningful progress.

Next steps were defined, follow-up meetings scheduled, and accountability structures established to maintain momentum and ensure continued alignment.`
    },
  ];

  // Select 4-6 sections based on prompt length
  const sectionCount = prompt.length === 'short' ? 4 : prompt.length === 'medium' ? 5 : 6;
  const sections = subTopicTemplates.slice(0, sectionCount);

  // Generate 150-200 word session overview
  const sessionOverview = `This ${prompt.style} session brought together key stakeholders to explore critical topics and drive meaningful outcomes. Written in a ${prompt.tone} tone for ${prompt.audience || 'professionals and team members'}, this article captures the essential discussions, decisions, and insights shared during our time together.

The conversation covered multiple dimensions of the subject matter, from foundational concepts to practical applications. Participants engaged in dynamic dialogue, sharing perspectives that enriched the collective understanding and opened new avenues for exploration.

Key themes emerged around innovation, collaboration, and strategic execution. The session highlighted both the opportunities ahead and the challenges to navigate, providing a balanced view that informs thoughtful action planning.

As organizations continue to evolve in an increasingly complex landscape, sessions like this become vital touchpoints for alignment and progress. The insights captured here serve as a foundation for continued growth and development.`;

  // Generate 3-5 actionable takeaways
  const takeaways = [
    'Prioritize collaborative approaches that leverage diverse perspectives and expertise across teams',
    'Implement quick wins immediately while building toward longer-term strategic initiatives',
    'Establish clear communication channels and regular check-ins to maintain alignment and momentum',
    'Document decisions and rationale to create institutional knowledge and enable future reference',
    'Schedule follow-up sessions to assess progress and adapt strategies based on learnings',
  ].slice(0, prompt.length === 'short' ? 3 : prompt.length === 'medium' ? 4 : 5);

  // Generate 8-12 relevant hashtags for LinkedIn optimization
  const allHashtags = [
    'SessionInsights', 'ProfessionalDevelopment', 'TeamCollaboration', 
    'StrategicPlanning', 'Innovation', 'Leadership', 'WorkplaceExcellence',
    'ContinuousLearning', 'BusinessStrategy', 'KnowledgeSharing',
    'FutureOfWork', 'GrowthMindset', 'ActionableInsights', 'TeamSuccess',
    'ProfessionalGrowth', 'CollaborativeLeadership'
  ];
  
  const hashtagCount = 8 + Math.floor(Math.random() * 5); // 8-12 hashtags
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
