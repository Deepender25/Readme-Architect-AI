import smtplib
import os
import json
import traceback
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class ErrorNotifier:
    """Centralized error handling and email notification system"""
    
    def __init__(self):
        self.email_user = os.getenv('EMAIL_USER')
        self.email_pass = os.getenv('EMAIL_PASS')
        self.notification_email = os.getenv('ERROR_NOTIFICATION_EMAIL', self.email_user)
        self.app_name = "AutoDoc AI README Generator"
        
    def is_configured(self):
        """Check if email configuration is available"""
        return bool(self.email_user and self.email_pass)
    
    def log_and_notify_error(self, error_type, error_message, context=None, user_info=None):
        """Log error and send email notification"""
        error_details = {
            'timestamp': datetime.now().isoformat(),
            'error_type': error_type,
            'error_message': str(error_message),
            'context': context or {},
            'user_info': user_info or {},
            'traceback': traceback.format_exc() if hasattr(error_message, '__traceback__') else None
        }
        
        # Log to console
        print(f"🚨 ERROR LOGGED: {error_type}")
        print(f"📝 Message: {error_message}")
        print(f"🔍 Context: {json.dumps(context, indent=2) if context else 'None'}")
        
        # Send email notification if configured
        if self.is_configured():
            try:
                self.send_error_email(error_details)
                print("📧 Error notification email sent successfully")
            except Exception as e:
                print(f"❌ Failed to send error notification email: {e}")
        else:
            print("⚠️ Email not configured - notification not sent")
    
    def send_error_email(self, error_details):
        """Send error notification email"""
        subject = f"🚨 {self.app_name} - Error Alert"
        
        # Create HTML email content
        html_content = self.create_error_email_html(error_details)
        
        # Create text content
        text_content = self.create_error_email_text(error_details)
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f'"{self.app_name} Error Monitor" <{self.email_user}>'
        msg['To'] = self.notification_email
        msg['Subject'] = subject
        
        # Attach parts
        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))
        
        # Send email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(self.email_user, self.email_pass)
            server.send_message(msg)
    
    def create_error_email_html(self, error_details):
        """Create HTML content for error notification email"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Error Alert - {self.app_name}</title>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }}
                .container {{ max-width: 700px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }}
                .header {{ background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }}
                .alert-box {{ background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 8px; margin-bottom: 20px; }}
                .error-details {{ background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #dc3545; }}
                .context-box {{ background: #e7f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff; }}
                .field {{ margin-bottom: 15px; }}
                .field-label {{ font-weight: bold; color: #dc3545; display: block; margin-bottom: 5px; }}
                .field-value {{ background: white; padding: 10px; border-radius: 5px; border: 1px solid #ddd; }}
                .traceback {{ background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; white-space: pre-wrap; }}
                .timestamp {{ color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚨 Error Alert</h1>
                    <p>{self.app_name}</p>
                </div>
                
                <div class="alert-box">
                    <strong>⚠️ An error occurred in your web application!</strong><br>
                    Please review the details below and take appropriate action.
                </div>
                
                <div class="error-details">
                    <div class="field">
                        <span class="field-label">🕐 Timestamp:</span>
                        <div class="field-value timestamp">{error_details['timestamp']}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">🔥 Error Type:</span>
                        <div class="field-value">{error_details['error_type']}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">💬 Error Message:</span>
                        <div class="field-value">{error_details['error_message']}</div>
                    </div>
                </div>
                
                {self.format_context_section(error_details.get('context', {}))}
                {self.format_user_info_section(error_details.get('user_info', {}))}
                {self.format_traceback_section(error_details.get('traceback'))}
                
                <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                    <p>This is an automated error notification from {self.app_name}</p>
                    <p>🤖 Generated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def format_context_section(self, context):
        """Format context information for email"""
        if not context:
            return ""
        
        context_items = ""
        for key, value in context.items():
            context_items += f"<strong>{key}:</strong> {value}<br>"
        
        return f"""
        <div class="context-box">
            <div class="field">
                <span class="field-label">🔍 Context Information:</span>
                <div class="field-value">{context_items}</div>
            </div>
        </div>
        """
    
    def format_user_info_section(self, user_info):
        """Format user information for email"""
        if not user_info:
            return ""
        
        user_items = ""
        for key, value in user_info.items():
            user_items += f"<strong>{key}:</strong> {value}<br>"
        
        return f"""
        <div class="context-box">
            <div class="field">
                <span class="field-label">👤 User Information:</span>
                <div class="field-value">{user_items}</div>
            </div>
        </div>
        """
    
    def format_traceback_section(self, traceback_info):
        """Format traceback information for email"""
        if not traceback_info:
            return ""
        
        return f"""
        <div class="error-details">
            <div class="field">
                <span class="field-label">🐛 Stack Trace:</span>
                <div class="traceback">{traceback_info}</div>
            </div>
        </div>
        """
    
    def create_error_email_text(self, error_details):
        """Create text content for error notification email"""
        text = f"""
🚨 ERROR ALERT - {self.app_name}

An error occurred in your web application!

DETAILS:
========
Timestamp: {error_details['timestamp']}
Error Type: {error_details['error_type']}
Error Message: {error_details['error_message']}
"""
        
        if error_details.get('context'):
            text += f"\nCONTEXT:\n"
            for key, value in error_details['context'].items():
                text += f"{key}: {value}\n"
        
        if error_details.get('user_info'):
            text += f"\nUSER INFO:\n"
            for key, value in error_details['user_info'].items():
                text += f"{key}: {value}\n"
        
        if error_details.get('traceback'):
            text += f"\nSTACK TRACE:\n{error_details['traceback']}\n"
        
        text += f"\n---\nThis is an automated notification from {self.app_name}\nGenerated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        
        return text

# Global instance
error_notifier = ErrorNotifier()

def log_error(error_type, error_message, context=None, user_info=None):
    """Convenience function to log and notify errors"""
    error_notifier.log_and_notify_error(error_type, error_message, context, user_info)

def notify_ai_failure(repo_url, project_name, error_message, user_info=None):
    """Specific function for AI generation failures"""
    context = {
        'repository_url': repo_url,
        'project_name': project_name or 'Not specified',
        'failure_type': 'AI Generation Failure'
    }
    
    log_error(
        error_type="AI Generation Failed", 
        error_message=error_message,
        context=context,
        user_info=user_info
    )

def notify_api_error(endpoint, error_message, request_data=None, user_info=None):
    """Specific function for API errors"""
    context = {
        'endpoint': endpoint,
        'request_data': request_data or 'Not available'
    }
    
    log_error(
        error_type="API Error",
        error_message=error_message,
        context=context,
        user_info=user_info
    )
