import PortfolioGrid from '../components/Portfolio';
import MetaTags, { JsonLd, structuredData } from '../components/MetaTags';
import { META_DESCRIPTIONS, SEO_CONSTANTS } from '../lib/seo/constants';

const BASE_URL = 'https://muntasirelagami.com';

export default function Portfolio() {
  return (
    <>
      <MetaTags
        title="Video Portfolio"
        description={META_DESCRIPTIONS.portfolio.en}
        keywords={SEO_CONSTANTS.UAE.PRIMARY_KEYWORDS.join(', ')}
        url={`${BASE_URL}/portfolio`}
        type="website"
      />
      <JsonLd
        data={structuredData.breadcrumbs([
          { name: 'Home', url: BASE_URL },
          { name: 'Portfolio', url: `${BASE_URL}/portfolio` },
        ])}
      />
      <PortfolioGrid />
    </>
  );
}