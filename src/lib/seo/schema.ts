export const getLocalBusinessSchema = (region: 'UAE' | 'KSA') => {
  const schemas = {
    UAE: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Muntasir Elagami Video Production",
      "image": "https://muntasirelagami.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AE",
        "addressRegion": "Dubai"
      },
      "url": "https://muntasirelagami.com",
      "telephone": "+971555561927",
      "priceRange": "$$"
    },
    KSA: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Muntasir Elagami Video Production",
      "image": "https://muntasirelagami.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "SA",
        "addressRegion": "Riyadh"
      },
      "url": "https://muntasirelagami.com/sa",
      "priceRange": "$$"
    }
  };

  return schemas[region];
};