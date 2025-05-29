import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    // Initialize embeddings model
    const model = new Supabase.ai.Session('gte-small');
    const embeddings = await model.run(text, { mean_pool: true, normalize: true });

    // Analyze content using embeddings and pattern matching
    const analysis = {
      suggestedTags: extractTags(text),
      emotions: detectEmotions(text),
      peopleMentioned: extractPeople(text),
      timePeriod: detectTimePeriod(text),
      suggestedQuestions: generateFollowUpQuestions(text)
    };

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});

function extractTags(text: string): string[] {
  // Simple keyword extraction
  const keywords = text.toLowerCase().match(/\b\w+\b/g) || [];
  return [...new Set(keywords)]
    .filter(word => word.length > 3)
    .slice(0, 5);
}

function detectEmotions(text: string): string[] {
  const emotionKeywords = {
    joy: ['happy', 'joyful', 'excited', 'delighted'],
    nostalgia: ['remember', 'memories', 'used to', 'back then'],
    love: ['love', 'caring', 'affection', 'cherish'],
    // Add more emotions and their keywords
  };

  return Object.entries(emotionKeywords)
    .filter(([_, keywords]) => 
      keywords.some(keyword => text.toLowerCase().includes(keyword))
    )
    .map(([emotion]) => emotion);
}

function extractPeople(text: string): string[] {
  // Basic named entity recognition
  const names = text.match(/[A-Z][a-z]+ (?:[A-Z][a-z]+)*/g) || [];
  return [...new Set(names)];
}

function detectTimePeriod(text: string): { start: number; end?: number } {
  // Extract years and decades
  const years = text.match(/\b(19|20)\d{2}\b/g) || [];
  if (years.length === 0) return { start: 2000 };

  const numericYears = years.map(Number);
  return {
    start: Math.min(...numericYears),
    end: Math.max(...numericYears)
  };
}

function generateFollowUpQuestions(text: string): string[] {
  // Generate contextual follow-up questions
  const questions = [
    'Can you describe the location in more detail?',
    'Who else was present during this event?',
    'What emotions did you feel at the time?',
    'Are there any specific details that stand out in your memory?',
    'How did this experience impact your life?'
  ];

  return questions;
}