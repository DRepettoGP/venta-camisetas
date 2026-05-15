import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDatabase from './config/database.js';
import { manejoErrores } from './middleware/manejoErrores.js';

import authRoutes from './routes/authRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDatabase();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client')));
app.use('/fotos', express.static(path.resolve(__dirname, '../fotos')));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.get('/api/salud', (req, res) => {
  res.status(200).json({ estado: 'Servidor funcionando correctamente' });
});

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use(manejoErrores);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
  });
}

// Exportar para Vercel
export default app;
