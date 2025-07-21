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

// Navigation Elements
const leftNav = document.getElementById('left-nav');
const navToggleBtn = document.getElementById('nav-toggle-btn');
const navToggle = document.getElementById('nav-toggle');
const navLogin = document.getElementById('nav-login');
const navLogout = document.getElementById('nav-logout');
const navUser = document.getElementById('nav-user');
const navUserAvatar = document.getElementById('nav-user-avatar');
const navUserName = document.getElementById('nav-user-name');
const navUserHandle = document.getElementById('nav-user-handle');

// View Elements
const repositoriesView = document.getElementById('repositories-view');
const historyView = document.getElementById('history-view');
const repositoriesGrid = document.getElementById('repositories-grid');
const historyList = document.getElementById('history-list');

// Current user data
let currentUser = null;
let currentView = 'input';
let isAnimating = false;
let initialLoadComplete = false;

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
            codeView.textContent = `/*\\n  Error: ${data.error}\\n*/`;
            hljs.highlightAll();
            setView('output');
        }
    } catch (error) {
        if (animationTimeout) {
            clearInterval(animationTimeout);
        }
        console.error("Request failed:", error);
        previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Connection Error</h3><p>Could not connect to the server. Please try again later.</p></div>`;
        codeView.textContent = `/*\\n  Error: Connection failed.\\n*/`;
        hljs.highlightAll();
        setView('output');
    }
});

backBtn.addEventListener('click', () => {
    if (isAnimating) return;
    setView('input');

    if (currentView === 'output') {
        repoUrlInput.value = '';
        projectNameInput.value = '';
        includeDemoCheckbox.checked = false;
        demoCountsContainer.style.opacity = 0;
        demoCountsContainer.style.transform = 'translateY(-10px)';
        demoCountsContainer.style.display = 'none';
        numScreenshotsInput.value = "2";
        numVideosInput.value = "1";
    }
});

includeDemoCheckbox.addEventListener('change', () => {
    const isChecked = includeDemoCheckbox.checked;
    if (isChecked) {
        demoCountsContainer.style.display = 'flex';
        anime({
            targets: demoCountsContainer,
            opacity: [0, 1],
            translateY: [-10, 0],
            duration: 300,
            easing: 'easeOutQuad'
        });
    } else {
        anime({
            targets: demoCountsContainer,
            opacity: [1, 0],
            translateY: [0, -10],
            duration: 300,
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
    console.log('All cookies:', document.cookie);

    const githubUserCookie = getCookie('github_user');
    console.log('GitHub user cookie:', githubUserCookie);

    if (githubUserCookie) {
        try {
            const userData = JSON.parse(atob(githubUserCookie));
            console.log('Parsed user data:', userData);

            // Accept any valid user data with username and access_token
            if (userData.username && userData.access_token) {
                currentUser = userData;
                showUserProfile(userData);
                console.log('User authenticated successfully:', userData.username);
                return true;
            } else {
                console.log('Invalid user data, missing username or access_token');
                deleteCookie('github_user');
            }
        } catch (e) {
            console.error('Failed to parse user data:', e);
            deleteCookie('github_user');
        }
    }

    console.log('No valid authentication found, showing login button');
    showLoginButton();
    return false;
}

function showUserProfile(userData) {
    currentUser = userData;
    updateNavUserProfile(userData);
}

function showLoginButton() {
    currentUser = null;
    updateNavUserProfile(null);
}

function handleLogin() {
    console.log('Redirecting to GitHub OAuth...');
    window.location.href = '/auth/github';
}

// Global function to match HTML calls
window.handleGitHubLogin = function () {
    console.log('GitHub login clicked - redirecting to GitHub OAuth');
    handleLogin();
};

function handleLogout() {
    console.log('Logging out...');
    deleteCookie('github_user');
    localStorage.removeItem('github_user');
    showLoginButton();
    currentUser = null;
    window.location.href = '/';
}

// Check for successful OAuth callback
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session') === 'success') {
        console.log('OAuth callback successful - session established');
        window.history.replaceState({}, document.title, '/');
        setTimeout(() => {
            checkAuthStatus();
        }, 500);
        return;
    }

    if (urlParams.get('error')) {
        console.error('OAuth callback error:', urlParams.get('error'));
        alert('GitHub login failed. Please try again.');
        window.history.replaceState({}, document.title, '/');
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

    repositoriesGrid.innerHTML = '<div class="loading-state">Loading repositories...</div>';

    try {
        console.log('Fetching repositories for user:', currentUser.username);

        const configResponse = await fetch(`/api/debug-config?t=${Date.now()}`);
        const configData = await configResponse.json();

        if (!configData.github_oauth_configured) {
            repositoriesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚙️</div>
                    <h3>GitHub OAuth Not Configured</h3>
                    <p>To see your real repositories, GitHub OAuth needs to be set up.</p>
                </div>
            `;
            return;
        }

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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
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
                <p>Please try logging out and back in.</p>
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

    historyList.innerHTML = '<div class="loading-state">Loading history...</div>';

    try {
        const githubUserCookie = getCookie('github_user');
        const response = await fetch('/api/history', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-User': githubUserCookie || ''
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        displayHistory(data.history || []);
    } catch (error) {
        console.error('Error loading history:', error);
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h3>Failed to Load History</h3>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

function displayHistory(history) {
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📜</div>
                <h3>No README History</h3>
                <p>You haven't generated any READMEs yet.</p>
                <p>Generate your first README to see it appear here!</p>
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

// Navigation functionality
function toggleNavigation() {
    leftNav.classList.toggle('open');
    document.body.classList.toggle('nav-open');
}

// Global function for HTML onclick (matches the HTML button)
window.toggleNav = function () {
    console.log('toggleNav() called from app.js');
    toggleNavigation();
};

function closeNavigation() {
    leftNav.classList.remove('open');
    document.body.classList.remove('nav-open');
}

// Update user profile display for navigation
function updateNavUserProfile(userData) {
    if (userData) {
        if (navUser) navUser.style.display = 'flex';
        if (navLogin) navLogin.style.display = 'none';
        if (navLogout) navLogout.style.display = 'block';

        const navRepositories = document.getElementById('nav-repositories');
        const navHistory = document.getElementById('nav-history');
        const navProfile = document.getElementById('nav-profile');

        if (navRepositories) navRepositories.style.display = 'flex';
        if (navHistory) navHistory.style.display = 'flex';
        if (navProfile) navProfile.style.display = 'flex';

        if (navUserAvatar && userData.avatar_url) {
            navUserAvatar.src = userData.avatar_url;
        }
        if (navUserName && userData.username) {
            navUserName.textContent = userData.username;
        }
        if (navUserHandle && userData.username) {
            navUserHandle.textContent = `@${userData.username}`;
        }
    } else {
        if (navUser) navUser.style.display = 'none';
        if (navLogin) navLogin.style.display = 'block';
        if (navLogout) navLogout.style.display = 'none';

        const navRepositories = document.getElementById('nav-repositories');
        const navHistory = document.getElementById('nav-history');
        const navProfile = document.getElementById('nav-profile');

        if (navRepositories) navRepositories.style.display = 'none';
        if (navHistory) navHistory.style.display = 'none';
        if (navProfile) navProfile.style.display = 'none';
    }
}

// Initialize navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation...');

    // Navigation toggle button uses onclick in HTML, no need for event listener here

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeNavigation();
        });
    }

    const navHome = document.getElementById('nav-home');
    const navRepositories = document.getElementById('nav-repositories');
    const navHistory = document.getElementById('nav-history');
    const navProfile = document.getElementById('nav-profile');

    if (navHome) {
        navHome.addEventListener('click', () => {
            setView('input');
            closeNavigation();
        });
    }

    if (navRepositories) {
        navRepositories.addEventListener('click', () => {
            setView('repositories');
            loadRepositories();
            closeNavigation();
        });
    }

    if (navHistory) {
        navHistory.addEventListener('click', () => {
            setView('history');
            loadHistory();
            closeNavigation();
        });
    }

    if (navProfile) {
        navProfile.addEventListener('click', () => {
            closeNavigation();
            if (currentUser && currentUser.html_url) {
                window.open(currentUser.html_url, '_blank');
            } else if (currentUser && currentUser.username) {
                window.open(`https://github.com/${currentUser.username}`, '_blank');
            } else {
                alert('Please log in to view your profile');
            }
        });
    }

    if (navLogin) {
        navLogin.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeNavigation();
            console.log('Login button clicked - redirecting to GitHub OAuth');
            window.location.href = '/auth/github';
        });
    }

    if (navLogout) {
        navLogout.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeNavigation();
            handleLogout();
        });
    }

    document.addEventListener('click', (e) => {
        if (leftNav && navToggleBtn &&
            !leftNav.contains(e.target) &&
            !navToggleBtn.contains(e.target)) {
            closeNavigation();
        }
    });

    console.log('Navigation initialized successfully');
}

