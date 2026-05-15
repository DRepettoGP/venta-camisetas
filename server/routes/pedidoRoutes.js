import express from 'express';
import {
  crearPedido,
  obtenerPedidosUsuario,
  obtenerPedidoPorId,
  obtenerTodosPedidos,
  actualizarEstadoPedido,
  simularPago,
} from '../controllers/pedidoController.js';
import { autenticacion, verificarAdmin } from '../middleware/autenticacion.js';

const router = express.Router();

router.post('/', autenticacion, crearPedido);
router.post('/pago/simular', autenticacion, simularPago);
router.get('/mis-pedidos/usuario', autenticacion, obtenerPedidosUsuario);
router.get('/:id', autenticacion, obtenerPedidoPorId);

router.get('/', autenticacion, verificarAdmin, obtenerTodosPedidos);
router.put('/:id/estado', autenticacion, verificarAdmin, actualizarEstadoPedido);

export default router;
