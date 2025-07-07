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
    updateLoaderText(); // Initial call for loader text

    const params = new URLSearchParams({
        repo_url: repoUrl,
        project_name: projectNameInput.value.trim(),
        include_demo: includeDemoCheckbox.checked,
        num_screenshots: parseInt(numScreenshotsInput.value, 10) || 0,
        num_videos: parseInt(numVideosInput.value, 10) || 0,
    });

    const eventSource = new EventSource(`/api/generate?${params.toString()}`);

    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.status) {
            loaderText.textContent = data.status; // Use status from backend if available
        } else if (data.readme) {
            codeView.textContent = data.readme;
            previewContent.innerHTML = marked.parse(data.readme);
            hljs.highlightAll();
            setView('output');
            animateOutputIn(); // Animate output when content is ready
            eventSource.close();
        } else if (data.error) {
            previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Generation Failed</h3><p>${data.error}</p></div>`;
            codeView.textContent = `/*\n  Error: ${data.error}\n*/`;
            hljs.highlightAll();
            setView('output');
            eventSource.close();
        }
    };

    eventSource.onerror = function(err) {
        console.error("EventSource failed:", err);
        previewContent.innerHTML = `<div style="color: #ff8a8a; padding: 20px;"><h3>Connection Error</h3><p>Could not connect to the server. Please try again later.</p></div>`;
        codeView.textContent = `/*\n  Error: Connection failed.\n*/`;
        hljs.highlightAll();
        setView('output');
        eventSource.close();
    };
});

backBtn.addEventListener('click', () => {
    if (isAnimating) return;
    setView('input');
    repoUrlInput.value = '';
    projectNameInput.value = '';
    includeDemoCheckbox.checked = false;
    demoCountsContainer.style.opacity = 0;
    demoCountsContainer.style.transform = 'translateY(-10px)';
    numScreenshotsInput.value = "2";
    numVideosInput.value = "1";
});

includeDemoCheckbox.addEventListener('change', () => {
    const isChecked = includeDemoCheckbox.checked;
    if (isChecked) {
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
        const originalText = copyBtn.querySelector('span').textContent;
        if (originalText === 'Copied!') return;

        copyBtn.querySelector('span').textContent = 'Copied!';
        anime({
            targets: copyBtn,
            scale: [1, 1.05, 1],
            duration: 150,
            easing: 'easeOutCubic'
        });

        setTimeout(() => {
            copyBtn.querySelector('span').textContent = originalText;
        }, 1000);
    }).catch(err => {
        alert('Failed to copy text.');
    });
}

// Initialize
function initialize() {
    if (initialLoadComplete) return; // Prevent re-initialization

    // Ensure inputView is visible and opaque initially
    inputView.style.display = 'flex';
    inputView.style.opacity = 1;
    inputView.style.transform = 'translateY(0px)';

    // Set other views to hidden
    outputView.style.display = 'none';
    loaderView.style.display = 'none';
    
    // Set initial states for animation targets to ensure they animate in from 0 opacity
    anime.set('.app-header .title', { opacity: 0, translateY: -20 });
    anime.set('.app-header .subtitle', { opacity: 0, translateY: -20 });
    anime.set('#back-btn', { opacity: 0, translateX: 20 });
    anime.set('#repo-form .form-main', { opacity: 0, translateY: 30 });
    anime.set('#repo-form .form-options .option-row', { opacity: 0, translateY: 20 });
    if (!includeDemoCheckbox.checked) {
        anime.set(demoCountsContainer, { opacity: 0, translateY: -10 });
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
document.addEventListener('DOMContentLoaded', initialize);

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