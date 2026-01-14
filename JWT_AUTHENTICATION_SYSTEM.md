# JWT Authentication System Implementation

## Overview

This document outlines the implementation of a professional JWT-based authentication system that replaces the previous client-side session management. The new system provides secure, server-side authentication with persistent sessions across page reloads.

## Key Improvements

### 🔒 **Security Enhancements**

- **JWT Tokens**: Secure JSON Web Tokens with HMAC SHA-256 signing
- **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies (not accessible via JavaScript)
- **Server-Side Validation**: All authentication checks happen on the server
- **Automatic Token Refresh**: Refresh tokens for extended sessions (30 days)
- **Cross-Site Protection**: SameSite cookie attributes prevent CSRF attacks

### 🚀 **User Experience Improvements**

- **Persistent Sessions**: Users stay logged in across page reloads and browser restarts
- **Cross-Tab Synchronization**: Login/logout status syncs across browser tabs
- **Seamless Authentication**: No more login prompts on page refresh
- **Professional Flow**: Clean authentication flow without client-side token exposure

### 🏗️ **Architecture Benefits**

- **Stateless Authentication**: JWT tokens contain all necessary user information
- **Scalable Design**: No server-side session storage required
- **Middleware Protection**: Route-level authentication via Next.js middleware
- **API Security**: All protected API routes validate JWT tokens
- **Backward Compatibility**: Graceful fallback to legacy authentication

## System Components

### 1. JWT Authentication Library (`src/lib/jwt-auth.ts`)

**Core Functions:**

- `createToken()`: Generate JWT access tokens (7-day expiry)
- `createRefreshToken()`: Generate refresh tokens (30-day expiry)
- `verifyToken()`: Validate and decode JWT tokens
- `getCurrentUser()`: Extract user data from valid tokens
- `setAuthCookies()`: Set secure HTTP-only cookies
- `clearAuthCookies()`: Clear authentication cookies

**Security Features:**

- HMAC SHA-256 token signing
- Configurable token expiration
- Secure cookie configuration
- Environment-based secret management

### 2. Client-Side Auth Hook (`src/lib/jwt-auth-client.tsx`)

**Features:**

- React context for authentication state
- Server-side token verification
- Cross-tab synchronization via cookie monitoring
- Automatic auth status checking
- Clean login/logout functions

**State Management:**

- `user`: Current user object or null
- `isAuthenticated`: Boolean authentication status
- `isLoading`: Loading state during auth checks
- `login()`: Redirect to login page
- `logout()`: Clear tokens and redirect
- `refreshAuth()`: Manual auth refresh

### 3. Authentication Middleware (`src/middleware.ts`)

**Protection Levels:**

- **Protected Routes**: `/repositories`, `/history`, `/settings`, `/generate`
- **Auth Routes**: `/login` (redirects authenticated users)
- **Public Routes**: All other pages accessible without authentication

**JWT Validation:**

- Automatic token verification for protected routes
- Fallback to legacy authentication for backward compatibility
- Proper redirect handling with return URLs

### 4. API Route Updates

**Enhanced Security:**

- All protected API routes validate JWT tokens
- GitHub access tokens extracted from JWT payload
- User context available in all authenticated requests
- Proper error handling for invalid/expired tokens

**Updated Routes:**

- `/api/auth/verify`: Token verification endpoint
- `/api/auth/callback`: JWT token creation on OAuth success
- `/api/auth/logout`: Secure token cleanup
- `/api/repositories`: JWT-protected repository access

## Implementation Details

### Token Structure

**Access Token Payload:**

