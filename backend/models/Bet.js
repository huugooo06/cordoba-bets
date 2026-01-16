import mongoose from 'mongoose';

// Definición del esquema de la apuesta
const BetSchema = new mongoose.Schema({
    // 1. Datos de la Apuesta
    fecha: {
        type: Date,
        required: true,
        default: Date.now // La fecha por defecto será la actual al crear el registro
    },
    apuesta: {
        type: String,
        required: true,
        trim: true // Elimina espacios en blanco al inicio y final
    },
    cuota: {
        type: Number,
        required: true,
        min: [1, 'La cuota debe ser 1.0 o superior.'] // Cuotas mínimas de 1.0
    },
    stake: {
        type: Number,
        required: true,
        min: [0.01, 'El stake debe ser un valor positivo.']
    },
    
    // 2. Resultado y Cálculo de Ganancia (Campos que se actualizarán)
    resultado: {
        type: String,
        required: true,
        enum: ['PENDIENTE', 'WIN', 'LOSE', 'VOID'], // Sólo se permiten estos 4 valores
        default: 'PENDIENTE' // Todas las apuestas inician como PENDIENTE
    },
    ganancia_neta: {
        type: Number,
        required: true,
        default: 0 // La ganancia es 0 hasta que se resuelve
    },
}, {
    timestamps: true // Añade automáticamente campos createdAt y updatedAt
});

// Exportar el modelo para usarlo en el controlador/rutas
const Bet = mongoose.model('Bet', BetSchema);

export default Bet;