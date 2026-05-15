// Authentication Management
class AuthManager {
  constructor() {
    this.usuario = this.cargarUsuario();
  }

  cargarUsuario() {
    const usuarioGuardado = localStorage.getItem('usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  }

  guardarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
  }

  eliminarUsuario() {
    localStorage.removeItem('usuario');
    this.usuario = null;
  }

  async registrar(nombre, email, password, confirmPassword) {
    try {
      const respuesta = await api.registro(nombre, email, password, confirmPassword);

      api.setToken(respuesta.token);
      this.guardarUsuario(respuesta.usuario);

      return { exito: true, mensaje: 'Registro exitoso' };
    } catch (error) {
      return {
        exito: false,
        mensaje: error.mensaje,
        errores: error.errores,
      };
    }
  }

  async iniciarSesion(email, password) {
    try {
      const respuesta = await api.login(email, password);

      api.setToken(respuesta.token);
      this.guardarUsuario(respuesta.usuario);

      return { exito: true, mensaje: 'Sesión iniciada exitosamente' };
    } catch (error) {
      return {
        exito: false,
        mensaje: error.mensaje,
        errores: error.errores,
      };
    }
  }

  cerrarSesion() {
    api.clearToken();
    this.eliminarUsuario();
    carrito.vaciar();
  }

  estaAutenticado() {
    return !!this.usuario && !!api.getToken();
  }

  esAdmin() {
    return this.usuario && this.usuario.rol === 'administrador';
  }

  obtenerUsuario() {
    return this.usuario;
  }
}

// Create global auth instance
const auth = new AuthManager();

// Update UI on page load based on auth state
document.addEventListener('DOMContentLoaded', () => {
  actualizarUIAuth();
});

function actualizarUIAuth() {
  const loginLink = document.getElementById('login-link');
  const registroLink = document.getElementById('registro-link');
  const logoutLink = document.getElementById('logout-link');
  const verPedidosLink = document.getElementById('ver-pedidos-link');
  const adminLink = document.getElementById('admin-link');

  if (auth.estaAutenticado()) {
    loginLink.style.display = 'none';
    registroLink.style.display = 'none';
    logoutLink.style.display = 'block';
    verPedidosLink.style.display = 'block';

    if (auth.esAdmin()) {
      adminLink.style.display = 'block';
    } else {
      adminLink.style.display = 'none';
    }
  } else {
    loginLink.style.display = 'block';
    registroLink.style.display = 'block';
    logoutLink.style.display = 'none';
    verPedidosLink.style.display = 'none';
    adminLink.style.display = 'none';
  }
}
