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

// Enhanced loading messages
const loadingMessages = [
    "Connecting to GitHub...",
    "Cloning repository blueprints...",
    "Analyzing file structure...",
    "Parsing commit history...",
    "Inspecting code dependencies...",
    "Assembling documentation...",
    "Optimizing README content...",
    "Finalizing markdown structure...",
    "Preparing for display..."
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
            // Try streaming first, fallback to regular API
            const useStreaming = true; // You can make this configurable
            
            if (useStreaming && typeof EventSource !== 'undefined') {
                console.log('🚀 Using streaming API for real-time updates');
                
                const eventSource = new EventSource(`/api/stream?${params.toString()}`);
                
                eventSource.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    
                    if (data.status) {
                        console.log('📡 Status update:', data.status);
                        loaderText.textContent = data.status;
                    } else if (data.readme) {
                        console.log('✅ README received via stream');
                        if (animationTimeout) {
                            clearInterval(animationTimeout);
                        }
                        
                        codeView.textContent = data.readme;
                        
                        // Simple and clean preview rendering like temp app.js
                        previewContent.innerHTML = marked.parse(data.readme);
                        hljs.highlightAll();
                        
                        setView('output');
                        if (typeof animateOutputIn === 'function') {
                            animateOutputIn(); // Animate output when content is ready
                        }
                        eventSource.close();
                    } else if (data.error) {
                        console.error('❌ Stream error:', data.error);
                        if (animationTimeout) {
                            clearInterval(animationTimeout);
                        }
                        
                        previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Generation Failed</h3><p>${data.error}</p></div>`;
                        codeView.textContent = `/*\n  Error: ${data.error}\n*/`;
                        hljs.highlightAll();
                        setView('output');
                        eventSource.close();
                    }
                };
                
                eventSource.onerror = function(err) {
                    console.error('❌ EventSource failed, falling back to regular API:', err);
                    eventSource.close();
                    
                    // Fallback to regular API
                    handleRegularAPI();
                };
                
            } else {
                console.log('📡 Using regular API (streaming not available)');
                handleRegularAPI();
            }
            
            async function handleRegularAPI() {
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
                    
                    // Simple and clean preview rendering like temp app.js
                    previewContent.innerHTML = marked.parse(data.readme);
                    hljs.highlightAll();
                    
                    setView('output');
                    if (typeof animateOutputIn === 'function') {
                        animateOutputIn(); // Animate output when content is ready
                    }
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
            }
            
        } catch (error) {
            if (animationTimeout) {
                clearInterval(animationTimeout);
            }
            console.error("Request failed:", error);
            previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Connection Error</h3><p>Could not connect to the server. Please check your internet connection and try again.</p></div>`;
            codeView.textContent = `/*\n  Error: Connection failed - ${error.message}\n*/`;
            hljs.highlightAll();
            setView('output');
        }
    });
    
    console.log('Form submission handler attached successfully');
}

// Removed complex enhanced functions - using simple marked.parse approach like temp app.js

// Helper function to process inline formatting
function processInlineFormatting(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="github-inline-code">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="github-link">$1</a>')
        .replace(/~~(.+?)~~/g, '<del>$1</del>');
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    // Delete cookie with multiple path variations to ensure complete removal
    const paths = ['/', '/auth', '/api'];
    const domains = [window.location.hostname, `.${window.location.hostname}`];
    
    paths.forEach(path => {
        domains.forEach(domain => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
        });
    });
    
    // Also try without domain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log(`🗑️ Deleted cookie: ${name}`);
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
                // Validate that the token is still valid by checking if we can make a simple API call
                validateUserToken(userData);
                return true;
            } else {
                console.log('Invalid user data - missing username or access_token');
                handleInvalidAuth();
            }
        } catch (e) {
            console.error('Failed to parse user data:', e);
            handleInvalidAuth();
        }
    } else {
        console.log('No github_user cookie found');
    }

    console.log('Showing login button');
    showLoginButton();
    return false;
}

