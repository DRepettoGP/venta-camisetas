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
const isVercel = process.env.VERCEL === '1';

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json());

if (!isVercel) {
  app.use(express.static(path.resolve(__dirname, '../client')));
  app.use('/fotos', express.static(path.resolve(__dirname, '../fotos')));
}

const ensureDatabase = async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    const esProduccion =
      process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

    let mensaje = 'No se pudo conectar a la base de datos';

    if (!process.env.MONGODB_URI) {
      mensaje =
        'Falta la variable MONGODB_URI en Vercel (Settings → Environment Variables)';
    } else if (error.message?.includes('whitelist') || error.message?.includes('IP')) {
      mensaje =
        'MongoDB Atlas bloquea la conexión. En Atlas → Network Access, añade 0.0.0.0/0 (Allow from anywhere)';
    }

    res.status(503).json({
      mensaje,
      error: esProduccion ? undefined : error.message,
    });
  }
};

app.get('/api/salud', (req, res) => {
  res.status(200).json({ estado: 'Servidor funcionando correctamente' });
});

app.use('/api', ensureDatabase);

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

if (!isVercel) {
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }
    if (req.method === 'GET' || req.method === 'HEAD') {
      return res.sendFile(path.join(__dirname, '../client/index.html'));
    }
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
  });
} else {
  app.use('/api', (req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
  });
}

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
