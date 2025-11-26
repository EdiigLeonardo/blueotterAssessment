import express from 'express';
import type { Request, Response } from 'express'
import cors from 'cors';
import routes from './routes/index';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get('/', (_req: Request, res: Response) => res.json({ status: 'ok' }));
  app.use('/', routes);
  app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Not Found' }));
  return app;
}