// --- Core UI Logic Function ---
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

    const timeline = anime.timeline({
        easing: 'easeOutCubic',
        duration: 300,
        complete: () => {
            isAnimating = false;
            currentView = viewName;
            if (viewName === 'loader') {
                animateLoaderIn();
            }
        }
    });

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
            if (viewName === 'input') {
                generateBtn.disabled = false;
                backBtn.classList.remove('visible');
            }
            else if (viewName === 'output') {
                backBtn.classList.add('visible');
            }
            else if (viewName === 'loader') {
                generateBtn.disabled = true;
            }
            else if (viewName === 'repositories' || viewName === 'history') {
                backBtn.classList.add('visible');
            }
        }
    });
}

function animateFormIn() {
    anime.timeline({
        easing: 'easeOutCubic',
        duration: 500
    })
        .add({
            targets: '#repo-form .form-main',
            opacity: [0, 1],
            translateY: [25, 0],
            delay: 75
        })
        .add({
            targets: '#repo-form .form-options .option-row',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(120),
            duration: 400
        }, '-=250');
}

function animateOutputIn() {
    anime({
        targets: '#output-view .pane',
        opacity: [0, 1],
        translateY: [25, 0],
        delay: anime.stagger(180),
        duration: 500,
        easing: 'easeOutCubic'
    });
}

