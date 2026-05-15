import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Producto from '../models/Producto.js';
import Usuario from '../models/Usuario.js';

const conectar = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar:', error);
    process.exit(1);
  }
};

const productosData = [
  {
    nombre: 'Real Madrid Home 2024/25',
    descripcion: 'Camiseta oficial del Real Madrid para la temporada 2024/25. Diseño clásico con el icónico uniforme blanco, escudo bordado y patrocinadores oficiales.',
    precio: 89.99,
    stock: 50,
    equipo: 'Real Madrid',
    liga: 'La Liga',
    temporada: '2024/25',
    color: 'Blanco',
    talla: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    imagen: '/fotos/Real-Madrid-Home.jfif',
  },
  {
    nombre: 'Barcelona Away 2024/25',
    descripcion: 'Camiseta de visitante del FC Barcelona para la temporada 2024/25. Colores azul grana tradicionales con detalles en dorado, escudo oficial y cuello en V.',
    precio: 89.99,
    stock: 45,
    equipo: 'Barcelona',
    liga: 'La Liga',
    temporada: '2024/25',
    color: 'Azul Grana',
    talla: ['S', 'M', 'L', 'XL'],
    imagen: '/fotos/Barcelona-Away.jfif',
  },
  {
    nombre: 'Manchester United Home 2024/25',
    descripcion: 'Camiseta de local del Manchester United para la temporada 2024/25. Rojo clásico con detalles en blanco, escudo bordado y patrocinadores oficiales.',
    precio: 84.99,
    stock: 60,
    equipo: 'Manchester United',
    liga: 'Premier League',
    temporada: '2024/25',
    color: 'Rojo',
    talla: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    imagen: '/fotos/Manchester-United-Home.jfif',
  },
  {
    nombre: 'Liverpool Away 2024/25',
    descripcion: 'Segunda equipación del Liverpool FC para la temporada 2024/25. Azul oscuro con detalles en rojo y blanco, escudo oficial y cuello redondo.',
    precio: 84.99,
    stock: 55,
    equipo: 'Liverpool',
    liga: 'Premier League',
    temporada: '2024/25',
    color: 'Azul Oscuro',
    talla: ['M', 'L', 'XL'],
    imagen: '/fotos/Liverpool-Away.jfif',
  },
  {
    nombre: 'Juventus Home 2024/25',
    descripcion: 'Camiseta oficial de la Juventus para la temporada 2024/25. Franjas verticales blancas y negras clásicas, escudo bordado y patrocinadores oficiales.',
    precio: 89.99,
    stock: 40,
    equipo: 'Juventus',
    liga: 'Serie A',
    temporada: '2024/25',
    color: 'Blanco Negro',
    talla: ['S', 'M', 'L', 'XL'],
    imagen: '/fotos/Juventus-Home.jfif',
  },
  {
    nombre: 'AC Milan Home 2024/25',
    descripcion: 'Camiseta de local del AC Milan para la temporada 2024/25. Franjas rojas y negras clásicas, escudo bordado y cuello en V.',
    precio: 84.99,
    stock: 35,
    equipo: 'AC Milan',
    liga: 'Serie A',
    temporada: '2024/25',
    color: 'Rojo Negro',
    talla: ['M', 'L', 'XL'],
    imagen: '/fotos/AC-Milan-Home.jfif',
  },
  {
    nombre: 'Paris Saint-Germain Home 2024/25',
    descripcion: 'Camiseta de local del Paris Saint-Germain para la temporada 2024/25. Azul oscuro con detalles dorados, escudo oficial y patrocinadores incluidos.',
    precio: 94.99,
    stock: 48,
    equipo: 'Paris Saint-Germain',
    liga: 'Ligue 1',
    temporada: '2024/25',
    color: 'Azul Oscuro',
    talla: ['XS', 'S', 'M', 'L', 'XL'],
    imagen: '/fotos/Paris-Saint-Germain-Home.jfif',
  },
  {
    nombre: 'Bayern Munich Home 2024/25',
    descripcion: 'Camiseta oficial del Bayern Munich para la temporada 2024/25. Rojo con detalles azules, escudo bordado y patrocinadores oficiales.',
    precio: 89.99,
    stock: 52,
    equipo: 'Bayern Munich',
    liga: 'Bundesliga',
    temporada: '2024/25',
    color: 'Rojo Azul',
    talla: ['S', 'M', 'L', 'XL', 'XXL'],
    imagen: '/fotos/Bayern-Munich-Home.jfif',
  },
  {
    nombre: 'Atlético Madrid Home 2024/25',
    descripcion: 'Camiseta de local del Atlético Madrid para la temporada 2024/25. Franjas rojas y blancas clásicas, escudo bordado y cuello redondo.',
    precio: 84.99,
    stock: 43,
    equipo: 'Atlético Madrid',
    liga: 'La Liga',
    temporada: '2024/25',
    color: 'Rojo Blanco',
    talla: ['M', 'L', 'XL'],
    imagen: '/fotos/Atlético-Madrid-Home.jfif',
  },
  {
    nombre: 'Chelsea Home 2024/25',
    descripcion: 'Camiseta de local del Chelsea FC para la temporada 2024/25. Azul royal con detalles blancos, escudo oficial y patrocinadores incluidos.',
    precio: 84.99,
    stock: 46,
    equipo: 'Chelsea',
    liga: 'Premier League',
    temporada: '2024/25',
    color: 'Azul Royal',
    talla: ['XS', 'S', 'M', 'L', 'XL'],
    imagen: '/fotos/Chelsea-Home.jfif',
  },
  {
    nombre: 'Inter Milan Home 2024/25',
    descripcion: 'Camiseta de local del Inter de Milán para la temporada 2024/25. Franjas azules y negras clásicas, escudo bordado y cuello en V.',
    precio: 89.99,
    stock: 41,
    equipo: 'Inter Milan',
    liga: 'Serie A',
    temporada: '2024/25',
    color: 'Azul Negro',
    talla: ['M', 'L', 'XL'],
    imagen: '/fotos/Inter-Milan-Home.jfif',
  },
  {
    nombre: 'Borussia Dortmund Home 2024/25',
    descripcion: 'Camiseta oficial del Borussia Dortmund para la temporada 2024/25. Amarillo con detalles negros, escudo bordado y patrocinadores oficiales.',
    precio: 84.99,
    stock: 38,
    equipo: 'Borussia Dortmund',
    liga: 'Bundesliga',
    temporada: '2024/25',
    color: 'Amarillo Negro',
    talla: ['S', 'M', 'L', 'XL'],
    imagen: '/fotos/Borussia-Dortmund-Home.jfif',
  },
];

const usuariosData = [
  {
    nombre: 'Admin Usuario',
    email: 'admin@ventacamisetas.com',
    password: 'admin123456',
    rol: 'administrador',
  },
  {
    nombre: 'Cliente Prueba',
    email: 'cliente@ventacamisetas.com',
    password: 'cliente123',
    rol: 'usuario',
  },
];

const seed = async () => {
  try {
    await conectar();

    await Producto.deleteMany({});
    await Usuario.deleteMany({});

    await Producto.insertMany(productosData);
    console.log('Productos insertados exitosamente');

    await Usuario.insertMany(usuariosData);
    console.log('Usuarios insertados exitosamente');

    console.log('Base de datos poblada con datos de ejemplo');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seed();
