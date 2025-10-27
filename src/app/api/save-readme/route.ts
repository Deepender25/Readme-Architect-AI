import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get user from cookie
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse user from cookie
    let user;
    try {
      const cookies = cookieHeader.split(';');
      const githubUserCookie = cookies.find(cookie => 
        cookie.trim().startsWith('github_user=')
      );
      
      if (!githubUserCookie) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      
      const cookieValue = githubUserCookie.split('=')[1];
      user = JSON.parse(atob(cookieValue));
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }

    const { repositoryUrl, readmeContent } = await request.json();

    if (!repositoryUrl || !readmeContent) {
      return NextResponse.json({ error: 'Repository URL and README content are required' }, { status: 400 });
    }

    // Extract owner and repo from GitHub URL
    const urlMatch = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlMatch) {
      return NextResponse.json({ error: 'Invalid GitHub repository URL' }, { status: 400 });
    }

    const [, owner, repo] = urlMatch;
    const repoName = repo.replace(/\.git$/, ''); // Remove .git suffix if present

    // Check if user owns the repository
    if (owner !== user.username) {
      return NextResponse.json({ error: 'You can only save README files to your own repositories' }, { status: 403 });
    }

    // Get current README file (if exists) to get its SHA
    let currentFileSha = null;
    try {
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/contents/README.md`,
        {
          headers: {
            'Authorization': `token ${user.access_token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'ReadmeArchitect'
          }
        }
      );

      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        currentFileSha = fileData.sha;
      }
    } catch (error) {
      // File doesn't exist, which is fine
      console.log('README.md does not exist, will create new file');
    }

    // Create or update README.md
    const updateData = {
      message: 'Update README.md via ReadmeArchitect',
      content: btoa(readmeContent), // Base64 encode
      ...(currentFileSha && { sha: currentFileSha }) // Include SHA if updating existing file
    };

    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/README.md`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${user.access_token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ReadmeArchitect'
        },
        body: JSON.stringify(updateData)
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('GitHub API error:', errorData);
      
      if (updateResponse.status === 404) {
        return NextResponse.json({ error: 'Repository not found or you do not have write access' }, { status: 404 });
      } else if (updateResponse.status === 403) {
        return NextResponse.json({ error: 'Insufficient permissions to write to this repository' }, { status: 403 });
      } else {
        return NextResponse.json({ error: 'Failed to save README to GitHub' }, { status: 500 });
      }
    }

    const result = await updateResponse.json();
    
    return NextResponse.json({ 
      success: true, 
      message: currentFileSha ? 'README.md updated successfully' : 'README.md created successfully',
      commit_url: result.commit.html_url,
      file_url: result.content.html_url
    });

  } catch (error) {
    console.error('Error saving README:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}