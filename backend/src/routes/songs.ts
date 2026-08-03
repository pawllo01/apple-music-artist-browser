import express from 'express';
import * as z from 'zod';

import { getArtistTrackIds } from '../api/getArtistTrackIds.js';
import { getTracksByIds } from '../api/getTracksByIds.js';
import { cache } from '../cache.js';
import { MarketSchema } from '../types/market.js';
import type { Song } from '../types/song.js';

const router = express.Router();

const GetTracksSchema = z.object({
  artistId: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().positive().max(300).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
  market: MarketSchema,
});

router.get('/:artistId/songs', async (req, res, next) => {
  try {
    const { artistId, limit, offset, market } = GetTracksSchema.parse({
      ...req.params,
      ...req.query,
    });

    // get all artist track ids
    const allIds: number[] = await cache.wrap(`artist-track-ids-${artistId}-${market}`, () =>
      getArtistTrackIds(artistId, market),
    );

    const paginatedIds: number[] = allIds.slice(offset, offset + limit);
    const missingIds: number[] = [];
    const tracks: Song[] = [];

    // get cached results
    const cachedResults = await Promise.all(
      paginatedIds.map((id) => cache.get<Song>(`track-${id}-${market}`)),
    );

    // push tracks & missingIds
    cachedResults.forEach((result, i) => {
      if (result) tracks.push(result);
      else if (paginatedIds[i]) missingIds.push(paginatedIds[i]);
    });

    // fetch missing tracks
    if (missingIds.length > 0) {
      const fetchedTracks = await getTracksByIds(missingIds, market);
      tracks.push(...fetchedTracks);

      // cache tracks
      await Promise.all(
        fetchedTracks.map((track) => cache.set(`track-${track.id}-${market}`, track)),
      );
    }

    res.json({
      items: tracks,
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
