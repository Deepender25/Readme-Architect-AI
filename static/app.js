// static/app.js

// --- DOM Elements ---
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

const codeView = document.getElementById('code-view');
const previewContent = document.getElementById('preview-content');
const copyBtn = document.getElementById('copy-btn');

// GitHub Auth Elements
const githubLoginBtn = document.getElementById('github-login-btn');
const userProfile = document.getElementById('user-profile');
const userProfileTrigger = document.getElementById('user-profile-trigger');
const userDropdown = document.getElementById('user-dropdown');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userHandle = document.getElementById('user-handle');

// Dropdown elements
const dropdownAvatar = document.getElementById('dropdown-avatar');
const dropdownName = document.getElementById('dropdown-name');
const dropdownHandle = document.getElementById('dropdown-handle');
const repositoriesOption = document.getElementById('repositories-option');
const historyOption = document.getElementById('history-option');
const profileOption = document.getElementById('profile-option');
const settingsOption = document.getElementById('settings-option');
const logoutOption = document.getElementById('logout-option');

// View Elements
const repositoriesView = document.getElementById('repositories-view');
const historyView = document.getElementById('history-view');
const repositoriesGrid = document.getElementById('repositories-grid');
const historyList = document.getElementById('history-list');

// Current user data
let currentUser = null;

let currentView = 'input';
let isAnimating = false;
let initialLoadComplete = false; // Flag to prevent double initial animations

// --- Loading state variables ---
let animationTimeout;
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

function updateLoaderText() {
    const baseMessage = loadingMessages[messageIndex];
    loaderText.textContent = baseMessage + '.'.repeat(dotCount);
    dotCount++;
    if (dotCount > 3) {
        dotCount = 1;
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    }
}

// --- Event Listeners ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const repoUrl = repoUrlInput.value;
    if (!repoUrl || isAnimating) return;

    setView('loader');
    
    // Start loader animation
    animationTimeout = setInterval(updateLoaderText, 500);

    const params = new URLSearchParams({
        repo_url: repoUrl,
        project_name: projectNameInput.value.trim(),
        include_demo: includeDemoCheckbox.checked,
        num_screenshots: parseInt(numScreenshotsInput.value, 10) || 0,
        num_videos: parseInt(numVideosInput.value, 10) || 0,
    });

    try {
        const response = await fetch(`/api/generate?${params.toString()}`);
        const data = await response.json();

        // Clear loader animation
        if (animationTimeout) {
            clearInterval(animationTimeout);
        }

        if (data.readme) {
            codeView.textContent = data.readme;
            previewContent.innerHTML = marked.parse(data.readme);
            hljs.highlightAll();
            setView('output');
            animateOutputIn();
        } else if (data.error) {
            previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Generation Failed</h3><p>${data.error}</p></div>`;
            codeView.textContent = `/*\n  Error: ${data.error}\n*/`;
            hljs.highlightAll();
            setView('output');
        }
    } catch (error) {
        // Clear loader animation
        if (animationTimeout) {
            clearInterval(animationTimeout);
        }
        
        console.error("Request failed:", error);
        previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Connection Error</h3><p>Could not connect to the server. Please try again later.</p></div>`;
        codeView.textContent = `/*\n  Error: Connection failed.\n*/`;
        hljs.highlightAll();
        setView('output');
    }
});

backBtn.addEventListener('click', () => {
    if (isAnimating) return;
    setView('input');
    repoUrlInput.value = '';
    projectNameInput.value = '';
    includeDemoCheckbox.checked = false;
    demoCountsContainer.style.opacity = 0;
    demoCountsContainer.style.transform = 'translateY(-10px)';
    demoCountsContainer.style.display = 'none'; // Explicitly hide on back
    numScreenshotsInput.value = "2";
    numVideosInput.value = "1";
});

