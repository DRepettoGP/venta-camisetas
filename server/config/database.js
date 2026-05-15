import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log(`MongoDB conectado: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`Error al conectar MongoDB: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

export default connectDatabase;
