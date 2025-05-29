export interface Chapter {
  id: string;
  title: string;
  content: string;
  storyIds: string[];
  order: number;
  suggestedImages?: string[];
}

export interface Memoir {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  dedication?: string;
  style: 'classic' | 'modern' | 'vintage';
  chapters: Chapter[];
  status: 'draft' | 'completed';
  lastModified: string;
  createdAt: string;
}

export interface MemoirStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  features: string[];
}

export interface MemoirConfig {
  chapterCount: number;
  tone: 'formal' | 'casual' | 'nostalgic';
  style?: string;
}