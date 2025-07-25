// Simple app.js without navigation

// DOM Elements
const form = document.getElementById('repo-form');
const repoUrlInput = document.getElementById('repo-url');
const projectNameInput = document.getElementById('project-name');
const generateBtn = document.getElementById('generate-btn');
const backBtn = document.getElementById('back-btn');

const includeDemoCheckbox = document.getElementById('include-demo');
const demoCountsContainer = document.getElementById('demo-counts-container');
const numScreenshotsInput = document.getElementById('num-screenshots');
const numVideosInput = document.getElementById('num-videos');

const inputView = document.getElementById('input-view');
const outputView = document.getElementById('output-view');
const loaderView = document.getElementById('loader-view');
const loaderText = document.getElementById('loader-text');
const repositoriesView = document.getElementById('repositories-view');
const repositoriesGrid = document.getElementById('repositories-grid');

const codeView = document.getElementById('code-view');
const previewContent = document.getElementById('preview-content');
const copyBtn = document.getElementById('copy-btn');

// User Elements
const userLogin = document.getElementById('user-login');
const userProfile = document.getElementById('user-profile');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userHandle = document.getElementById('user-handle');

// Current user data
let currentUser = null;
let currentView = 'input';
let isAnimating = false;

// Loading messages
const loadingMessages = [
    "Connecting to GitHub...",
    "Analyzing repository...",
    "Generating documentation...",
    "Finalizing README..."
];
let messageIndex = 0;
let dotCount = 1;
let animationTimeout;

function updateLoaderText() {
    const baseMessage = loadingMessages[messageIndex];
    loaderText.textContent = baseMessage + '.'.repeat(dotCount);
    dotCount++;
    if (dotCount > 3) {
        dotCount = 1;
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    }
}

