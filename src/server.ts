import express from 'express';
import type { Request, Response } from 'express'
import cors from 'cors';
import routes from './routes/index';
import swaggerUi from 'swagger-ui-express'
import { openapi } from './openapi'
import 'dotenv/config';
const PORT: number = 3000;

export function initApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get('/openapi.json', (_req: Request, res: Response) => res.json(openapi))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi))
  app.get('/', (_req: Request, res: Response) => res.json({ status: 'ok' }));
  app.use('/', routes);
  app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Not Found' }));
  return app;
}

const app = initApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
