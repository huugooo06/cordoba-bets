<template>
  <v-container class="fill-height justify-center">
    <v-card width="100%" max-width="600" elevation="6" class="rounded-xl pa-2">
      <v-card-title class="text-h5 font-weight-bold text-center py-4">
        <v-icon color="primary" class="mb-1 mr-2">mdi-plus-circle-outline</v-icon>
        Registrar Nueva Apuesta
      </v-card-title>
      
      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-form @submit.prevent="submitBet" ref="form">
          <v-text-field
            v-model="apuesta.apuesta"
            label="Descripción del Evento / Apuesta"
            placeholder="Ej: Real Madrid vs Barcelona - Gana Madrid"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-format-list-bulleted-type"
            class="mb-2"
            :rules="[v => !!v || 'La descripción es requerida']"
            required
            color="primary"
          ></v-text-field>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="apuesta.cuota"
                label="Cuota (@)"
                placeholder="1.85"
                type="number"
                step="0.01"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-at"
                :rules="[v => !!v || 'Requerido', v => v > 1 || 'Mínimo 1.01']"
                required
                color="primary"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="apuesta.stake"
                label="Stake (Unidades)"
                placeholder="1.0"
                type="number"
                step="0.1"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-poker-chip"
                :rules="[v => !!v || 'Requerido', v => v > 0 || 'Mínimo 0.1']"
                required
                color="primary"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Live Calculator Preview -->
          <v-fade-transition>
            <v-sheet 
              v-if="potentialProfit > 0"
              color="surface-variant" 
              class="rounded-lg pa-4 mb-6 mt-2 border-dashed border-primary"
            >
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-caption text-uppercase font-weight-bold text-medium-emphasis">Retorno Potencial</span>
                <v-chip size="small" color="success" variant="flat" class="font-weight-bold">
                   ROI: {{ potentialRoi }}%
                </v-chip>
              </div>
              <div class="d-flex align-end">
                 <span class="text-h4 font-weight-black text-primary mr-2">
                   {{ potentialReturn.toFixed(2) }} u
                 </span>
                 <span class="text-caption text-medium-emphasis mb-1">
                   (Profit: <span class="text-success font-weight-bold">+{{ potentialProfit.toFixed(2) }}</span>)
                 </span>
              </div>
            </v-sheet>
          </v-fade-transition>
  
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            elevation="4"
            class="mt-2 text-none font-weight-bold rounded-lg"
            :loading="loading"
            height="50"
          >
            Guardar Apuesta
          </v-btn>

      <v-alert
            v-if="message"
            :type="messageType"
            variant="tonal"
            density="compact"
            class="mt-4"
            closable
             @click:close="message = ''"
          >
            {{ message }}
          </v-alert>
  
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="450" persistent>
      <v-card class="rounded-xl text-center pa-4">
        <v-icon color="success" size="80" class="mb-2">mdi-check-circle-outline</v-icon>
        <v-card-title class="text-h5 font-weight-bold pt-0">
          ¡Apuesta Creada!
        </v-card-title>
        <v-card-text class="text-body-1 text-medium-emphasis">
          La apuesta se ha guardado correctamente. <br> ¿Qué te gustaría hacer ahora?
        </v-card-text>
        
        <v-card-actions class="d-flex flex-column ga-2 px-6 pb-6">
          <v-btn 
            color="primary" 
            variant="flat" 
            size="large" 
            block 
            rounded="xl" 
            class="font-weight-bold"
            @click="createAnother"
          >
            <v-icon start>mdi-plus</v-icon>
            Crear Otra Apuesta
          </v-btn>
          <v-btn 
            color="secondary" 
            variant="tonal" 
            size="large" 
            block 
            rounded="xl" 
            class="font-weight-bold"
            @click="goToDashboard"
          >
            <v-icon start>mdi-view-dashboard</v-icon>
            Volver al Inicio
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../api/apiService';

const router = useRouter();

const apuesta = ref({
  apuesta: '',
  cuota: null,
  stake: null,
});

const loading = ref(false);
const message = ref('');
const messageType = ref('success');
const form = ref(null);
const successDialog = ref(false);

const potentialProfit = computed(() => {
    if (apuesta.value.cuota && apuesta.value.stake) {
        return (apuesta.value.cuota * apuesta.value.stake) - apuesta.value.stake;
    }
    return 0;
});

const potentialReturn = computed(() => {
     if (apuesta.value.cuota && apuesta.value.stake) {
        return apuesta.value.cuota * apuesta.value.stake;
    }
    return 0;
});

const potentialRoi = computed(() => {
    if (apuesta.value.cuota) {
        return ((apuesta.value.cuota - 1) * 100).toFixed(0);
    }
    return 0;
});

const submitBet = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  loading.value = true;
  message.value = '';
  try {
    await apiService.createBet(apuesta.value);
    // Open Dialog instead of just showing message
    successDialog.value = true;
    
  } catch (err) {
    message.value = 'Error al comunicarse con el servidor.';
    messageType.value = 'error';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const createAnother = () => {
    // Reset properties
    apuesta.value = { apuesta: '', cuota: null, stake: null };
    successDialog.value = false;
    message.value = ''; // Clear any previous error messages if any
    
    // Reset form validation state
    if(form.value) form.value.resetValidation();
};

const goToDashboard = () => {
    successDialog.value = false;
    router.push('/');
};
</script>
  