includeDemoCheckbox.addEventListener('change', () => {
    const isChecked = includeDemoCheckbox.checked;
    if (isChecked) {
        demoCountsContainer.style.display = 'flex';
        anime({
            targets: demoCountsContainer,
            opacity: [0, 1],
            translateY: [-10, 0],
            duration: 300, // Faster duration
            easing: 'easeOutQuad' // Snappier easing
        });
    } else {
        anime({
            targets: demoCountsContainer,
            opacity: [1, 0],
            translateY: [0, -10],
            duration: 300, // Faster duration
            easing: 'easeInQuad',
            complete: () => {
                demoCountsContainer.style.display = 'none';
            }
        });
    }
});

// --- GitHub Authentication Functions ---
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
    const githubUserCookie = getCookie('github_user');
    console.log('GitHub user cookie found:', !!githubUserCookie);
    
    if (githubUserCookie) {
        try {
            const userData = JSON.parse(atob(githubUserCookie));
            console.log('Parsed user data:', userData);
            currentUser = userData;
            showUserProfile(userData);
            return true;
        } catch (e) {
            console.error('Failed to parse user data:', e);
            console.log('Clearing invalid cookie...');
            deleteCookie('github_user');
        }
    }
    
    console.log('No valid authentication found, showing login button');
    showLoginButton();
    return false;
}

function showUserProfile(userData) {
    // Ensure login button is completely hidden
    if (githubLoginBtn) {
        githubLoginBtn.style.display = 'none';
        githubLoginBtn.style.visibility = 'hidden';
        githubLoginBtn.style.opacity = '0';
    }
    
    // Show user profile
    if (userProfile) {
        userProfile.style.display = 'block';
        userProfile.style.visibility = 'visible';
        userProfile.style.opacity = '1';
    }
    
    // Set user data in main profile
    if (userAvatar && userData.avatar_url) {
        userAvatar.src = userData.avatar_url;
    }
    if (userName && userData.username) {
        userName.textContent = userData.username;
    }
    if (userHandle && userData.username) {
        userHandle.textContent = `@${userData.username}`;
    }
    
    // Set user data in dropdown
    if (dropdownAvatar && userData.avatar_url) {
        dropdownAvatar.src = userData.avatar_url;
    }
    if (dropdownName && userData.username) {
        dropdownName.textContent = userData.name || userData.username;
    }
    if (dropdownHandle && userData.username) {
        dropdownHandle.textContent = `@${userData.username}`;
    }
    
    // Test authentication after showing profile
    setTimeout(async () => {
        const authResult = await testAuthentication();
        if (!authResult.authenticated) {
            console.log('Frontend shows user but backend has no auth - clearing frontend state');
            showLoginButton();
        }
    }, 1000);
}

function showLoginButton() {
    // Show login button
    if (githubLoginBtn) {
        githubLoginBtn.style.display = 'flex';
        githubLoginBtn.style.visibility = 'visible';
        githubLoginBtn.style.opacity = '1';
    }
    
    // Hide user profile and close dropdown
    if (userProfile) {
        userProfile.style.display = 'none';
        userProfile.style.visibility = 'hidden';
        userProfile.style.opacity = '0';
    }
    
    // Close dropdown if open
    closeDropdown();
    
    currentUser = null;
}

function handleLogin() {
    window.location.href = '/auth/github';
}

function handleLogout() {
    deleteCookie('github_user');
    showLoginButton();
    // Redirect to clear any URL parameters
    window.location.href = '/';
}

// Check for successful OAuth callback
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session') === 'success') {
        // Clean up URL
        window.history.replaceState({}, document.title, '/');
        // Check auth status to update UI
        checkAuthStatus();
    }
}