```json
{
  "userId": "github_user_id",
  "username": "github_username",
  "name": "User Full Name",
  "email": "user@example.com",
  "avatar_url": "https://github.com/avatar.jpg",
  "html_url": "https://github.com/username",
  "github_id": "github_user_id",
  "access_token": "github_oauth_token",
  "sessionId": "unique_session_id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Refresh Token Payload:**

```json
{
  "userId": "github_user_id",
  "sessionId": "unique_session_id",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Cookie Configuration

**Access Token Cookie (`auth_token`):**

- HTTP-Only: ✅ (prevents XSS attacks)
- Secure: ✅ (HTTPS only in production)
- SameSite: `lax` (CSRF protection)
- Max-Age: 7 days
- Path: `/` (site-wide access)

**Refresh Token Cookie (`refresh_token`):**

- HTTP-Only: ✅
- Secure: ✅
- SameSite: `lax`
- Max-Age: 30 days
- Path: `/`

**Auth Status Cookie (`auth_status`):**

- HTTP-Only: ❌ (client needs to read for UI state)
- Secure: ✅
- SameSite: `lax`
- Max-Age: 7 days
- Value: `"authenticated"` or empty

### Authentication Flow

1. **Login Initiation**: User clicks "Connect with Github"
2. **OAuth Redirect**: Redirect to GitHub OAuth
3. **OAuth Callback**: GitHub returns with authorization code
4. **Token Exchange**: Exchange code for GitHub access token
5. **JWT Creation**: Create JWT tokens with user data
6. **Cookie Setting**: Set secure HTTP-only cookies
7. **Client Sync**: Client detects auth_status cookie change
8. **State Update**: Client fetches user data via `/api/auth/verify`

### Logout Flow

1. **Logout Initiation**: User clicks logout
2. **Client Cleanup**: Clear React state immediately
3. **Server Cleanup**: Call `/api/auth/logout` to clear cookies
4. **Cookie Clearing**: Remove all authentication cookies
5. **Redirect**: Navigate based on current page type

## Environment Configuration

### Required Environment Variables

```bash
# JWT Secret Key (CRITICAL - Generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# GitHub OAuth (existing)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://yourdomain.com/api/auth/callback
```

### Security Recommendations

1. **JWT Secret**: Use a cryptographically secure random key (minimum 32 bytes)
2. **HTTPS Only**: Always use HTTPS in production for secure cookies
3. **Environment Isolation**: Different JWT secrets for dev/staging/production
4. **Key Rotation**: Regularly rotate JWT secrets (invalidates all sessions)
5. **Token Monitoring**: Monitor for suspicious token usage patterns

## Migration from Legacy System

### Backward Compatibility

The new system maintains backward compatibility with the existing authentication:

1. **Dual Token Support**: Checks JWT tokens first, falls back to legacy cookies
2. **Gradual Migration**: Users automatically migrate to JWT on next login
3. **Legacy Cleanup**: Old session cookies are cleared during logout
4. **API Compatibility**: All existing API calls continue to work

### Migration Steps

1. **Deploy JWT System**: New authentication runs alongside legacy
2. **User Migration**: Users get JWT tokens on next login
3. **Monitor Usage**: Track JWT vs legacy authentication usage
4. **Legacy Removal**: Remove legacy auth code after full migration

## Testing and Validation

### Authentication Tests

1. **Login Flow**: Verify complete OAuth → JWT flow
2. **Token Validation**: Test JWT signature verification
3. **Cookie Security**: Validate HTTP-only and secure flags
4. **Cross-Tab Sync**: Test login/logout across browser tabs
5. **Page Refresh**: Verify persistent sessions after reload
6. **Route Protection**: Test middleware protection on all routes
7. **API Security**: Validate JWT requirements on protected endpoints

### Security Tests

1. **Token Tampering**: Verify rejection of modified tokens
2. **Expired Tokens**: Test automatic cleanup of expired tokens
3. **Invalid Signatures**: Ensure rejection of tokens with wrong signatures
4. **Cookie Manipulation**: Test protection against cookie tampering
5. **CSRF Protection**: Validate SameSite cookie protection

## Monitoring and Debugging

### Logging Points

- JWT token creation and validation
- Authentication middleware decisions
- API route authentication checks
- Cookie setting and clearing operations
- Cross-tab synchronization events

### Debug Information

Enable detailed logging in development:

```javascript
console.log("JWT: Token created for user:", username);
console.log("JWT: Authentication verified for:", pathname);
console.log("JWT: Token validation failed:", error);
```

## Performance Considerations

### Optimizations

1. **Token Caching**: Client-side caching of auth verification (5-minute cache)
2. **Middleware Efficiency**: Fast JWT verification in middleware
3. **Cookie Optimization**: Minimal cookie size and efficient parsing
4. **API Efficiency**: Single auth check per request lifecycle

### Scalability

- **Stateless Design**: No server-side session storage required
- **CDN Friendly**: Static assets served without authentication overhead
- **Database Independent**: Authentication works without database queries
- **Horizontal Scaling**: JWT tokens work across multiple server instances

## Troubleshooting

### Common Issues

1. **"Authentication Required" Errors**

   - Check JWT_SECRET environment variable
   - Verify cookie settings (HTTP-only, Secure, SameSite)
   - Confirm token expiration times

2. **Page Reload Logout**

   - Verify auth_status cookie is being set
   - Check client-side auth verification endpoint
   - Confirm middleware is not blocking auth routes

3. **Cross-Tab Issues**
   - Validate cookie domain settings
   - Check auth_status cookie monitoring
   - Verify cookie synchronization timing

### Debug Commands

```bash
# Check JWT token structure
node -e "console.log(require('jose').decodeJwt('YOUR_TOKEN_HERE'))"

# Verify environment variables
echo $JWT_SECRET

# Test cookie settings
curl -I https://yourdomain.com/api/auth/verify
```

## Future Enhancements

### Planned Features

1. **Token Refresh**: Automatic access token refresh using refresh tokens
2. **Session Management**: User dashboard for active session management
3. **Device Tracking**: Enhanced device information and session history
4. **Security Alerts**: Notifications for suspicious authentication activity
5. **Multi-Factor Auth**: Optional 2FA integration for enhanced security

### Performance Improvements

1. **Token Compression**: Reduce JWT token size for faster transmission
2. **Caching Strategy**: Enhanced client-side authentication caching
3. **Background Refresh**: Proactive token refresh before expiration
4. **Connection Pooling**: Optimized database connections for user data

## Conclusion

The new JWT authentication system provides a robust, secure, and user-friendly authentication experience. It addresses all the issues with the previous client-side system while maintaining backward compatibility and providing a foundation for future enhancements.

Key benefits:

- ✅ Persistent sessions across page reloads
- ✅ Secure server-side token validation
- ✅ Professional authentication flow
- ✅ Cross-tab synchronization
- ✅ Enhanced security with HTTP-only cookies
- ✅ Scalable stateless architecture
- ✅ Comprehensive error handling
- ✅ Backward compatibility with legacy system

The system is production-ready and provides a solid foundation for the application's authentication needs.
