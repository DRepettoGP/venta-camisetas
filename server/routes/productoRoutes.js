import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerLigas,
} from '../controllers/productoController.js';
import { autenticacion, verificarAdmin } from '../middleware/autenticacion.js';

const router = express.Router();

router.get('/ligas', obtenerLigas);
router.get('/:id', obtenerProductoPorId);
router.get('/', obtenerProductos);

router.post('/', autenticacion, verificarAdmin, crearProducto);
router.put('/:id', autenticacion, verificarAdmin, actualizarProducto);
router.delete('/:id', autenticacion, verificarAdmin, eliminarProducto);

export default router;