// Load user repositories
async function loadRepositories() {
    if (!currentUser) {
        repositoriesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔐</div>
                <h3>Authentication Required</h3>
                <p>Please log in with GitHub to view your repositories.</p>
            </div>
        `;
        return;
    }
    
    // Show loading state
    repositoriesGrid.innerHTML = '<div class="loading-state">Loading repositories...</div>';
    
    try {
        console.log('Fetching repositories for user:', currentUser.username);
        
        // First check OAuth configuration (with cache busting)
        const configResponse = await fetch(`/api/debug-config?t=${Date.now()}`);
        const configData = await configResponse.json();
        console.log('OAuth configuration:', configData);
        
        if (!configData.github_oauth_configured) {
            repositoriesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚙️</div>
                    <h3>GitHub OAuth Not Configured</h3>
                    <p>To see your real repositories, GitHub OAuth needs to be set up.</p>
                    <div class="empty-note">
                        <small>💡 Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables</small>
                    </div>
                </div>
            `;
            return;
        }
        
        // Get the cookie value to send as header (workaround for cookie transmission issue)
        const githubUserCookie = getCookie('github_user');
        
        const response = await fetch(`/api/repositories?t=${Date.now()}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-GitHub-User': githubUserCookie || ''
            }
        });
        
        console.log('Repository response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Repository data received:', data);
        displayRepositories(data.repositories || []);
    } catch (error) {
        console.error('Error loading repositories:', error);
        repositoriesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h3>Failed to Load Repositories</h3>
                <p>Error: ${error.message}</p>
                <p>Please try logging out and back in.</p>
            </div>
        `;
    }
}

// Display repositories
function displayRepositories(repositories) {
    if (repositories.length === 0) {
        repositoriesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>No Repositories Found</h3>
                <p>It looks like you don't have any repositories yet, or they might be private.</p>
                <p>Create a new repository on GitHub to get started!</p>
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

// Select repository
function selectRepository(repoUrl) {
    repoUrlInput.value = repoUrl;
    setView('input');
    repoUrlInput.focus();
}

// Load user history
async function loadHistory() {
    if (!currentUser) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔐</div>
                <h3>Authentication Required</h3>
                <p>Please log in with GitHub to view your history.</p>
            </div>
        `;
        return;
    }
    
    // Show loading state
    historyList.innerHTML = '<div class="loading-state">Loading history...</div>';
    
    try {
        console.log('Fetching history for user:', currentUser.username);
        // Get the cookie value to send as header (workaround for cookie transmission issue)
        const githubUserCookie = getCookie('github_user');
        
        const response = await fetch('/api/history', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-User': githubUserCookie || ''
            }
        });
        
        console.log('History response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('History data received:', data);
        displayHistory(data.history || []);
    } catch (error) {
        console.error('Error loading history:', error);
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h3>Failed to Load History</h3>
                <p>Error: ${error.message}</p>
                <p>Please try logging out and back in.</p>
            </div>
        `;
    }
}

// Display history
function displayHistory(history) {
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📜</div>
                <h3>No README History</h3>
                <p>You haven't generated any READMEs yet.</p>
                <p>Generate your first README to see it appear here!</p>
                <div class="empty-note">
                    <small>💡 Note: History feature requires database setup. This is a demo version.</small>
                </div>
            </div>
        `;
        return;
    }
    
    const historyItems = history.map(item => `
        <div class="history-item" onclick="loadHistoryItem(${item.id})">
            <h3>${item.project_name || item.repo_name}</h3>
            <p>${item.repo_url}</p>
            <span class="history-date">${new Date(item.created_at).toLocaleDateString()}</span>
        </div>
    `).join('');
    
    historyList.innerHTML = historyItems;
}

// Load history item
async function loadHistoryItem(historyId) {
    try {
        console.log('Loading history item:', historyId);
        
        const response = await fetch(`/api/history/${historyId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load README from history');
        }
        
        const data = await response.json();
        
        if (data.readme_content) {
            // Show the README
            codeView.textContent = data.readme_content;
            previewContent.innerHTML = marked.parse(data.readme_content);
            hljs.highlightAll();
            setView('output');
            animateOutputIn();
        } else {
            throw new Error('No README content found');
        }
        
    } catch (error) {
        console.error('Error loading history item:', error);
        alert('Failed to load README from history. This feature requires database setup.');
    }
}

// Dropdown functionality
let dropdownOpen = false;

function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
    
    if (dropdownOpen) {
        userDropdown.classList.add('show');
        userProfile.classList.add('dropdown-open');
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeDropdownOnOutsideClick);
        }, 100);
    } else {
        userDropdown.classList.remove('show');
        userProfile.classList.remove('dropdown-open');
        document.removeEventListener('click', closeDropdownOnOutsideClick);
    }
}

function closeDropdownOnOutsideClick(event) {
    if (!userProfile.contains(event.target)) {
        closeDropdown();
    }
}

