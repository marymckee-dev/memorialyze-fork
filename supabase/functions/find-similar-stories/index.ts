import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { storyId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the story content
    const { data: story, error: storyError } = await supabaseClient
      .from('journal_entries')
      .select('content')
      .eq('id', storyId)
      .single();

    if (storyError) throw storyError;

    // Generate embeddings for the story
    const model = new Supabase.ai.Session('gte-small');
    const embeddings = await model.run(story.content, { mean_pool: true, normalize: true });

    // Find similar stories using vector similarity
    const { data: similarStories, error: similarError } = await supabaseClient.rpc(
      'match_stories',
      {
        query_embedding: embeddings,
        match_threshold: 0.7,
        match_count: 5
      }
    );

    if (similarError) throw similarError;

    return new Response(
      JSON.stringify({ similarStories }),
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