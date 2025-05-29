import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface GenerateRequest {
  stories: string[];
  chapterCount: number;
  tone: 'formal' | 'casual' | 'nostalgic';
  style?: string;
}

interface Chapter {
  title: string;
  introduction: string;
  content: string;
  stories: string[];
  suggestedImages?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { stories, chapterCount, tone, style } = await req.json() as GenerateRequest;

    if (!stories?.length || !chapterCount || !tone) {
      throw new Error('Missing required parameters');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch story contents and associated files
    const { data: storyData, error: storyError } = await supabase
      .from('journal_entries')
      .select(`
        id,
        content,
        title,
        created_at,
        files!entry_files (
          id,
          url,
          type
        )
      `)
      .in('id', stories);

    if (storyError) throw storyError;

    // Initialize AI model
    const model = new Supabase.ai.Session('gte-small');

    // Generate chapter outline with style consideration
    const stylePrompt = style ? `Use a ${style} writing style that is ${tone} in tone.` :
                               `Use a ${tone} tone throughout the memoir.`;

    const outlinePrompt = `Create a ${chapterCount}-chapter memoir from these stories:

${storyData.map(s => `"${s.title}": ${s.content}`).join('\n\n')}

${stylePrompt}

Each chapter should:
1. Have a compelling title
2. Include a brief introduction
3. Weave stories together naturally
4. Maintain consistent voice
5. Include suggestions for photo placement

Format as JSON:
{
  "chapters": [
    {
      "title": "Chapter Title",
      "introduction": "Chapter intro text",
      "content": "Full chapter content with [PHOTO] markers for suggested image placements",
      "stories": ["story-id-1", "story-id-2"],
      "suggestedImages": ["url1", "url2"]
    }
  ]
}`;

    const outline = await model.run(outlinePrompt);
    const { chapters } = JSON.parse(outline);

    // Process each chapter to include actual file URLs
    const processedChapters = chapters.map((chapter: Chapter) => {
      const chapterStories = storyData.filter(s => chapter.stories.includes(s.id));
      const availableImages = chapterStories
        .flatMap(s => s.files)
        .filter(f => f?.type?.startsWith('image/'))
        .map(f => f.url);

      return {
        ...chapter,
        suggestedImages: availableImages
      };
    });

    return new Response(
      JSON.stringify({ chapters: processedChapters }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
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