// Validate if the stored token is still valid
async function validateUserToken(userData) {
    try {
        // Try to make a simple API call to validate the token
        const response = await fetch('/api/repositories', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            // Token is invalid/revoked
            console.log('🚫 Token is invalid or revoked');
            handleInvalidAuth();
            return;
        }

        // Token is valid, show user profile
        currentUser = userData;
        showUserProfile(userData);
        console.log('✅ User profile should now be visible');
        
        // Handle post-login actions
        handlePostLoginAction();
        
    } catch (error) {
        console.log('⚠️ Could not validate token, assuming valid:', error);
        // If we can't validate, assume it's valid (network issues, etc.)
        currentUser = userData;
        showUserProfile(userData);
        
        // Handle post-login actions
        handlePostLoginAction();
    }
}

// Handle actions that were requested before login
function handlePostLoginAction() {
    const postLoginAction = sessionStorage.getItem('postLoginAction');
    
    if (postLoginAction) {
        console.log('🎯 Executing post-login action:', postLoginAction);
        
        // Clear the stored action
        sessionStorage.removeItem('postLoginAction');
        
        // Execute the requested action
        switch (postLoginAction) {
            case 'repositories':
                setTimeout(() => showRepositories(), 500);
                break;
            case 'history':
                setTimeout(() => showHistory(), 500);
                break;
            case 'profile':
                setTimeout(() => openGitHubProfile(), 500);
                break;
            case 'settings':
                setTimeout(() => showSettings(), 500);
                break;
            default:
                console.log('Unknown post-login action:', postLoginAction);
        }
    }
}

// Handle invalid authentication (revoked OAuth, expired tokens, etc.)
function handleInvalidAuth() {
    console.log('🚫 Invalid authentication detected, clearing user data...');
    
    // Clear all stored data
    currentUser = null;
    deleteCookie('github_user');
    clearUserProfileData();
    
    // Clear storage
    try {
        localStorage.removeItem('github_user');
        sessionStorage.removeItem('github_user');
    } catch (e) {
        console.log('Could not clear storage:', e);
    }
    
    // Show login button
    showLoginButton();
}

function showUserProfile(userData) {
    console.log('🔄 showUserProfile called with:', userData);
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
        console.log('✅ Shown user profile container');
        
        // Ensure the dropdown is initially hidden
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
            console.log('✅ Reset dropdown to hidden state');
        }
    } else {
        console.error('❌ userProfile element not found');
    }

    // Set profile trigger data
    if (userAvatar && userData.avatar_url) {
        userAvatar.src = userData.avatar_url;
        console.log('✅ Set user avatar:', userData.avatar_url);
    } else {
        console.error('❌ Could not set user avatar');
    }
    
    if (userName && (userData.name || userData.username)) {
        userName.textContent = userData.name || userData.username;
        console.log('✅ Set user name:', userData.name || userData.username);
    } else {
        console.error('❌ Could not set user name');
    }
    
    if (userHandle && userData.username) {
        userHandle.textContent = `@${userData.username}`;
        console.log('✅ Set user handle:', userData.username);
    } else {
        console.error('❌ Could not set user handle');
    }

    // Set dropdown header data
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const dropdownName = document.getElementById('dropdown-name');
    const dropdownHandle = document.getElementById('dropdown-handle');
    const dropdownEmail = document.getElementById('dropdown-email');

    if (dropdownAvatar && userData.avatar_url) {
        dropdownAvatar.src = userData.avatar_url;
        console.log('✅ Set dropdown avatar');
    }
    if (dropdownName) {
        dropdownName.textContent = userData.name || userData.username;
        console.log('✅ Set dropdown name');
    }
    if (dropdownHandle && userData.username) {
        dropdownHandle.textContent = `@${userData.username}`;
        console.log('✅ Set dropdown handle');
    }
    if (dropdownEmail && userData.email) {
        dropdownEmail.textContent = userData.email;
        dropdownEmail.style.display = 'block';
        console.log('✅ Set dropdown email');
    } else if (dropdownEmail) {
        dropdownEmail.style.display = 'none';
        console.log('✅ Hidden dropdown email (not available)');
    }

    console.log('🎉 User profile setup completed');
}

function showLoginButton() {
    currentUser = null;
    if (userLogin) userLogin.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';
}

