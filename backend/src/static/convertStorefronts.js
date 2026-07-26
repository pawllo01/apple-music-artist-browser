import fs from 'fs';
import storefronts from './storefronts-orig.json' with { type: 'json' };
import markets from './markets.json' with { type: 'json' };

const allowedStorefronts = storefronts.reduce((acc, storefront) => {
  const code = storefront.info.slice(0, 2).toLowerCase();

  if (markets.includes(code)) {
    acc[code] = {
      code,
      ...storefront,
      // storefront: `${storefront.storefront.split('-')[0]},0`,
    };
  }

  return acc;
}, {});

fs.writeFileSync('./storefronts.json', JSON.stringify(allowedStorefronts, null, 2));
