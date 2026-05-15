Guía de Despliegue en Vercel y MongoDB Atlas

PASO 1: Preparar MongoDB Atlas
=========================================

1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear un cluster gratuito:
   - Seleccionar "Create" en Deployments
   - Elegir opción gratuita (M0)
   - Seleccionar región más cercana
   - Click en "Create Cluster"

3. Crear usuario de base de datos:
   - Ir a "Database Access"
   - Click en "Add New Database User"
   - Crear usuario y contraseña fuertes
   - Guardar credenciales

4. Permitir conexiones:
   - Ir a "Network Access"
   - Click en "Add IP Address"
   - Seleccionar "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. Obtener cadena de conexión:
   - Ir a Clusters
   - Click en "Connect" del cluster
   - Seleccionar "Connect your application"
   - Copiar cadena (MongoDB URI)
   - Reemplazar <username> y <password> con tus credenciales
   - Cambiar "myFirstDatabase" por "ventaCamisetas"
   
   Ejemplo final:
   mongodb+srv://usuario:contraseña@cluster0.xxxxxx.mongodb.net/ventaCamisetas?retryWrites=true&w=majority


PASO 2: Preparar Repositorio GitHub
=========================================

1. Crear repositorio en GitHub
2. Clonar este proyecto
3. Cambiar origen remoto:
   git remote set-url origin https://github.com/tu-usuario/ProyectoVentaCamisetas.git

4. Push a GitHub:
   git add .
   git commit -m "Initial commit: Plataforma de venta de camisetas"
   git push origin main


PASO 3: Desplegar en Vercel
=========================================

1. Ir a https://vercel.com/signup
2. Registrarse con GitHub
3. Dar permisos para acceder a repositorios

4. Importar proyecto:
   - Click en "New Project"
   - Seleccionar repositorio "ProyectoVentaCamisetas"
   - Click en "Import"

5. Configurar variables de entorno:
   - En la sección "Environment Variables"
   - Agregar las siguientes variables:
   
   Nombre: MONGODB_URI
   Valor: mongodb+srv://usuario:contraseña@cluster0.xxxxxx.mongodb.net/ventaCamisetas?retryWrites=true&w=majority
   
   Nombre: JWT_SECRET
   Valor: tu_clave_secreta_muy_segura_2024_cambiar_en_produccion
   
   Nombre: NODE_ENV
   Valor: production

6. Configurar build:
   - Framework: Other
   - Build Command: npm install --prefix ./server
   - Output Directory: client
   - Root Directory: (dejar vacío)

7. Click en "Deploy"

8. Esperar a que se complete el despliegue
   - Vercel proporcionará una URL única
   - El proyecto estará disponible públicamente


PASO 4: Actualizar URL de API en Cliente
=========================================

Si usas desarrollo local:
- Las URLs ya están configuradas para localhost:5000

Si desplegas en Vercel:
- Las URLs se actualizan automáticamente en producción
- O actualizar en client/js/api.js:
  const API_BASE_URL = 'https://tu-proyecto.vercel.app/api';


PASO 5: Inicializar Base de Datos
=========================================

1. Acceder a la terminal de Vercel o ejecutar localmente
2. Ejecutar seed con datos de ejemplo:
   npm run seed

   O manualmente desde API:
   POST http://tu-servidor/api/productos
   con datos de camisetas


TROUBLESHOOTING
=========================================

Error: "Cannot connect to database"
- Verificar MongoDB URI es correcta
- Verificar credenciales de usuario
- Verificar IP está permitida en "Network Access"
- Verificar nombre de base de datos es "ventaCamisetas"

Error: "JWT_SECRET not defined"
- Verificar que JWT_SECRET esté en variables de entorno
- Verificar formato y que no tenga espacios

Error: "CORS error"
- Las URLs de frontend y backend no coinciden
- Verificar API_BASE_URL en api.js
- Verificar CORS está habilitado en server.js

Error: "Vercel deployment failed"
- Verificar que package.json está en raíz
- Verificar que server/ tiene su propio package.json
- Revisar logs de Vercel para más detalles


VERIFICAR QUE FUNCIONA
=========================================

1. Acceder a URL de Vercel
2. Intentar buscar productos (debe mostrar datos de seed)
3. Intentar registrarse con nuevo usuario
4. Intentar login con credenciales de demo
5. Agregar producto al carrito
6. Proceder al checkout
7. Completar compra simulada


ACTUALIZAR EN FUTURO
=========================================

Cada vez que hagas cambios:

1. Comitear cambios locales:
   git add .
   git commit -m "Descripción de cambios"
   git push origin main

2. Vercel se actualiza automáticamente

3. Ver estado de deployment en Vercel dashboard


MONITOREO Y LOGS
=========================================

- Vercel Dashboard: https://vercel.com/dashboard
- Logs en tiempo real: Click en proyecto > Deployments > ver logs
- Mongoodb Compass para ver datos: Descargar y conectar con MongoDB URI