function handleLogout() {
    console.log('🚪 Logging out user...');
    
    // Close dropdown if open
    const dropdown = document.getElementById('user-dropdown');
    const trigger = document.querySelector('.user-profile-trigger');
    if (dropdown && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        if (trigger) trigger.classList.remove('active');
    }
    
    // Clear all user data
    currentUser = null;
    
    // Delete all possible cookies
    deleteCookie('github_user');
    deleteCookie('session');
    deleteCookie('auth_token');
    
    // Clear localStorage and sessionStorage
    try {
        localStorage.removeItem('github_user');
        localStorage.removeItem('user_data');
        sessionStorage.removeItem('github_user');
        sessionStorage.removeItem('user_data');
        console.log('🗑️ Cleared local storage');
    } catch (e) {
        console.log('⚠️ Could not clear storage:', e);
    }
    
    // Reset UI to login state
    showLoginButton();
    
    // Clear user profile data
    clearUserProfileData();
    
    // Return to input view if in user-specific views
    if (currentView === 'repositories' || currentView === 'history') {
        setView('input');
    }
    
    // Show confirmation
    console.log('✅ User logged out successfully');
    
    // Optional: Redirect to clear any URL parameters
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Clear all user profile data from UI
function clearUserProfileData() {
    console.log('🧹 Clearing user profile data from UI...');
    
    // Clear profile trigger elements
    if (userAvatar) {
        userAvatar.src = '';
        userAvatar.alt = 'User Avatar';
    }
    if (userName) {
        userName.textContent = '';
    }
    if (userHandle) {
        userHandle.textContent = '';
    }
    
    // Clear dropdown header elements
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const dropdownName = document.getElementById('dropdown-name');
    const dropdownHandle = document.getElementById('dropdown-handle');
    const dropdownEmail = document.getElementById('dropdown-email');
    
    if (dropdownAvatar) {
        dropdownAvatar.src = '';
        dropdownAvatar.alt = 'User Avatar';
    }
    if (dropdownName) {
        dropdownName.textContent = '';
    }
    if (dropdownHandle) {
        dropdownHandle.textContent = '';
    }
    if (dropdownEmail) {
        dropdownEmail.textContent = '';
        dropdownEmail.style.display = 'none';
    }
    
    console.log('✅ User profile data cleared');
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

// Enhanced view switching with animations (from temp app.js)
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

    // Check if anime.js is available for animations
    if (typeof anime !== 'undefined') {
        const timeline = anime.timeline({
            easing: 'easeOutCubic',
            duration: 300,
            complete: () => {
                isAnimating = false;
                currentView = viewName;
            }
        });

        // Animate out current view
        if (currentViewEl) {
            timeline.add({
                targets: currentViewEl,
                opacity: [1, 0],
                translateY: [0, -40],
                duration: 150,
                begin: () => {
                    if (viewName === 'input') {
                        backBtn.classList.remove('visible');
                    }
                },
                complete: () => {
                    currentViewEl.style.display = 'none';
                }
            });
        }

        // Animate in next view
        timeline.add({
            targets: nextViewEl,
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 250,
            begin: () => {
                nextViewEl.style.display = 'flex';
                nextViewEl.style.opacity = 0;
                nextViewEl.style.transform = 'translateY(40px)';
            },
            complete: () => {
                if (viewName === 'output') {
                    backBtn.classList.add('visible');
                }
            }
        });
    } else {
        // Fallback without animations
        if (currentViewEl) {
            currentViewEl.style.display = 'none';
        }
        nextViewEl.style.display = 'flex';
        currentView = viewName;
        
        if (viewName === 'input') {
            backBtn.classList.remove('visible');
        } else {
            backBtn.classList.add('visible');
        }
        
        isAnimating = false;
    }
}

// Animation function for output view (from temp app.js)
function animateOutputIn() {
    if (typeof anime !== 'undefined') {
        anime({
            targets: '#output-view .pane',
            opacity: [0, 1],
            translateY: [25, 0],
            delay: anime.stagger(180),
            duration: 500,
            easing: 'easeOutCubic'
        });
    }
}

// Enhanced copy function with animation (from temp app.js)
function copyCode() {
    navigator.clipboard.writeText(codeView.textContent).then(() => {
        if (typeof showCopySuccessAnimation === 'function') {
            showCopySuccessAnimation();
        } else {
            // Fallback for when animation isn't available
            copyBtn.innerHTML = '✓ Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = 'Copy';
            }, 2000);
        }
    }).catch(err => {
        alert('Failed to copy text.');
    });
}

