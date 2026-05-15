import express from 'express';
import { registroUsuario, loginUsuario, obtenerPerfil } from '../controllers/authController.js';
import { autenticacion } from '../middleware/autenticacion.js';

const router = express.Router();

router.post('/registro', registroUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', autenticacion, obtenerPerfil);

export default router;
