import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    rol: {
      type: String,
      enum: ['usuario', 'administrador'],
      default: 'usuario',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcryptjs.compare(passwordIngresada, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);
