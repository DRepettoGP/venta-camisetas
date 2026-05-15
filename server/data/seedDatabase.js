import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Producto from '../models/Producto.js';
import Usuario from '../models/Usuario.js';
import { productosData, usuariosData } from './seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const conectar = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no está definida. Crea un archivo .env en la raíz del proyecto.');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log('Conectado a MongoDB');
};

const seed = async () => {
  try {
    await conectar();

    await Producto.deleteMany({});
    await Usuario.deleteMany({});

    await Producto.insertMany(productosData);
    console.log('Productos insertados exitosamente');

    for (const datos of usuariosData) {
      await new Usuario(datos).save();
    }
    console.log('Usuarios insertados exitosamente');

    console.log('Base de datos poblada con datos de ejemplo');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error.message);
    process.exit(1);
  }
};

seed();
