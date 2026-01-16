<template>
  <v-container fluid class="fill-height align-start">
    <!-- Header -->
    <v-row class="mb-8 align-end">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold display-1">
          <span class="text-primary">Tu</span> Dashboard
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">Resumen de tu rendimiento.</p>
      </v-col>
      
      <!-- Date Filters -->
      <v-col cols="12" md="6" class="d-flex justify-end ga-2">
         <v-select
          v-model="selectedMonth"
          :items="months"
          label="Mes"
          variant="outlined"
          density="compact"
          hide-details
          class="rounded-lg"
          style="max-width: 150px;"
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
    </v-row>
    
    <!-- Banner & KPI Section -->
    <v-row class="mb-8">
      <!-- 1. Banner (Left Sidebar) -->
      <v-col cols="12" lg="3">
          <v-card 
             class="d-flex flex-column align-center justify-center h-100 pa-4 rounded-xl bg-surface-variant position-relative overflow-hidden" 
             elevation="4"
             variant="flat"
          >
             <!-- Decorative -->
             <div class="position-absolute" style="top: -10px; left: -10px; opacity: 0.05;">
                <v-icon size="120" color="primary">mdi-poker-chip</v-icon>
             </div>

             <div class="text-center z-index-1">
                <v-avatar color="primary" size="56" class="mb-3 elevation-4">
                   <v-icon size="32" color="white">mdi-trophy-variant</v-icon>
                </v-avatar>
                <div class="text-h6 font-weight-bold mb-1 lh-1">CÓRDOBA BETS</div>
                <div class="text-caption text-uppercase font-weight-bold text-primary letter-spacing-1 mb-3">
                   Professional Tracker
                </div>
                <div class="px-3 py-2 rounded-lg bg-background border w-100">
                   <span class="text-caption font-weight-medium text-medium-emphasis font-italic d-block lh-tight">
                      ❄️ "La disciplina es el puente entre metas y logros"
                   </span>
                </div>
             </div>
          </v-card>
      </v-col>

      <!-- 2. KPIs (Right Grid) -->
      <v-col cols="12" lg="9">
        <v-row>
          <!-- 1. Balance -->
          <v-col cols="12" sm="6" lg="3">
            <v-card elevation="4" class="rounded-xl h-100 bg-surface-variant">
              <v-card-text class="d-flex flex-column justify-space-between h-100 pa-6">
                <div class="d-flex justify-space-between align-start align-center">
                  <div>
                    <div class="text-overline font-weight-bold mb-1">Balance</div>
                    <div 
                      class="text-h4 font-weight-black"
                      :class="totalUnits >= 0 ? 'text-success' : 'text-error'"
                    >
                      {{ totalUnits > 0 ? '+' : '' }}{{ totalUnits.toFixed(2) }} u
                    </div>
                  </div>
                  <v-avatar 
                    :color="totalUnits >= 0 ? 'success' : 'error'" 
                    variant="tonal" 
                    size="56"
                    rounded="lg"
                  >
                    <v-icon size="32">{{ totalUnits >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
                  </v-avatar>
                </div>
                <div class="mt-6 pt-4 border-t d-flex align-center text-caption text-medium-emphasis">
                   <v-icon size="small" class="mr-2">mdi-information-outline</v-icon>
                   Ganancia Neta
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 2. ROI -->
          <v-col cols="12" sm="6" lg="3">
            <v-card elevation="4" class="rounded-xl h-100 bg-surface-variant">
              <v-card-text class="d-flex flex-column justify-space-between h-100 pa-6">
                 <div class="d-flex justify-space-between align-start align-center">
                  <div>
                    <div class="text-overline font-weight-bold mb-1">ROI</div>
                    <div class="text-h4 font-weight-black text-info">
                       {{ roi }}%
                    </div>
                  </div>
                  <v-avatar color="info" variant="tonal" size="56" rounded="lg">
                    <v-icon size="32">mdi-chart-donut</v-icon>
                  </v-avatar>
                </div>
                <div class="mt-6 pt-4 border-t d-flex align-center text-caption text-medium-emphasis">
                   <v-icon size="small" class="mr-2">mdi-percent</v-icon>
                   Yield / Rendimiento
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 3. Cuota Media -->
          <v-col cols="12" sm="6" lg="3">
            <v-card elevation="4" class="rounded-xl h-100 bg-surface-variant">
              <v-card-text class="d-flex flex-column justify-space-between h-100 pa-6">
                 <div class="d-flex justify-space-between align-start align-center">
                  <div>
                    <div class="text-overline font-weight-bold mb-1">Cuota Media</div>
                    <div class="text-h4 font-weight-black text-warning">
                       @{{ avgOdds }}
                    </div>
                  </div>
                  <v-avatar color="warning" variant="tonal" size="56" rounded="lg">
                    <v-icon size="32">mdi-scale-balance</v-icon>
                  </v-avatar>
                </div>
                <div class="mt-6 pt-4 border-t d-flex align-center text-caption text-medium-emphasis">
                   <v-icon size="small" class="mr-2">mdi-sigma</v-icon>
                   Promedio de tus cuotas
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 4. Total Apuestas -->
          <v-col cols="12" sm="6" lg="3">
            <v-card elevation="4" class="rounded-xl h-100 bg-surface-variant">
              <v-card-text class="d-flex flex-column justify-space-between h-100 pa-6">
                 <div class="d-flex justify-space-between align-start align-center">
                  <div>
                    <div class="text-overline font-weight-bold mb-1">Apuestas</div>
                    <div class="text-h4 font-weight-black text-primary">
                      {{ filteredBets.length }}
                    </div>
                  </div>
                  <v-avatar color="primary" variant="tonal" size="56" rounded="lg">
                    <v-icon size="32">mdi-format-list-numbered</v-icon>
                  </v-avatar>
                </div>
                 <div class="mt-6 pt-4 border-t d-flex align-center text-caption text-medium-emphasis">
                   <span class="text-success font-weight-bold mr-3">{{ wins }} W</span>
                   <span class="text-error font-weight-bold mr-3">{{ losses }} L</span>
                   <span class="text-warning font-weight-bold">{{ voids }} V</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    


    <!-- Bottom Section: Table & Chart -->
    <v-row>
      <!-- Activity Table (Left - 60%) -->
      <v-col cols="12" lg="7">
        <v-card elevation="3" class="rounded-xl h-100">
          <v-card-title class="d-flex align-center py-4 px-6 border-b">
            <v-icon start color="primary">mdi-history</v-icon>
            Actividad Reciente (Filtrada)
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" to="/historial" size="small">
              Ver Todo
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="latestBets"
            density="comfortable"
            hide-default-footer
            class="bg-transparent"
          >
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
             <template v-slot:no-data>
                <div class="pa-4 text-center text-medium-emphasis">No hay actividad reciente en este periodo</div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Balance Chart (Right - 40%) -->
      <v-col cols="12" lg="5">
        <BalanceChart :bets="filteredBets" />
      </v-col>
    </v-row>


    <v-overlay :model-value="loading" class="align-center justify-center persistent">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from '../api/apiService';
import BalanceChart from '../components/BalanceChart.vue';

const bets = ref([]);
const loading = ref(true);

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
    const availableYears = [currentYear];
    // Add years from actual bets if older
    return availableYears;
});


