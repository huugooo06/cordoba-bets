<template>
  <v-card elevation="4" class="rounded-xl bg-surface-variant pa-4 h-100 d-flex flex-column">
    <v-card-title class="text-h6 font-weight-bold mb-4 d-flex align-center">
      <v-icon start color="primary" class="mr-2">mdi-chart-line-variant</v-icon>
      Evolución del Balance
    </v-card-title>
    
    <div style="height: 200px; position: relative;" class="flex-grow-1">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'vue-chartjs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  bets: {
    type: Array,
    required: true,
    default: () => []
  }
});

const chartData = computed(() => {
  // 1. Sort bets by date/time ascending
  const sortedBets = [...props.bets].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // 2. Calculate cumulative balance
  let currentBalance = 0;
  const dataPoints = sortedBets.map(bet => {
    if (bet.resultado !== 'PENDIENTE') {
      currentBalance += (bet.ganancia_neta || 0);
    }
    return {
      x: new Date(bet.fecha).toLocaleDateString(),
      y: currentBalance,
      bet: bet // store for tooltip if needed
    };
  });

  // If no bets, show a flat line at 0 or empty?
  if (dataPoints.length === 0) {
      return {
          labels: [],
          datasets: []
      }
  }

  return {
    labels: dataPoints.map(p => p.x),
    datasets: [
      {
        label: 'Balance Acumulado',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(76, 175, 80, 0.4)'); // Success green transparent
          gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
          return gradient;
        },
        borderColor: '#4CAF50', // Success green
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4CAF50',
        fill: true,
        tension: 0.4, // Smooth curves
        data: dataPoints.map(p => p.y)
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(2) + ' u';
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
          color: '#9E9E9E',
          maxTicksLimit: 10 // Limit x-axis labels to avoid crowding
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: '#9E9E9E',
        callback: function(value) {
            return value + ' u';
        }
      }
    }
  },
  interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
  }
};
</script>