// Copy success animation (from temp app.js)
function showCopySuccessAnimation() {
    if (typeof anime !== 'undefined') {
        const slider = document.createElement('div');
        slider.className = 'copy-success-slider';
        slider.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        slider.textContent = '✓ Copied to clipboard!';
        document.body.appendChild(slider);

        anime.timeline({
            easing: 'easeOutQuad',
            duration: 300,
            complete: () => {
                anime({
                    targets: slider,
                    translateX: ['0%', '100%'],
                    opacity: [1, 0],
                    duration: 300,
                    easing: 'easeInQuad',
                    complete: () => {
                        slider.remove();
                    }
                });
            }
        })
        .add({
            targets: slider,
            translateX: ['100%', '0%'],
            opacity: [0, 1],
            duration: 300
        });
    } else {
        // Fallback without animation
        copyBtn.innerHTML = '✓ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = 'Copy';
        }, 2000);
    }
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

// Enhanced dropdown functionality with proper error handling
function toggleUserDropdown() {
    console.log('🔽 toggleUserDropdown called');
    
    const dropdown = document.getElementById('user-dropdown');
    const trigger = document.querySelector('.user-profile-trigger');
    
    console.log('Dropdown element:', dropdown);
    console.log('Trigger element:', trigger);

    if (!dropdown) {
        console.error('❌ Dropdown element not found!');
        return;
    }
    
    if (!trigger) {
        console.error('❌ Trigger element not found!');
        return;
    }

    const isOpen = dropdown.style.display === 'block';
    console.log('Current dropdown state - isOpen:', isOpen);
    
    if (isOpen) {
        dropdown.style.display = 'none';
        trigger.classList.remove('active');
        console.log('✅ Dropdown closed');
    } else {
        dropdown.style.display = 'block';
        trigger.classList.add('active');
        console.log('✅ Dropdown opened');
    }
}

// Login dropdown functionality
function toggleLoginDropdown() {
    console.log('🔽 toggleLoginDropdown called');
    
    const dropdown = document.getElementById('login-dropdown');
    const trigger = document.querySelector('.login-btn');
    
    if (!dropdown || !trigger) {
        console.error('❌ Login dropdown elements not found!');
        return;
    }

    const isOpen = dropdown.style.display === 'block';
    console.log('Current login dropdown state - isOpen:', isOpen);
    
    if (isOpen) {
        dropdown.style.display = 'none';
        trigger.classList.remove('active');
        console.log('✅ Login dropdown closed');
    } else {
        dropdown.style.display = 'block';
        trigger.classList.add('active');
        console.log('✅ Login dropdown opened');
    }
}

// Professional dropdown functions
function showRepositories() {
    toggleUserDropdown(); // Close dropdown
    if (!currentUser) {
        alert('Please log in first');
        return;
    }
    console.log('📚 Loading user repositories...');
    setView('repositories');
    loadRepositories();
}

function showHistory() {
    toggleUserDropdown(); // Close dropdown
    if (!currentUser) {
        alert('Please log in first');
        return;
    }
    console.log('📜 Loading README history...');
    setView('history');
    loadHistory();
}

function openGitHubProfile() {
    toggleUserDropdown(); // Close dropdown
    if (!currentUser) {
        alert('Please log in first');
        return;
    }
    
    const profileUrl = currentUser.html_url || `https://github.com/${currentUser.username}`;
    console.log('🔗 Opening GitHub profile:', profileUrl);
    window.open(profileUrl, '_blank');
}

function showApiUsage() {
    toggleUserDropdown(); // Close dropdown
    if (!currentUser) {
        alert('Please log in first');
        return;
    }
    console.log('📊 API Usage feature coming soon!');
    alert('📊 API Usage statistics coming soon!');
}

function showSettings() {
    toggleUserDropdown(); // Close dropdown
    console.log('⚙️ Settings feature coming soon!');
    alert('⚙️ Settings feature coming soon!');
}

