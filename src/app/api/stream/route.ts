import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const repoUrl = searchParams.get('repo_url');
  const projectName = searchParams.get('project_name') || '';
  const includeDemo = searchParams.get('include_demo') === 'true';
  const numScreenshots = parseInt(searchParams.get('num_screenshots') || '0');
  const numVideos = parseInt(searchParams.get('num_videos') || '0');

  if (!repoUrl) {
    return new Response('Repository URL is required', { status: 400 });
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const generateReadme = async () => {
        try {
          // Step 1: Cloning
          sendEvent({ status: 'Cloning repository...' });
          
          // Step 2: Analyzing
          sendEvent({ status: 'Analyzing codebase structure...' });
          
          // Step 3: Building prompt
          sendEvent({ status: 'Building AI prompt...' });
          
          // Step 4: Generating
          sendEvent({ status: 'Generating README with Gemini AI...' });

          // Step 5: Call the Python API directly for actual generation
          try {
            // Construct the full URL for the Python API
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
            const host = process.env.VERCEL_URL || request.headers.get('host') || 'localhost:3000';
            const pythonApiUrl = `${protocol}://${host}/api/python/generate?${searchParams.toString()}`;
            
            console.log('🔗 Calling Python API:', pythonApiUrl);
            
            const response = await fetch(pythonApiUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'AutoDoc-Stream/1.0',
              },
              timeout: 60000, // 60 second timeout
            });

            console.log('📡 Python API Response Status:', response.status);

            if (response.ok) {
              const data = await response.json();
              console.log('✅ Python API Success, README length:', data.readme?.length || 0);
              
              if (data.readme) {
                sendEvent({ readme: data.readme });
              } else {
                throw new Error('No README content received from Python API');
              }
            } else {
              const errorText = await response.text();
              console.error('❌ Python API Error:', response.status, errorText);
              throw new Error(`Python API failed: ${response.status} - ${errorText}`);
            }
          } catch (apiError) {
            console.error('🚨 API Call Failed:', apiError);
            sendEvent({ error: `Generation failed: ${apiError instanceof Error ? apiError.message : 'Unknown error'}` });
          }

          controller.close();
        } catch (error) {
          console.error('💥 Stream Error:', error);
          sendEvent({ error: error instanceof Error ? error.message : 'Generation failed' });
          controller.close();
        }
      };

      generateReadme();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}