import Hero from '../components/Hero';
import Features from '../components/Features';
import FeaturedVideos from '../components/featured/FeaturedVideos';
import Clients from '../components/Clients';
import Profile from '../components/Profile';
import MetaTags, { JsonLd, structuredData } from '../components/MetaTags';
import { SEO_CONSTANTS, META_DESCRIPTIONS } from '../lib/seo/constants';

const BASE_URL = 'https://muntasirelagami.com';

export default function Home() {
  return (
    <>
      <MetaTags
        title="Professional Video Production & Editing"
        description={META_DESCRIPTIONS.home.en}
        keywords={[
          ...SEO_CONSTANTS.UAE.PRIMARY_KEYWORDS,
          ...SEO_CONSTANTS.KSA.PRIMARY_KEYWORDS.slice(0, 3),
        ].join(', ')}
        url={BASE_URL}
        type="website"
      />
      <JsonLd
        data={structuredData.organization({
          name: 'Muntasir Elagami Production',
          url: BASE_URL,
          logo: `${BASE_URL}/logo.png`,
          description: META_DESCRIPTIONS.home.en,
          sameAs: [
            'https://www.instagram.com/ajamyproductions',
            'https://www.youtube.com/@ajamyproductions',
            'https://vimeo.com/ajamyproductions',
          ],
        })}
      />
      <Hero />
      <Features />
      <FeaturedVideos />
      <Clients />
      <Profile />
    </>
  );
}