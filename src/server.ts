import { createApp } from './app';

const rawPort = process.env.PORT;
const PORT = rawPort ?? 3000;

const app = createApp();

app.listen(PORT, () => {
  if (rawPort === undefined) {
    console.warn(`PORT não definida no .env. Usando porta ${PORT}.`);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});