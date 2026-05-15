import Pedido from '../models/Pedido.js';
import Producto from '../models/Producto.js';

export const crearPedido = async (req, res) => {
  try {
    const { items, direccionEnvio } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ mensaje: 'El pedido debe contener al menos un producto' });
    }

    let total = 0;
    const itemsValidos = [];

    for (const item of items) {
      const producto = await Producto.findById(item.productoId);

      if (!producto) {
        return res.status(404).json({ mensaje: `Producto ${item.productoId} no encontrado` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para ${producto.nombre}` });
      }

      itemsValidos.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        talla: item.talla,
      });

      total += producto.precio * item.cantidad;
    }

    const nuevoPedido = new Pedido({
      usuarioId: req.usuario._id,
      items: itemsValidos,
      total,
      direccionEnvio: direccionEnvio || {},
      estado: 'pendiente',
    });

    await nuevoPedido.save();

    for (const item of itemsValidos) {
      await Producto.findByIdAndUpdate(
        item.productoId,
        { $inc: { stock: -item.cantidad } }
      );
    }

    res.status(201).json({
      mensaje: 'Pedido creado exitosamente',
      pedido: nuevoPedido,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear pedido', error: error.message });
  }
};

export const obtenerPedidosUsuario = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuarioId: req.usuario._id })
      .populate('items.productoId', 'nombre precio imagen')
      .sort({ createdAt: -1 });

    res.status(200).json({ pedidos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
  }
};

export const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findById(id).populate('items.productoId', 'nombre precio imagen');

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    if (pedido.usuarioId.toString() !== req.usuario._id.toString() && req.usuario.rol !== 'administrador') {
      return res.status(403).json({ mensaje: 'No autorizado para ver este pedido' });
    }

    res.status(200).json({ pedido });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedido', error: error.message });
  }
};

export const obtenerTodosPedidos = async (req, res) => {
  try {
    const { estado, pagina = 1, limite = 20 } = req.query;

    const filtro = {};
    if (estado) {
      filtro.estado = estado;
    }

    const skip = (pagina - 1) * limite;

    const pedidos = await Pedido.find(filtro)
      .populate('usuarioId', 'nombre email')
      .populate('items.productoId', 'nombre precio')
      .limit(limite)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Pedido.countDocuments(filtro);

    res.status(200).json({
      pedidos,
      paginacion: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(total / limite),
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
  }
};

export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, numeroSeguimiento } = req.body;

    if (!['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'].includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado inválido' });
    }

    const actualizaciones = { estado };
    if (numeroSeguimiento) {
      actualizaciones.numeroSeguimiento = numeroSeguimiento;
    }

    const pedido = await Pedido.findByIdAndUpdate(id, actualizaciones, { new: true });

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Pedido actualizado exitosamente',
      pedido,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar pedido', error: error.message });
  }
};

export const simularPago = async (req, res) => {
  try {
    const { pedidoId } = req.body;

    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    if (pedido.usuarioId.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    pedido.estado = 'pagado';
    await pedido.save();

    res.status(200).json({
      mensaje: 'Pago procesado exitosamente (simulado)',
      pedido,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al procesar pago', error: error.message });
  }
};
