export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          title: string
          bio: string
          avatar_url: string | null
          email: string
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          title?: string
          bio?: string
          avatar_url?: string | null
          email?: string
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          bio?: string
          avatar_url?: string | null
          email?: string
          phone?: string | null
          location?: string | null
          updated_at?: string
        }
      }
      video_projects: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          vimeo_id: string
          thumbnail_url: string | null
          featured: boolean
          order_index: number
          tags: string[]
          video_source: 'vimeo' | 'cloudflare' | 'youtube' | 'direct'
          video_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          category?: string
          vimeo_id: string
          thumbnail_url?: string | null
          featured?: boolean
          order_index?: number
          tags?: string[]
          video_source?: 'vimeo' | 'cloudflare' | 'youtube' | 'direct'
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          vimeo_id?: string
          thumbnail_url?: string | null
          featured?: boolean
          order_index?: number
          tags?: string[]
          video_source?: 'vimeo' | 'cloudflare' | 'youtube' | 'direct'
          video_url?: string | null
          updated_at?: string
        }
      }
      photo_albums: {
        Row: {
          id: string
          title: string
          description: string
          cover_image_url: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          cover_image_url?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          cover_image_url?: string | null
          order_index?: number
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          album_id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          album_id: string
          title?: string
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          album_id?: string
          title?: string
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          order_index?: number
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          status: 'new' | 'read' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          status?: 'new' | 'read' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: 'new' | 'read' | 'archived'
        }
      }
      site_settings: {
        Row: {
          id: string
          hero_title: string
          hero_subtitle: string
          about_title: string
          about_text: string
          updated_at: string
        }
        Insert: {
          id?: string
          hero_title?: string
          hero_subtitle?: string
          about_title?: string
          about_text?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hero_title?: string
          hero_subtitle?: string
          about_title?: string
          about_text?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          icon?: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          order_index?: number
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          cover_image_url: string | null
          status: 'draft' | 'published'
          published_at: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string
          content?: string
          cover_image_url?: string | null
          status?: 'draft' | 'published'
          published_at?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          cover_image_url?: string | null
          status?: 'draft' | 'published'
          published_at?: string | null
          tags?: string[]
          updated_at?: string
        }
      }
      site_content: {
        Row: {
          id: string
          content: string
          content_type: 'text' | 'html' | 'image_url' | 'json'
          updated_at: string
        }
        Insert: {
          id: string
          content?: string
          content_type?: 'text' | 'html' | 'image_url' | 'json'
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          content_type?: 'text' | 'html' | 'image_url' | 'json'
          updated_at?: string
        }
      }
    }
  }
}