// Form submission handler
function setupFormSubmission() {
    if (!form) {
        console.error('Form element not found!');
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted!');
        
        const repoUrl = repoUrlInput?.value;
        if (!repoUrl || isAnimating) {
            console.log('No repo URL or animation in progress');
            return;
        }

        console.log('Starting README generation for:', repoUrl);
        setView('loader');
        animationTimeout = setInterval(updateLoaderText, 500);

        const params = new URLSearchParams({
            repo_url: repoUrl,
            project_name: projectNameInput?.value?.trim() || '',
            include_demo: includeDemoCheckbox?.checked || false,
            num_screenshots: parseInt(numScreenshotsInput?.value, 10) || 0,
            num_videos: parseInt(numVideosInput?.value, 10) || 0,
        });

        console.log('Request parameters:', params.toString());

        try {
            const response = await fetch(`/api/generate?${params.toString()}`);
            console.log('API response status:', response.status);
            
            const data = await response.json();
            console.log('API response data:', data);

            if (animationTimeout) {
                clearInterval(animationTimeout);
            }

            if (data.readme) {
                console.log('README generated successfully');
                codeView.textContent = data.readme;
                
                // Render markdown preview properly
                renderMarkdownPreview(data.readme);
                
                setView('output');
            } else if (data.error) {
                console.error('API returned error:', data.error);
                previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Generation Failed</h3><p>${data.error}</p></div>`;
                codeView.textContent = `/*\n  Error: ${data.error}\n*/`;
                hljs.highlightAll();
                setView('output');
            } else {
                console.error('Unexpected API response format');
                previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Unexpected Response</h3><p>The server returned an unexpected response format.</p></div>`;
                codeView.textContent = `/*\n  Error: Unexpected response format\n*/`;
                hljs.highlightAll();
                setView('output');
            }
        } catch (error) {
            if (animationTimeout) {
                clearInterval(animationTimeout);
            }
            console.error("Request failed:", error);
            previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Connection Error</h3><p>Could not connect to the server. Please check your internet connection and try again.</p></div>`;
            codeView.textContent = `/*\\n  Error: Connection failed - ${error.message}\\n*/`;
            hljs.highlightAll();
            setView('output');
        }
    });
    
    console.log('Form submission handler attached successfully');
}

// Function to render markdown preview
function renderMarkdownPreview(markdownContent) {
    console.log('🔄 Rendering markdown preview...');
    console.log('📝 Content to render:', markdownContent.substring(0, 100) + '...');
    
    if (!previewContent) {
        console.error('❌ Preview content element not found');
        return;
    }
    
    // Clear existing content
    previewContent.innerHTML = '';
    
    try {
        // Always use our custom parser for reliability
        console.log('🔧 Converting markdown to HTML...');
        
        // Process the markdown content line by line for better control
        const lines = markdownContent.split('\n');
        let htmlLines = [];
        let inCodeBlock = false;
        let codeBlockContent = [];
        let codeLanguage = '';
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Handle code blocks
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    // Start of code block
                    inCodeBlock = true;
                    codeLanguage = line.substring(3).trim();
                    codeBlockContent = [];
                } else {
                    // End of code block
                    inCodeBlock = false;
                    const codeContent = codeBlockContent.join('\n');
                    htmlLines.push(`<pre><code class="language-${codeLanguage}">${codeContent}</code></pre>`);
                    codeBlockContent = [];
                }
                continue;
            }
            
            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }
            
            // Process regular lines
            if (line.startsWith('# ')) {
                htmlLines.push(`<h1>${line.substring(2)}</h1>`);
            } else if (line.startsWith('## ')) {
                htmlLines.push(`<h2>${line.substring(3)}</h2>`);
            } else if (line.startsWith('### ')) {
                htmlLines.push(`<h3>${line.substring(4)}</h3>`);
            } else if (line.startsWith('#### ')) {
                htmlLines.push(`<h4>${line.substring(5)}</h4>`);
            } else if (line.startsWith('##### ')) {
                htmlLines.push(`<h5>${line.substring(6)}</h5>`);
            } else if (line.startsWith('###### ')) {
                htmlLines.push(`<h6>${line.substring(7)}</h6>`);
            } else if (line.trim() === '') {
                htmlLines.push('<br>');
            } else {
                // Process inline formatting
                let processedLine = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/`([^`]+)`/g, '<code>$1</code>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
                
                htmlLines.push(`<p>${processedLine}</p>`);
            }
        }
        
        const finalHtml = htmlLines.join('\n');
        console.log('📄 Generated HTML:', finalHtml.substring(0, 200) + '...');
        
        // Set the HTML content
        previewContent.innerHTML = finalHtml;
        
        // Apply syntax highlighting
        setTimeout(() => {
            if (typeof hljs !== 'undefined') {
                hljs.highlightAll();
            }
        }, 100);
        
        console.log('✅ Markdown preview rendered successfully');
        
    } catch (error) {
        console.error('❌ Error rendering markdown:', error);
        previewContent.innerHTML = `<div style="color: #ff6b6b; padding: 20px;">
            <h3>Preview Error</h3>
            <p>Failed to render markdown preview: ${error.message}</p>
            <pre style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; margin-top: 10px;">${markdownContent}</pre>
        </div>`;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (isAnimating) return;
            setView('input');
            if (repoUrlInput) repoUrlInput.value = '';
            if (projectNameInput) projectNameInput.value = '';
            if (includeDemoCheckbox) includeDemoCheckbox.checked = false;
            if (demoCountsContainer) demoCountsContainer.style.display = 'none';
            if (numScreenshotsInput) numScreenshotsInput.value = "2";
            if (numVideosInput) numVideosInput.value = "1";
        });
        console.log('✓ Back button event listener attached');
    }

    // Demo checkbox
    if (includeDemoCheckbox && demoCountsContainer) {
        includeDemoCheckbox.addEventListener('change', () => {
            const isChecked = includeDemoCheckbox.checked;
            if (isChecked) {
                demoCountsContainer.style.display = 'flex';
            } else {
                demoCountsContainer.style.display = 'none';
            }
        });
        console.log('✓ Demo checkbox event listener attached');
    }
    
    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (codeView && codeView.textContent) {
                navigator.clipboard.writeText(codeView.textContent).then(() => {
                    copyBtn.innerHTML = '✓ Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = 'Copy';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
        console.log('✓ Copy button event listener attached');
    }
    
    console.log('All event listeners setup complete');
}

// Authentication functions
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function checkAuthStatus() {
    console.log('Checking authentication status...');
    console.log('All cookies:', document.cookie);

    const githubUserCookie = getCookie('github_user');
    console.log('GitHub user cookie:', githubUserCookie ? 'Found' : 'Not found');

    if (githubUserCookie) {
        try {
            const userData = JSON.parse(atob(githubUserCookie));
            console.log('User authenticated:', userData);

            if (userData.username && userData.access_token) {
                currentUser = userData;
                showUserProfile(userData);
                console.log('User profile should now be visible');
                return true;
            } else {
                console.log('Invalid user data - missing username or access_token');
            }
        } catch (e) {
            console.error('Failed to parse user data:', e);
            deleteCookie('github_user');
        }
    } else {
        console.log('No github_user cookie found');
    }

    console.log('Showing login button');
    showLoginButton();
    return false;
}

function showUserProfile(userData) {
    console.log('showUserProfile called with:', userData);
    console.log('userLogin element:', userLogin);
    console.log('userProfile element:', userProfile);

    currentUser = userData;

    // Hide login button and show profile dropdown
    if (userLogin) {
        userLogin.style.display = 'none';
        console.log('✅ Hidden login button');
    } else {
        console.error('❌ userLogin element not found');
    }

    if (userProfile) {
        userProfile.style.display = 'block';
        console.log('✅ Shown user profile dropdown');
    } else {
        console.error('❌ userProfile element not found');
    }

    // Set profile trigger data
    if (userAvatar && userData.avatar_url) {
        userAvatar.src = userData.avatar_url;
        console.log('Set user avatar');
    }
    if (userName && userData.name) {
        userName.textContent = userData.name || userData.username;
        console.log('Set name:', userData.name || userData.username);
    }
    if (userHandle && userData.username) {
        userHandle.textContent = `@${userData.username}`;
        console.log('Set user handle');
    }

    // Set dropdown header data
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const dropdownName = document.getElementById('dropdown-name');
    const dropdownHandle = document.getElementById('dropdown-handle');
    const dropdownEmail = document.getElementById('dropdown-email');

    if (dropdownAvatar && userData.avatar_url) {
        dropdownAvatar.src = userData.avatar_url;
    }
    if (dropdownName) {
        dropdownName.textContent = userData.name || userData.username;
    }
    if (dropdownHandle && userData.username) {
        dropdownHandle.textContent = `@${userData.username}`;
    }
    if (dropdownEmail && userData.email) {
        dropdownEmail.textContent = userData.email;
    } else if (dropdownEmail) {
        dropdownEmail.style.display = 'none';
    }

}

function showLoginButton() {
    currentUser = null;
    if (userLogin) userLogin.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';
}

function handleLogout() {
    toggleUserDropdown(); // Close dropdown
    deleteCookie('github_user');
    showLoginButton();
    if (currentView === 'repositories') {
        setView('input');
    }
}

function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session') === 'success') {
        console.log('OAuth callback successful');
        window.history.replaceState({}, document.title, '/');
        setTimeout(() => {
            checkAuthStatus();
        }, 100);
    }
}