const headers = [
  { title: 'Apuesta', key: 'apuesta', align: 'start' },
  { title: 'Fecha', key: 'fecha', align: 'start' },
  { title: 'Stake', key: 'stake', align: 'end' },
  { title: 'Cuota', key: 'cuota', align: 'end' },
  { title: 'Resultado', key: 'resultado', align: 'center' },
  { title: 'P/L', key: 'ganancia_neta', align: 'end' },
];

const fetchDashboardData = async () => {
  try {
    bets.value = await apiService.getBets();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const filteredBets = computed(() => {
    return bets.value.filter(bet => {
        const betDate = new Date(bet.fecha);
        const matchesYear = selectedYear.value ? betDate.getFullYear() === selectedYear.value : true;
        const matchesMonth = selectedMonth.value !== null ? betDate.getMonth() === selectedMonth.value : true;
        return matchesYear && matchesMonth;
    });
});

const latestBets = computed(() => {
  // Show filtered activity, or global? Usually dashboard activity reflects filters.
  return filteredBets.value.slice(0, 10); 
});

const totalUnits = computed(() => {
    // Sum only resolved bets in the filtered period
    return filteredBets.value
        .filter(b => b.resultado !== 'PENDIENTE')
        .reduce((sum, b) => sum + (b.ganancia_neta || 0), 0);
});

const roi = computed(() => {
    // ROI of filtered period
    const resolvedBets = filteredBets.value.filter(b => b.resultado !== 'PENDIENTE');
    if (resolvedBets.length === 0) return '0.00';

    const totalStaked = resolvedBets.reduce((sum, b) => sum + b.stake, 0);
    if (totalStaked === 0) return '0.00';

    return ((totalUnits.value / totalStaked) * 100).toFixed(2);
});

const avgOdds = computed(() => {
    if (filteredBets.value.length === 0) return '0.00';
    const totalOdds = filteredBets.value.reduce((sum, b) => sum + b.cuota, 0);
    return (totalOdds / filteredBets.value.length).toFixed(2);
});

const wins = computed(() => filteredBets.value.filter(b => b.resultado === 'WIN').length);
const losses = computed(() => filteredBets.value.filter(b => b.resultado === 'LOSE').length);
const voids = computed(() => filteredBets.value.filter(b => b.resultado === 'VOID').length);

const getResultColor = (resultado) => {
  switch (resultado) {
      case 'WIN': return 'success';
      case 'LOSE': return 'error';
      case 'VOID': return 'warning';
      case 'PENDIENTE': return 'grey';
      default: return 'grey';
  }
};

const getProfitColor = (profit, status) => {
    if (status === 'PENDIENTE') return 'text-medium-emphasis';
    if (profit > 0) return 'text-success';
    if (profit < 0) return 'text-error';
    return 'text-warning';
};

onMounted(fetchDashboardData);
</script>
