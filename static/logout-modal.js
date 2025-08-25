// Logout Modal functionality

let logoutModalInstance = null;

function createLogoutModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('logout-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'logout-modal';
    modal.className = 'logout-modal-overlay';
    modal.innerHTML = `
        <div class="logout-modal">
            <div class="logout-modal-header">
                <div class="logout-modal-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                </div>
                <h3>Sign Out Confirmation</h3>
                <p>Are you sure you want to sign out?</p>
            </div>
            
            <div class="logout-modal-body">
                <div class="logout-info-card">
                    <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div class="info-content">
                        <h4>Quick Login Next Time</h4>
                        <p>We'll remember your account and give you the option to continue with it or use a different GitHub account when you log back in.</p>
                    </div>
                </div>
            </div>
            
            <div class="logout-modal-actions">
                <button class="logout-cancel-btn" onclick="closeLogoutModal()">
                    <span>Cancel</span>
                </button>
                <button class="logout-confirm-btn" onclick="confirmLogout()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    logoutModalInstance = modal;

    // Add animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLogoutModal();
        }
    });

    // Close on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeLogoutModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    return modal;
}

function showLogoutModal() {
    console.log('🚪 Showing logout modal...');
    
    // Close any open dropdowns first
    const dropdown = document.getElementById('user-dropdown');
    const trigger = document.querySelector('.user-profile-trigger');
    if (dropdown && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        if (trigger) trigger.classList.remove('active');
    }

    createLogoutModal();
}

function closeLogoutModal() {
    console.log('❌ Closing logout modal...');
    
    if (logoutModalInstance) {
        logoutModalInstance.classList.remove('show');
        setTimeout(() => {
            if (logoutModalInstance && logoutModalInstance.parentNode) {
                logoutModalInstance.parentNode.removeChild(logoutModalInstance);
            }
            logoutModalInstance = null;
        }, 300);
    }
}

function confirmLogout() {
    console.log('✅ Logout confirmed by user');
    
    closeLogoutModal();
    
    // Store current user info for account selection
    if (currentUser) {
        const accountInfo = {
            username: currentUser.username,
            name: currentUser.name || currentUser.username,
            avatar_url: currentUser.avatar_url,
            email: currentUser.email
        };
        
        try {
            localStorage.setItem('previous_github_account', JSON.stringify(accountInfo));
            console.log('💾 Stored previous account info for next login');
        } catch (error) {
            console.error('❌ Failed to store account info:', error);
        }
    }
    
    // Set a flag to show account selection on next login
    localStorage.setItem('show_account_selection', 'true');
    
    // Perform the actual logout and redirect to account selection
    performLogoutAndRedirect();
}

// New function that performs logout and immediately redirects to account selection
async function performLogoutAndRedirect() {
    console.log('🚪 Performing logout and redirecting to account selection...');

    try {
        // Make server request to clear server-side cookies
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Server-side logout successful');
        } else {
            console.warn('⚠️ Server-side logout failed, proceeding with client-side cleanup');
        }
    } catch (error) {
        console.warn('⚠️ Server logout request failed:', error, 'proceeding with client-side cleanup');
    }

    // Clear all user data
    currentUser = null;

    // Delete all possible cookies
    deleteCookie('github_user');
    deleteCookie('session');
    deleteCookie('auth_token');

    // Clear localStorage and sessionStorage (except previous_github_account)
    try {
        const previousAccount = localStorage.getItem('previous_github_account');
        
        localStorage.clear();
        sessionStorage.clear();
        
        // Restore the account selection data
        if (previousAccount) {
            localStorage.setItem('previous_github_account', previousAccount);
        }
        // Always set the flag to show account selection after logout
        localStorage.setItem('show_account_selection', 'true');
        
        console.log('🗑️ Cleared storage (preserved account selection data)');
    } catch (e) {
        console.log('⚠️ Could not clear storage:', e);
    }

    // Show success notification
    console.log('✅ User logged out successfully, redirecting to account selection');
    
    // Immediately redirect to account selection page
    setTimeout(() => {
        window.location.href = '/auth/select-account';
    }, 500); // Small delay to ensure cleanup is complete
}

// Keep the original performLogout for backward compatibility
async function performLogout() {
    console.log('🚪 Performing logout...');

    try {
        // Make server request to clear server-side cookies
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Server-side logout successful');
        } else {
            console.warn('⚠️ Server-side logout failed, proceeding with client-side cleanup');
        }
    } catch (error) {
        console.warn('⚠️ Server logout request failed:', error, 'proceeding with client-side cleanup');
    }

    // Clear all user data
    currentUser = null;

    // Delete all possible cookies
    deleteCookie('github_user');
    deleteCookie('session');
    deleteCookie('auth_token');

    // Clear localStorage and sessionStorage (except previous_github_account)
    try {
        const previousAccount = localStorage.getItem('previous_github_account');
        const showAccountSelection = localStorage.getItem('show_account_selection');
        
        localStorage.clear();
        sessionStorage.clear();
        
        // Restore the account selection flags
        if (previousAccount) {
            localStorage.setItem('previous_github_account', previousAccount);
        }
        if (showAccountSelection) {
            localStorage.setItem('show_account_selection', showAccountSelection);
        }
        
        console.log('🗑️ Cleared storage (preserved account selection data)');
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
    
    // Show a subtle notification
    showLogoutNotification();

    // Optional: Redirect to clear any URL parameters
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function showLogoutNotification() {
    // Create a subtle notification
    const notification = document.createElement('div');
    notification.className = 'logout-notification';
    notification.innerHTML = `
        <div class="logout-notification-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Signed out successfully</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Enhanced login function to check for account selection
function enhancedLogin() {
    console.log('🔐 Enhanced login initiated...');
    
    // Check if we should show account selection
    const showAccountSelection = localStorage.getItem('show_account_selection');
    const previousAccount = localStorage.getItem('previous_github_account');
    
    if (showAccountSelection === 'true' && previousAccount) {
        console.log('🔄 Redirecting to account selection page...');
        localStorage.removeItem('show_account_selection');
        window.location.href = '/auth/select-account';
    } else {
        console.log('🚀 Proceeding to direct GitHub login...');
        window.location.href = '/api/auth/github';
    }
}

// Update the existing handleLogout function to use the modal
function handleLogout() {
    showLogoutModal();
}

// Update login handlers to use enhanced login
function handleGitHubLogin() {
    enhancedLogin();
}

// Make functions globally available
window.showLogoutModal = showLogoutModal;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
window.enhancedLogin = enhancedLogin;
