export const manejoErrores = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: Object.values(err.errors).map(e => e.message),
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      mensaje: 'Duplicado',
      errores: [`${Object.keys(err.keyPattern)[0]} ya existe`],
    });
  }

  res.status(err.status || 500).json({
    mensaje: err.mensaje || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
