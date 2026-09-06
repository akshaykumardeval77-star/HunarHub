import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';
import apiRoutes from './routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static craft & artisan assets from workspace root assets directory
const workspaceRoot = path.join(__dirname, '..');
app.use('/assets', express.static(path.join(workspaceRoot, 'assets')));

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'HunarHub MERN REST API' });
});

// Connect DB & Start Server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 HunarHub MERN Backend Server running at http://localhost:${PORT}`);
  });
};

startServer();