function animateHeaderIn() {
    anime.timeline({
        easing: 'easeOutCubic',
        duration: 400
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
        }, '-=200')
        .add({
            targets: '#back-btn',
            opacity: [0, 1],
            translateX: [20, 0]
        }, '-=150');
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
    if (initialLoadComplete) return;

    handleOAuthCallback();
    checkAuthStatus();

    includeDemoCheckbox.checked = false;

    inputView.style.display = 'flex';
    inputView.style.opacity = 1;
    inputView.style.transform = 'translateY(0px)';

    outputView.style.display = 'none';
    loaderView.style.display = 'none';
    repositoriesView.style.display = 'none';
    historyView.style.display = 'none';

    anime.set('.app-header .title', { opacity: 0, translateY: -20 });
    anime.set('.app-header .subtitle', { opacity: 0, translateY: -20 });
    anime.set('#back-btn', { opacity: 0, translateX: 20 });
    anime.set('#repo-form .form-main', { opacity: 0, translateY: 30 });
    anime.set('#repo-form .form-options .option-row', { opacity: 0, translateY: 20 });

    if (!includeDemoCheckbox.checked) {
        anime.set(demoCountsContainer, { opacity: 0, translateY: -10 });
        demoCountsContainer.style.display = 'none';
    }

    animateFormIn();
    animateHeaderIn();

    initialLoadComplete = true;
}

// Call initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initialize();
        initializeNavigation();
    }, 100);
});