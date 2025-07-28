// Vercel serverless function for README generation
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { repo_url, project_name, include_demo, num_screenshots, num_videos } = req.query;
        
        if (!repo_url) {
            return res.status(400).json({ error: 'Repository URL is required' });
        }

        if (!repo_url.includes('github.com')) {
            return res.status(400).json({ error: 'Only GitHub repositories are supported' });
        }

        console.log(`Processing repository: ${repo_url}`);

        // Call the Python handler
        const pythonScript = path.join(__dirname, 'generate.py');
        const python = spawn('python', [pythonScript], {
            env: {
                ...process.env,
                REPO_URL: repo_url,
                PROJECT_NAME: project_name || '',
                INCLUDE_DEMO: include_demo || 'false',
                NUM_SCREENSHOTS: num_screenshots || '0',
                NUM_VIDEOS: num_videos || '0'
            }
        });

        let output = '';
        let error = '';

        python.stdout.on('data', (data) => {
            output += data.toString();
        });

        python.stderr.on('data', (data) => {
            error += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script failed with code ${code}: ${error}`);
                return res.status(500).json({ error: 'README generation failed' });
            }

            try {
                const result = JSON.parse(output);
                res.status(200).json(result);
            } catch (parseError) {
                console.error('Failed to parse Python output:', parseError);
                res.status(500).json({ error: 'Invalid response from generator' });
            }
        });

    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}