<script setup>
import { ref } from 'vue'
import { login } from '../services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  error.value = ''
  const result = login(usuario.value, password.value)
  if (result.success) {
    router.push('/admin')
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <div class="login">
    <div class="login-box">
      <h2>Acceso Administrador</h2>
      <p class="login-info">Introduce tus credenciales para acceder al panel de administración.</p>

      <div v-if="error" class="mensaje-error" role="alert">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="usuario">Usuario</label>
          <input id="usuario" v-model="usuario" type="text" placeholder="admin" required />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" v-model="password" type="password" placeholder="••••••" required />
        </div>

        <button type="submit" class="btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}

.login-box {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

h2 {
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.login-info {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #2d3748;
}

input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.btn-primary {
  background-color: #2b6cb0;
  color: white;
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
}

.btn-primary:hover {
  background-color: #2c5282;
}

.mensaje-error {
  background-color: #fed7d7;
  color: #9b2c2c;
  border: 1px solid #feb2b2;
  padding: 0.7rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
</style>