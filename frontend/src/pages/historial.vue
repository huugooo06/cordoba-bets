<template>
  <v-container fluid>
    <!-- Header & Filters -->
    <v-row class="mb-4 align-center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold">Historial de Apuestas</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gestiona y analiza todas tus predicciones.</p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex ga-2">
         <v-select
          v-model="selectedMonth"
          :items="months"
          label="Mes"
          variant="outlined"
          density="compact"
          hide-details
          class="rounded-lg"
          prepend-inner-icon="mdi-calendar-month"
        ></v-select>
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Año"
          variant="outlined"
          density="compact"
          hide-details
          class="rounded-lg"
           style="max-width: 120px;"
          prepend-inner-icon="mdi-calendar"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn-toggle
          v-model="filter"
          mandatory
          rounded="xl"
          color="primary"
          variant="outlined"
          divided
        >
          <v-btn value="ALL">Todas</v-btn>
          <v-btn value="PENDIENTE">Pendientes</v-btn>
          <v-btn value="RESUELTA">Resueltas</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    
    <!-- Filter Summary -->
    <v-row v-if="selectedMonth !== null" class="mb-4">
        <v-col cols="12">
            <v-card variant="tonal" :color="periodProfit >= 0 ? 'success' : 'error'" class="rounded-lg px-4 py-2 d-flex align-center">
                 <v-icon start>mdi-cash-multiple</v-icon>
                 <span class="font-weight-bold mr-2">Balance del Periodo:</span>
                 <span class="text-h6 font-weight-black">{{ periodProfit > 0 ? '+' : '' }}{{ periodProfit.toFixed(2) }} u</span>
                 <v-spacer></v-spacer>
                 <span class="text-caption font-weight-bold">{{ filteredBets.length }} Apuestas</span>
            </v-card>
        </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card elevation="4" class="rounded-xl">
      <v-data-table
        :headers="headers"
        :items="filteredBets"
        :loading="loading"
        hover
        density="comfortable"
      >
        <!-- Custom Columns -->
        <template v-slot:item.fecha="{ item }">
          {{ new Date(item.fecha).toLocaleDateString() }}
        </template>
        
        <template v-slot:item.stake="{ item }">
          <span class="font-weight-medium">{{ item.stake }} u</span>
        </template>

        <template v-slot:item.cuota="{ item }">
          <span class="font-weight-bold text-medium-emphasis">@{{ item.cuota.toFixed(2) }}</span>
        </template>

        <template v-slot:item.resultado="{ item }">
          <v-chip
            :color="getResultColor(item.resultado)"
            size="small"
            label
            class="font-weight-bold"
          >
            {{ item.resultado }}
          </v-chip>
        </template>

        <template v-slot:item.ganancia_neta="{ item }">
           <span :class="getProfitColor(item.ganancia_neta, item.resultado)" class="font-weight-bold">
              <template v-if="item.resultado !== 'PENDIENTE'">
                 {{ item.ganancia_neta > 0 ? '+' : '' }}{{ item.ganancia_neta }}
              </template>
              <template v-else>-</template>
           </span>
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex align-center justify-end">
            <v-btn
                v-if="item.resultado === 'PENDIENTE'"
                size="small"
                color="primary"
                variant="tonal"
                rounded="lg"
                class="mr-2"
                @click="openResolveDialog(item)"
            >
                Resolver
            </v-btn>
            <v-btn
                icon
                size="small"
                color="error"
                variant="text"
                @click="deleteBet(item)"
            >
                <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
        
         <template v-slot:no-data>
            <div class="pa-8 text-center">
                <v-icon size="64" color="medium-emphasis" class="mb-2">mdi-clipboard-text-outline</v-icon>
                <div class="text-h6 text-medium-emphasis">No hay apuestas encontradas</div>
            </div>
        </template>

      </v-data-table>
    </v-card>

    <!-- Dialog for Resolving Bets -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card v-if="selectedBet" class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold pt-4 px-4 text-center">
          Resolver Apuesta
        </v-card-title>
        <v-card-text class="text-center pb-2">
           <div class="text-subtitle-1 mb-2">{{ selectedBet.apuesta }}</div>
           <div class="d-flex justify-center ga-2 text-caption text-medium-emphasis mb-4">
              <v-chip size="x-small" variant="outlined">Stake: {{ selectedBet.stake }}</v-chip>
              <v-chip size="x-small" variant="outlined">@{{ selectedBet.cuota }}</v-chip>
           </div>
           <p class="mb-4">¿Cuál fue el resultado final?</p>
           
           <div class="d-flex flex-column ga-2">
             <v-btn color="success" size="large" block variant="tonal" @click="resolveBet('WIN')">
               <v-icon start>mdi-check-circle</v-icon> GANADA (WIN)
             </v-btn>
             <v-btn color="error" size="large" block variant="tonal" @click="resolveBet('LOSE')">
               <v-icon start>mdi-close-circle</v-icon> PERDIDA (LOSE)
             </v-btn>
             <v-btn color="warning" size="large" block variant="tonal" @click="resolveBet('VOID')">
               <v-icon start>mdi-minus-circle</v-icon> NULA (VOID)
             </v-btn>
           </div>
        </v-card-text>
        <v-card-actions class="justify-center pb-4">
          <v-btn color="medium-emphasis" variant="text" @click="dialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from '../api/apiService';

