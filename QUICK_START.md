INICIO RÁPIDO - La Grada
=====================================================

Este archivo te guía para empezar con el proyecto en 5 minutos.


REQUISITOS
=====================================================
- Node.js v16+
- npm v8+
- Cuenta MongoDB Atlas (gratuita)


CONFIGURACIÓN RÁPIDA (LOCAL)
=====================================================

1. Instalar dependencias:
   
   cd server
   npm install
   cd ..

2. Crear archivo .env en server/:
   
   PORT=5000
   MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/ventaCamisetas
   JWT_SECRET=tu_clave_secreta_2024
   NODE_ENV=development

   Nota: Reemplaza usuario, contraseña y URL con tus datos de MongoDB Atlas

3. Poblar base de datos:
   
   cd server
   npm run seed

4. Iniciar servidor:
   
   npm run dev
   
   Deberías ver: "Servidor ejecutándose en puerto 5000"

5. Abrir cliente:
   
   Abre client/index.html en tu navegador
   O usa Live Server en VS Code


VERIFICAR QUE FUNCIONA
=====================================================

Haz estas pruebas en orden:

1. Ver productos:
   - Deberías ver 12 camisetas en el catálogo
   - Si ves "Cargando..." por mucho tiempo, verifica MongoDB URI

2. Login con credenciales demo:
   Email: admin@ventacamisetas.com
   Contraseña: admin123456
   
   Si falla: Verifica que el servidor está ejecutándose en puerto 5000

3. Buscar productos:
   - Escribe "Real Madrid" y busca
   - Deberías ver solo productos de Real Madrid

4. Filtrar por liga:
   - Selecciona "La Liga"
   - Deberías ver solo productos españoles

5. Agregar al carrito:
   - Haz click en una camiseta
   - Selecciona talla y cantidad
   - Click en "Agregar al carrito"
   - Verifica que el contador sube

6. Ver carrito:
   - Click en botón "Carrito (1)"
   - Deberías ver el producto agregado

7. Proceder al checkout:
   - Click en "Proceder al Pago"
   - Deberías ir a página de pago simulado

8. Completar pago:
   - Llena dirección y datos de tarjeta (demo)
   - Click en "Completar Pago"
   - Deberías ver confirmación de pedido


ERRORES COMUNES Y SOLUCIONES
=====================================================

Error: "Cannot reach server"
→ Verifica que ejecutaste: npm run dev
→ Verifica que estás en carpeta /server

Error: "MongoDB connection failed"
→ Verifica MongoDB URI es correcta
→ Verifica usuario y contraseña
→ Verifica IP está permitida en MongoDB Atlas

Error: "Cannot find module"
→ Ejecuta: npm install
→ Debes estar en carpeta /server

Error: "API request failed"
→ Verifica que el servidor está ejecutándose
→ Verifica que no hay conflictos de puerto (5000)


PRÓXIMOS PASOS
=====================================================

1. Hacer cambios de código:
   - Edita archivos en server/ para lógica
   - Edita archivos en client/ para interfaz
   - Servidor se reinicia automático con npm run dev

2. Crear más productos:
   - Edita server/data/seedDatabase.js
   - Ejecuta: npm run seed (borra y recrea base de datos)

3. Customizar estilos:
   - Edita archivos en client/css/

4. Desplegar en Vercel:
   - Ver archivo DESPLIEGUE_VERCEL.md

5. Agregar funcionalidades:
   - Ver sección "Mejoras Futuras" en README.md


COMANDOS ÚTILES
=====================================================

# Desde carpeta /server:
npm install              # Instalar dependencias
npm run dev             # Iniciar servidor en modo desarrollo
npm run start           # Iniciar servidor en producción
npm run seed            # Poblar BD con datos de ejemplo

# Desde carpeta raíz:
npm run install-all     # Instalar dependencias de servidor y cliente
npm run dev             # Iniciar servidor


ESTRUCTURA DE CARPETAS
=====================================================

server/
  ├── config/           → Configuración BD y JWT
  ├── models/           → Esquemas de MongoDB
  ├── controllers/      → Lógica de API
  ├── routes/           → Definición de endpoints
  ├── middleware/       → Autenticación y manejo de errores
  ├── data/             → Scripts de datos
  └── server.js         → Entrada principal

client/
  ├── css/              → Estilos (no necesita compilación)
  ├── js/               → Scripts JavaScript
  │   ├── api.js        → Conexión a API
  │   ├── auth.js       → Autenticación
  │   ├── carrito.js    → Gestión de carrito
  │   ├── ui.js         → Funciones de interfaz
  │   └── main.js       → Lógica principal
  └── index.html        → Página principal


CREDENCIALES DE PRUEBA
=====================================================

Administrador:
  Email: admin@ventacamisetas.com
  Contraseña: admin123456

Cliente:
  Email: cliente@ventacamisetas.com
  Contraseña: cliente123

O crea tu propia cuenta con el formulario de registro


DATOS DE PRUEBA
=====================================================

El script seed proporciona 12 camisetas de ejemplo:
- Real Madrid Home
- Barcelona Away
- Manchester United Home
- Liverpool Away
- Juventus Home
- AC Milan Home
- PSG Home
- Bayern Munich Home
- Atlético Madrid Home
- Chelsea Home
- Inter Milan Home
- Borussia Dortmund Home

Precios entre 84.99$ y 94.99$


DESARROLLO ADICIONAL
=====================================================

Para agregar más funcionalidades:

1. Crear modelo en server/models/
2. Crear controlador en server/controllers/
3. Crear rutas en server/routes/
4. Agregar endpoints en server/server.js
5. Crear funciones en client/js/
6. Actualizar HTML en client/index.html

Mantén los archivos organizados y bien documentados.


NECESITAS AYUDA?
=====================================================

Ver archivos de documentación:
- README.md              → Guía completa
- DESPLIEGUE_VERCEL.md   → Despliegue en producción
- Este archivo           → Guía rápida

Revisar:
- Consola de navegador (F12) para errores frontend
- Terminal para errores de servidor


¡Listo! Tu plataforma de venta de camisetas está funcional.

Diviértete desarrollando!
