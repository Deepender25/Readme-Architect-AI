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
// We keep this array for the new animation function
let animationTimeout;
const loadingMessages = [
    'Cloning repository...',
    'Analyzing codebase...',
    'Preparing context for AI...',
    'Generating README sections in parallel...',
    'This may take a moment...'
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

    inputView.style.display = 'none';
    outputView.style.display = 'none';
    loaderView.style.display = 'none';
    backBtn.classList.remove('visible');

    // Clear any pending animation timeouts
    clearTimeout(animationTimeout);

    if (viewName === 'input') {
        inputView.style.display = 'flex';
        generateBtn.disabled = false;
    } else if (viewName === 'output') {
        outputView.style.display = 'flex';
        backBtn.classList.add('visible');
    } else if (viewName === 'loader') {
        loaderView.style.display = 'flex';
        startLoaderAnimation(); // Call the new animation function
    }
}

// --- NEW REALISTIC LOADER ANIMATION ---
function startLoaderAnimation() {
    let messageIndex = 0;
    
    function updateMessage() {
        if (messageIndex < loadingMessages.length) {
            loaderText.textContent = loadingMessages[messageIndex];
            messageIndex++;
            // Set the next timeout for the next message
            animationTimeout = setTimeout(updateMessage, 2000); // Progress every 2 seconds
        }
        // The animation stops naturally after the last message
    }
    
    updateMessage(); // Start the sequence
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