function showHelp() {
    toggleUserDropdown(); // Close dropdown
    console.log('❓ Help feature coming soon!');
    alert('❓ Help & Support coming soon!');
}

// Login dropdown menu functions
function loginAndShowRepositories() {
    console.log('📚 Login and show repositories...');
    toggleLoginDropdown(); // Close dropdown
    
    // Store the intended action
    sessionStorage.setItem('postLoginAction', 'repositories');
    
    // Proceed to GitHub OAuth
    window.location.href = '/auth/github';
}

function loginAndShowHistory() {
    console.log('📜 Login and show history...');
    toggleLoginDropdown(); // Close dropdown
    
    // Store the intended action
    sessionStorage.setItem('postLoginAction', 'history');
    
    // Proceed to GitHub OAuth
    window.location.href = '/auth/github';
}

function loginAndShowProfile() {
    console.log('👤 Login and show profile...');
    toggleLoginDropdown(); // Close dropdown
    
    // Store the intended action
    sessionStorage.setItem('postLoginAction', 'profile');
    
    // Proceed to GitHub OAuth
    window.location.href = '/auth/github';
}

function loginAndShowSettings() {
    console.log('⚙️ Login and show settings...');
    toggleLoginDropdown(); // Close dropdown
    
    // Store the intended action
    sessionStorage.setItem('postLoginAction', 'settings');
    
    // Proceed to GitHub OAuth
    window.location.href = '/auth/github';
}

function proceedToLogin() {
    console.log('🚀 Proceeding to GitHub login...');
    toggleLoginDropdown(); // Close dropdown
    
    // Direct login without specific action
    window.location.href = '/auth/github';
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

// Simple and clean markdown preview function (like temp app.js)
function renderMarkdownPreview(markdownContent) {
    console.log('🔄 Rendering markdown preview with marked.js');
    
    if (!previewContent) {
        console.error('❌ Preview content element not found');
        return;
    }
    
    try {
        // Use marked library for clean, simple rendering
        if (typeof marked !== 'undefined') {
            previewContent.innerHTML = marked.parse(markdownContent);
            hljs.highlightAll();
            console.log('✅ Markdown preview rendered successfully');
        } else {
            console.error('❌ marked.js library not available');
            previewContent.innerHTML = `<div style="color: #ff6b6b; padding: 20px;">
                <h3>Preview Error</h3>
                <p>marked.js library is required for markdown preview</p>
            </div>`;
        }
    } catch (error) {
        console.error('❌ Error rendering markdown:', error);
        previewContent.innerHTML = `<div style="color: #ff6b6b; padding: 20px;">
            <h3>Preview Error</h3>
            <p>Failed to render markdown preview: ${error.message}</p>
        </div>`;
    }
}

// Test function for markdown preview (simplified like temp app.js)
window.testPreview = function() {
    const testMarkdown = `# Test README

## Overview
This is a **test** README with *italic* text and proper formatting.

### Features
- Feature 1: Amazing functionality
- Feature 2: Great performance  
- Feature 3: Easy to use

### Code Example
\`\`\`javascript
console.log("Hello World!");
const greeting = "Welcome to the preview!";
\`\`\`

### Links
[GitHub](https://github.com) | [Documentation](https://docs.example.com)

This preview should show \`inline code\` and **bold text** properly.

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| JavaScript | Frontend | Interactive UI |
| Node.js | Backend | Server-side logic |

> This is a blockquote example with enhanced styling.
`;
    
    console.log('🧪 Testing simple preview with sample README...');
    codeView.textContent = testMarkdown;
    previewContent.innerHTML = marked.parse(testMarkdown);
    hljs.highlightAll();
    setView('output');
    if (typeof animateOutputIn === 'function') {
        animateOutputIn();
    }
    console.log('✅ Simple test completed - check the preview panel');
};

// Global functions for HTML buttons
window.showRepositories = showRepositories;
window.showHistory = showHistory;
window.openGitHubProfile = openGitHubProfile;
window.showApiUsage = showApiUsage;
window.showSettings = showSettings;
window.showHelp = showHelp;
window.handleLogout = handleLogout;
window.toggleUserDropdown = toggleUserDropdown;

// Login dropdown functions
window.toggleLoginDropdown = toggleLoginDropdown;
window.loginAndShowRepositories = loginAndShowRepositories;
window.loginAndShowHistory = loginAndShowHistory;
window.loginAndShowProfile = loginAndShowProfile;
window.loginAndShowSettings = loginAndShowSettings;
window.proceedToLogin = proceedToLogin;

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userSection = document.getElementById('user-section');
    const dropdown = document.getElementById('user-dropdown');
    const trigger = document.querySelector('.user-profile-trigger');

    if (userSection && !userSection.contains(e.target)) {
        if (dropdown && dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            if (trigger) trigger.classList.remove('active');
        }
    }
    
    // Close login dropdown when clicking outside
    const loginDropdownContainer = document.querySelector('.login-dropdown-container');
    const loginDropdown = document.getElementById('login-dropdown');
    const loginTrigger = document.querySelector('.login-btn');

    if (loginDropdownContainer && !loginDropdownContainer.contains(e.target)) {
        if (loginDropdown && loginDropdown.style.display === 'block') {
            loginDropdown.style.display = 'none';
            if (loginTrigger) loginTrigger.classList.remove('active');
        }
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close user dropdown
        const dropdown = document.getElementById('user-dropdown');
        const trigger = document.querySelector('.user-profile-trigger');
        
        if (dropdown && dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            if (trigger) trigger.classList.remove('active');
        }
        
        // Close login dropdown
        const loginDropdown = document.getElementById('login-dropdown');
        const loginTrigger = document.querySelector('.login-btn');
        
        if (loginDropdown && loginDropdown.style.display === 'block') {
            loginDropdown.style.display = 'none';
            if (loginTrigger) loginTrigger.classList.remove('active');
        }
    }
});

