# Portfolio CMS Implementation Plan

## Overview
This document outlines the comprehensive implementation plan for transforming the portfolio website into a fully database-driven content management system with Supabase integration.

## ✅ Completed Tasks

### 1. Database Schema Design
- ✅ Created complete Supabase database schema
- ✅ Tables created: `profiles`, `video_projects`, `photo_albums`, `photos`, `contact_messages`, `site_settings`, `skills`
- ✅ Implemented Row Level Security (RLS) policies for all tables
- ✅ Created indexes for performance optimization
- ✅ Inserted default data for skills and site settings

### 2. Supabase Client Configuration
- ✅ Created `src/lib/supabase.ts` - Supabase client singleton
- ✅ Created `src/lib/database.types.ts` - TypeScript database types
- ✅ Installed `@supabase/supabase-js` package
- ✅ Environment variables configured

### 3. Authentication System
- ✅ Created `useSupabaseAuth` hook for authentication
- ✅ Supports sign up, sign in, sign out
- ✅ Session management with auto-refresh
- ✅ Created new login form component

### 4. Data Management Hooks
- ✅ `useVideoProjects` - Video portfolio CRUD operations
- ✅ `usePhotoAlbums` - Photo album CRUD operations
- ✅ `usePhotos` - Individual photo CRUD operations
- ✅ `useContactMessages` - Contact message management
- ✅ `useSiteSettings` - Global site settings
- ✅ `useSkills` - Skills management
- ✅ `useSupabaseProfile` - User profile management

### 5. Contact Form Enhancement
- ✅ Created Edge Function `send-contact-email` for email notifications
- ✅ Created new contact form component with Supabase integration
- ✅ Saves messages to database
- ✅ Sends email notifications via Resend API

### 6. Admin Dashboard Structure
- ✅ Created main admin dashboard component (`AdminNew.tsx`)
- ✅ Tab-based interface for different management sections
- ✅ Created login form with Supabase authentication
- ✅ Created video management component

## 🚧 Remaining Tasks

### 1. Complete Admin Panel Components

#### A. Photo Management Component (`src/components/admin/PhotoManagement.tsx`)
```typescript
Features needed:
- Album creation, editing, deletion
- Photo upload within albums
- Drag-and-drop photo reordering
- Image upload to Supabase Storage
- Thumbnail generation
- Album cover image selection
```

#### B. Contact Messages View (`src/components/admin/ContactMessagesView.tsx`)
```typescript
Features needed:
- List all contact messages
- Filter by status (new, read, archived)
- Mark messages as read
- Delete messages
- Display sender details
- Search functionality
```

#### C. Site Settings View (`src/components/admin/SiteSettingsView.tsx`)
```typescript
Features needed:
- Edit hero title/subtitle
- Edit about section content
- Update other global settings
- Real-time preview (optional)
```

#### D. Skills Management (`src/components/admin/SkillsManagement.tsx`)
```typescript
Features needed:
- Add/edit/delete skills
- Reorder skills
- Edit skill descriptions
- Icon selection
```

#### E. Profile Management (`src/components/admin/ProfileManagement.tsx`)
```typescript
Features needed:
- Edit profile information
- Upload avatar image
- Update contact information
- Bio editing
```

### 2. Supabase Storage Setup

#### Create Storage Buckets:
```sql
-- Execute in Supabase SQL Editor
-- Create storage buckets for file uploads

-- Profile photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Photo albums bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photo-albums', 'photo-albums', true);

-- Site assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true);

-- Storage policies
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('profile-photos', 'photo-albums', 'site-assets'));

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('profile-photos', 'photo-albums', 'site-assets'));

CREATE POLICY "Authenticated users can update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('profile-photos', 'photo-albums', 'site-assets'));

CREATE POLICY "Authenticated users can delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('profile-photos', 'photo-albums', 'site-assets'));
```

#### Create Image Upload Utility (`src/lib/uploadImage.ts`):
```typescript
import { supabase } from './supabase';

export async function uploadImage(
  file: File,
  bucket: string,
  folder?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (error) {
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
```

### 3. Frontend Updates

#### Update Components to Use Supabase Data:

##### A. Update `Features.tsx`:
```typescript
// Replace static features with data from useSkills hook
import { useSkills } from '../hooks/useSkills';

export default function Features() {
  const { skills, loading } = useSkills();
  // Map skills to features display
}
```

##### B. Update `Profile.tsx` or `About.tsx`:
```typescript
// Use useSupabaseProfile instead of localStorage
import { useSupabaseProfile } from '../hooks/useSupabaseProfile';
```

##### C. Update `FeaturedVideos.tsx`:
```typescript
// Use useVideoProjects with getFeaturedProjects
import { useVideoProjects } from '../hooks/useVideoProjects';

export default function FeaturedVideos() {
  const { getFeaturedProjects } = useVideoProjects();
  const featured = getFeaturedProjects();
}
```

