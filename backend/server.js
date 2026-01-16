import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- Nuevo: Importar CORS
import betRoutes from './routes/betRoutes.js'; // <-- Nuevo: Importar Rutas

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middlewares ---
// 1. CORS: Permite que el Frontend acceda a esta API (importante en desarrollo)
app.use(cors()); 

// 2. Body Parser: Procesa el JSON
app.use(express.json());

// --- 3. Rutas de la API ---
// Todas las rutas de apuestas se mapearán a /api/bets
app.use('/api/bets', betRoutes); 

// Ruta principal (Test)
app.get('/', (req, res) => {
    res.send('API de Apuestas funcionando. Estado de la DB: ' + (mongoose.connection.readyState === 1 ? 'CONECTADA' : 'DESCONECTANDO/FALLO'));
});

// --- Conexión a DB y Servidor ---
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB conectado exitosamente.');
    } catch (err) {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        process.exit(1);
    }
};

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    });
};

connectDB().then(() => {
    startServer();
});