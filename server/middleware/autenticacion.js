import { verifyToken } from '../config/jwt.js';
import Usuario from '../models/Usuario.js';

export const autenticacion = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }

    const usuario = await Usuario.findById(decoded.userId);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en autenticación', error: error.message });
  }
};

export const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};
