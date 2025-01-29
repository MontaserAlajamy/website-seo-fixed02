import React from 'react';
import { Helmet } from 'react-helmet';
import { META_DESCRIPTIONS } from '../../lib/seo/constants';

interface MetaTagsProps {
  title: string;
  description?: string;
  path: string;
  locale: 'en' | 'ar';
  region?: 'ae' | 'sa';
}

export default function MetaTags({ title, description, path, locale, region }: MetaTagsProps) {
  const baseUrl = 'https://muntasirelagami.com';
  const currentUrl = `${baseUrl}${region ? `/${region}` : ''}${locale === 'ar' ? '/ar' : ''}${path}`;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      
      {/* hreflang tags */}
      <link rel="alternate" href={`${baseUrl}${path}`} hreflang="en" />
      <link rel="alternate" href={`${baseUrl}/ae/ar${path}`} hreflang="ar-ae" />
      <link rel="alternate" href={`${baseUrl}/sa/ar${path}`} hreflang="ar-sa" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={locale === 'ar' ? 'ar_AE' : 'en_US'} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}