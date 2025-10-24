import os
import json
import base64
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import requests
from dotenv import load_dotenv

load_dotenv()

# GitHub Database configuration
GITHUB_DATA_REPO_OWNER = os.getenv("GITHUB_DATA_REPO_OWNER")
GITHUB_DATA_REPO_NAME = os.getenv("GITHUB_DATA_REPO_NAME")
GITHUB_DATA_TOKEN = os.getenv("GITHUB_DATA_TOKEN")

def get_github_headers():
    """Get GitHub API headers"""
    return {
        'Authorization': f'token {GITHUB_DATA_TOKEN}',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    }

def validate_github_config():
    """Validate GitHub database configuration"""
    if not all([GITHUB_DATA_REPO_OWNER, GITHUB_DATA_REPO_NAME, GITHUB_DATA_TOKEN]):
        print("❌ Missing GitHub database configuration")
        return False
    return True

def generate_session_token() -> str:
    """Generate a secure session token"""
    return secrets.token_urlsafe(32)

def hash_session_token(token: str) -> str:
    """Hash session token for storage"""
    return hashlib.sha256(token.encode()).hexdigest()

def get_user_agent(request_headers: dict) -> str:
    """Extract user agent from request headers"""
    return request_headers.get('user-agent', 'Unknown Browser')

def get_device_info(request_headers: dict) -> dict:
    """Extract device information from request headers"""
    user_agent = get_user_agent(request_headers)
    
    # Simple device detection based on user agent
    device_type = "Desktop"
    if any(mobile in user_agent.lower() for mobile in ['mobile', 'android', 'iphone', 'ipad']):
        device_type = "Mobile"
    
    # Extract browser info
    browser = "Unknown"
    if "Chrome" in user_agent:
        browser = "Chrome"
    elif "Firefox" in user_agent:
        browser = "Firefox"
    elif "Safari" in user_agent and "Chrome" not in user_agent:
        browser = "Safari"
    elif "Edge" in user_agent:
        browser = "Edge"
    
    return {
        "type": device_type,
        "browser": browser,
        "user_agent": user_agent[:100]  # Truncate for storage
    }

def get_user_sessions_file_path(user_id: str) -> str:
    """Get the file path for a user's sessions"""
    return f"sessions/{user_id}/active_sessions.json"

def get_file_from_github(file_path: str) -> Optional[Dict]:
    """Get a file from GitHub repository"""
    if not validate_github_config():
        return None
    
    try:
        url = f"https://api.github.com/repos/{GITHUB_DATA_REPO_OWNER}/{GITHUB_DATA_REPO_NAME}/contents/{file_path}"
        
        response = requests.get(url, headers=get_github_headers())
        
        if response.status_code == 200:
            file_data = response.json()
            content = base64.b64decode(file_data['content']).decode('utf-8')
            parsed_content = json.loads(content)
            return {
                'content': parsed_content,
                'sha': file_data['sha']
            }
        elif response.status_code == 404:
            # File doesn't exist yet
            return {'content': [], 'sha': None}
        else:
            print(f"❌ GitHub API error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error getting file from GitHub: {e}")
        return None

def save_file_to_github(file_path: str, content: str, sha: Optional[str] = None, commit_message: str = "Update sessions") -> bool:
    """Save a file to GitHub repository"""
    if not validate_github_config():
        return False
    
    try:
        url = f"https://api.github.com/repos/{GITHUB_DATA_REPO_OWNER}/{GITHUB_DATA_REPO_NAME}/contents/{file_path}"
        
        data = {
            'message': commit_message,
            'content': base64.b64encode(content.encode('utf-8')).decode('utf-8')
        }
        
        if sha:
            data['sha'] = sha
        
        response = requests.put(url, headers=get_github_headers(), json=data)
        
        if response.status_code in [200, 201]:
            return True
        else:
            print(f"❌ GitHub API error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error saving file to GitHub: {e}")
        return False

def create_user_session(
    user_id: str,
    username: str,
    user_data: dict,
    access_token: str,
    request_headers: dict,
    ip_address: str = None
) -> Tuple[str, bool]:
    """
    Create a new user session
    Returns: (session_token, success)
    """
    if not validate_github_config():
        return None, False
    
    try:
        session_token = generate_session_token()
        session_token_hash = hash_session_token(session_token)
        
        device_info = get_device_info(request_headers)
        
        # Get existing sessions
        file_path = get_user_sessions_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return None, False
        
        sessions_list = file_data['content']
        
        # Create new session entry
        new_session = {
            "session_id": session_token_hash,
            "user_id": str(user_id),
            "username": username,
            "access_token": access_token,
            "user_data": user_data,
            "device_info": device_info,
            "ip_address": ip_address,
            "created_at": datetime.utcnow().isoformat(),
            "last_used": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat(),  # 30 days expiry
            "is_active": True
        }
        
        # Clean up expired sessions before adding new one
        current_time = datetime.utcnow()
        sessions_list = [
            session for session in sessions_list
            if datetime.fromisoformat(session['expires_at']) > current_time
        ]
        
        # Add new session
        sessions_list.append(new_session)
        
        # Keep only last 10 sessions per user
        sessions_list = sorted(sessions_list, key=lambda x: x['created_at'], reverse=True)[:10]
        
        # Save back to GitHub
        success = save_file_to_github(
            file_path,
            json.dumps(sessions_list, indent=2),
            file_data['sha'],
            f"Create new session for {username}"
        )
        
        if success:
            print(f"✅ Created new session for user {username}")
            return session_token, True
        else:
            print(f"❌ Failed to save session for user {username}")
            return None, False
            
    except Exception as e:
        print(f"❌ Error creating user session: {e}")
        import traceback
        traceback.print_exc()
        return None, False

