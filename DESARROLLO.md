GUÍA DE DESARROLLO Y PERSONALIZACIÓN
=====================================================

Esta guía te ayuda a personalizar y extender el proyecto.


CAMBIAR DATOS DE EJEMPLO
=====================================================

Los datos iniciales están en: server/data/seedDatabase.js

Para modificar productos:

1. Editar productosData en seedDatabase.js
2. Agregar o modificar objetos en el array
3. Ejecutar: npm run seed

Campos disponibles:
- nombre: string
- descripcion: string
- precio: number
- stock: number
- equipo: string
- liga: enum ["La Liga", "Premier League", "Serie A", "Ligue 1", "Bundesliga", "Otros"]
- temporada: string (ej: "2024/25")
- color: string
- talla: array de strings
- imagen: URL string
- calificacion: number (0-5)


PERSONALIZAR ESTILOS
=====================================================

Colores principales están en: client/css/estilos.css

Editar variables CSS:
```css
:root {
  --color-primario: #1e40af;      /* Azul principal */
  --color-secundario: #dc2626;    /* Rojo secundario */
  --color-fondo: #f8fafc;         /* Fondo gris claro */
  --color-texto: #1e293b;         /* Texto oscuro */
  /* ... más colores */
}
```

Cambiar esquema de colores completo:
- Editar variables CSS en raíz
- Se aplicarán automáticamente en todo el sitio
- No necesita reiniciar servidor


AGREGAR NUEVA PÁGINA
=====================================================

1. Crear archivo HTML:
   client/pages/nueva-pagina.html

2. Copiar estructura base:
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nueva Página</title>
  <link rel="stylesheet" href="../css/estilos.css">
</head>
<body>
  <nav><!-- copiar navbar de index.html --></nav>
  <main>
    <!-- Tu contenido -->
  </main>
  <footer><!-- copiar footer de index.html --></footer>
</body>
</html>
```

3. Agregar link en navbar (index.html):
```html
<li><a href="pages/nueva-pagina.html" class="nav-link">Nueva Página</a></li>
```


AGREGAR NUEVOS PRODUCTOS VÍA API
=====================================================

Método POST (requiere ser admin):

URL: http://localhost:5000/api/productos

Headers:
```
Authorization: Bearer [tu-jwt-token]
Content-Type: application/json
```

Body:
```json
{
  "nombre": "Nombre de Camiseta",
  "descripcion": "Descripción completa",
  "precio": 89.99,
  "stock": 50,
  "equipo": "Nombre del Equipo",
  "liga": "La Liga",
  "temporada": "2024/25",
  "color": "Color principal",
  "talla": ["XS", "S", "M", "L", "XL", "XXL"],
  "imagen": "https://url-de-imagen.com/imagen.jpg",
  "calificacion": 0
}
```

Puedes usar Postman para hacer estas pruebas.


AGREGAR NUEVA FUNCIONALIDAD
=====================================================

Ejemplo: Sistema de comentarios en productos

1. Crear modelo (server/models/Comentario.js):
```javascript
import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  texto: String,
  calificacion: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Comentario', comentarioSchema);
```

2. Crear controlador (server/controllers/comentarioController.js)

3. Crear rutas (server/routes/comentarioRoutes.js)

4. Agregar rutas a server.js:
```javascript
import comentarioRoutes from './routes/comentarioRoutes.js';
app.use('/api/comentarios', comentarioRoutes);
```

5. Actualizar cliente para mostrar/agregar comentarios


MODIFICAR VALIDACIÓN DE DATOS
=====================================================

En server/controllers/productoController.js:

```javascript
// Agregar validación personalizada
if (precio < 0 || precio > 500) {
  return res.status(400).json({ 
    mensaje: 'Precio debe estar entre 0 y 500' 
  });
}

if (stock < 0) {
  return res.status(400).json({ 
    mensaje: 'Stock no puede ser negativo' 
  });
}
```


AGREGAR FILTROS AVANZADOS
=====================================================

En server/controllers/productoController.js:

```javascript
// Filtro por rango de precio
if (filtro.precioMin || filtro.precioMax) {
  filtro.precio = {};
  if (filtro.precioMin) {
    filtro.precio.$gte = parseFloat(filtro.precioMin);
  }
  if (filtro.precioMax) {
    filtro.precio.$lte = parseFloat(filtro.precioMax);
  }
}

// Ordenamiento
const ordenamiento = req.query.orden === 'precio_asc' 
  ? { precio: 1 } 
  : { precio: -1 };

const productos = await Producto.find(filtro).sort(ordenamiento);
```

En cliente:
```javascript
// En main.js agregar:
const precioMin = document.getElementById('precio-min')?.value;
const precioMax = document.getElementById('precio-max')?.value;

filtrarProductos() toma estos parámetros
```


CAMBIAR FLUJO DE PAGO
=====================================================

Actualmente es simulado. Para integraciones reales:

1. Stripe:
```javascript
// server/controllers/pedidoController.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const procesarPagoStripe = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(pedido.total * 100),
      currency: 'usd',
      // ... más configuración
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

2. PayPal:
```javascript
// Similar a Stripe, usar SDK de PayPal
```

3. Otras:
- Mercado Pago
- 2Checkout
- Square


AGREGAR NOTIFICACIONES POR EMAIL
=====================================================

Usar nodemailer:

```bash
npm install nodemailer
```

