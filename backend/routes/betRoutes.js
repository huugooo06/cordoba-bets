// backend/routes/betRoutes.js
import express from 'express';
import Bet from '../models/Bet.js'; // Importa el modelo que acabamos de crear

const router = express.Router();

// Función de lógica de cálculo (clave para tu proyecto)
const calcularGanancia = (cuota, stake, resultado) => {
    switch (resultado) {
        case 'WIN':
            // Ganancia = (Cuota * Stake) - Stake
            return (cuota * stake) - stake;
        case 'LOSE':
            // Pérdida total del stake
            return -stake;
        case 'VOID':
            // Stake devuelto (ni ganancia ni pérdida)
            return 0;
        default:
            return 0;
    }
}

// --- RUTA 1: CREAR NUEVA APUESTA (POST /api/bets) ---
router.post('/', async (req, res) => {
    const { apuesta, cuota, stake } = req.body;

    // Validar datos básicos
    if (!apuesta || !cuota || !stake) {
        return res.status(400).json({ message: 'Faltan campos requeridos: apuesta, cuota o stake.' });
    }

    try {
        const newBet = new Bet({
            apuesta,
            cuota,
            stake
            // resultado y ganancia_neta se usan por defecto (PENDIENTE y 0)
        });

        await newBet.save();
        res.status(201).json(newBet); // 201 Created
    } catch (error) {
        // Manejo de errores de validación de Mongoose
        res.status(500).json({ message: 'Error al crear la apuesta', error: error.message });
    }
});


// --- RUTA 2: RESOLVER APUESTA (PUT /api/bets/:id/resolve) ---
router.put('/:id/resolve', async (req, res) => {
    const { resultado } = req.body; // Esto vendrá del botón (WIN, LOSE, VOID)
    const { id } = req.params;

    if (!['WIN', 'LOSE', 'VOID'].includes(resultado)) {
        return res.status(400).json({ message: 'Resultado no válido.' });
    }

    try {
        const bet = await Bet.findById(id);

        if (!bet) {
            return res.status(404).json({ message: 'Apuesta no encontrada.' });
        }

        // 1. Aplicar la lógica de cálculo
        const ganancia = calcularGanancia(bet.cuota, bet.stake, resultado);

        // 2. Actualizar la apuesta
        bet.resultado = resultado;
        bet.ganancia_neta = ganancia;
        await bet.save();

        res.status(200).json(bet);

    } catch (error) {
        res.status(500).json({ message: 'Error al resolver la apuesta', error: error.message });
    }
});

// --- RUTA 3: OBTENER TOTALES (GET /api/bets/totals) ---
router.get('/totals', async (req, res) => {
    try {
        // Agregación en MongoDB:
        // 1. Filtrar solo las apuestas resueltas
        // 2. Sumar el campo ganancia_neta
        const result = await Bet.aggregate([
            {
                $match: {
                    resultado: { $in: ['WIN', 'LOSE', 'VOID'] } // Solo apuestas finalizadas
                }
            },
            {
                $group: {
                    _id: null,
                    total_unidades: { $sum: "$ganancia_neta" }
                }
            }
        ]);

        // Si hay resultados, devuelve el total; si no, devuelve 0
        const total = result.length > 0 ? result[0].total_unidades : 0;

        res.status(200).json({ total_unidades: total });

    } catch (error) {
        res.status(500).json({ message: 'Error al calcular totales', error: error.message });
    }
});


// --- RUTA 4: OBTENER TODAS LAS APUESTAS (GET /api/bets) ---
router.get('/', async (req, res) => {
    try {
        const bets = await Bet.find().sort({ fecha: -1 }); // Ordenar por fecha descendente
        res.status(200).json(bets);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las apuestas', error: error.message });
    }
});


// --- RUTA 5: ELIMINAR UNA APUESTA POR ID (DELETE /api/bets/:id) ---
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBet = await Bet.findByIdAndDelete(id);

        if (!deletedBet) {
            return res.status(404).json({ message: 'Apuesta no encontrada.' });
        }

        res.status(200).json({ message: 'Apuesta eliminada correctamente.', bet: deletedBet });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la apuesta', error: error.message });
    }
});

export default router;