def get_user_session(session_token: str) -> Optional[Dict]:
    """Get user session data by session token"""
    if not validate_github_config():
        return None
    
    try:
        session_token_hash = hash_session_token(session_token)
        
        # We need to search through all user session files
        # For better performance, this could be optimized with a session index
        # For now, we'll return None and require the user_id for lookup
        return None
        
    except Exception as e:
        print(f"❌ Error getting user session: {e}")
        return None

def get_user_session_by_user_id(user_id: str, session_token: str) -> Optional[Dict]:
    """Get user session data by user_id and session token"""
    if not validate_github_config():
        return None
    
    try:
        session_token_hash = hash_session_token(session_token)
        
        file_path = get_user_sessions_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return None
        
        sessions_list = file_data['content']
        
        # Find the session
        for session in sessions_list:
            if session['session_id'] == session_token_hash:
                # Check if session is still valid
                expires_at = datetime.fromisoformat(session['expires_at'])
                if expires_at > datetime.utcnow() and session.get('is_active', True):
                    # Update last used time
                    session['last_used'] = datetime.utcnow().isoformat()
                    
                    # Save updated session
                    save_file_to_github(
                        file_path,
                        json.dumps(sessions_list, indent=2),
                        file_data['sha'],
                        f"Update last used for {session['username']}"
                    )
                    
                    return session
                else:
                    # Session expired or inactive
                    return None
        
        return None
        
    except Exception as e:
        print(f"❌ Error getting user session: {e}")
        return None

def get_all_user_sessions(user_id: str) -> List[Dict]:
    """Get all active sessions for a user"""
    if not validate_github_config():
        return []
    
    try:
        file_path = get_user_sessions_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return []
        
        sessions_list = file_data['content']
        
        # Filter active and non-expired sessions
        current_time = datetime.utcnow()
        active_sessions = []
        
        for session in sessions_list:
            expires_at = datetime.fromisoformat(session['expires_at'])
            if expires_at > current_time and session.get('is_active', True):
                # Remove sensitive data for listing
                session_info = {
                    'session_id': session['session_id'][:8] + '...',  # Truncated for display
                    'device_info': session['device_info'],
                    'ip_address': session.get('ip_address', 'Unknown'),
                    'created_at': session['created_at'],
                    'last_used': session['last_used'],
                    'expires_at': session['expires_at']
                }
                active_sessions.append(session_info)
        
        return active_sessions
        
    except Exception as e:
        print(f"❌ Error getting user sessions: {e}")
        return []

def revoke_session(user_id: str, session_token_hash: str) -> bool:
    """Revoke a specific user session"""
    if not validate_github_config():
        return False
    
    try:
        file_path = get_user_sessions_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return False
        
        sessions_list = file_data['content']
        
        # Find and deactivate the session
        session_found = False
        for session in sessions_list:
            if session['session_id'] == session_token_hash:
                session['is_active'] = False
                session['revoked_at'] = datetime.utcnow().isoformat()
                session_found = True
                break
        
        if not session_found:
            return False
        
        # Save back to GitHub
        success = save_file_to_github(
            file_path,
            json.dumps(sessions_list, indent=2),
            file_data['sha'],
            f"Revoke session for user {user_id}"
        )
        
        return success
        
    except Exception as e:
        print(f"❌ Error revoking session: {e}")
        return False

def revoke_all_user_sessions(user_id: str, except_session: str = None) -> bool:
    """Revoke all sessions for a user, optionally except one"""
    if not validate_github_config():
        return False
    
    try:
        file_path = get_user_sessions_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return False
        
        sessions_list = file_data['content']
        
        # Deactivate all sessions except the specified one
        for session in sessions_list:
            if except_session and session['session_id'] == except_session:
                continue  # Skip this session
            
            if session.get('is_active', True):
                session['is_active'] = False
                session['revoked_at'] = datetime.utcnow().isoformat()
        
        # Save back to GitHub
        success = save_file_to_github(
            file_path,
            json.dumps(sessions_list, indent=2),
            file_data['sha'],
            f"Revoke all sessions for user {user_id}"
        )
        
        return success
        
    except Exception as e:
        print(f"❌ Error revoking all sessions: {e}")
        return False

def cleanup_expired_sessions(user_id: str) -> bool:
    """Clean up expired sessions for a user"""
    if not validate_github_config():
        return False
    
    try:
        file_path = get_user_sessions_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return False
        
        sessions_list = file_data['content']
        
        # Remove expired sessions
        current_time = datetime.utcnow()
        active_sessions = [
            session for session in sessions_list
            if datetime.fromisoformat(session['expires_at']) > current_time
        ]
        
        if len(active_sessions) != len(sessions_list):
            # Save cleaned up sessions
            success = save_file_to_github(
                file_path,
                json.dumps(active_sessions, indent=2),
                file_data['sha'],
                f"Cleanup expired sessions for user {user_id}"
            )
            
            print(f"✅ Cleaned up {len(sessions_list) - len(active_sessions)} expired sessions")
            return success
        
        return True
        
    except Exception as e:
        print(f"❌ Error cleaning up sessions: {e}")
        return False