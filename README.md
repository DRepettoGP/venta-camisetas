# La Grada — Plataforma Online de Venta de Camisetas de Fútbol

Plataforma web de comercio electrónico especializada en camisetas de fútbol de equipos nacionales e internacionales. Proyecto académico desarrollado con arquitectura cliente-servidor, autenticación JWT y base de datos MongoDB.

🌐 **Demo en producción:** [venta-camisetas.vercel.app](https://venta-camisetas.vercel.app)

---

## Funcionalidades

### Usuario
- Registro e inicio de sesión con autenticación segura (JWT)
- Catálogo de camisetas organizado por liga y equipo
- Buscador y filtros por liga y equipo
- Ficha detallada de cada producto (equipo, liga, temporada, talla, color, precio)
- Carrito de compra con gestión de cantidades
- Proceso de compra simulado con dirección de envío y datos de pago
- Historial de pedidos realizados

### Administrador
- Panel de administración para añadir, editar y eliminar productos
- Visualización y gestión del estado de todos los pedidos
- Acceso con credenciales de demo:
  - **Email:** admin@ventacamisetas.com
  - **Contraseña:** admin123456

---

## Tecnologías

**Frontend**
- HTML5, CSS3, JavaScript Vanilla
- Diseño responsive con CSS variables y media queries

**Backend**
- Node.js + Express
- MongoDB Atlas con Mongoose ODM
- Autenticación con JWT
- Cifrado de contraseñas con bcryptjs
- Seguridad de headers con Helmet

**Herramientas**
- Git + GitHub (control de versiones)
- Vercel (despliegue)
- MongoDB Atlas (base de datos en la nube)
- Visual Studio Code

