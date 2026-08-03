import express from 'express';
import * as z from 'zod';

import { getArtist } from '../api/getArtist.js';
import { cache } from '../cache.js';
import { MarketSchema } from '../types/market.js';

const router = express.Router();

const GetArtistSchema = z.object({
  artistId: z.coerce.number().int().positive(),
  market: MarketSchema,
});

router.get('/:artistId', async (req, res, next) => {
  try {
    const { artistId, market } = GetArtistSchema.parse({
      ...req.params,
      ...req.query,
    });

    const artist = await cache.wrap(`artist-${artistId}-${market}`, () =>
      getArtist(artistId, market),
    );

    res.json(artist);
  } catch (err) {
    next(err);
  }
});

export default router;
