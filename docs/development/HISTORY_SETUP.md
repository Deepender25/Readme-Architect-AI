# History Feature Setup Guide

The history feature allows users to save and view their previously generated README files. This guide will help you set up Firebase Firestore and configure the feature.

## Prerequisites

1. **Firebase Account**: You need a Firebase project set up
2. **Environment Variables**: Properly configured Firebase credentials
3. **Firestore Access**: Admin access to your Firebase project

## Step 1: Environment Configuration

Make sure your `.env` file contains the following Firebase variables:

```env
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

You can find these values in your Firebase project settings under "Service accounts".

## Step 2: Database Setup

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase_migration.sql`
4. Paste and run the SQL script
5. Verify the table was created in the **Table Editor**

### Option B: Using the Setup Script

Run the setup verification script:

```bash
python setup_database.py
```

This will:

- Verify your Supabase connection
- Check if the table exists
- Provide setup instructions

## Step 3: Table Structure

The `readme_history` table includes:

| Column              | Type      | Description                                |
| ------------------- | --------- | ------------------------------------------ |
| `id`                | UUID      | Primary key (auto-generated)               |
| `user_id`           | TEXT      | GitHub user ID                             |
| `username`          | TEXT      | GitHub username                            |
| `repository_url`    | TEXT      | Full repository URL                        |
| `repository_name`   | TEXT      | Repository name (e.g., "user/repo")        |
| `project_name`      | TEXT      | Optional custom project name               |
| `readme_content`    | TEXT      | Generated README content                   |
| `generation_params` | JSONB     | Generation parameters (demo options, etc.) |
| `created_at`        | TIMESTAMP | When the README was generated              |
| `updated_at`        | TIMESTAMP | Last update time                           |

## Step 4: Security Features

The table includes Row Level Security (RLS) policies that ensure:

- Users can only see their own history
- Users can only modify their own records
- Proper data isolation between users

## Step 5: Testing the Feature

1. **Login**: Make sure GitHub OAuth is working
2. **Generate**: Create a README for any repository
3. **View History**: Click on your profile → "README History"
4. **Verify**: Check that your generation appears in the history

## API Endpoints

The history feature adds these endpoints:

- `GET /api/history` - Get user's history
- `GET /api/history/{id}` - Get specific history item
- `DELETE /api/history/{id}` - Delete history item

## Troubleshooting

### Common Issues

1. **"Authentication required" error**

   - Make sure you're logged in with GitHub
   - Check that cookies are enabled

2. **"Failed to load history" error**

   - Verify Supabase credentials in `.env`
   - Check that the table exists
   - Ensure RLS policies are properly set

3. **"Table doesn't exist" error**
   - Run the SQL migration script
   - Check table name spelling
   - Verify database permissions

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify network requests in browser dev tools
3. Check server logs for database connection issues
4. Test Supabase connection with the setup script

## Features

### History View

- **List View**: Shows all generated READMEs with metadata
- **Search/Filter**: Find specific repositories
- **Date Sorting**: Most recent first

### History Actions

- **View**: Display the README content
- **Regenerate**: Pre-fill form with historical data
- **Delete**: Remove from history (with confirmation)

### Data Management

- **Automatic Saving**: Every successful generation is saved
- **User Isolation**: Each user sees only their own history
- **Efficient Storage**: Optimized database queries and indexes

## Performance Considerations

- History is limited to 50 items per user by default
- Large README content is stored efficiently
- Database indexes optimize query performance
- RLS policies ensure security without performance impact

## Future Enhancements

Potential improvements for the history feature:

- Export history to JSON/CSV
- README comparison between versions
- Favorite/bookmark specific generations
- Search within README content
- Bulk operations (delete multiple items)
- History statistics and analytics

## Support

If you encounter issues with the history feature:

1. Check this setup guide
2. Verify your Supabase configuration
3. Test with the provided setup script
4. Check the browser console for errors
5. Review server logs for database issues

The history feature enhances the ReadmeArchitect experience by providing users with a complete record of their documentation generation activities.
