import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Build-time sitemap generator.
 * Queries Supabase for published blog posts and photo albums,
 * then generates a sitemap.xml with all static + dynamic URLs.
 *
 * Usage: npx tsx scripts/generate-sitemap.ts
 */

const BASE_URL = 'https://muntasirelagami.com';

// Supabase config — reads from .env or process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not found. Generating static-only sitemap.');
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

interface SitemapEntry {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
}

async function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];
    const entries: SitemapEntry[] = [];

    // Static pages
    entries.push(
        { loc: `${BASE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
        { loc: `${BASE_URL}/portfolio`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
        { loc: `${BASE_URL}/photography`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { loc: `${BASE_URL}/blog`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    );

    if (supabase) {
        // Fetch published blog posts
        try {
            const { data: posts, error } = await supabase
                .from('blog_posts')
                .select('slug, updated_at, published_at')
                .eq('status', 'published')
                .order('published_at', { ascending: false });

            if (!error && posts) {
                for (const post of posts) {
                    const lastmod = (post.updated_at || post.published_at || today).split('T')[0];
                    entries.push({
                        loc: `${BASE_URL}/blog/${post.slug}`,
                        lastmod,
                        changefreq: 'monthly',
                        priority: '0.7',
                    });
                }
                console.log(`📝 Added ${posts.length} blog post(s) to sitemap`);
            }
        } catch (err) {
            console.warn('⚠️  Failed to fetch blog posts:', err);
        }

        // Fetch photo albums
        try {
            const { data: albums, error } = await supabase
                .from('photo_albums')
                .select('id, updated_at')
                .order('order_index', { ascending: true });

            if (!error && albums) {
                for (const album of albums) {
                    const lastmod = (album.updated_at || today).split('T')[0];
                    entries.push({
                        loc: `${BASE_URL}/photography/${album.id}`,
                        lastmod,
                        changefreq: 'monthly',
                        priority: '0.6',
                    });
                }
                console.log(`📷 Added ${albums.length} photo album(s) to sitemap`);
            }
        } catch (err) {
            console.warn('⚠️  Failed to fetch photo albums:', err);
        }
    }

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `    <url>
        <loc>${e.loc}</loc>
        <lastmod>${e.lastmod}</lastmod>
        <changefreq>${e.changefreq}</changefreq>
        <priority>${e.priority}</priority>
    </url>`).join('\n')}
</urlset>
`;

    const outPath = resolve(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(outPath, xml, 'utf-8');
    console.log(`✅ Sitemap generated with ${entries.length} URLs → ${outPath}`);
}

generateSitemap().catch(err => {
    console.error('❌ Sitemap generation failed:', err);
    process.exit(1);
});
