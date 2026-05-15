# La Grada - Plataforma Online de Venta de Camisetas de Fútbol

Plataforma web profesional de comercio electrónico especializada en la venta de camisetas de fútbol de equipos nacionales e internacionales. Proyecto desarrollado con tecnologías modernas siguiendo mejores prácticas de desarrollo.

## Características Principales

- **Catálogo Completo**: Camisetas de múltiples ligas internacionales (La Liga, Premier League, Serie A, Ligue 1, Bundesliga)
- **Sistema de Autenticación**: Registro e inicio de sesión seguro con cifrado de contraseñas
- **Carrito de Compra Funcional**: Gestión completa de productos seleccionados
- **Proceso de Compra Simulado**: Flujo de checkout con pago simulado
- **Historial de Pedidos**: Los usuarios pueden consultar sus compras anteriores
- **Panel de Administración Básico**: Gestión de productos para administradores
- **Búsqueda y Filtros**: Búsqueda por equipo, liga y términos generales
- **Diseño Responsive**: Compatible con dispositivos móviles, tablets y desktop
- **Interfaz Intuitiva**: Experiencia de usuario clara y profesional

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y media queries
- **JavaScript Vanilla**: Lógica de aplicación sin dependencias de frameworks

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web minimalista
- **MongoDB**: Base de datos NoSQL con Mongoose ODM
- **JWT**: Autenticación segura con tokens
- **Bcryptjs**: Cifrado de contraseñas

### Herramientas y Servicios
- **Git & GitHub**: Control de versiones
- **MongoDB Atlas**: Base de datos en la nube
- **Vercel**: Plataforma de despliegue
- **Visual Studio Code**: Editor de código

## Requisitos Previos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Cuenta en MongoDB Atlas
- Git instalado

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ProyectoVentaCamisetas.git
cd ProyectoVentaCamisetas
```

### 2. Configurar el servidor

```bash
cd server
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la carpeta `server`:

```
PORT=5000
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/ventaCamisetas
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion_2024
NODE_ENV=development
```

### 4. Poblar la base de datos con datos de ejemplo

```bash
npm run seed
```

### 5. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### 6. Acceder al cliente

Abre `client/index.html` en tu navegador o sirve con un servidor local.

## Uso de la Aplicación

### Como Usuario

1. **Registro**: Crea una nueva cuenta con tu nombre, email y contraseña
2. **Explorar Catálogo**: Navega por el catálogo de camisetas
3. **Filtrar**: Utiliza los filtros por liga y equipo para encontrar productos específicos
4. **Ver Detalles**: Haz clic en un producto para ver sus detalles completos
5. **Agregar al Carrito**: Selecciona talla y cantidad, luego agrega al carrito
6. **Proceder al Pago**: Revisa tu carrito e inicia el checkout
7. **Completar Compra**: Ingresa dirección de envío y datos de pago (simulado)
8. **Consultar Pedidos**: Accede a tu historial de compras

### Credenciales de Prueba

- **Email**: admin@ventacamisetas.com
- **Contraseña**: admin123456
- **Rol**: Administrador

## Estructura del Proyecto

```
ProyectoVentaCamisetas/
├── server/
│   ├── config/              # Configuración (BD, JWT)
│   ├── models/              # Modelos de datos (Mongoose)
│   ├── routes/              # Rutas de API
│   ├── controllers/         # Lógica de negocio
│   ├── middleware/          # Middlewares (autenticación, errores)
│   ├── data/                # Scripts de seed
│   ├── server.js            # Entrada principal del servidor
│   ├── package.json         # Dependencias del servidor
│   └── .env                 # Variables de entorno
│
├── client/
│   ├── css/                 # Estilos (estilos.css, navbar.css, etc)
│   ├── js/                  # Scripts JavaScript
│   │   ├── api.js          # Servicios de API
│   │   ├── carrito.js      # Gestión de carrito
│   │   ├── auth.js         # Gestión de autenticación
│   │   ├── ui.js           # Funciones de interfaz
│   │   └── main.js         # Lógica principal
│   ├── assets/              # Imágenes y recursos
│   ├── index.html           # Página principal
│   └── pages/               # Páginas adicionales
│
├── .gitignore               # Archivos ignorados por Git
├── vercel.json              # Configuración de Vercel
└── README.md                # Este archivo
```

## API Endpoints

### Autenticación

- `POST /api/auth/registro` - Crear nueva cuenta
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil del usuario (requiere autenticación)

### Productos

- `GET /api/productos` - Obtener todos los productos (con filtros opcionales)
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/ligas` - Obtener lista de ligas
- `POST /api/productos` - Crear producto (solo admin)
- `PUT /api/productos/:id` - Actualizar producto (solo admin)
- `DELETE /api/productos/:id` - Eliminar producto (solo admin)

### Pedidos

- `POST /api/pedidos` - Crear nuevo pedido (requiere autenticación)
- `GET /api/pedidos/mis-pedidos/usuario` - Obtener pedidos del usuario (requiere autenticación)
- `GET /api/pedidos/:id` - Obtener pedido por ID (requiere autenticación)
- `GET /api/pedidos` - Obtener todos los pedidos (solo admin)
- `PUT /api/pedidos/:id/estado` - Actualizar estado de pedido (solo admin)
- `POST /api/pedidos/pago/simular` - Simular pago (requiere autenticación)

## Despliegue en Vercel

### Pasos para desplegar:

1. **Crear cuenta en Vercel**: https://vercel.com/signup

2. **Conectar repositorio**: 
   - Importar proyecto desde GitHub
   - Vercel detectará automáticamente la configuración

3. **Configurar variables de entorno**:
   - Ir a Configuración > Variables de Entorno
   - Agregar:
     - `MONGODB_URI`: Tu URL de MongoDB Atlas
     - `JWT_SECRET`: Tu clave secreta

4. **Desplegar**: 
   - Vercel desplegará automáticamente con cada push a main

5. **URL de producción**: Se proporciona al finalizar el despliegue

## Mejoras Futuras

- Integración con pasarela de pago real (Stripe, PayPal)
- Sistema de comentarios y calificaciones
- Perfil de usuario más completo
- Carrito persistente en servidor
- Sistema de wishlist
- Notificaciones por email
- Panel admin avanzado con gráficos y reportes
- Integración con sistemas de envío reales
- Búsqueda avanzada con autocomplete
- Recomendaciones personalizadas

## Mantenimiento y Buenas Prácticas

### Seguridad
- Todas las contraseñas se cifran con bcryptjs
- Autenticación mediante JWT
- CORS configurado para desarrollo seguro
- Helmet implementado para headers de seguridad

### Rendimiento
- Paginación en listados
- Índices en base de datos
- Validación de datos en cliente y servidor
- Compresión de responses

### Código
- Estructura modular y escalable
- Separación de responsabilidades
- Naming convenciones claras
- Comentarios explicativos

## Licencia

Este proyecto está bajo la licencia MIT.

## Autor

Desarrollado como parte de un proyecto académico de comercio electrónico.

## Soporte

Para reportar bugs o sugerir mejoras, abre un issue en el repositorio de GitHub.

---

**Nota**: Este es un proyecto de demostración. El sistema de pago es simulado y no procesa pagos reales.
