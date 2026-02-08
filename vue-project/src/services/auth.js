import { ref } from "vue";

// Credenciales del administrador
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

export const isAdmin = ref(false);

export function login(usuario, password) {
  if (usuario === ADMIN_USER && password === ADMIN_PASS) {
    isAdmin.value = true;
    sessionStorage.setItem("admin", "true");
    return { success: true };
  }
  return { success: false, error: "Usuario o contraseña incorrectos" };
}

export function logout() {
  isAdmin.value = false;
  sessionStorage.removeItem("admin");
}

export function checkSession() {
  isAdmin.value = sessionStorage.getItem("admin") === "true";
}
