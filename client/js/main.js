// Main Application Logic
let productosActuales = [];

// Modal Setup and Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
  configurarModoOscuro();
  configurarEventListenersModales();
  configurarEventListenersNavegacion();
  configurarEventListenersCarrito();
  configurarEventListenersAutenticacion();
  configurarEventListenersFiltros();

  try {
    await cargarProductos();
    await cargarFiltros();
  } catch (error) {
    ui.mostrarMensaje('Error al cargar la página', 'error');
    console.error(error);
  }
});

// Modal Event Listeners
function configurarEventListenersModales() {
  const modales = document.querySelectorAll('.modal');

  modales.forEach((modal) => {
    const cerrarBtn = modal.querySelector('.modal-close');

    if (cerrarBtn) {
      cerrarBtn.addEventListener('click', () => {
        ui.cerrarModal(modal.id);
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        ui.cerrarModal(modal.id);
      }
    });
  });
}

// Navigation Event Listeners
function configurarEventListenersNavegacion() {
  document.getElementById('carrito-btn').addEventListener('click', () => {
    ui.actualizarCarrito();
    ui.abrirModal('modal-carrito');
  });

  document.getElementById('usuario-btn').addEventListener('click', () => {
    const menu = document.getElementById('usuario-menu');
    menu.classList.toggle('active');
  });

  document.getElementById('login-link').addEventListener('click', (e) => {
    e.preventDefault();
    ui.cerrarTodosLosModales();
    ui.abrirModal('modal-login');
  });

  document.getElementById('registro-link').addEventListener('click', (e) => {
    e.preventDefault();
    ui.cerrarTodosLosModales();
    ui.abrirModal('modal-registro');
  });

  document.getElementById('ver-pedidos-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    cargarMisPedidos();
  });

  document.getElementById('logout-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    auth.cerrarSesion();
    actualizarUIAuth();
    ui.mostrarMensaje('Sesión cerrada exitosamente');
    ui.cerrarTodosLosModales();
    window.location.reload();
  });

  document.getElementById('switch-registro-link').addEventListener('click', (e) => {
    e.preventDefault();
    ui.cerrarModal('modal-login');
    ui.abrirModal('modal-registro');
  });

  document.getElementById('switch-login-link').addEventListener('click', (e) => {
    e.preventDefault();
    ui.cerrarModal('modal-registro');
    ui.abrirModal('modal-login');
  });

  document.getElementById('confirmacion-cerrar').addEventListener('click', () => {
    ui.cerrarModal('modal-confirmacion');
    carrito.vaciar();
    window.location.reload();
  });
}

// Cart Event Listeners
function configurarEventListenersCarrito() {
  document.getElementById('modal-agregar-btn').addEventListener('click', () => {
    const productoId = document.getElementById('modal-agregar-btn').dataset.productoId;
    const talla = document.getElementById('modal-talla-select').value;
    const cantidadInput = document.getElementById('modal-cantidad-input');
    const cantidad = parseInt(cantidadInput.value, 10);

    if (!talla) {
      ui.mostrarMensaje('Por favor selecciona una talla', 'error');
      return;
    }

    if (!cantidad || cantidad < 1) {
      ui.mostrarMensaje('Por favor ingresa una cantidad válida', 'error');
      return;
    }

    const producto = productosActuales.find((p) => p._id === productoId);

    if (!producto) {
      ui.mostrarMensaje('Producto no encontrado', 'error');
      return;
    }

    if (cantidad > producto.stock) {
      ui.mostrarMensaje(`No hay suficientes existencias. Stock disponible: ${producto.stock}`, 'error');
      return;
    }

    carrito.agregarProducto(producto, cantidad, talla);
    ui.actualizarCarrito();
    ui.mostrarMensaje('Producto añadido al carrito');
    ui.cerrarModal('modal-producto');
  });

  document.getElementById('carrito-proceder-btn').addEventListener('click', () => {
    if (auth.estaAutenticado()) {
      ui.abrirModal('modal-checkout');
    } else {
      ui.mostrarMensaje('Debes iniciar sesión para proceder', 'error');
      ui.abrirModal('modal-login');
    }
  });

  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const direccionEnvio = {
      calle: document.getElementById('checkout-calle').value,
      ciudad: document.getElementById('checkout-ciudad').value,
      codigoPostal: document.getElementById('checkout-codigo').value,
      pais: document.getElementById('checkout-pais').value,
    };

    try {
      const items = carrito.prepararParaPedido();
      const respuesta = await api.crearPedido(items, direccionEnvio);

      await api.simularPago(respuesta.pedido._id);

      ui.mostrarConfirmacionPago(respuesta.pedido);
      ui.cerrarModal('modal-checkout');
      ui.mostrarMensaje('Pago completado exitosamente');
    } catch (error) {
      ui.mostrarMensaje(error.mensaje || 'Error al procesar el pago', 'error');
    }
  });
}

