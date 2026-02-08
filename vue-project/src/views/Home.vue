<script setup>
import { ref, onMounted } from "vue";
import { getEstadisticas } from "../services/api";

const stats = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const result = await getEstadisticas();
    if (result.success) {
      stats.value = result.data;
    }
  } catch (e) {
    console.error("Error cargando estadísticas:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="home">
    <section class="hero">
      <h2>Gestión de Reclamaciones - Cártel de Coches</h2>
      <p>
        Aplicación para registrar clientes afectados por el cártel de
        fabricantes de coches en España (2006–2013) y gestionar el estado de sus
        reclamaciones.
      </p>
    </section>

    <section class="acciones">
      <h3>¿Qué deseas hacer?</h3>
      <div class="cards">
        <RouterLink to="/registro-cliente" class="card">
          <span class="card-icon"></span>
          <h4>Registrar Cliente</h4>
          <p>Dar de alta un nuevo cliente afectado</p>
        </RouterLink>

        <RouterLink to="/registro-vehiculo" class="card">
          <span class="card-icon"></span>
          <h4>Registrar Vehículo</h4>
          <p>Añadir un vehículo a un cliente existente</p>
        </RouterLink>

        <RouterLink to="/admin" class="card">
          <span class="card-icon"></span>
          <h4>Panel de Administración</h4>
          <p>Gestionar incidencias y estados</p>
        </RouterLink>
      </div>
    </section>

    <section v-if="!loading && stats" class="resumen">
      <h3>Resumen actual</h3>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-number">{{ stats.totalClientes }}</span>
          <span class="stat-label">Clientes registrados</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">{{ stats.totalVehiculos }}</span>
          <span class="stat-label">Vehículos registrados</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">{{ stats.porEstado?.pendiente || 0 }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">{{ stats.porEstado?.resuelto || 0 }}</span>
          <span class="stat-label">Resueltos</span>
        </div>
      </div>
    </section>

    <p v-if="loading" class="loading">Cargando datos...</p>
  </div>
</template>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.hero h2 {
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.hero p {
  color: #4a5568;
  max-width: 600px;
  margin: 0 auto;
}

.acciones h3,
.resumen h3 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  text-align: center;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.card h4 {
  color: #1a365d;
  margin: 0.5rem 0;
}

.card p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-box {
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #2b6cb0;
}

.stat-label {
  color: #4a5568;
  font-size: 0.85rem;
}

.loading {
  text-align: center;
  color: #718096;
}
</style>
