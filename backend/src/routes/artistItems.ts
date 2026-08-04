import express from 'express';
import * as z from 'zod';

import { getArtistItemIds } from '../api/getArtistItemIds.js';
import { getItems } from '../api/getItems.js';
import { cache } from '../cache.js';
import type { ItemMap, Type } from '../types/item-types.js';
import { MarketSchema } from '../types/market.js';

const router = express.Router();

const createGetItemsSchema = (maxLimit: number) =>
  z.object({
    artistId: z.coerce.number().int().positive(),
    limit: z.coerce.number().int().positive().max(maxLimit).default(20),
    offset: z.coerce.number().int().nonnegative().default(0),
    market: MarketSchema,
  });

const schemas: Record<Type, ReturnType<typeof createGetItemsSchema>> = {
  songs: createGetItemsSchema(300),
  albums: createGetItemsSchema(100),
  videos: createGetItemsSchema(100),
};

const TypeSchema = z.enum(['albums', 'songs', 'videos'] satisfies Type[]);

router.get('/:artistId/:type', async (req, res, next) => {
  try {
    const type = TypeSchema.parse(req.params.type);

    const { artistId, limit, offset, market } = schemas[type].parse({
      ...req.params,
      ...req.query,
    });

    // get all artist item ids
    const allIds: number[] = await cache.wrap(`artist-${type}-ids-${artistId}-${market}`, () =>
      getArtistItemIds(type, artistId, market),
    );

    const paginatedIds: number[] = allIds.slice(offset, offset + limit);
    const missingIds: number[] = [];
    const items: ItemMap[typeof type][] = [];

    // get cached results
    const cachedResults = await Promise.all(
      paginatedIds.map((id) => cache.get<ItemMap[typeof type]>(`${type}-${id}-${market}`)),
    );

    // push items & missingIds
    cachedResults.forEach((result, i) => {
      if (result) items.push(result);
      else if (paginatedIds[i]) missingIds.push(paginatedIds[i]);
    });

    // fetch missing items
    if (missingIds.length > 0) {
      const fetchedItems = await getItems(type, missingIds, market);
      items.push(...fetchedItems);

      // cache items
      await Promise.all(
        fetchedItems.map((item) => cache.set(`${type}-${item.id}-${market}`, item)),
      );
    }

    res.json({
      items,
      offset,
      limit,
      total: allIds.length,
      hasMore: offset + limit < allIds.length,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
