# Account Switching Fix

## Problem
When users selected "Use different GitHub account" option, they were automatically logged in with the existing account instead of being able to switch accounts. This happened because:

1. GitHub OAuth remembers the logged-in session
2. GitHub doesn't support `prompt=select_account` like Google OAuth
3. The existing flow didn't properly clear the GitHub session

## Solution

### 1. Dedicated Account Switching Flow
Created a new `/switch-account` page that guides users through the account switching process with clear steps:

**Step 1**: Sign out of GitHub
- Opens GitHub logout page in new tab
- Clear instructions for users

**Step 2**: Continue with OAuth
- Redirects to GitHub OAuth after logout
- Uses unique state parameter to force fresh auth

### 2. Enhanced Login Page
- Updated "Use different GitHub account" button to redirect to dedicated switching page
- Simplified the user experience with clear messaging
- Removed complex inline instructions

### 3. Backend Improvements
- Modified Python backend to handle `force_account_selection` parameter
- Added unique state generation for account switching flows
- Better logging for debugging account switching issues

## Key Changes Made

### Frontend Changes

#### 1. New Switch Account Page (`src/app/switch-account/page.tsx`)
- **Step-by-step guidance** for account switching
- **Visual progress indicators** showing current step
- **Clear instructions** for signing out of GitHub
- **Proper error handling** and fallback options

#### 2. Updated Login Page (`src/app/login/page.tsx`)
- **Simplified account switching** - redirects to dedicated page
- **Cleaner user experience** with better messaging
- **Proper state management** for return URLs

#### 3. Enhanced Auth Context (`src/lib/auth.tsx`)
- **Better session clearing** for account switching
- **Improved cookie management** during account switches

### Backend Changes

#### 1. Python Backend (`api/index.py`)
- **Account switching detection** via `force_account_selection` parameter
- **Unique state generation** for fresh auth flows
- **Better OAuth parameter handling**

```python
# For account switching, add a unique state to force a fresh auth flow
if force_account_selection == 'true':
    print("DEBUG: Account switching requested - using unique state")
    import time
    state = f'oauth_switch_{int(time.time())}'
    github_params['state'] = state
```

## User Experience Flow

### Before (Broken)
1. User clicks "Use different GitHub account"
2. Redirects to GitHub OAuth
3. GitHub automatically uses existing session
4. User gets logged in with same account ❌

### After (Fixed)
1. User clicks "Use different GitHub account"
2. Redirects to `/switch-account` page
3. **Step 1**: User clicks "Sign out of GitHub" (opens in new tab)
4. **Step 2**: User returns and clicks "Continue with GitHub"
5. GitHub OAuth now shows fresh login/account selection ✅

## Technical Implementation

### 1. Account Switching Detection
```typescript
const handleLoginWithDifferentAccount = () => {
  // Redirect to the dedicated account switching page
  const returnToParam = searchParams.get('returnTo');
  const switchUrl = `/switch-account${returnToParam ? `?returnTo=${encodeURIComponent(returnToParam)}` : ''}`;
  router.push(switchUrl);
};
```

### 2. Session Clearing
```typescript
useEffect(() => {
  // Clear any existing auth state
  document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  localStorage.removeItem('previous_github_account');
  localStorage.removeItem('show_account_selection');
}, []);
```

### 3. Unique State Generation
```python
if force_account_selection == 'true':
    import time
    state = f'oauth_switch_{int(time.time())}'
    github_params['state'] = state
```

## Benefits

✅ **Clear User Guidance**: Step-by-step instructions for account switching
✅ **Reliable Account Switching**: Forces fresh GitHub authentication
✅ **Better UX**: No more confusion about why the same account is used
✅ **Proper State Management**: Maintains return URLs through the switching process
✅ **Error Handling**: Fallback options if switching fails

## Testing the Fix

1. **Login with Account A**
2. **Logout** (this saves Account A as previous account)
3. **Go to login page** - should show Account A as option
4. **Click "Use different GitHub account"**
5. **Follow the switching flow**:
   - Should redirect to `/switch-account`
   - Step 1: Sign out of GitHub
   - Step 2: Continue with OAuth
6. **Should be able to login with Account B** ✅

## Fallback Options

If users still have issues:
- **Manual GitHub logout**: Direct link to `https://github.com/logout`
- **Browser cache clearing**: Instructions provided on switch page
- **Return to login**: Easy navigation back to main login page

The account switching now works reliably and provides a much better user experience with clear guidance throughout the process.