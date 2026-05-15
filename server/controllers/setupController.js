import { seedIfEmpty } from '../data/seedIfEmpty.js';

export const poblarBaseDeDatos = async (req, res) => {
  try {
    const secret = process.env.SETUP_SECRET;

    if (secret && req.headers['x-setup-secret'] !== secret) {
      return res.status(401).json({ mensaje: 'No autorizado' });
    }

    const resultado = await seedIfEmpty();

    res.status(200).json({
      mensaje: resultado.seeded
        ? 'Catálogo inicial cargado correctamente'
        : 'La base de datos ya tenía productos',
      ...resultado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al poblar la base de datos',
      error: error.message,
    });
  }
};
