// static/app.js

// --- DOM Elements ---
const form = document.getElementById('repo-form');
const repoUrlInput = document.getElementById('repo-url');
const generateBtn = document.getElementById('generate-btn');
const backBtn = document.getElementById('back-btn');

const inputView = document.getElementById('input-view');
const outputView = document.getElementById('output-view');
const loaderView = document.getElementById('loader-view');
const loaderText = document.getElementById('loader-text');

const codeView = document.getElementById('code-view');
const previewContent = document.getElementById('preview-content');
const copyBtn = document.getElementById('copy-btn');

// --- Loading state variables ---
let loaderInterval;
const loadingMessages = [
    'Analyzing repository structure...',
    'Identifying key files and dependencies...',
    'Crafting the prompt for Gemini...',
    'Writing documentation...',
    'Polishing the final draft...'
];

// --- Event Listeners ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const repoUrl = repoUrlInput.value;
    if (!repoUrl) return;

    setView('loader');
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repo_url: repoUrl })
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
});

// --- Core UI Logic Function ---
function setView(viewName) {
    generateBtn.disabled = true;

    // Hide all views first
    inputView.style.display = 'none';
    outputView.style.display = 'none';
    loaderView.style.display = 'none';
    backBtn.classList.remove('visible');

    clearInterval(loaderInterval);

    // Show the requested view by setting its display property to 'flex'
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
    let messageIndex = 0;
    loaderText.textContent = loadingMessages[messageIndex];
    loaderInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loaderText.textContent = loadingMessages[messageIndex];
    }, 2500);
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

// Initialize the app with the correct starting view
setView('input');