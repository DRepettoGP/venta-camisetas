// UI Management
class UIManager {
  abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  cerrarTodosLosModales() {
    const modales = document.querySelectorAll('.modal.active');
    modales.forEach((modal) => modal.classList.remove('active'));
  }

  mostrarMensaje(mensaje, tipo = 'exito') {
    const mainContent = document.getElementById('main-content');
    const divMensaje = document.createElement('div');
    divMensaje.className =
      tipo === 'exito' ? 'success-message' : 'error-message';
    divMensaje.textContent = mensaje;

    mainContent.insertBefore(divMensaje, mainContent.firstChild);

    setTimeout(() => {
      divMensaje.remove();
    }, 5000);
  }

  formatearPrecio(precio) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(precio);
  }

  formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  obtenerUrlImagen(imagen) {
    if (!imagen) return imagen;
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      return imagen;
    }

    const origen = window.location.origin;
    const base = origen === 'null' || origen === '' ? 'http://localhost:5000' : origen;
    return imagen.startsWith('/') ? `${base}${imagen}` : `${base}/${imagen}`;
  }

  crearTarjetaProducto(producto) {
    const div = document.createElement('div');
    div.className = 'producto-card';

    const stockDisponible = producto.stock > 0;
    const estadoStock = stockDisponible
      ? `<span class="stock-disponible">${producto.stock} disponibles</span>`
      : '<span class="stock-agotado">Agotado</span>';

    const imagenUrl = this.obtenerUrlImagen(producto.imagen);

    div.innerHTML = `
      <img src="${imagenUrl}" alt="${producto.nombre}" class="producto-imagen">
      <div class="producto-contenido">
        <h3 class="producto-titulo">${producto.nombre}</h3>
        <p class="producto-equipo">${producto.equipo}</p>
        <span class="producto-liga">${producto.liga}</span>
        <p class="producto-descripcion">${producto.descripcion.substring(0, 100)}...</p>
        <div class="producto-precio">${this.formatearPrecio(producto.precio)}</div>
        <div class="producto-stock">${estadoStock}</div>
        <button class="producto-btn" ${!stockDisponible ? 'disabled' : ''} data-id="${producto._id}">
          ${stockDisponible ? 'Ver Detalles' : 'No Disponible'}
        </button>
      </div>
    `;

    if (stockDisponible) {
      div.querySelector('.producto-btn').addEventListener('click', () => {
        this.abrirDetalleProducto(producto);
      });
    }

    return div;
  }

  abrirDetalleProducto(producto) {
    document.getElementById('modal-nombre').textContent = producto.nombre;
    document.getElementById('modal-descripcion').textContent = producto.descripcion;
    document.getElementById('modal-precio-value').textContent = this.formatearPrecio(
      producto.precio
    );
    const stockEl = document.getElementById('modal-stock-value');
    const hayStock = producto.stock > 0;
    stockEl.textContent = hayStock ? `${producto.stock} en stock` : 'Agotado';
    stockEl.classList.toggle('modal-stock-badge--agotado', !hayStock);
    document.getElementById('modal-img').src = this.obtenerUrlImagen(producto.imagen);
    document.getElementById('modal-equipo').textContent = producto.equipo;
    document.getElementById('modal-liga').textContent = producto.liga;
    document.getElementById('modal-temporada').textContent = producto.temporada;
    document.getElementById('modal-color').textContent = producto.color;

    const tallaSelect = document.getElementById('modal-talla-select');
    tallaSelect.innerHTML = '<option value="">Seleccionar</option>';
    producto.talla.forEach((talla) => {
      const option = document.createElement('option');
      option.value = talla;
      option.textContent = talla;
      tallaSelect.appendChild(option);
    });

    const cantidadInput = document.getElementById('modal-cantidad-input');
    cantidadInput.value = 1;
    cantidadInput.max = producto.stock > 0 ? producto.stock : 1;
    cantidadInput.min = 1;

    document.getElementById('modal-agregar-btn').dataset.productoId = producto._id;

    this.abrirModal('modal-producto');
  }

  actualizarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const items = carrito.obtenerItems();

    if (items.length === 0) {
      carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
      document.getElementById('carrito-proceder-btn').disabled = true;
    } else {
      carritoItems.innerHTML = items
        .map((item) => {
          const imagenUrl = this.obtenerUrlImagen(item.imagen);
          return `
        <div class="carrito-item">
          <img src="${imagenUrl}" alt="${item.nombre}" class="carrito-item-imagen">
          <div class="carrito-item-info">
            <div class="carrito-item-nombre">${item.nombre}</div>
            <div class="carrito-item-equipo">${item.equipo}</div>
            <div class="carrito-item-precio">${this.formatearPrecio(item.precio)}</div>
            <div class="carrito-item-cantidad">Talla: ${item.talla} | Cantidad: ${item.cantidad}</div>
          </div>
          <button class="carrito-item-eliminar" data-id="${item.productoId}" data-talla="${item.talla}">
            Eliminar
          </button>
        </div>
      `;
        })
        .join('');

      document.getElementById('carrito-proceder-btn').disabled = false;

      document.querySelectorAll('.carrito-item-eliminar').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const talla = btn.dataset.talla;
          carrito.eliminarProducto(id, talla);
          this.actualizarCarrito();
        });
      });
    }

    const subtotal = carrito.calcularTotal();
    const impuestos = carrito.calcularImpuestos(subtotal);
    const total = subtotal + impuestos;

    document.getElementById('carrito-subtotal').textContent = this.formatearPrecio(subtotal);
    document.getElementById('carrito-impuestos').textContent = this.formatearPrecio(impuestos);
    document.getElementById('carrito-total').textContent = this.formatearPrecio(total);
    document.getElementById('checkout-total').textContent = this.formatearPrecio(total);
  }

  mostrarPedidos(pedidos) {
    const pedidosList = document.getElementById('pedidos-lista');

    if (!pedidos || pedidos.length === 0) {
      pedidosList.innerHTML = '<p class="carrito-vacio">No tienes pedidos</p>';
      return;
    }

    pedidosList.innerHTML = pedidos
      .map(
        (pedido) => `
      <div class="pedido-item">
        <div class="pedido-header">
          <div>
            <div class="pedido-id">Pedido #${pedido._id.substring(0, 8).toUpperCase()}</div>
            <div class="pedido-fecha">${this.formatearFecha(pedido.createdAt)}</div>
          </div>
          <span class="pedido-estado estado-${pedido.estado}">${pedido.estado.toUpperCase()}</span>
        </div>
        <div>
          <div class="pedido-items">
            ${pedido.items.map((item) => `<span class="pedido-item-tag">${item.productoId?.nombre || 'Producto'} x${item.cantidad}</span>`).join('')}
          </div>
          <div class="pedido-total">Total: ${this.formatearPrecio(pedido.total)}</div>
        </div>
      </div>
    `
      )
      .join('');
  }

  mostrarConfirmacionPago(pedido) {
    const confirmacionDetalles = document.getElementById('confirmacion-detalles');
    const subtotal = carrito.calcularTotal();
    const impuestos = carrito.calcularImpuestos(subtotal);

    confirmacionDetalles.innerHTML = `
      <div class="confirmacion-detalle-fila">
        <span>Número de Pedido:</span>
        <span>#${pedido._id.substring(0, 8).toUpperCase()}</span>
      </div>
      <div class="confirmacion-detalle-fila">
        <span>Subtotal:</span>
        <span>${this.formatearPrecio(subtotal)}</span>
      </div>
      <div class="confirmacion-detalle-fila">
        <span>Impuestos (5%):</span>
        <span>${this.formatearPrecio(impuestos)}</span>
      </div>
      <div class="confirmacion-detalle-fila">
        <span>Total Pagado:</span>
        <span>${this.formatearPrecio(pedido.total)}</span>
      </div>
    `;

    this.abrirModal('modal-confirmacion');
  }
}

// Create global UI instance
const ui = new UIManager();
