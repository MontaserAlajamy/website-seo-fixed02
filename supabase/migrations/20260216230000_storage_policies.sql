/*
  # Storage Policies for Portfolio Images

  Allows:
  - Anyone to read/view images (SELECT)
  - Authenticated users to upload (INSERT), update, and delete images
*/

-- Allow public read access to portfolio-images bucket
CREATE POLICY "Anyone can view portfolio images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload to portfolio-images
CREATE POLICY "Authenticated users can upload portfolio images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to update portfolio images
CREATE POLICY "Authenticated users can update portfolio images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-images')
  WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete portfolio images
CREATE POLICY "Authenticated users can delete portfolio images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-images');

-- Same policies for blog-images bucket
CREATE POLICY "Anyone can view blog images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');
