import express from 'express';
import cors from 'cors';
import routes from './routes/index';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get('/', (_req, res) => res.json({ status: 'ok' }));
  app.use('/', routes);
  app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));
  return app;
}