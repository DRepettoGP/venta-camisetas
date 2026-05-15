import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    items: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
        precioUnitario: {
          type: Number,
          required: true,
        },
        talla: {
          type: String,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
      default: 'pendiente',
    },
    direccionEnvio: {
      calle: String,
      ciudad: String,
      codigoPostal: String,
      pais: String,
    },
    numeroSeguimiento: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Pedido', pedidoSchema);
