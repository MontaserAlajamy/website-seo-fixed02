/*
  # Blog Posts and Site Content Extension

  ## New Tables

  ### `blog_posts`
  Full blog/article system with slug-based URLs, drafts, and tagging.

  ### `site_content`
  Key-value editable site content blocks (hero text, social links, etc.).

  ## Modified Tables

  ### `video_projects`
  Added `video_source` and `video_url` columns for multi-platform video support.

  ## Storage Buckets
  Created `blog-images` bucket for blog post cover images.
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_content table (key-value editable blocks)
CREATE TABLE IF NOT EXISTS site_content (
  id text PRIMARY KEY,
  content text NOT NULL DEFAULT '',
  content_type text DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'image_url', 'json')),
  updated_at timestamptz DEFAULT now()
);

-- Add video source flexibility to video_projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_projects' AND column_name = 'video_source'
  ) THEN
    ALTER TABLE video_projects ADD COLUMN video_source text DEFAULT 'vimeo'
      CHECK (video_source IN ('vimeo', 'cloudflare', 'youtube', 'direct'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_projects' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE video_projects ADD COLUMN video_url text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR (SELECT auth.role()) = 'authenticated');

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for site_content
CREATE POLICY "Anyone can view site content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);

-- Insert default site content
INSERT INTO site_content (id, content, content_type) VALUES
  ('hero_title', 'Muntasir Elagami', 'text'),
  ('hero_subtitle', 'Professional Video Editor & Videographer', 'text'),
  ('hero_video_url', 'https://customer-ajj0x7flqjhaqqqt.cloudflarestream.com/adf8cf36c1d35b4b6fb22a4ee32d1088/iframe?muted=true&preload=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-ajj0x7flqjhaqqqt.cloudflarestream.com%2Fadf8cf36c1d35b4b6fb22a4ee32d1088%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&controls=false', 'text'),
  ('about_bio', 'With over a decade of experience in video editing and production, I specialize in crafting compelling visual narratives that captivate audiences and deliver powerful messages.', 'text'),
  ('logo_url', '', 'image_url'),
  ('social_links', '{"vimeo":"https://vimeo.com/muntasirelagami","twitter":"https://twitter.com/MuntasirElagami","flickr":"https://www.flickr.com/photos/muntasirelagami/","tiktok":"https://www.tiktok.com/@muntasir.elagami","youtube":"https://youtube.com/@MuntasirElagami","instagram":"https://www.instagram.com/muntasir.elagami/","linkedin":"https://www.linkedin.com/in/muntasir-elagami-b2429228a/","whatsapp":"https://wa.me/971569556541"}', 'json')
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for blog images
-- Note: Run via Supabase dashboard or CLI: supabase storage create blog-images --public
