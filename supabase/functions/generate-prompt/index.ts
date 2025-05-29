interface PromptContext {
  timePeriod?: string;
  people?: string[];
  themes?: string[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateContextualPrompt(context: PromptContext): string {
  const prompts = [
    'What was your first day of school like?',
    'Tell me about a family tradition that means a lot to you.',
    'What\'s your earliest childhood memory?',
    'Describe a moment that changed your life.',
    'What was your favorite family vacation?',
    'Tell me about your grandparents.',
    'What was your neighborhood like growing up?',
    'Describe a family celebration that stands out in your memory.',
    'What games did you play as a child?',
    'Tell me about your first job.',
  ];

  if (context?.timePeriod) {
    prompts.push(
      `What was life like in the ${context.timePeriod}?`,
      `What major events do you remember from the ${context.timePeriod}?`
    );
  }

  if (context?.people?.length) {
    prompts.push(
      `Tell me about your memories with ${context.people.join(' and ')}.`,
      `What's your favorite story involving ${context.people[0]}?`
    );
  }

  if (context?.themes?.length) {
    context.themes.forEach(theme => {
      prompts.push(`Share a memory about ${theme}.`);
    });
  }

  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    let context: PromptContext = {};
    
    // Only try to parse JSON if it's a POST request with a body
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      context = body as PromptContext;
    }

    const prompt = generateContextualPrompt(context);

    return new Response(
      JSON.stringify({ prompt }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating prompt:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate prompt',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});