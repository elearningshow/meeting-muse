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
  generatedImage?: string;
}

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface ArticlePrompt {
  style: 'professional' | 'casual' | 'academic' | 'creative';
  tone: 'formal' | 'friendly' | 'informative' | 'persuasive';
  length: 'short' | 'medium' | 'long';
  audience: string;
}

export interface StorageStatus {
  used: number;
  total: number;
  free: number;
  warning: 'none' | 'low' | 'critical';
}
