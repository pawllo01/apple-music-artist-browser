import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as z from 'zod';

import searchRoutes from './routes/searchArtists.js';
import artistRoutes from './routes/getArtist.js';
import trackRoutes from './routes/getTracks.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/search', searchRoutes);
app.use('/artists', artistRoutes);
app.use('/artists', trackRoutes);

// https://expressjs.com/en/guide/error-handling/#the-default-error-handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Invalid request',
      details: z.prettifyError(err),
    });
  }

  return res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
