import os
import json
import base64
from datetime import datetime
from typing import List, Dict, Optional
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

def get_user_file_path(user_id: str) -> str:
    """Get the file path for a user's history"""
    return f"users/{user_id}/history.json"

def get_file_from_github(file_path: str) -> Optional[Dict]:
    """Get a file from GitHub repository"""
    if not validate_github_config():
        print("❌ GitHub config validation failed in get_file_from_github")
        return None
    
    try:
        url = f"https://api.github.com/repos/{GITHUB_DATA_REPO_OWNER}/{GITHUB_DATA_REPO_NAME}/contents/{file_path}"
        print(f"🌐 GitHub API URL: {url}")
        
        response = requests.get(url, headers=get_github_headers())
        print(f"📡 GitHub API response: {response.status_code}")
        
        if response.status_code == 200:
            file_data = response.json()
            content = base64.b64decode(file_data['content']).decode('utf-8')
            parsed_content = json.loads(content)
            print(f"✅ Successfully retrieved file with {len(parsed_content)} items")
            return {
                'content': parsed_content,
                'sha': file_data['sha']
            }
        elif response.status_code == 404:
            # File doesn't exist yet - create empty history
            print("📝 File doesn't exist yet, creating empty history")
            return {'content': [], 'sha': None}
        else:
            print(f"❌ GitHub API error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error getting file from GitHub: {e}")
        import traceback
        traceback.print_exc()
        return None

