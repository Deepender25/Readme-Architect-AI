// static/app.js

// --- DOM Elements ---
const form = document.getElementById('repo-form');
const repoUrlInput = document.getElementById('repo-url');
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

// --- Loading state variables ---
let animationTimeout;
// === START OF CHANGES: New Loading Messages ===
const loadingMessages = [
    'Connecting to GitHub...',
    'Cloning repository blueprints...',
    'Analyzing file structure...',
    'Parsing commit history...',
    'Inspecting code dependencies...',
    'Assembling documentation...'
];
// === END OF CHANGES ===

// --- Event Listeners ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const repoUrl = repoUrlInput.value;
    if (!repoUrl) return;

    setView('loader');
    
    const requestBody = {
        repo_url: repoUrl,
        include_demo: includeDemoCheckbox.checked,
        num_screenshots: parseInt(numScreenshotsInput.value, 10) || 0,
        num_videos: parseInt(numVideosInput.value, 10) || 0,
    };

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'An unknown error occurred.');
        
        codeView.textContent = data.readme;
        previewContent.innerHTML = marked.parse(data.readme);
        hljs.highlightElement(codeView);
        
        setView('output');

    } catch (error) {
        previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Generation Failed</h3><p>${error.message}</p></div>`;
        codeView.textContent = `/*\n  Error: ${error.message}\n*/`;
        hljs.highlightElement(codeView);
        setView('output');
    }
});

backBtn.addEventListener('click', () => {
    setView('input');
    repoUrlInput.value = '';
    includeDemoCheckbox.checked = false;
    demoCountsContainer.style.display = 'none';
});

includeDemoCheckbox.addEventListener('change', () => {
    demoCountsContainer.style.display = includeDemoCheckbox.checked ? 'flex' : 'none';
});

// --- Core UI Logic Function ---
function setView(viewName) {
    generateBtn.disabled = true;
    inputView.style.display = 'none';
    outputView.style.display = 'none';
    loaderView.style.display = 'none';
    backBtn.classList.remove('visible');
    clearTimeout(animationTimeout);

    if (viewName === 'input') {
        inputView.style.display = 'flex';
        generateBtn.disabled = false;
    } else if (viewName === 'output') {
        outputView.style.display = 'flex';
        backBtn.classList.add('visible');
    } else if (viewName === 'loader') {
        loaderView.style.display = 'flex';
        startLoaderAnimation();
    }
}

function startLoaderAnimation() {
    let messageIndex = 0, dotCount = 1;
    function updateLoader() {
        const baseMessage = loadingMessages[messageIndex];
        loaderText.textContent = baseMessage + '.'.repeat(dotCount);
        dotCount++;
        if (dotCount > 3) {
            dotCount = 1;
            messageIndex = (messageIndex + 1) % loadingMessages.length;
        }
        animationTimeout = setTimeout(updateLoader, 600); // Slightly slower for readability
    }
    updateLoader();
}

function copyCode() {
    navigator.clipboard.writeText(codeView.textContent).then(() => {
        const originalText = copyBtn.querySelector('span').textContent;
        copyBtn.querySelector('span').textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.querySelector('span').textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Failed to copy text.');
    });
}

// Initialize
setView('input');