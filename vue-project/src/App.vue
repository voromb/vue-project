<script setup>
import { RouterLink, RouterView } from "vue-router";
import { isAdmin, logout, checkSession } from "./services/auth";
import { useRouter } from "vue-router";

checkSession();
const router = useRouter();

function handleLogout() {
  logout();
  router.push("/");
}
</script>

<template>
  <div id="app">
    <header>
      <nav aria-label="Navegación principal">
        <div class="nav-brand">
          <h1>Cártel de Coches</h1>
        </div>
        <ul class="nav-links">
          <li><RouterLink to="/">Inicio</RouterLink></li>
          <li>
            <RouterLink to="/registro-cliente">Registro Cliente</RouterLink>
          </li>
          <li>
            <RouterLink to="/registro-vehiculo">Registro Vehículo</RouterLink>
          </li>
          <li v-if="isAdmin">
            <RouterLink to="/admin">Panel Admin</RouterLink>
          </li>
          <li v-if="!isAdmin"><RouterLink to="/login">Admin</RouterLink></li>
          <li v-if="isAdmin">
            <button class="btn-logout" @click="handleLogout">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>Proyecto Cártel de Coches - Gestión de reclamaciones by Xavi & Voro</p>
    </footer>
  </div>
</template>

<style scoped>
header {
  background-color: #1a365d;
  padding: 0;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-brand h1 {
  color: white;
  margin: 0;
  font-size: 1.4rem;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-links a {
  color: #cbd5e0;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background-color: #2d4a7a;
  color: white;
}

.btn-logout {
  background: transparent;
  border: 1px solid #cbd5e0;
  color: #cbd5e0;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-logout:hover {
  background-color: #e53e3e;
  border-color: #e53e3e;
  color: white;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #f7fafc;
  color: #718096;
  margin-top: 3rem;
  border-top: 1px solid #e2e8f0;
}
</style>
