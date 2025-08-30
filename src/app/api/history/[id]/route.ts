import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decodedId = decodeURIComponent(params.id);
    console.log('📖 Individual history item fetch request received for ID:', params.id, 'Decoded:', decodedId);
    
    // Get user authentication from cookies
    const cookieHeader = request.headers.get('Cookie') || '';
    
    let userData = null;
    if (cookieHeader.includes('github_user=')) {
      try {
        const cookieValue = cookieHeader.split('github_user=')[1].split(';')[0];
        userData = JSON.parse(Buffer.from(cookieValue, 'base64').toString());
        console.log('👤 User authenticated:', userData?.username, 'User ID:', userData?.github_id);
      } catch (e) {
        console.error('❌ Failed to parse user cookie:', e);
        return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
      }
    }

    if (!userData) {
      console.log('❌ No user authentication found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Fetch specific history item from GitHub database
    const historyItem = await fetchHistoryItemFromGitHubDatabase(userData.github_id, decodedId);
    
    if (!historyItem) {
      console.log('❌ History item not found for ID:', decodedId, 'User ID:', userData.github_id);
      return NextResponse.json({ error: 'History item not found' }, { status: 404 });
    }

    console.log('✅ Retrieved history item:', historyItem.repository_name);
    return NextResponse.json({ history_item: historyItem });

  } catch (error) {
    console.error('❌ History item fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch history item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decodedId = decodeURIComponent(params.id);
    console.log('🗑️ Individual history item delete request received for ID:', params.id, 'Decoded:', decodedId);
    
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

    // Delete specific history item from GitHub database
    const success = await deleteHistoryItemFromGitHubDatabase(userData.github_id, decodedId);
    
    if (success) {
      console.log('✅ History item deleted successfully');
      return NextResponse.json({ message: 'History item deleted successfully' });
    } else {
      console.log('❌ Failed to delete history item or item not found');
      return NextResponse.json({ error: 'Failed to delete history item' }, { status: 404 });
    }

  } catch (error) {
    console.error('❌ History item deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete history item' },
      { status: 500 }
    );
  }
}

async function fetchHistoryItemFromGitHubDatabase(userId: string, itemId: string): Promise<any | null> {
  try {
    const GITHUB_DATA_REPO_OWNER = process.env.GITHUB_DATA_REPO_OWNER;
    const GITHUB_DATA_REPO_NAME = process.env.GITHUB_DATA_REPO_NAME;
    const GITHUB_DATA_TOKEN = process.env.GITHUB_DATA_TOKEN;

    if (!GITHUB_DATA_REPO_OWNER || !GITHUB_DATA_REPO_NAME || !GITHUB_DATA_TOKEN) {
      console.error('❌ Missing GitHub database configuration');
      return null;
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
      
      console.log('📊 Total history items found:', history.length);
      console.log('🔍 Looking for item ID:', itemId);
      console.log('📋 Available IDs:', history.map((item: any) => item.id).slice(0, 5)); // Show first 5 IDs
      
      // Find the specific item by ID
      const historyItem = history.find((item: any) => item.id === itemId);
      
      if (historyItem) {
        console.log('✅ Found history item:', historyItem.repository_name);
        return historyItem;
      } else {
        console.log('❌ History item not found in user data');
        console.log('🔍 Searched for:', itemId);
        console.log('📋 Available items:', history.map((item: any) => ({ id: item.id, name: item.repository_name })));
        return null;
      }
    } else if (response.status === 404) {
      console.log('📝 No history file found');
      return null;
    } else {
      console.error('❌ Failed to fetch from GitHub:', response.status);
      return null;
    }

  } catch (error) {
    console.error('❌ GitHub database fetch error:', error);
    return null;
  }
}

async function deleteHistoryItemFromGitHubDatabase(userId: string, itemId: string): Promise<boolean> {
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

    // Get existing file
    const getResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${GITHUB_DATA_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!getResponse.ok) {
      console.log('📝 No history file found');
      return false;
    }

    const fileData = await getResponse.json();
    const content = Buffer.from(fileData.content, 'base64').toString();
    let history = JSON.parse(content);
    
    // Find and remove the specific item
    const initialLength = history.length;
    history = history.filter((item: any) => item.id !== itemId);
    
    if (history.length === initialLength) {
      console.log('❌ History item not found for deletion');
      return false;
    }

    // Update the file with the item removed
    const updateData = {
      message: `Delete history item ${itemId} for user ${userId}`,
      content: Buffer.from(JSON.stringify(history, null, 2)).toString('base64'),
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
      console.log('✅ Successfully deleted history item from GitHub database');
      return true;
    } else {
      const errorText = await updateResponse.text();
      console.error('❌ Failed to delete from GitHub database:', updateResponse.status, errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ GitHub database delete error:', error);
    return false;
  }
}