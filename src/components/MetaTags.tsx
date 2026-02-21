import { useEffect } from 'react';

interface MetaTagsProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    author?: string;
    publishedTime?: string;
    locale?: string;
    siteName?: string;
    twitterCard?: 'summary' | 'summary_large_image' | 'player';
}

/**
 * Sets document meta tags for SEO, Open Graph, and Twitter Cards.
 * Call in each page component with page-specific data.
 */
export default function MetaTags({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author = 'Ajamy Productions',
    publishedTime,
    locale = 'en_US',
    siteName = 'Ajamy Productions',
    twitterCard = 'summary_large_image',
}: MetaTagsProps) {
    useEffect(() => {
        // Title
        document.title = `${title} | ${siteName}`;

        // Helper
        const setMeta = (nameOrProperty: string, content: string, isProperty = false) => {
            const attr = isProperty ? 'property' : 'name';
            let el = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, nameOrProperty);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        // Standard meta
        setMeta('description', description);
        if (keywords) setMeta('keywords', keywords);
        setMeta('author', author);

        // Open Graph
        setMeta('og:title', title, true);
        setMeta('og:description', description, true);
        setMeta('og:type', type, true);
        setMeta('og:locale', locale, true);
        setMeta('og:site_name', siteName, true);
        if (url) setMeta('og:url', url, true);
        if (image) setMeta('og:image', image, true);
        if (publishedTime) setMeta('article:published_time', publishedTime, true);
        if (author) setMeta('article:author', author, true);

        // Twitter Card
        setMeta('twitter:card', twitterCard);
        setMeta('twitter:title', title);
        setMeta('twitter:description', description);
        if (image) setMeta('twitter:image', image);

        // Geo tags for UAE/KSA targeting
        setMeta('geo.region', 'AE');
        setMeta('geo.placename', 'Dubai');

        return () => {
            // Cleanup is optional — tags persist for SPA navigation
        };
    }, [title, description, keywords, image, url, type, author, publishedTime, locale, siteName, twitterCard]);

    return null;
}

/**
 * Generate JSON-LD structured data for different content types.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        script.id = `jsonld-${data['@type'] || 'default'}`;

        // Remove existing script with same ID
        const existing = document.getElementById(script.id);
        if (existing) existing.remove();

        document.head.appendChild(script);

        return () => {
            script.remove();
        };
    }, [data]);

    return null;
}

// Pre-built structured data generators
export const structuredData = {
    organization: (opts: { name: string; url: string; logo?: string; description?: string; sameAs?: string[] }) => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: opts.name,
        url: opts.url,
        ...(opts.logo && { logo: opts.logo }),
        ...(opts.description && { description: opts.description }),
        ...(opts.sameAs && { sameAs: opts.sameAs }),
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressCountry: 'AE',
        },
    }),

    videoObject: (opts: { name: string; description: string; thumbnailUrl: string; uploadDate: string; embedUrl?: string }) => ({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: opts.name,
        description: opts.description,
        thumbnailUrl: opts.thumbnailUrl,
        uploadDate: opts.uploadDate,
        ...(opts.embedUrl && { embedUrl: opts.embedUrl }),
    }),

    blogPosting: (opts: { headline: string; description: string; datePublished: string; author: string; image?: string; url?: string }) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: opts.headline,
        description: opts.description,
        datePublished: opts.datePublished,
        author: {
            '@type': 'Person',
            name: opts.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Ajamy Productions',
        },
        ...(opts.image && { image: opts.image }),
        ...(opts.url && { url: opts.url }),
    }),

    imageGallery: (opts: { name: string; description: string; images: { url: string; name: string }[] }) => ({
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: opts.name,
        description: opts.description,
        image: opts.images.map(img => ({
            '@type': 'ImageObject',
            contentUrl: img.url,
            name: img.name,
        })),
    }),

    breadcrumbs: (items: { name: string; url: string }[]) => ({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    }),
};
