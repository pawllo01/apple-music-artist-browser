import express from 'express';
import * as z from 'zod';

import { getArtists } from '../api/getArtists.js';
import { cache } from '../cache.js';
import { MarketSchema } from '../types/market.js';

const router = express.Router();

const SearchSchema = z.object({
  term: z.string().trim().toLowerCase().min(1).max(100),
  market: MarketSchema,
});

router.get('', async (req, res, next) => {
  try {
    const { term, market } = SearchSchema.parse(req.query);

    const artists = await cache.wrap(`search-${term}`, () => getArtists(term, market));

    res.json(artists);
  } catch (err) {
    next(err);
  }
});

export default router;
