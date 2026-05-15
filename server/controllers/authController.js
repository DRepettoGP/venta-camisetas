import Usuario from '../models/Usuario.js';
import { generateToken } from '../config/jwt.js';

export const registroUsuario = async (req, res) => {
  try {
    const { nombre, email, password, confirmPassword } = req.body;

    if (!nombre || !email || !password || !confirmPassword) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
      rol: 'usuario',
    });

    await nuevoUsuario.save();

    const token = generateToken(nuevoUsuario._id);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en registro', error: error.message });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña requeridos' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordValida = await usuario.compararPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generateToken(usuario._id);

    res.status(200).json({
      mensaje: 'Sesión iniciada exitosamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en login', error: error.message });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    res.status(200).json({
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        rol: req.usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
};
