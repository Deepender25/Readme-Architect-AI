import { NextRequest, NextResponse } from 'next/server';
import SimpleAuth from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await SimpleAuth.getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get GitHub access token
    const accessToken = await SimpleAuth.getGitHubAccessToken(request);
    if (!accessToken) {
      return NextResponse.json({ error: 'GitHub access token not found' }, { status: 401 });
    }

    console.log('Fetching repositories for user:', user.username);

    // Fetch repositories from GitHub API
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch repositories from GitHub' },
        { status: response.status }
      );
    }

    const repositories = await response.json();
    
    // Transform the data to match expected format
    const transformedRepos = repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      private: repo.private,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      updated_at: repo.updated_at,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
    }));

    console.log(`Successfully fetched ${transformedRepos.length} repositories`);

    return NextResponse.json({ repositories: transformedRepos });
  } catch (error) {
    console.error('Repositories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}