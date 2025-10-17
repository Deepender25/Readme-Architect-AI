import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Save history request received');
    
    // Get the request body
    const body = await request.json();
    console.log('📋 Request body:', JSON.stringify(body, null, 2));
    
    // Get user authentication from cookies
    const cookieHeader = request.headers.get('Cookie') || '';
    console.log('🍪 Cookie header:', cookieHeader);
    
    let userData = null;
    if (cookieHeader.includes('github_user=')) {
      try {
        const cookieValue = cookieHeader.split('github_user=')[1].split(';')[0];
        userData = JSON.parse(Buffer.from(cookieValue, 'base64').toString());
        console.log('👤 User data extracted:', userData?.username);
      } catch (e) {
        console.error('❌ Failed to parse user cookie:', e);
        return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
      }
    }

    if (!userData) {
      console.log('❌ No user authentication found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Prepare data for GitHub database
    const historyData = {
      user_id: String(userData.github_id || ''),
      username: userData.username || '',
      repository_url: body.repository_url || '',
      repository_name: body.repository_name || '',
      project_name: body.project_name || null,
      readme_content: body.readme_content || '',
      generation_params: body.generation_params || {},
      session_id: body.session_id || null // Add session tracking
    };

    console.log('💾 Saving to GitHub database...');

    // Call the GitHub database save function
    const success = await saveToGitHubDatabase(historyData);

    if (success) {
      console.log('✅ History saved successfully');
      return NextResponse.json({ success: true, message: 'History saved successfully' });
    } else {
      console.log('❌ Failed to save history');
      return NextResponse.json({ error: 'Failed to save to history' }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Save history error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save to history' },
      { status: 500 }
    );
  }
}

async function saveToGitHubDatabase(data: any): Promise<boolean> {
  try {
    const GITHUB_DATA_REPO_OWNER = process.env.GITHUB_DATA_REPO_OWNER;
    const GITHUB_DATA_REPO_NAME = process.env.GITHUB_DATA_REPO_NAME;
    const GITHUB_DATA_TOKEN = process.env.GITHUB_DATA_TOKEN;

    if (!GITHUB_DATA_REPO_OWNER || !GITHUB_DATA_REPO_NAME || !GITHUB_DATA_TOKEN) {
      console.error('❌ Missing GitHub database configuration');
      return false;
    }

    const filePath = `users/${data.user_id}/history.json`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_DATA_REPO_OWNER}/${GITHUB_DATA_REPO_NAME}/contents/${filePath}`;

    console.log('🌐 GitHub API URL:', apiUrl);

    // Get existing file
    let existingData = [];
    let sha = null;

    try {
      const getResponse = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${GITHUB_DATA_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        const content = Buffer.from(fileData.content, 'base64').toString();
        existingData = JSON.parse(content);
        sha = fileData.sha;
        console.log(`📊 Found existing history with ${existingData.length} items`);
      } else if (getResponse.status === 404) {
        console.log('📝 Creating new history file');
      } else {
        console.error('❌ Failed to get existing file:', getResponse.status);
        return false;
      }
    } catch (e) {
      console.log('📝 Creating new history file (parse error)');
    }

    // Check for duplicates based on repository_url and readme_content
    // Also check for recent duplicates (within last 5 minutes) to prevent rapid saves
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const isDuplicate = existingData.some((entry: any) => {
      const isSameRepo = entry.repository_url === data.repository_url && entry.user_id === data.user_id;
      const isSameContent = entry.readme_content === data.readme_content;
      const isRecent = entry.created_at > fiveMinutesAgo;
      
      // Exact duplicate (same repo + same content)
      if (isSameRepo && isSameContent) {
        console.log('🔄 Exact duplicate detected (same repo + same content)');
        return true;
      }
      
      // Recent duplicate (same repo within 5 minutes)
      if (isSameRepo && isRecent) {
        console.log('🔄 Recent duplicate detected (same repo within 5 minutes)');
        return true;
      }
      
      return false;
    });

    if (isDuplicate) {
      console.log('🔄 Duplicate entry detected, skipping save');
      return true; // Return success to avoid errors, but don't save duplicate
    }

    // Create new history entry
    const newEntry = {
      id: `${data.user_id}_${Date.now()}`,
      user_id: data.user_id,
      username: data.username,
      repository_url: data.repository_url,
      repository_name: data.repository_name,
      project_name: data.project_name,
      readme_content: data.readme_content,
      generation_params: data.generation_params,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to beginning of array (most recent first)
    existingData.unshift(newEntry);

    // Keep only last 50 entries
    existingData = existingData.slice(0, 50);

    // Save back to GitHub
    const updateData = {
      message: `Add README history for ${data.username}/${data.repository_name}`,
      content: Buffer.from(JSON.stringify(existingData, null, 2)).toString('base64'),
      ...(sha && { sha })
    };

    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_DATA_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (updateResponse.ok) {
      console.log('✅ Successfully saved to GitHub database');
      return true;
    } else {
      const errorText = await updateResponse.text();
      console.error('❌ Failed to save to GitHub:', updateResponse.status, errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ GitHub database error:', error);
    return false;
  }
}