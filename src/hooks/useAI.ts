import { useState } from 'react';
import { analyzeContent, generateStoryPrompt, getSimilarStories, AIAnalysis } from '../lib/ai';

export function useAI() {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (text: string): Promise<AIAnalysis | null> => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const analysis = await analyzeContent(text);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const getPrompt = async (context?: {
    timePeriod?: string;
    people?: string[];
    themes?: string[];
  }): Promise<string | null> => {
    setError(null);
    
    try {
      const prompt = await generateStoryPrompt(context);
      return prompt;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const findSimilarStories = async (storyId: string): Promise<string[] | null> => {
    setError(null);
    
    try {
      const stories = await getSimilarStories(storyId);
      return stories;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  return {
    analyze,
    getPrompt,
    findSimilarStories,
    analyzing,
    error
  };
}