// ============================================
// src/services/api.js
// Servicio para conectar Vue.js con Google Sheets
// ============================================

// La obtienes en: Apps Script → Implementar → Nueva implementación → App web
const API_URL = 'https://script.google.com/macros/s/AKfycbw3RTM5MsyOPdf6MvMgVMElQUY80pgk3zyYee4wWkVZ78WfKvUxHTZAz05vVqebwSnJ9g/exec';

// ============================================
// CLIENTES
// ============================================

export async function getClientes() {
  const response = await fetch(`${API_URL}?action=getClientes`);
  return await response.json();
}

export async function getClienteByDNI(dni) {
  const response = await fetch(`${API_URL}?action=getCliente&dni=${dni}`);
  return await response.json();
}

export async function addCliente(cliente) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // Apps Script necesita text/plain
    body: JSON.stringify({
      action: 'addCliente',
      cliente
    })
  });
  return await response.json();
}

export async function updateEstadoCliente(dni, estado) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'updateEstado',
      dni,
      estado
    })
  });
  return await response.json();
}

export async function updateCliente(dni, datosActualizados) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'updateCliente',
      dni,
      cliente: datosActualizados
    })
  });
  return await response.json();
}

export async function deleteCliente(dni) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'deleteCliente',
      dni
    })
  });
  return await response.json();
}

// ============================================
// VEHÍCULOS
// ============================================

export async function getVehiculos() {
  const response = await fetch(`${API_URL}?action=getVehiculos`);
  return await response.json();
}

export async function getVehiculosByCliente(dni) {
  const response = await fetch(`${API_URL}?action=getVehiculosByCliente&dni=${dni}`);
  return await response.json();
}

export async function addVehiculo(vehiculo) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'addVehiculo',
      vehiculo
    })
  });
  return await response.json();
}

export async function deleteVehiculo(matricula) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'deleteVehiculo',
      matricula
    })
  });
  return await response.json();
}

// ============================================
// DASHBOARD / ESTADÍSTICAS
// ============================================

export async function getEstadisticas() {
  const response = await fetch(`${API_URL}?action=getEstadisticas`);
  return await response.json();
}

// ============================================
// MARCAS Y MODELOS (datos estáticos locales)
// ============================================

export const MARCAS_MODELOS = {
  'Seat': ['Ibiza', 'León', 'Arona', 'Ateca', 'Tarraco'],
  'Volkswagen': ['Golf', 'Polo', 'Tiguan', 'Passat', 'T-Roc'],
  'Renault': ['Clio', 'Mégane', 'Captur', 'Kadjar', 'Scénic'],
  'Peugeot': ['208', '308', '2008', '3008', '5008'],
  'Citroën': ['C3', 'C4', 'C5 Aircross', 'Berlingo'],
  'Opel': ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland'],
  'Ford': ['Fiesta', 'Focus', 'Kuga', 'Puma', 'Mondeo'],
  'Toyota': ['Yaris', 'Corolla', 'C-HR', 'RAV4', 'Auris'],
  'Hyundai': ['i20', 'i30', 'Tucson', 'Kona', 'Santa Fe'],
  'Kia': ['Rio', 'Ceed', 'Sportage', 'Niro', 'Stonic'],
  'BMW': ['Serie 1', 'Serie 3', 'X1', 'X3', 'Serie 5'],
  'Mercedes-Benz': ['Clase A', 'Clase C', 'GLA', 'GLC', 'Clase E'],
  'Audi': ['A1', 'A3', 'A4', 'Q3', 'Q5'],
  'Fiat': ['500', 'Panda', 'Tipo', '500X', '500L'],
  'Nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf']
};

export const ESTADOS_RESOLUCION = [
  'pendiente',
  'en trámite',
  'resuelto',
  'rechazado'
];