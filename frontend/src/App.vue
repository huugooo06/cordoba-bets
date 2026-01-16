<template>
  <v-app theme="dark">
    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer v-model="drawer" app color="blue-grey-darken-4" elevation="5">
      <div class="d-flex flex-column align-center py-6">
        <v-avatar color="primary" size="64" class="mb-3 elevation-3">
          <v-icon size="32" color="white">mdi-poker-chip</v-icon>
        </v-avatar>
        <div class="text-h6 font-weight-bold">CÓRDOBA BETS</div>
        <div class="text-caption text-medium-emphasis">Premium Tracker</div>
      </div>

      <v-divider></v-divider>

      <v-list nav class="mt-2">
        <v-list-item to="/" rounded="xl" active-color="primary" class="mb-1">
          <template v-slot:prepend>
            <v-icon>mdi-view-dashboard</v-icon>
          </template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item to="/nueva-apuesta" rounded="xl" active-color="primary" class="mb-1">
          <template v-slot:prepend>
            <v-icon>mdi-plus-circle</v-icon>
          </template>
          <v-list-item-title>Nueva Apuesta</v-list-item-title>
        </v-list-item>

        <v-list-item to="/historial" rounded="xl" active-color="primary" class="mb-1">
          <template v-slot:prepend>
            <v-icon>mdi-history</v-icon>
          </template>
          <v-list-item-title>Historial</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar (Header) -->
    <v-app-bar app color="blue-grey-darken-4" elevation="3">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold">
        <span class="text-primary">CÓRDOBA</span> <span class="text-white">BETS</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-darken-4">
      <v-container fluid class="pa-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(true);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>