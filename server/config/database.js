import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`Error al conectar MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDatabase;