// Force logout function - can be called manually to clear all user data
window.forceLogout = function() {
    console.log('🔧 Force logout initiated...');
    handleLogout();
    
    // Additional cleanup - clear ALL cookies
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear all storage
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch (e) {
        console.log('Could not clear all storage:', e);
    }
    
    console.log('✅ Force logout completed');
    alert('✅ All user data cleared! The page will reload to ensure clean state.');
    
    // Reload page to ensure completely clean state
    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

// Check authentication status manually
window.checkAuth = function() {
    console.log('🔍 Manual auth check...');
    console.log('Current user:', currentUser);
    console.log('All cookies:', document.cookie);
    console.log('Profile display:', document.getElementById('user-profile')?.style.display);
    console.log('Login display:', document.getElementById('user-login')?.style.display);
    
    checkAuthStatus();
};

// Test function to simulate login
window.testLogin = function() {
    console.log('🧪 Simulating user login...');
    
    const mockUser = {
        username: 'testuser',
        name: 'Test User',
        avatar_url: 'https://github.com/github.png',
        html_url: 'https://github.com/testuser',
        access_token: 'mock_token'
    };
    
    showUserProfile(mockUser);
    console.log('✅ Mock login completed');
    
    // Test the dropdown after a short delay
    setTimeout(() => {
        console.log('🧪 Testing user dropdown...');
        toggleUserDropdown();
    }, 1000);
};

// Test function specifically for user dropdown
window.testUserDropdown = function() {
    console.log('🧪 Testing user dropdown functionality...');
    
    const elements = {
        'user-profile': document.getElementById('user-profile'),
        'user-dropdown': document.getElementById('user-dropdown'),
        'user-profile-trigger': document.querySelector('.user-profile-trigger'),
        'user-avatar': document.getElementById('user-avatar'),
        'user-name': document.getElementById('user-name')
    };
    
    console.log('Elements check:', elements);
    
    Object.entries(elements).forEach(([name, element]) => {
        if (element) {
            console.log(`✅ ${name}: Found`, element.style.display || 'default');
        } else {
            console.error(`❌ ${name}: Not found`);
        }
    });
    
    // Force show profile if hidden
    if (elements['user-profile']) {
        elements['user-profile'].style.display = 'block';
        console.log('🔧 Forced user profile to show');
    }
    
    // Try to toggle dropdown
    console.log('🔧 Attempting to toggle dropdown...');
    toggleUserDropdown();
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initialize, 100);
});

// Removed duplicate - using enhanced version above

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