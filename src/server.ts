import 'dotenv/config';
import { createApp } from './app';
const PORT: number = 3000;

export const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
