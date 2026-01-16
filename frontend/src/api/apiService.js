// frontend/src/services/apiService.js
import axios from 'axios';

// La URL base de tu API de Node.js, tal como está en Docker Compose
// En desarrollo, el Frontend se conecta directamente al puerto expuesto en el host (3000)
const API_URL = 'http://localhost:3000/api/bets';

const apiService = {
    // 1. CREAR UNA APUESTA (POST)
    createBet: async (betData) => {
        try {
            const response = await axios.post(API_URL, betData);
            return response.data;
        } catch (error) {
            console.error("Error al crear la apuesta:", error);
            throw error;
        }
    },

    // 2. OBTENER TODAS LAS APUESTAS (GET)
    getBets: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener las apuestas:", error);
            throw error;
        }
    },

    // 3. RESOLVER UNA APUESTA (PUT /:id/resolve)
    resolveBet: async (id, resultado) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/resolve`, { resultado });
            return response.data;
        } catch (error) {
            console.error(`Error al resolver la apuesta ${id}:`, error);
            throw error;
        }
    },

    // 4. OBTENER EL TOTAL DE UNIDADES (GET /totals)
    getTotals: async () => {
        try {
            const response = await axios.get(`${API_URL}/totals`);
            // Devuelve el valor total_unidades
            return response.data.total_unidades;
        } catch (error) {
            console.error("Error al obtener los totales:", error);
            throw error;
        }
    },

    // 5. ELIMINAR UNA APUESTA (DELETE /:id)
    deleteBet: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar la apuesta ${id}:`, error);
            throw error;
        }
    },


};

export default apiService;