import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    // Parse request body
    const requestData = await req.json().catch(() => {
      throw new Error('Invalid JSON payload');
    });

    const { stories, style = 'classic' } = requestData;

    // Validate required fields
    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing stories array' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get story contents
    const { data: storyContents, error: storyError } = await supabaseClient
      .from('journal_entries')
      .select('content, title, user_id, created_at')
      .in('id', stories);

    if (storyError) {
      console.error('Supabase query error:', storyError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch stories' }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!storyContents || storyContents.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No stories found with the provided IDs' }),
        { status: 404, headers: corsHeaders }
      );
    }

    try {
      // Generate chapter using AI
      const model = new Supabase.ai.Session('gte-small');
      
      const stylePrompt = style === 'classic' ? 'Write in a timeless, elegant style with rich descriptive language.' :
                         style === 'modern' ? 'Write in a clean, contemporary style with concise language.' :
                         'Write in a nostalgic, warm style with period-appropriate language.';

      const prompt = `Create a memoir chapter that weaves together these stories:

${storyContents.map(s => `"${s.title}" (${new Date(s.created_at).toLocaleDateString()}):
${s.content}`).join('\n\n')}

${stylePrompt}

The chapter should:
1. Have a compelling title that captures the theme
2. Flow naturally between stories
3. Include relevant details and quotes
4. Maintain consistent narrative voice
5. Create emotional resonance

Format:
TITLE: [Chapter Title]
CONTENT: [Chapter Content]`;

      const response = await model.run(prompt);
      
      // Parse response
      const [titleLine, ...contentLines] = response.split('\n');
      const title = titleLine.replace(/^TITLE:\s*/, '');
      const content = contentLines.join('\n').replace(/^CONTENT:\s*/, '');

      if (!title || !content) {
        throw new Error('Invalid AI response format');
      }

      // Return success response
      return new Response(
        JSON.stringify({
          title,
          content,
          suggestedImages: [] // Will be populated by the suggest-images function
        }),
        { headers: corsHeaders }
      );
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate chapter content' }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
});