// Show repositories
function showRepositories() {
    toggleUserDropdown(); // Close dropdown
    if (!currentUser) {
        alert('Please log in first');
        return;
    }
    setView('repositories');
    loadRepositories();
}

async function loadRepositories() {
    repositoriesGrid.innerHTML = '<div class="loading-state">Loading repositories...</div>';

    try {
        const githubUserCookie = getCookie('github_user');
        const response = await fetch('/api/repositories', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-User': githubUserCookie || ''
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load repositories');
        }

        const data = await response.json();
        displayRepositories(data.repositories || []);
    } catch (error) {
        console.error('Error loading repositories:', error);
        repositoriesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h3>Failed to Load Repositories</h3>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

function displayRepositories(repositories) {
    if (repositories.length === 0) {
        repositoriesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>No Repositories Found</h3>
                <p>Create a repository on GitHub to get started!</p>
            </div>
        `;
        return;
    }

    const repoCards = repositories.map(repo => `
        <div class="repo-card" onclick="selectRepository('${repo.html_url}')">
            <div class="repo-header">
                <h3>${repo.name}</h3>
                ${repo.private ? '<span class="private-badge">Private</span>' : ''}
            </div>
            <p>${repo.description || 'No description available'}</p>
            <div class="repo-meta">
                <span>⭐ ${repo.stargazers_count}</span>
                ${repo.language ? `<span class="language-tag">${repo.language}</span>` : ''}
                <span class="updated-date">Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');

    repositoriesGrid.innerHTML = repoCards;
}

function selectRepository(repoUrl) {
    repoUrlInput.value = repoUrl;
    setView('input');
    repoUrlInput.focus();
}

// View switching
function setView(viewName) {
    if (viewName === currentView || isAnimating) return;
    isAnimating = true;

    const currentViewEl = document.getElementById(`${currentView}-view`);
    const nextViewEl = document.getElementById(`${viewName}-view`);

    if (!nextViewEl) {
        console.error(`View element not found: ${viewName}-view`);
        isAnimating = false;
        return;
    }

    // Simple view switching without animations
    if (currentViewEl) {
        currentViewEl.style.display = 'none';
    }

    nextViewEl.style.display = 'flex';
    currentView = viewName;

    // Show/hide back button
    if (viewName === 'input') {
        backBtn.classList.remove('visible');
    } else {
        backBtn.classList.add('visible');
    }

    isAnimating = false;
}

function copyCode() {
    navigator.clipboard.writeText(codeView.textContent).then(() => {
        alert('Code copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy text.');
    });
}

// Initialize
function initialize() {
    console.log('Initializing application...');
    
    // Check if all required elements exist
    const requiredElements = {
        'form': form,
        'repoUrlInput': repoUrlInput,
        'projectNameInput': projectNameInput,
        'generateBtn': generateBtn,
        'backBtn': backBtn,
        'includeDemoCheckbox': includeDemoCheckbox,
        'codeView': codeView,
        'previewContent': previewContent
    };
    
    for (const [name, element] of Object.entries(requiredElements)) {
        if (!element) {
            console.error(`Required element '${name}' not found!`);
        } else {
            console.log(`✓ Element '${name}' found`);
        }
    }
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup other event listeners
    setupEventListeners();
    
    // Handle OAuth callback and check auth status
    handleOAuthCallback();
    checkAuthStatus();

    if (includeDemoCheckbox) {
        includeDemoCheckbox.checked = false;
    }
    if (demoCountsContainer) {
        demoCountsContainer.style.display = 'none';
    }

    if (inputView) {
        inputView.style.display = 'flex';
    }
    if (outputView) {
        outputView.style.display = 'none';
    }
    
    console.log('Application initialized successfully');
    loaderView.style.display = 'none';
    repositoriesView.style.display = 'none';
}

// Dropdown functionality
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    const trigger = document.querySelector('.user-profile-trigger');

    if (dropdown.style.display === 'none' || !dropdown.style.display) {
        dropdown.style.display = 'block';
        trigger.classList.add('active');
    } else {
        dropdown.style.display = 'none';
        trigger.classList.remove('active');
    }
}

function showHistory() {
    alert('README History feature coming soon!');
    toggleUserDropdown();
}

function openGitHubProfile() {
    toggleUserDropdown();
    if (currentUser && currentUser.html_url) {
        window.open(currentUser.html_url, '_blank');
    } else if (currentUser && currentUser.username) {
        window.open(`https://github.com/${currentUser.username}`, '_blank');
    }
}

function showSettings() {
    toggleUserDropdown();
    alert('Settings feature coming soon!');
}

function showSettings() {
    alert('Settings feature coming soon!');
    toggleUserDropdown();
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('user-dropdown');
    const trigger = document.querySelector('.user-profile-trigger');

    if (dropdown && trigger && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
        trigger.classList.remove('active');
    }
});

// Test function for markdown preview
window.testPreview = function() {
    const testMarkdown = `# 🚀 Test README

## 📋 Overview
This is a **test** README with *italic* text and proper formatting.

### ✨ Features
- **Feature 1**: Amazing functionality
- **Feature 2**: Great performance  
- **Feature 3**: Easy to use

### 💻 Code Example
\`\`\`javascript
console.log("Hello World!");
const greeting = "Welcome to the preview!";
\`\`\`

### 🔗 Links
[GitHub](https://github.com) | [Documentation](https://docs.example.com)

### 📝 Notes
This preview should show \`inline code\` and **bold text** properly.
`;
    
    console.log('🧪 Testing preview with sample README...');
    console.log('Preview element:', previewContent);
    
    if (!previewContent) {
        console.error('❌ Preview element not found!');
        return;
    }
    
    renderMarkdownPreview(testMarkdown);
    
    // Switch to output view to see the result
    setView('output');
    
    console.log('✅ Test completed - check the preview panel');
};

// Debug function to check elements
window.debugPreview = function() {
    console.log('🔍 Debug info:');
    console.log('- previewContent element:', previewContent);
    console.log('- previewContent exists:', !!previewContent);
    console.log('- previewContent innerHTML:', previewContent ? previewContent.innerHTML.substring(0, 100) : 'N/A');
    console.log('- marked library:', typeof marked !== 'undefined' ? 'Available' : 'Not available');
};

// Global functions for HTML buttons
window.showRepositories = showRepositories;
window.handleLogout = handleLogout;
window.toggleUserDropdown = toggleUserDropdown;
window.showHistory = showHistory;
window.openGitHubProfile = openGitHubProfile;
window.showSettings = showSettings;

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initialize, 100);
});

// Dropdown toggle functionality
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    const trigger = document.querySelector('.user-profile-trigger');

    if (dropdown.style.display === 'none' || !dropdown.style.display) {
        dropdown.style.display = 'block';
        trigger.classList.add('active');
    } else {
        dropdown.style.display = 'none';
        trigger.classList.remove('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userSection = document.getElementById('user-section');
    const dropdown = document.getElementById('user-dropdown');
    const trigger = document.querySelector('.user-profile-trigger');

    if (userSection && !userSection.contains(e.target)) {
        if (dropdown) dropdown.style.display = 'none';
        if (trigger) trigger.classList.remove('active');
    }
});

// Additional dropdown functions
function showHistory() {
    toggleUserDropdown();
    alert('README History feature coming soon!');
}

// Duplicate functions removed