function closeDropdown() {
    if (dropdownOpen) {
        dropdownOpen = false;
        userDropdown.classList.remove('show');
        userProfile.classList.remove('dropdown-open');
        document.removeEventListener('click', closeDropdownOnOutsideClick);
    }
}

// Add GitHub auth event listeners
if (githubLoginBtn) {
    githubLoginBtn.addEventListener('click', handleLogin);
}

// User profile dropdown trigger
if (userProfileTrigger) {
    userProfileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Add ripple effect
        userProfileTrigger.classList.add('ripple');
        setTimeout(() => {
            userProfileTrigger.classList.remove('ripple');
        }, 600);
        
        toggleDropdown();
    });
}

// Dropdown menu options
if (repositoriesOption) {
    repositoriesOption.addEventListener('click', () => {
        closeDropdown();
        setView('repositories');
        loadRepositories();
    });
}

if (historyOption) {
    historyOption.addEventListener('click', () => {
        closeDropdown();
        setView('history');
        loadHistory();
    });
}

if (profileOption) {
    profileOption.addEventListener('click', () => {
        closeDropdown();
        // Open GitHub profile in new tab
        if (currentUser && currentUser.html_url) {
            window.open(currentUser.html_url, '_blank');
        } else if (currentUser && currentUser.username) {
            window.open(`https://github.com/${currentUser.username}`, '_blank');
        }
    });
}

// Add test authentication function for debugging
async function testAuthentication() {
    try {
        console.log('Testing authentication...');
        console.log('Current cookies:', document.cookie);
        
        // Get the cookie value to send as header (workaround for cookie transmission issue)
        const githubUserCookie = getCookie('github_user');
        
        const response = await fetch('/api/test-auth', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-User': githubUserCookie || ''
            }
        });
        
        const data = await response.json();
        console.log('Auth test result:', data);
        return data;
    } catch (error) {
        console.error('Auth test failed:', error);
        return { authenticated: false, error: error.message };
    }
}

// Remove duplicate function - keeping the original one above

if (settingsOption) {
    settingsOption.addEventListener('click', () => {
        closeDropdown();
        // TODO: Implement settings view
        alert('Settings feature coming soon!');
    });
}

if (logoutOption) {
    logoutOption.addEventListener('click', () => {
        closeDropdown();
        handleLogout();
    });
}


