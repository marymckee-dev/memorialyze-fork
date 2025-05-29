import { useState } from 'react';
import { generateMemoir, MemoirChapter } from '../lib/ai';
import { Chapter } from '../types/Memoir';

export function useMemoir() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateChapters = async (
    stories: string[],
    config: {
      chapterCount: number;
      tone: 'formal' | 'casual' | 'nostalgic';
      style?: string;
    }
  ): Promise<Chapter[]> => {
    try {
      setIsGenerating(true);
      setError(null);

      const { chapters } = await generateMemoir(stories, {
        ...config,
        style: config.style
      });

      // Convert AI chapters to app format
      return chapters.map((chapter: MemoirChapter, index: number) => ({
        id: crypto.randomUUID(),
        title: chapter.title,
        content: `${chapter.introduction}\n\n${chapter.content}`,
        storyIds: chapter.stories,
        order: index + 1,
        suggestedImages: chapter.suggestedImages
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate chapters');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateChapters,
    isGenerating,
    error
  };
}