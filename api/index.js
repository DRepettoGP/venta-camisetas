import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDatabase from '../server/config/database.js';
import { manejoErrores } from '../server/middleware/manejoErrores.js';

import authRoutes from '../server/routes/authRoutes.js';
import productoRoutes from '../server/routes/productoRoutes.js';
import pedidoRoutes from '../server/routes/pedidoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDatabase();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Servir frontend (solo en desarrollo local)
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.resolve(__dirname, '../client')));
}

app.use('/fotos', express.static(path.resolve(__dirname, '../fotos')));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.use(manejoErrores);

// Para desarrollo local
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
  });
}

// Para Vercel (exportar la app)
export default app;
