export interface Meeting {
  id: string;
  title: string;
  participants: string;
  date: string;
  duration: number;
  transcript: string;
  article?: GeneratedArticle;
  createdAt: string;
}

export interface GeneratedArticle {
  title: string;
  summary: string;
  sections: ArticleSection[];
  takeaways: string[];
  hashtags?: string[];
  generatedImage?: string;
}

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface ArticlePrompt {
  style: 'professional' | 'casual' | 'academic' | 'conversational';
  tone: 'informative' | 'persuasive' | 'neutral' | 'engaging';
  length: 'short' | 'medium' | 'long';
  audience: string;
}

export interface StorageStatus {
  used: number;
  total: number;
  free: number;
  warning: 'none' | 'low' | 'critical';
}

export interface LLMModel {
  id: string;
  name: string;
  description: string;
  size: string;
  downloaded: boolean;
  isDefault?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type RecordingState = 'idle' | 'recording' | 'paused';
