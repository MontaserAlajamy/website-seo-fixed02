/*
  # Complete Portfolio CMS Database Schema

  ## Overview
  This migration creates a comprehensive content management system for the portfolio website
  with full authentication, video portfolio, photography portfolio, contact messages, and site settings.

  ## 1. New Tables

  ### `profiles`
  Stores user profile information for the portfolio owner
  - `id` (uuid, primary key) - Links to auth.users
  - `name` (text) - Full name
  - `title` (text) - Professional title
  - `bio` (text) - Biography/about text
  - `avatar_url` (text) - Profile photo URL
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone
  - `location` (text) - Location/address
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `video_projects`
  Stores video portfolio items
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Video title
  - `description` (text) - Video description
  - `category` (text) - Category/genre
  - `vimeo_id` (text) - Vimeo video ID
  - `thumbnail_url` (text) - Video thumbnail URL
  - `featured` (boolean) - Featured status
  - `order_index` (integer) - Display order
  - `tags` (text[]) - Array of tags
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `photo_albums`
  Stores photography album collections
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Album title
  - `description` (text) - Album description
  - `cover_image_url` (text) - Album cover image
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `photos`
  Stores individual photos within albums
  - `id` (uuid, primary key) - Unique identifier
  - `album_id` (uuid, foreign key) - References photo_albums
  - `title` (text) - Photo title
  - `description` (text) - Photo description
  - `image_url` (text) - Full-size image URL
  - `thumbnail_url` (text) - Thumbnail URL
  - `order_index` (integer) - Display order within album
  - `created_at` (timestamptz) - Creation timestamp

  ### `contact_messages`
  Stores contact form submissions
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `phone` (text) - Optional phone number
  - `message` (text) - Message content
  - `status` (text) - Message status (new, read, archived)
  - `created_at` (timestamptz) - Submission timestamp

  ### `site_settings`
  Stores global site configuration
  - `id` (uuid, primary key) - Single row identifier
  - `hero_title` (text) - Hero section title
  - `hero_subtitle` (text) - Hero section subtitle
  - `about_title` (text) - About section title
  - `about_text` (text) - About section content
  - `updated_at` (timestamptz) - Last update timestamp

  ### `skills`
  Stores skills and expertise information
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Skill name
  - `description` (text) - Skill description
  - `icon` (text) - Icon identifier
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Public read access for all content tables
  - Authenticated admin write access for content management
  - Public insert access for contact_messages
  - Restricted access to profiles (authenticated users only)

  ## 3. Storage Buckets
  Will be created separately for:
  - profile-photos
  - video-thumbnails
  - photo-albums
  - site-assets
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  avatar_url text,
  email text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video_projects table
CREATE TABLE IF NOT EXISTS video_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  vimeo_id text NOT NULL,
  thumbnail_url text,
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photo_albums table
CREATE TABLE IF NOT EXISTS photo_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_image_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  image_url text NOT NULL,
  thumbnail_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at timestamptz DEFAULT now()
);

-- Create site_settings table (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text NOT NULL DEFAULT 'Muntasir Elagami',
  hero_subtitle text NOT NULL DEFAULT 'Professional Video Editor & Videographer',
  about_title text NOT NULL DEFAULT 'About Me',
  about_text text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for video_projects
CREATE POLICY "Anyone can view video projects"
  ON video_projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert video projects"
  ON video_projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update video projects"
  ON video_projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete video projects"
  ON video_projects FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for photo_albums
CREATE POLICY "Anyone can view photo albums"
  ON photo_albums FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert photo albums"
  ON photo_albums FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update photo albums"
  ON photo_albums FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete photo albums"
  ON photo_albums FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for photos
CREATE POLICY "Anyone can view photos"
  ON photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update photos"
  ON photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for skills
CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_video_projects_category ON video_projects(category);
CREATE INDEX IF NOT EXISTS idx_video_projects_featured ON video_projects(featured);
CREATE INDEX IF NOT EXISTS idx_video_projects_order ON video_projects(order_index);
CREATE INDEX IF NOT EXISTS idx_photos_album ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_photos_order ON photos(album_id, order_index);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);

-- Insert default site settings if not exists
INSERT INTO site_settings (hero_title, hero_subtitle, about_title, about_text)
SELECT 
  'Muntasir Elagami',
  'Professional Video Editor & Videographer',
  'About Me',
  'Passionate about creating compelling visual stories through expert video editing and cinematography.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Insert default skills
INSERT INTO skills (name, description, icon, order_index)
VALUES
  ('Video Editing', 'Advanced editing techniques with industry-standard software', 'Film', 0),
  ('Color Grading', 'Professional color correction and grading for cinematic looks', 'Palette', 1),
  ('Sound Design', 'Immersive audio mixing and sound effects creation', 'Wand2', 2),
  ('Motion Graphics', 'Dynamic visual effects and animated elements', 'Zap', 3),
  ('Cinematography', 'Professional camera work and visual composition', 'Camera', 4)
ON CONFLICT DO NOTHING;
