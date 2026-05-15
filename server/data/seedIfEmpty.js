import Producto from '../models/Producto.js';
import Usuario from '../models/Usuario.js';
import { productosData, usuariosData } from './seedData.js';

let seedEnProgreso = null;

export const seedIfEmpty = async () => {
  if (seedEnProgreso) {
    return seedEnProgreso;
  }

  seedEnProgreso = (async () => {
    const totalProductos = await Producto.countDocuments();

    if (totalProductos > 0) {
      return { seeded: false, productos: totalProductos };
    }

    await Producto.insertMany(productosData);

    const totalUsuarios = await Usuario.countDocuments();
    if (totalUsuarios === 0) {
      for (const datos of usuariosData) {
        await new Usuario(datos).save();
      }
    }

    console.log('Base de datos poblada automáticamente (catálogo vacío)');
    return { seeded: true, productos: productosData.length };
  })();

  try {
    return await seedEnProgreso;
  } finally {
    seedEnProgreso = null;
  }
};
