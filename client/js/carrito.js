// Shopping Cart Management
class CarritoManager {
  constructor() {
    this.items = this.cargarDelLocalStorage();
  }

  cargarDelLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  guardarEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.items));
    this.actualizarContador();
  }

  agregarProducto(producto, cantidad, talla) {
    const itemExistente = this.items.find(
      (item) =>
        item.productoId === producto._id && item.talla === talla
    );

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.items.push({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        equipo: producto.equipo,
        talla: talla,
        cantidad: cantidad,
      });
    }

    this.guardarEnLocalStorage();
    return true;
  }

  eliminarProducto(productoId, talla) {
    this.items = this.items.filter(
      (item) =>
        !(item.productoId === productoId && item.talla === talla)
    );

    this.guardarEnLocalStorage();
  }

  obtenerItems() {
    return this.items;
  }

  calcularTotal() {
    return this.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  calcularImpuestos(total) {
    return total * 0.05;
  }

  calcularTotalConImpuestos() {
    const subtotal = this.calcularTotal();
    return subtotal + this.calcularImpuestos(subtotal);
  }

  obtenerCantidadProductos() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  vaciar() {
    this.items = [];
    this.guardarEnLocalStorage();
  }

  actualizarContador() {
    const contador = document.getElementById('carrito-count');
    if (contador) {
      contador.textContent = this.obtenerCantidadProductos();
    }
  }

  prepararParaPedido() {
    return this.items.map((item) => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
      talla: item.talla,
    }));
  }
}

// Create global carrito instance
const carrito = new CarritoManager();

// Update cart counter on page load
document.addEventListener('DOMContentLoaded', () => {
  carrito.actualizarContador();
});
