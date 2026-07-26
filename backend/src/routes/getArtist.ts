import express from 'express';
import * as z from 'zod';
import { cache } from '../cache.js';
import { MarketSchema } from '../types/market.js';
import { fetchArtist } from '../api/fetchArtist.js';

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
      fetchArtist(artistId, market),
    );

    res.json(artist);
  } catch (err) {
    next(err);
  }
});

export default router;
