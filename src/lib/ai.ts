import { supabase } from './supabase';

export interface AIAnalysis {
  suggestedTags: string[];
  emotions: string[];
  peopleMentioned: string[];
  timePeriod: {
    start: number;
    end?: number;
  };
  suggestedQuestions: string[];
}

export interface ChapterSuggestion {
  title: string;
  content: string;
  suggestedImages?: string[];
}

export interface MemoirChapter {
  title: string;
  introduction: string;
  content: string;
  stories: string[];
}

export async function analyzeContent(text: string): Promise<AIAnalysis> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-content', {
      body: { text }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
}

export async function generateStoryPrompt(context?: {
  timePeriod?: string;
  people?: string[];
  themes?: string[];
}): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-prompt', {
      body: { context }
    });

    if (error) throw error;
    return data.prompt;
  } catch (error) {
    console.error('Error generating story prompt:', error);
    throw error;
  }
}

export async function generateChapter(stories: string[], theme?: string): Promise<ChapterSuggestion> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-chapter', {
      body: { stories, theme }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating chapter:', error);
    throw error;
  }
}

export async function generateMemoir(stories: string[], config: {
  chapterCount: number;
  tone: 'formal' | 'casual' | 'nostalgic';
}): Promise<{ chapters: MemoirChapter[] }> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-memoir', {
      body: {
        stories,
        chapterCount: config.chapterCount,
        tone: config.tone
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating memoir:', error);
    throw error;
  }
}

export async function suggestImages(text: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('suggest-images', {
      body: { text }
    });

    if (error) throw error;
    return data.images;
  } catch (error) {
    console.error('Error suggesting images:', error);
    throw error;
  }
}

export async function getSimilarStories(storyId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('find-similar-stories', {
      body: { storyId }
    });

    if (error) throw error;
    return data.stories;
  } catch (error) {
    console.error('Error finding similar stories:', error);
    throw error;
  }
}