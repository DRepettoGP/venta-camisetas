// API Configuration and Services
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`;

class APIService {
  constructor() {
    this.token = localStorage.getItem('token') || null;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          mensaje: data.mensaje || 'Error en la solicitud',
          errores: data.errores || [],
        };
      }

      return data;
    } catch (error) {
      if (error.status === 401) {
        this.clearToken();
        window.location.reload();
      }
      throw error;
    }
  }

  // Authentication endpoints
  async registro(nombre, email, password, confirmPassword) {
    return this.request('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password, confirmPassword }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async obtenerPerfil() {
    return this.request('/auth/perfil', { method: 'GET' });
  }

  // Products endpoints
  async obtenerProductos(filtros = {}) {
    const params = new URLSearchParams();

    if (filtros.liga) params.append('liga', filtros.liga);
    if (filtros.equipo) params.append('equipo', filtros.equipo);
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros.pagina) params.append('pagina', filtros.pagina);
    if (filtros.limite) params.append('limite', filtros.limite);

    const queryString = params.toString();
    const endpoint = queryString ? `/productos?${queryString}` : '/productos';

    return this.request(endpoint, { method: 'GET' });
  }

  async obtenerProductoPorId(id) {
    return this.request(`/productos/${id}`, { method: 'GET' });
  }

  async obtenerLigas() {
    return this.request('/productos/ligas', { method: 'GET' });
  }

  async crearProducto(producto) {
    return this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  }

  async actualizarProducto(id, producto) {
    return this.request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    });
  }

  async eliminarProducto(id) {
    return this.request(`/productos/${id}`, { method: 'DELETE' });
  }

  // Orders endpoints
  async crearPedido(items, direccionEnvio) {
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify({ items, direccionEnvio }),
    });
  }

  async obtenerPedidosUsuario() {
    return this.request('/pedidos/mis-pedidos/usuario', { method: 'GET' });
  }

  async obtenerPedidoPorId(id) {
    return this.request(`/pedidos/${id}`, { method: 'GET' });
  }

  async obtenerTodosPedidos(filtros = {}) {
    const params = new URLSearchParams();

    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.pagina) params.append('pagina', filtros.pagina);

    const queryString = params.toString();
    const endpoint = queryString ? `/pedidos?${queryString}` : '/pedidos';

    return this.request(endpoint, { method: 'GET' });
  }

  async actualizarEstadoPedido(id, estado, numeroSeguimiento = null) {
    return this.request(`/pedidos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado, numeroSeguimiento }),
    });
  }

  async simularPago(pedidoId) {
    return this.request('/pedidos/pago/simular', {
      method: 'POST',
      body: JSON.stringify({ pedidoId }),
    });
  }

  async verificarSalud() {
    return this.request('/salud', { method: 'GET' });
  }
}

// Create global API instance
const api = new APIService();
