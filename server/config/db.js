import mongoose from 'mongoose';

let isInMemoryFallback = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hunarhub';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB Connected Successfully: ${mongoURI}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB connection skipped/not running (${error.message}).`);
    console.warn(`🚀 Running HunarHub MERN Backend with High-Speed In-Memory Data Store!`);
    isInMemoryFallback = true;
  }
};

export const getFallbackStatus = () => isInMemoryFallback;