##### D. Update Portfolio Page (`src/pages/Portfolio.tsx`):
```typescript
// Rename to VideoPortfolio and use useVideoProjects
import { useVideoProjects } from '../hooks/useVideoProjects';
```

### 4. Create Photography Portfolio

#### A. Photography Portfolio Page (`src/pages/PhotoPortfolio.tsx`):
```typescript
Features:
- Display all photo albums
- Grid layout with album covers
- Click to view album details
- Responsive design
```

#### B. Album View Component (`src/components/portfolio/AlbumView.tsx`):
```typescript
Features:
- Display all photos in an album
- Lightbox for full-size viewing
- Photo navigation
- Responsive gallery grid
```

#### C. Photo Gallery Component (`src/components/portfolio/PhotoGallery.tsx`):
```typescript
Features:
- Masonry or grid layout
- Lazy loading
- Image optimization
- Hover effects
```

### 5. Update Navigation

Update `src/components/Header.tsx` to include:
- Link to "Video Portfolio"
- Link to "Photography Portfolio" (new)
- Keep existing navigation items

### 6. Update Routes

Update `src/App.tsx`:
```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoPortfolio from './pages/VideoPortfolio'; // Renamed from Portfolio
import PhotoPortfolio from './pages/PhotoPortfolio'; // New
import AdminNew from './pages/AdminNew'; // New admin

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/video-portfolio" element={<VideoPortfolio />} />
  <Route path="/photo-portfolio" element={<PhotoPortfolio />} />
  <Route path="/admin" element={<AdminNew />} />
</Routes>
```

### 7. Environment Setup

Ensure `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 8. Testing Checklist

- [ ] Test authentication (sign up, sign in, sign out)
- [ ] Test video CRUD operations
- [ ] Test photo album CRUD operations
- [ ] Test photo upload and display
- [ ] Test contact form submission
- [ ] Test email notifications
- [ ] Test all RLS policies (try accessing data when not authenticated)
- [ ] Test responsive design on mobile
- [ ] Test dark mode compatibility
- [ ] Test image uploads to storage
- [ ] Test portfolio displays (video & photo)
- [ ] Performance testing with multiple items

### 9. Optional Enhancements

- [ ] Add image compression before upload
- [ ] Implement infinite scroll for portfolios
- [ ] Add analytics dashboard in admin
- [ ] Add social sharing features
- [ ] Implement search functionality
- [ ] Add video/photo categories filter
- [ ] Add sorting options (date, title, category)
- [ ] Implement bulk operations (delete, move)
- [ ] Add export functionality for messages
- [ ] Implement backup/restore features

## Database Schema Reference

### Tables Created:
1. **profiles** - User profile information
2. **video_projects** - Video portfolio items
3. **photo_albums** - Photo album collections
4. **photos** - Individual photos in albums
5. **contact_messages** - Contact form submissions
6. **site_settings** - Global site configuration
7. **skills** - Skills/expertise display

### Edge Functions:
1. **send-contact-email** - Sends email notifications for contact form

## Key Files Created:

### Hooks:
- `src/hooks/useSupabaseAuth.ts`
- `src/hooks/useVideoProjects.ts`
- `src/hooks/usePhotoAlbums.ts`
- `src/hooks/useContactMessages.ts`
- `src/hooks/useSiteSettings.ts`
- `src/hooks/useSkills.ts`
- `src/hooks/useSupabaseProfile.ts`

### Components:
- `src/pages/AdminNew.tsx`
- `src/components/admin/LoginFormNew.tsx`
- `src/components/admin/VideoManagement.tsx`
- `src/components/contact/ContactFormNew.tsx`

### Configuration:
- `src/lib/supabase.ts`
- `src/lib/database.types.ts`

## Next Steps

1. **Create remaining admin components** (Photo, Messages, Settings, Skills, Profile management)
2. **Set up Supabase Storage buckets** for image uploads
3. **Update existing components** to use Supabase data
4. **Create photography portfolio pages**
5. **Update navigation and routing**
6. **Test all features thoroughly**
7. **Deploy and configure production environment**

## Notes

- All database operations use RLS for security
- Images should be uploaded to Supabase Storage
- Email notifications require RESEND_API_KEY to be configured in Supabase Edge Function secrets
- Authentication uses Supabase's built-in email/password auth
- All data is real-time enabled (can add subscriptions for live updates)

## Support

For questions or issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Review this implementation plan
3. Check existing hook implementations for patterns
4. Test RLS policies in Supabase dashboard

---

**Status**: Foundation Complete - Ready for Feature Implementation
**Last Updated**: 2025-10-09
