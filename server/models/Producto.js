import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    equipo: {
      type: String,
      required: true,
      trim: true,
    },
    liga: {
      type: String,
      required: true,
      enum: ['La Liga', 'Premier League', 'Serie A', 'Ligue 1', 'Bundesliga', 'Otros'],
    },
    temporada: {
      type: String,
      required: true,
    },
    talla: {
      type: [String],
      default: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    color: {
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      default: 'https://via.placeholder.com/400x500?text=Camiseta',
    },
    calificacion: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Producto', productoSchema);
