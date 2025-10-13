import express from 'express';
import cors from 'cors';
import routes from './routes';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get('/', (_req, res) => res.json({ status: 'ok' }));
  app.use('/', routes);
  return app;
}