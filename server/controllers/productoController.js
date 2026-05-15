import Producto from '../models/Producto.js';
import { seedIfEmpty } from '../data/seedIfEmpty.js';

export const obtenerProductos = async (req, res) => {
  try {
    await seedIfEmpty();

    const { liga, equipo, busqueda, pagina = 1, limite = 12 } = req.query;

    const filtro = { activo: true };

    if (liga) {
      filtro.liga = liga;
    }

    if (equipo) {
      filtro.equipo = { $regex: equipo, $options: 'i' };
    }

    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } },
        { equipo: { $regex: busqueda, $options: 'i' } },
      ];
    }

    const skip = (pagina - 1) * limite;

    const productos = await Producto.find(filtro)
      .limit(limite)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Producto.countDocuments(filtro);

    res.status(200).json({
      productos,
      paginacion: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(total / limite),
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.status(200).json({ producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, equipo, liga, temporada, color, talla, imagen } = req.body;

    if (!nombre || !descripcion || !precio || stock === undefined || !equipo || !liga || !temporada || !color) {
      return res.status(400).json({ mensaje: 'Campos requeridos faltantes' });
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      stock,
      equipo,
      liga,
      temporada,
      color,
      talla: talla || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      imagen,
    });

    await nuevoProducto.save();

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    const producto = await Producto.findByIdAndUpdate(id, actualizaciones, { new: true });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Producto actualizado exitosamente',
      producto,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByIdAndDelete(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
};

export const obtenerLigas = async (req, res) => {
  try {
    await seedIfEmpty();
    const ligas = await Producto.distinct('liga');
    res.status(200).json({ ligas });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ligas', error: error.message });
  }
};
