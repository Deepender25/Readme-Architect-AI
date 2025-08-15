import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('📚 History fetch request received');
    
    // Get user authentication from cookies
    const cookieHeader = request.headers.get('Cookie') || '';
    
    let userData = null;
    if (cookieHeader.includes('github_user=')) {
      try {
        const cookieValue = cookieHeader.split('github_user=')[1].split(';')[0];
        userData = JSON.parse(Buffer.from(cookieValue, 'base64').toString());
        console.log('👤 User authenticated:', userData?.username);
      } catch (e) {
        console.error('❌ Failed to parse user cookie:', e);
        return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
      }
    }

    if (!userData) {
      console.log('❌ No user authentication found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Fetch history from GitHub database
    const history = await fetchFromGitHubDatabase(userData.github_id);
    
    console.log(`📊 Retrieved ${history.length} history items`);
    return NextResponse.json({ history });

  } catch (error) {
    console.error('❌ History fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ History delete request received');
    
    // Get user authentication from cookies
    const cookieHeader = request.headers.get('Cookie') || '';
    
    let userData = null;
    if (cookieHeader.includes('github_user=')) {
      try {
        const cookieValue = cookieHeader.split('github_user=')[1].split(';')[0];
        userData = JSON.parse(Buffer.from(cookieValue, 'base64').toString());
        console.log('👤 User authenticated:', userData?.username);
      } catch (e) {
        console.error('❌ Failed to parse user cookie:', e);
        return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
      }
    }

    if (!userData) {
      console.log('❌ No user authentication found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Clear history in GitHub database
    const success = await clearGitHubDatabase(userData.github_id);
    
    if (success) {
      console.log('✅ History cleared successfully');
      return NextResponse.json({ message: 'History cleared successfully' });
    } else {
      console.log('❌ Failed to clear history');
      return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ History deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete history' },
      { status: 500 }
    );
  }
}

async function fetchFromGitHubDatabase(userId: string): Promise<any[]> {
  try {
    const GITHUB_DATA_REPO_OWNER = process.env.GITHUB_DATA_REPO_OWNER;
    const GITHUB_DATA_REPO_NAME = process.env.GITHUB_DATA_REPO_NAME;
    const GITHUB_DATA_TOKEN = process.env.GITHUB_DATA_TOKEN;

    if (!GITHUB_DATA_REPO_OWNER || !GITHUB_DATA_REPO_NAME || !GITHUB_DATA_TOKEN) {
      console.error('❌ Missing GitHub database configuration');
      return [];
    }

    const filePath = `users/${userId}/history.json`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_DATA_REPO_OWNER}/${GITHUB_DATA_REPO_NAME}/contents/${filePath}`;

    console.log('🌐 Fetching from GitHub API:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${GITHUB_DATA_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const fileData = await response.json();
      const content = Buffer.from(fileData.content, 'base64').toString();
      const history = JSON.parse(content);
      console.log(`✅ Retrieved ${history.length} history items from GitHub`);
      return history;
    } else if (response.status === 404) {
      console.log('📝 No history file found, returning empty array');
      return [];
    } else {
      console.error('❌ Failed to fetch from GitHub:', response.status);
      return [];
    }

  } catch (error) {
    console.error('❌ GitHub database fetch error:', error);
    return [];
  }
}

async function clearGitHubDatabase(userId: string): Promise<boolean> {
  try {
    const GITHUB_DATA_REPO_OWNER = process.env.GITHUB_DATA_REPO_OWNER;
    const GITHUB_DATA_REPO_NAME = process.env.GITHUB_DATA_REPO_NAME;
    const GITHUB_DATA_TOKEN = process.env.GITHUB_DATA_TOKEN;

    if (!GITHUB_DATA_REPO_OWNER || !GITHUB_DATA_REPO_NAME || !GITHUB_DATA_TOKEN) {
      console.error('❌ Missing GitHub database configuration');
      return false;
    }

    const filePath = `users/${userId}/history.json`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_DATA_REPO_OWNER}/${GITHUB_DATA_REPO_NAME}/contents/${filePath}`;

    // Get existing file to get SHA
    const getResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${GITHUB_DATA_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!getResponse.ok) {
      console.log('📝 No history file to clear');
      return true; // Consider it successful if there's nothing to clear
    }

    const fileData = await getResponse.json();
    
    // Update with empty array
    const updateData = {
      message: `Clear history for user ${userId}`,
      content: Buffer.from(JSON.stringify([], null, 2)).toString('base64'),
      sha: fileData.sha
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
      console.log('✅ Successfully cleared GitHub database');
      return true;
    } else {
      const errorText = await updateResponse.text();
      console.error('❌ Failed to clear GitHub database:', updateResponse.status, errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ GitHub database clear error:', error);
    return false;
  }
}