import 'dotenv/config';

import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';
import * as z from 'zod';

import artistRouter from './routes/artist.js';
import artistItemsRouter from './routes/artistItems.js';
import searchRouter from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/artists', artistRouter);
app.use('/artists', artistItemsRouter);
app.use('/search', searchRouter);

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