const bets = ref([]);
const loading = ref(true);
const filter = ref('ALL');
const dialog = ref(false);
const selectedBet = ref(null);

const headers = [
  { title: 'Fecha', key: 'fecha', align: 'start' },
  { title: 'Apuesta', key: 'apuesta', align: 'start', width: '30%' },
  { title: 'Stake', key: 'stake', align: 'end' },
  { title: 'Cuota', key: 'cuota', align: 'end' },
  { title: 'Resultado', key: 'resultado', align: 'center' },
  { title: 'Ganancia', key: 'ganancia_neta', align: 'end' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false },
];

const fetchBets = async () => {
    loading.value = true;
    try {
        bets.value = await apiService.getBets();
    } catch (error) {
        console.error("Error cargando historial", error);
    } finally {
        loading.value = false;
    }
};

const months = [
  { title: 'Todo el Año', value: null },
  { title: 'Enero', value: 0 }, { title: 'Febrero', value: 1 },
  { title: 'Marzo', value: 2 }, { title: 'Abril', value: 3 },
  { title: 'Mayo', value: 4 }, { title: 'Junio', value: 5 },
  { title: 'Julio', value: 6 }, { title: 'Agosto', value: 7 },
  { title: 'Septiembre', value: 8 }, { title: 'Octubre', value: 9 },
  { title: 'Noviembre', value: 10 }, { title: 'Diciembre', value: 11 }
];

const selectedMonth = ref(null); 
const selectedYear = ref(new Date().getFullYear());

const years = computed(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear]; // Can be expanded dynamically
});

const filteredBets = computed(() => {
    let result = bets.value;

    // 1. Date Filter
    result = result.filter(bet => {
        const betDate = new Date(bet.fecha);
        const matchesYear = selectedYear.value ? betDate.getFullYear() === selectedYear.value : true;
        const matchesMonth = selectedMonth.value !== null ? betDate.getMonth() === selectedMonth.value : true;
        return matchesYear && matchesMonth;
    });

    // 2. Status Filter
    if (filter.value === 'PENDIENTE') {
        result = result.filter(b => b.resultado === 'PENDIENTE');
    } else if (filter.value === 'RESUELTA') {
        result = result.filter(b => b.resultado !== 'PENDIENTE');
    }

    return result;
});

const periodProfit = computed(() => {
    return filteredBets.value
        .filter(b => b.resultado !== 'PENDIENTE')
        .reduce((sum, b) => sum + (b.ganancia_neta || 0), 0);
});

const getResultColor = (resultado) => {
  switch (resultado) {
      case 'WIN': return 'success';
      case 'LOSE': return 'error';
      case 'VOID': return 'warning';
      case 'PENDIENTE': return 'info';
      default: return 'grey';
  }
};

const getProfitColor = (profit, status) => {
    if (status === 'PENDIENTE') return 'text-medium-emphasis';
    if (profit > 0) return 'text-success';
    if (profit < 0) return 'text-error';
    return 'text-warning';
};

const openResolveDialog = (bet) => {
    selectedBet.value = bet;
    dialog.value = true;
};

const resolveBet = async (resultado) => {
    if (!selectedBet.value) return;
    
    // Optimistic UI update (optional, but keep it simple for now and rely on API)
    loading.value = true;
    try {
        await apiService.resolveBet(selectedBet.value._id, resultado);
        // Recargar datos
        await fetchBets();
        dialog.value = false;
    } catch (error) {
        console.error("Error al resolver apuesta", error);
        alert("Error al actualizar la apuesta");
    } finally {
        loading.value = false;
    }
};

const deleteBet = async (bet) => {
    if(!confirm('¿Estás seguro de que quieres eliminar esta apuesta? Esta acción no se puede deshacer.')) return;

    loading.value = true;
    try {
        await apiService.deleteBet(bet._id);
        await fetchBets(); // Recargar la lista
    } catch (error) {
        console.error("Error al eliminar apuesta", error);
        alert("Hubo un error al intentar eliminar la apuesta.");
    } finally {
        loading.value = false;
    }
};



onMounted(fetchBets);
</script>
  