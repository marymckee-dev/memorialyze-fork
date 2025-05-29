import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    // Extract key themes and subjects from the text
    const model = new Supabase.ai.Session('gte-small');
    const prompt = `Extract 3-5 key visual themes or subjects from this text that could be represented by photos. Format as comma-separated list.

Text: ${text}`;

    const themes = await model.run(prompt);
    const themeList = themes.split(',').map(t => t.trim());

    // For demonstration, return curated Pexels photos
    // In production, this would integrate with Pexels API
    const stockPhotos = {
      'family': 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg',
      'childhood': 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
      'nature': 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg',
      'home': 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'vintage': 'https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg',
      'celebration': 'https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg',
      'travel': 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg',
      'food': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
    };

    // Select relevant photos based on themes
    const suggestedImages = themeList
      .map(theme => stockPhotos[theme.toLowerCase()] || null)
      .filter(Boolean)
      .slice(0, 5);

    return new Response(
      JSON.stringify({ images: suggestedImages }),
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