def save_file_to_github(file_path: str, content: str, sha: Optional[str] = None, commit_message: str = "Update history") -> bool:
    """Save a file to GitHub repository"""
    if not validate_github_config():
        print("❌ GitHub config validation failed in save_file_to_github")
        return False
    
    try:
        url = f"https://api.github.com/repos/{GITHUB_DATA_REPO_OWNER}/{GITHUB_DATA_REPO_NAME}/contents/{file_path}"
        print(f"🌐 Saving to GitHub URL: {url}")
        
        data = {
            'message': commit_message,
            'content': base64.b64encode(content.encode('utf-8')).decode('utf-8')
        }
        
        if sha:
            data['sha'] = sha
            print(f"📝 Using existing SHA: {sha}")
        else:
            print("📝 Creating new file (no SHA)")
        
        response = requests.put(url, headers=get_github_headers(), json=data)
        print(f"📡 GitHub save response: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print(f"✅ Successfully saved file to GitHub: {file_path}")
            return True
        else:
            print(f"❌ GitHub API error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error saving file to GitHub: {e}")
        import traceback
        traceback.print_exc()
        return False

def create_history_repository():
    """Ensure the GitHub repository exists and is accessible"""
    if not validate_github_config():
        return False
    
    try:
        # Test repository access
        url = f"https://api.github.com/repos/{GITHUB_DATA_REPO_OWNER}/{GITHUB_DATA_REPO_NAME}"
        response = requests.get(url, headers=get_github_headers())
        
        if response.status_code == 200:
            print("✅ GitHub repository is accessible")
            return True
        else:
            print(f"❌ Cannot access GitHub repository: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error checking GitHub repository: {e}")
        return False

def save_readme_history(
    user_id: str,
    username: str,
    repository_url: str,
    repository_name: str,
    readme_content: str,
    project_name: Optional[str] = None,
    generation_params: Optional[Dict] = None
) -> bool:
    """Save README generation to history"""
    print(f"🔄 Starting to save history for user {user_id}")
    
    if not validate_github_config():
        print("❌ GitHub configuration validation failed")
        return False
    
    try:
        # Get existing user history
        file_path = get_user_file_path(user_id)
        print(f"📁 File path: {file_path}")
        
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            print("❌ Failed to get file data from GitHub")
            return False
        
        history_list = file_data['content']
        print(f"📊 Current history count: {len(history_list)}")
        
        # Create new history entry
        new_entry = {
            "id": f"{user_id}_{int(datetime.utcnow().timestamp())}",
            "user_id": str(user_id),
            "username": username,
            "repository_url": repository_url,
            "repository_name": repository_name,
            "project_name": project_name,
            "readme_content": readme_content,
            "generation_params": generation_params or {},
            "created_at": datetime.utcnow().isoformat()
        }
        
        print(f"📝 Created new entry with ID: {new_entry['id']}")
        
        # Add to beginning of list (most recent first)
        history_list.insert(0, new_entry)
        
        # Keep only last 50 entries to avoid file getting too large
        history_list = history_list[:50]
        
        # Save back to GitHub
        print(f"💾 Saving to GitHub with SHA: {file_data.get('sha', 'None')}")
        success = save_file_to_github(
            file_path,
            json.dumps(history_list, indent=2),
            file_data['sha'],
            f"Add README history for {username}/{repository_name}"
        )
        
        if success:
            print(f"✅ Saved README history for {username}/{repository_name}")
        else:
            print(f"❌ Failed to save to GitHub for {username}/{repository_name}")
        
        return success
            
    except Exception as e:
        print(f"❌ Error saving README history: {e}")
        import traceback
        traceback.print_exc()
        return False

def get_user_history(user_id: str, limit: int = 50) -> List[Dict]:
    """Get README generation history for a user"""
    if not validate_github_config():
        return []
    
    try:
        file_path = get_user_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return []
        
        history_list = file_data['content']
        
        # Apply limit
        limited_history = history_list[:limit] if len(history_list) > limit else history_list
        
        print(f"✅ Retrieved {len(limited_history)} history items for user {user_id}")
        return limited_history
            
    except Exception as e:
        print(f"❌ Error retrieving user history: {e}")
        return []

def get_history_item(history_id: str, user_id: str) -> Optional[Dict]:
    """Get a specific history item"""
    if not validate_github_config():
        return None
    
    try:
        file_path = get_user_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return None
        
        history_list = file_data['content']
        
        # Find the specific item
        for item in history_list:
            if item.get('id') == history_id:
                print(f"✅ Retrieved history item {history_id}")
                return item
        
        print(f"❌ History item {history_id} not found")
        return None
            
    except Exception as e:
        print(f"❌ Error retrieving history item: {e}")
        return None

def delete_history_item(history_id: str, user_id: str) -> bool:
    """Delete a specific history item"""
    if not validate_github_config():
        return False
    
    try:
        file_path = get_user_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return False
        
        history_list = file_data['content']
        
        # Find and remove the item
        original_length = len(history_list)
        history_list = [item for item in history_list if item.get('id') != history_id]
        
        if len(history_list) == original_length:
            print(f"❌ History item {history_id} not found")
            return False
        
        # Save back to GitHub
        success = save_file_to_github(
            file_path,
            json.dumps(history_list, indent=2),
            file_data['sha'],
            f"Delete history item {history_id}"
        )
        
        if success:
            print(f"✅ Deleted history item {history_id}")
        
        return success
            
    except Exception as e:
        print(f"❌ Error deleting history item: {e}")
        return False

def update_history_item(
    history_id: str,
    user_id: str,
    readme_content: str,
    project_name: Optional[str] = None
) -> bool:
    """Update an existing history item"""
    if not validate_github_config():
        return False
    
    try:
        file_path = get_user_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            return False
        
        history_list = file_data['content']
        
        # Find and update the item
        item_found = False
        for item in history_list:
            if item.get('id') == history_id:
                item['readme_content'] = readme_content
                if project_name is not None:
                    item['project_name'] = project_name
                item_found = True
                break
        
        if not item_found:
            print(f"❌ History item {history_id} not found")
            return False
        
        # Save back to GitHub
        success = save_file_to_github(
            file_path,
            json.dumps(history_list, indent=2),
            file_data['sha'],
            f"Update history item {history_id}"
        )
        
        if success:
            print(f"✅ Updated history item {history_id}")
        
        return success
            
    except Exception as e:
        print(f"❌ Error updating history item: {e}")
        return False

def delete_all_user_history(user_id: str) -> bool:
    """Delete all history for a user"""
    if not validate_github_config():
        return False
    
    try:
        file_path = get_user_file_path(user_id)
        file_data = get_file_from_github(file_path)
        
        if file_data is None:
            # No history exists, consider it successful
            print(f"✅ No history found for user {user_id}, nothing to delete")
            return True
        
        # Clear the history by saving an empty list
        success = save_file_to_github(
            file_path,
            json.dumps([], indent=2),
            file_data['sha'],
            f"Delete all history for user {user_id}"
        )
        
        if success:
            print(f"✅ Deleted all history for user {user_id}")
        else:
            print(f"❌ Failed to delete history for user {user_id}")
        
        return success
            
    except Exception as e:
        print(f"❌ Error deleting all user history: {e}")
        return False