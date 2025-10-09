# Portfolio CMS - Quick Start Guide

## What Has Been Built

Your portfolio website now has a **complete foundation** for a database-driven Content Management System using Supabase. Here's what's ready to use:

### ✅ Completed Infrastructure

#### 1. **Complete Database Schema**
- All tables created and configured in Supabase
- Row Level Security (RLS) enabled for data protection
- Tables include:
  - `video_projects` - Your video portfolio
  - `photo_albums` - Photo album collections
  - `photos` - Individual photos
  - `contact_messages` - Contact form submissions
  - `profiles` - User profiles
  - `site_settings` - Global site configuration
  - `skills` - Your skills/expertise

#### 2. **Authentication System**
- Supabase email/password authentication
- Secure login/logout functionality
- Session management
- Protected admin routes

#### 3. **Data Management Hooks**
Ready-to-use React hooks for all database operations:
- `useSupabaseAuth` - Authentication
- `useVideoProjects` - Video portfolio management
- `usePhotoAlbums` - Photo album management
- `usePhotos` - Photo management
- `useContactMessages` - Message management
- `useSiteSettings` - Site settings
- `useSkills` - Skills management
- `useSupabaseProfile` - Profile management

#### 4. **Admin Dashboard**
- Professional admin interface created
- Tab-based navigation
- Video management component completed
- Login form with authentication

#### 5. **Contact Form**
- Saves messages to database
- Email notifications via Edge Function
- Success/error handling
- Modern, responsive design

#### 6. **Edge Function**
- `send-contact-email` function deployed
- Handles email notifications for contact form

## Getting Started

### Step 1: Create Your Admin Account

You need to create an admin user account in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Users
3. Click "Add User"
4. Create an account with:
   - Email: your-email@example.com
   - Password: your-secure-password
   - Email Confirm: Yes (or disable email confirmation in Auth settings)

### Step 2: Access Admin Dashboard

1. Visit your website's `/admin` route
2. Log in with the credentials you created
3. You'll see the admin dashboard with tabs:
   - Video Portfolio
   - Photo Portfolio (needs components)
   - Messages (needs component)
   - Profile (needs component)
   - Skills (needs component)
   - Site Settings (needs component)

### Step 3: Add Your First Video

1. In admin dashboard, go to "Video Portfolio" tab
2. Click "Add Video"
3. Fill in:
   - Title
   - Vimeo ID (just the numbers from your Vimeo URL)
   - Description
   - Category
   - Tags
   - Mark as "Featured" if desired
4. Click "Add Video"

## What Needs to Be Completed

To have a fully functional CMS, you need to create these admin components:

### Required Components (In Priority Order):

1. **PhotoManagement.tsx** - Manage photo albums and photos
2. **ContactMessagesView.tsx** - View and manage contact messages
3. **ProfileManagement.tsx** - Edit your profile information
4. **SkillsManagement.tsx** - Manage your skills display
5. **SiteSettingsView.tsx** - Edit global site settings

### Additional Frontend Updates Needed:

1. Update `Features.tsx` to use `useSkills` hook
2. Update `Profile.tsx`/`About.tsx` to use `useSupabaseProfile` hook
3. Update `FeaturedVideos.tsx` to use `useVideoProjects` hook
4. Create `PhotoPortfolio.tsx` page
5. Update navigation to include video/photo portfolio links
6. Update routing in `App.tsx`

## File Structure

```
src/
├── hooks/
│   ├── useSupabaseAuth.ts ✅
│   ├── useVideoProjects.ts ✅
│   ├── usePhotoAlbums.ts ✅
│   ├── usePhotos.ts ✅
│   ├── useContactMessages.ts ✅
│   ├── useSiteSettings.ts ✅
│   ├── useSkills.ts ✅
│   └── useSupabaseProfile.ts ✅
├── components/
│   ├── admin/
│   │   ├── LoginFormNew.tsx ✅
│   │   ├── VideoManagement.tsx ✅
│   │   ├── PhotoManagement.tsx ⏳ (needs to be created)
│   │   ├── ContactMessagesView.tsx ⏳
│   │   ├── ProfileManagement.tsx ⏳
│   │   ├── SkillsManagement.tsx ⏳
│   │   └── SiteSettingsView.tsx ⏳
│   └── contact/
│       └── ContactFormNew.tsx ✅
├── pages/
│   ├── AdminNew.tsx ✅
│   └── PhotoPortfolio.tsx ⏳
└── lib/
    ├── supabase.ts ✅
    └── database.types.ts ✅
```

## Using the Hooks in Your Components

### Example: Display Videos

```typescript
import { useVideoProjects } from '../hooks/useVideoProjects';

function VideoList() {
  const { projects, loading } = useVideoProjects();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example: Display Featured Videos

```typescript
import { useVideoProjects } from '../hooks/useVideoProjects';

function FeaturedVideos() {
  const { getFeaturedProjects } = useVideoProjects();
  const featured = getFeaturedProjects();

  return (
    <div>
      {featured.map(project => (
        // Display featured project
      ))}
    </div>
  );
}
```

## Database Access

### Direct SQL Access
You can query your database directly in Supabase Dashboard:
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run queries to view/modify data

### Example Queries:

```sql
-- View all videos
SELECT * FROM video_projects ORDER BY created_at DESC;

-- View all contact messages
SELECT * FROM contact_messages ORDER BY created_at DESC;

-- View site settings
SELECT * FROM site_settings;

-- Update site settings
UPDATE site_settings
SET hero_title = 'New Title'
WHERE id = (SELECT id FROM site_settings LIMIT 1);
```

## Security Notes

1. **RLS is Enabled**: All tables have Row Level Security
2. **Public Read Access**: Content is viewable by everyone
3. **Authenticated Write Access**: Only logged-in admins can modify data
4. **Contact Messages**: Anyone can submit, only admins can read

## Email Notifications

The contact form sends emails via the `send-contact-email` Edge Function.

**To enable email notifications:**
1. Sign up for Resend (https://resend.com)
2. Get your API key
3. In Supabase Dashboard → Edge Functions → send-contact-email
4. Add secret: `RESEND_API_KEY` with your Resend API key

**Note**: The contact form will still work and save messages even without email setup.

## Troubleshooting

### Can't log in to admin?
- Make sure you created a user in Supabase Authentication
- Check that the email is verified (or disable email verification)
- Check browser console for errors

### Data not loading?
- Check Supabase Dashboard to see if data exists
- Check browser console for RLS policy errors
- Verify `.env` file has correct Supabase URL and keys

### Images not uploading?
- Storage buckets need to be created (see IMPLEMENTATION_PLAN.md)
- Check RLS policies on storage.objects

## Next Steps

1. **Create remaining admin components** - This is the highest priority
2. **Set up Supabase Storage** - For photo uploads
3. **Update existing components** - To use Supabase data instead of localStorage
4. **Create photography portfolio pages** - For photo display
5. **Test thoroughly** - All CRUD operations

## Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Implementation Plan**: See `IMPLEMENTATION_PLAN.md` for detailed steps
- **Database Schema**: Check Supabase Dashboard → Database → Tables

---

**Current Status**: Foundation Complete ✅
**Ready for**: Admin Component Development & Frontend Integration
**Estimated Time to Complete**: 4-6 hours for remaining components

## Support

For each component you need to build, refer to:
1. The corresponding hook in `src/hooks/`
2. `VideoManagement.tsx` as a reference pattern
3. `IMPLEMENTATION_PLAN.md` for detailed requirements

Happy building! 🚀