// --- Core UI Logic Function ---
function setView(viewName) {
    if (viewName === currentView || isAnimating) return;
    isAnimating = true;

    const currentViewEl = document.getElementById(`${currentView}-view`);
    const nextViewEl = document.getElementById(`${viewName}-view`);
    
    const timeline = anime.timeline({
        easing: 'easeOutCubic', // Consistent, clean easing
        duration: 300, // Faster overall transition
        complete: () => {
            isAnimating = false;
            currentView = viewName;
            if (viewName === 'loader') {
                animateLoaderIn(); // Trigger loader animation
            }
        }
    });

    // Animate out current view
    if (currentViewEl) {
        timeline.add({
            targets: currentViewEl,
            opacity: [1, 0],
            translateY: [0, -40], // More pronounced translation
            duration: 150, // Very fast fade out
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

    // Animate in next view - this will now happen *after* the previous one completes
    timeline.add({
        targets: nextViewEl,
        opacity: [0, 1],
        translateY: [40, 0], // More pronounced translation
        duration: 250, // Fast fade in
        begin: () => {
            nextViewEl.style.display = 'flex';
            nextViewEl.style.opacity = 0;
            nextViewEl.style.transform = 'translateY(40px)';
        },
        complete: () => {
            if (viewName === 'input') {
                generateBtn.disabled = false;
            }
            else if (viewName === 'output') {
                backBtn.classList.add('visible');
            }
            else if (viewName === 'loader') {
                generateBtn.disabled = true;
            }
        }
    }); // No overlap, sequential
}

function animateFormIn() {
    anime.timeline({
        easing: 'easeOutCubic', // Consistent, clean easing
        duration: 500 // Faster duration
    })
    .add({
        targets: '#repo-form .form-main',
        opacity: [0, 1],
        translateY: [25, 0], // Adjusted translation
        delay: 75 // Adjusted delay
    })
    .add({
        targets: '#repo-form .form-options .option-row',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(120), // Adjusted stagger delay
        duration: 400 // Faster duration
    }, '-=250'); // Adjusted overlap
}

function animateOutputIn() {
    anime({
        targets: '#output-view .pane',
        opacity: [0, 1],
        translateY: [25, 0],
        delay: anime.stagger(180), // Adjusted stagger delay
        duration: 500, // Faster duration
        easing: 'easeOutCubic' // Consistent, clean easing
    });
}

function copyCode() {
    navigator.clipboard.writeText(codeView.textContent).then(() => {
        showCopySuccessAnimation();
    }).catch(err => {
        alert('Failed to copy text.');
    });
}

function showCopySuccessAnimation() {
    const slider = document.createElement('div');
    slider.className = 'copy-success-slider';
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
}

// Initialize
function initialize() {
    if (initialLoadComplete) return; // Prevent re-initialization

    // Handle OAuth callback first
    handleOAuthCallback();
    
    // Check authentication status
    checkAuthStatus();

    includeDemoCheckbox.checked = false; // Explicitly uncheck on load

    // Ensure inputView is visible and opaque initially
    inputView.style.display = 'flex';
    inputView.style.opacity = 1;
    inputView.style.transform = 'translateY(0px)';

    // Set other views to hidden
    outputView.style.display = 'none';
    loaderView.style.display = 'none';
    repositoriesView.style.display = 'none';
    historyView.style.display = 'none';
    
    // Set initial states for animation targets to ensure they animate in from 0 opacity
    anime.set('.app-header .title', { opacity: 0, translateY: -20 });
    anime.set('.app-header .subtitle', { opacity: 0, translateY: -20 });
    anime.set('#back-btn', { opacity: 0, translateX: 20 });
    anime.set('#repo-form .form-main', { opacity: 0, translateY: 30 });
    anime.set('#repo-form .form-options .option-row', { opacity: 0, translateY: 20 });
    if (!includeDemoCheckbox.checked) {
        anime.set(demoCountsContainer, { opacity: 0, translateY: -10 });
        demoCountsContainer.style.display = 'none';
    }

    // Now animate them in
    animateFormIn();
    animateHeaderIn(); // Animate header elements on initialization

    initialLoadComplete = true;
}

function animateHeaderIn() {
    anime.timeline({
        easing: 'easeOutCubic',
        duration: 400 // Faster duration
    })
    .add({
        targets: '.app-header .title',
        opacity: [0, 1],
        translateY: [-20, 0]
    })
    .add({
        targets: '.app-header .subtitle',
        opacity: [0, 1],
        translateY: [-20, 0]
    }, '-=200') // Adjusted overlap
    .add({
        targets: '#back-btn',
        opacity: [0, 1],
        translateX: [20, 0]
    }, '-=150'); // Adjusted overlap
}

function animateLoaderIn() {
    anime({
        targets: '.github-octocat-loader',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutBack'
    });
    anime({
        targets: '#loader-text',
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 300,
        easing: 'easeOutCubic',
        delay: 150
    });
}

// Call initialize only once when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are properly loaded
    setTimeout(initialize, 100);
});

// Add button animations
function setupButtonAnimations() {
    const buttons = [generateBtn, copyBtn]; // Add other buttons as needed

    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                scale: 1.03,
                boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
                duration: 150,
                easing: 'easeOutQuad'
            });
            // Shine effect
            const shine = document.createElement('div');
            shine.className = 'button-shine';
            button.style.position = 'relative'; // Ensure position for absolute shine
            button.style.overflow = 'hidden'; // Hide overflow of shine
            button.appendChild(shine);

            anime({
                targets: shine,
                width: '100%',
                height: '100%',
                top: '0%',
                left: '0%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                opacity: [0, 1, 0],
                duration: 500,
                easing: 'easeOutSine',
                translateX: ['-100%', '100%'],
                complete: () => {
                    shine.remove();
                }
            });
        });

        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                duration: 150,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Call setupButtonAnimations after initialize
document.addEventListener('DOMContentLoaded', setupButtonAnimations);