```javascript
// server/config/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const enviarConfirmacionCompra = async (email, pedido) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmación de tu pedido',
    html: `<h1>Pedido #${pedido._id}</h1>...`
  });
};
```


OPTIMIZAR IMÁGENES
=====================================================

Para mejor rendimiento:

1. Comprimir imágenes:
```bash
# Usando ImageMagick
convert imagen.jpg -quality 85 imagen-optimizado.jpg

# O usar: tinypng.com, imageoptim.com
```

2. Usar formatos modernos:
```html
<picture>
  <source srcset="imagen.webp" type="image/webp">
  <img src="imagen.jpg" alt="Descripción">
</picture>
```

3. Lazy loading:
```html
<img src="..." alt="..." loading="lazy">
```


AGREGAR PANEL ADMIN COMPLETO
=====================================================

Crear nueva página: client/pages/admin.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <title>Panel Admin</title>
  <link rel="stylesheet" href="../css/estilos.css">
</head>
<body>
  <div class="admin-container">
    <h1>Panel de Administración</h1>
    
    <section class="admin-productos">
      <h2>Gestionar Productos</h2>
      <div id="productos-tabla"></div>
      <button id="btn-agregar-producto" class="btn-primario">
        Agregar Producto
      </button>
    </section>
    
    <section class="admin-pedidos">
      <h2>Gestionar Pedidos</h2>
      <div id="pedidos-tabla"></div>
    </section>
  </div>
  
  <script src="../js/admin.js"></script>
</body>
</html>
```

Crear: client/js/admin.js con funciones de CRUD completas.


TESTING MANUAL
=====================================================

1. Testear registro:
   - Intentar registrar con email ya existente
   - Intentar registrar con contraseñas que no coinciden
   - Intentar registrar con campos vacíos

2. Testear productos:
   - Buscar producto que existe
   - Buscar producto que no existe
   - Filtrar por liga
   - Verificar precios correctos

3. Testear carrito:
   - Agregar mismo producto dos veces (debe sumar cantidad)
   - Eliminar producto del carrito
   - Vaciar carrito completo

4. Testear pedido:
   - Intentar hacer pedido sin estar logueado
   - Intentar hacer pedido con carrito vacío
   - Completar pedido exitoso


DEBUGGING
=====================================================

Frontend:
- Abrir F12 (DevTools)
- Ver Console tab para errores
- Ver Network tab para solicitudes API
- Ver Application > Storage > LocalStorage para datos guardados

Backend:
- Ver terminal donde corre npm run dev
- Agregar console.log() para debugging
- Usar debugger de VS Code:
  ```json
  // .vscode/launch.json
  {
    "version": "0.2.0",
    "configurations": [{
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/server.js"
    }]
  }
  ```

Base de datos:
- Usar MongoDB Compass para visualizar datos
- Verificar índices están creados
- Ver tamaño de colecciones


MEJORAR RENDIMIENTO
=====================================================

1. Frontend:
   - Minificar CSS y JS
   - Comprimir imágenes
   - Lazy loading
   - Service workers para caché

2. Backend:
   - Agregar índices a BD
   - Implementar caching
   - Usar CDN para archivos estáticos
   - Rate limiting

3. Monitoreo:
   - Usar Lighthouse
   - WebPageTest
   - New Relic
   - DataDog


INTERNACIONALIZACIÓN (i18n)
=====================================================

Crear carpeta client/locales/:
```
locales/
  ├── es.json
  ├── en.json
  └── fr.json
```

Archivo es.json:
```json
{
  "nav.catalogo": "Catálogo",
  "nav.carrito": "Carrito",
  "producto.detalles": "Ver Detalles",
  "btn.agregar": "Agregar al Carrito"
}
```

Crear función en cliente:
```javascript
const idioma = localStorage.getItem('idioma') || 'es';
const i18n = require(`./locales/${idioma}.json`);

function t(key) {
  return i18n[key] || key;
}
```


VERSIONAMIENTO DE API
=====================================================

Hacer la API más flexible para futuro:

```javascript
// Usar versionamiento en rutas
app.use('/api/v1/productos', productoRoutesV1);
app.use('/api/v2/productos', productoRoutesV2);
```

Beneficios:
- Mantener compatibilidad hacia atrás
- Deprecar endpoints antiguos gradualmente
- Mejor para aplicaciones móviles


PREGUNTAS FRECUENTES DE DESARROLLO
=====================================================

P: ¿Cómo cambio el puerto?
R: Editar variable PORT en .env

P: ¿Cómo agrego más campos a usuario?
R: Editar schema en server/models/Usuario.js

P: ¿Cómo hago backup de BD?
R: MongoDB Atlas > Backups > Crear backup

P: ¿Cómo reinicio la BD?
R: Ejecutar npm run seed (CUIDADO: borra todo)

P: ¿Cómo veo logs de la API?
R: Ver consola donde está npm run dev

P: ¿Cómo cambio el tiempo de expiración del JWT?
R: Editar server/config/jwt.js, función generateToken


RECURSOS DE AYUDA
=====================================================

Documentación oficial:
- Express: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- Mongoose: https://mongoosejs.com/
- JWT: https://jwt.io/

Herramientas:
- Postman: https://www.postman.com/
- MongoDB Compass: https://www.mongodb.com/products/tools/compass
- VS Code: https://code.visualstudio.com/

Comunidades:
- Stack Overflow
- GitHub Discussions
- MDN Web Docs

Cursos:
- freeCodeCamp
- Udemy
- Coursera