// Authentication Event Listeners
function configurarEventListenersAutenticacion() {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const resultado = await auth.iniciarSesion(email, password);

    if (resultado.exito) {
      ui.mostrarMensaje('Bienvenido ' + auth.obtenerUsuario().nombre);
      ui.cerrarTodosLosModales();
      actualizarUIAuth();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      ui.mostrarMensaje(resultado.mensaje, 'error');
    }
  });

  document.getElementById('registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('registro-nombre').value;
    const email = document.getElementById('registro-email').value;
    const password = document.getElementById('registro-password').value;
    const confirmPassword = document.getElementById('registro-confirm').value;

    const resultado = await auth.registrar(nombre, email, password, confirmPassword);

    if (resultado.exito) {
      ui.mostrarMensaje('Registro exitoso, bienvenido ' + nombre);
      ui.cerrarTodosLosModales();
      actualizarUIAuth();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      ui.mostrarMensaje(resultado.mensaje, 'error');
    }
  });
}

// Filters Event Listeners
function configurarEventListenersFiltros() {
  document.getElementById('buscar-btn').addEventListener('click', () => {
    filtrarProductos();
  });

  document.getElementById('buscar-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      filtrarProductos();
    }
  });

  document.getElementById('filtro-liga').addEventListener('change', () => {
    filtrarProductos();
  });

  document.getElementById('filtro-equipo').addEventListener('input', () => {
    filtrarProductos();
  });

  document.getElementById('filtro-limpiar').addEventListener('click', () => {
    document.getElementById('buscar-input').value = '';
    document.getElementById('filtro-liga').value = '';
    document.getElementById('filtro-equipo').value = '';
    cargarProductos();
  });
}

// Product Loading
async function cargarProductos(filtros = {}) {
  try {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = '<div class="loading">Cargando productos...</div>';

    const respuesta = await api.obtenerProductos(filtros);
    productosActuales = respuesta.productos;

    if (productosActuales.length === 0) {
      grid.innerHTML =
        '<div class="no-productos"><h3>No se encontraron productos</h3><p>Intenta con otros filtros</p></div>';
      return;
    }

    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    productosActuales.forEach((producto) => {
      fragment.appendChild(ui.crearTarjetaProducto(producto));
    });
    grid.appendChild(fragment);
  } catch (error) {
    document.getElementById('productos-grid').innerHTML =
      `<div class="no-productos"><h3>${error.mensaje || 'Error al cargar productos'}</h3><p>Revisa MongoDB Atlas (Network Access) y MONGODB_URI en Vercel.</p></div>`;
    console.error(error);
  }
}

// Filter Products
function filtrarProductos() {
  const busqueda = document.getElementById('buscar-input').value;
  const liga = document.getElementById('filtro-liga').value;
  const equipo = document.getElementById('filtro-equipo').value;

  const filtros = {};
  if (busqueda) filtros.busqueda = busqueda;
  if (liga) filtros.liga = liga;
  if (equipo) filtros.equipo = equipo;

  cargarProductos(filtros);
}

// Load Filters
async function cargarFiltros() {
  try {
    const respuesta = await api.obtenerLigas();
    const select = document.getElementById('filtro-liga');

    respuesta.ligas.forEach((liga) => {
      const option = document.createElement('option');
      option.value = liga;
      option.textContent = liga;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar ligas:', error);
  }
}

// Dark Mode Configuration
function actualizarBotonTema(btn, isDark) {
  btn.setAttribute('aria-pressed', String(isDark));
  btn.setAttribute(
    'aria-label',
    isDark ? 'Activar modo claro' : 'Activar modo oscuro'
  );
  btn.title = isDark ? 'Modo claro' : 'Modo oscuro';
}

function configurarModoOscuro() {
  const btn = document.getElementById('modo-oscuro-btn');
  const body = document.body;

  const modoOscuro = localStorage.getItem('modoOscuro') === 'true';
  if (modoOscuro) {
    body.classList.add('dark-mode');
  }

  actualizarBotonTema(btn, modoOscuro);

  btn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('modoOscuro', isDark);
    actualizarBotonTema(btn, isDark);
  });
}

// Load User Orders
async function cargarMisPedidos() {
  try {
    const respuesta = await api.obtenerPedidosUsuario();
    ui.mostrarPedidos(respuesta.pedidos);
    ui.abrirModal('modal-pedidos');
  } catch (error) {
    ui.mostrarMensaje('Error al cargar tus pedidos', 'error');
  }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const usuarioMenu = document.getElementById('usuario-menu');
  const usuarioBtn = document.getElementById('usuario-btn');

  if (!usuarioMenu.contains(e.target) && !usuarioBtn.contains(e.target)) {
    usuarioMenu.classList.remove('active');
  }
});
