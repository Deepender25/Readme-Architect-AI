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
let animationTimeout;
// === START OF CHANGES ===
// A cooler, more engaging set of messages for the new animation.
const loadingMessages = [
    'Warming up the AI brain cells',
    'Analyzing repository structure',
    'Deconstructing code logic',
    'Consulting with digital scribes',
    'Synthesizing documentation',
    'Polishing the final draft'
];
// === END OF CHANGES ===

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

// === START OF CHANGES ===
// --- NEW INTUITIVE & COOLER LOADER ANIMATION ---
// This function now creates an animated ellipsis and cycles through messages indefinitely.
function startLoaderAnimation() {
    let messageIndex = 0;
    let dotCount = 1;

    function updateLoader() {
        // This creates a "message..." effect that updates every 500ms.
        const baseMessage = loadingMessages[messageIndex];
        loaderText.textContent = baseMessage + '.'.repeat(dotCount);
        
        dotCount++;
        // When the dots reach 4, we reset them and move to the next message.
        if (dotCount > 3) {
            dotCount = 1;
            // The modulo operator (%) makes the message list loop forever.
            messageIndex = (messageIndex + 1) % loadingMessages.length;
        }

        // Set the next timeout in the chain, ensuring it can be cleared later.
        animationTimeout = setTimeout(updateLoader, 500);
    }
    
    updateLoader(); // Start the animation sequence
}
// === END OF CHANGES ===


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