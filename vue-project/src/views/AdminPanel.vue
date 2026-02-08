<script setup>
import { ref, computed, onMounted } from 'vue'
import { getClientes, getVehiculosByCliente, updateEstadoCliente, ESTADOS_RESOLUCION } from '../services/api'
import SelectField from '../components/SelectField.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'
import ModalConfirm from '../components/ModalConfirm.vue'

const clientes = ref([])
const loading = ref(true)
const filtroEstado = ref('todos')
const clienteSeleccionado = ref(null)
const vehiculosCliente = ref([])
const cargandoVehiculos = ref(false)
const mensaje = ref('')
const tipoMensaje = ref('')

const estados = ESTADOS_RESOLUCION
const filtroOptions = [{ value: 'todos', label: 'Todos' }, ...estados.map(e => ({ value: e, label: e }))]

// Modal para cambio de estado
const mostrarModal = ref(false)
const modalDNI = ref('')
const modalNombre = ref('')
const modalEstadoNuevo = ref('')

onMounted(async () => {
  await cargarClientes()
})

async function cargarClientes() {
  loading.value = true
  try {
    const result = await getClientes()
    if (result.success) {
      clientes.value = result.data
    }
  } catch (e) {
    console.error('Error cargando clientes:', e)
  } finally {
    loading.value = false
  }
}

const clientesFiltrados = computed(() => {
  if (filtroEstado.value === 'todos') return clientes.value
  return clientes.value.filter(c => c.Estado === filtroEstado.value)
})

async function verVehiculos(cliente) {
  if (clienteSeleccionado.value?.DNI === cliente.DNI) {
    clienteSeleccionado.value = null
    vehiculosCliente.value = []
    return
  }

  clienteSeleccionado.value = cliente
  cargandoVehiculos.value = true

  try {
    const result = await getVehiculosByCliente(cliente.DNI)
    if (result.success) {
      vehiculosCliente.value = result.data
    }
  } catch (e) {
    console.error('Error cargando vehículos:', e)
  } finally {
    cargandoVehiculos.value = false
  }
}

function pedirCambioEstado(cliente, nuevoEstado) {
  if (nuevoEstado === cliente.Estado) return
  modalDNI.value = cliente.DNI
  modalNombre.value = cliente.Nombre + ' ' + cliente.Apellidos
  modalEstadoNuevo.value = nuevoEstado
  mostrarModal.value = true
}

async function confirmarCambioEstado() {
  mostrarModal.value = false
  mensaje.value = ''

  try {
    const result = await updateEstadoCliente(modalDNI.value, modalEstadoNuevo.value)
    if (result.success) {
      mensaje.value = `Estado de ${modalNombre.value} actualizado a "${modalEstadoNuevo.value}"`
      tipoMensaje.value = 'exito'
      const cliente = clientes.value.find(c => c.DNI === modalDNI.value)
      if (cliente) cliente.Estado = modalEstadoNuevo.value
    } else {
      mensaje.value = result.error || 'Error al actualizar'
      tipoMensaje.value = 'error'
    }
  } catch (e) {
    mensaje.value = 'Error de conexión'
    tipoMensaje.value = 'error'
  }
}

function cancelarCambioEstado() {
  mostrarModal.value = false
  // Restaurar el select al valor original
  const cliente = clientes.value.find(c => c.DNI === modalDNI.value)
  if (cliente) {
    // Forzar reactualización
    const estado = cliente.Estado
    cliente.Estado = ''
    setTimeout(() => { cliente.Estado = estado }, 0)
  }
}

function getEstadoClase(estado) {
  const clases = {
    'pendiente': 'estado-pendiente',
    'en trámite': 'estado-tramite',
    'resuelto': 'estado-resuelto',
    'rechazado': 'estado-rechazado'
  }
  return clases[estado] || ''
}
</script>

<template>
  <div class="admin-panel">
    <h2>Panel de Administración</h2>

    <div v-if="mensaje" :class="['mensaje', tipoMensaje]" role="alert">
      {{ mensaje }}
    </div>

    <!-- Filtros -->
    <div class="filtros">
      <SelectField
        id="filtro"
        label="Filtrar por estado"
        v-model="filtroEstado"
        :options="filtroOptions"
        placeholder=""
      />
      <span class="contador">{{ clientesFiltrados.length }} cliente(s)</span>
      <ButtonPrimary @click="cargarClientes" :loading="loading" loadingText="Cargando...">
        Recargar
      </ButtonPrimary>
    </div>

    <!-- Tabla de clientes -->
    <p v-if="loading" class="loading">Cargando clientes...</p>

    <div v-else-if="clientesFiltrados.length === 0" class="sin-datos">
      No hay clientes con el filtro seleccionado.
    </div>

    <table v-else class="tabla-clientes" aria-label="Listado de clientes">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>Email</th>
          <th>Estado</th>
          <th>Cambiar Estado</th>
          <th>Vehículos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in clientesFiltrados" :key="c.DNI"
            :class="{ 'fila-seleccionada': clienteSeleccionado?.DNI === c.DNI }">
          <td>{{ c.DNI }}</td>
          <td>{{ c.Nombre }}</td>
          <td>{{ c.Apellidos }}</td>
          <td>{{ c.Email }}</td>
          <td>
            <span :class="['badge', getEstadoClase(c.Estado)]">{{ c.Estado }}</span>
          </td>
          <td>
            <select
              :value="c.Estado"
              @change="pedirCambioEstado(c, $event.target.value)"
              :aria-label="'Cambiar estado de ' + c.Nombre"
            >
              <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
            </select>
          </td>
          <td>
            <button class="btn-ver" @click="verVehiculos(c)">
              {{ clienteSeleccionado?.DNI === c.DNI ? 'Ocultar' : 'Ver' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Panel de vehículos -->
    <div v-if="clienteSeleccionado" class="panel-vehiculos">
      <h3>Vehículos de {{ clienteSeleccionado.Nombre }} {{ clienteSeleccionado.Apellidos }}</h3>

      <p v-if="cargandoVehiculos">Cargando vehículos...</p>

      <div v-else-if="vehiculosCliente.length === 0" class="sin-datos">
        Este cliente no tiene vehículos registrados.
      </div>

      <table v-else class="tabla-vehiculos" aria-label="Vehículos del cliente">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Color</th>
            <th>Puertas</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in vehiculosCliente" :key="v.Matricula">
            <td>{{ v.Matricula }}</td>
            <td>{{ v.Marca }}</td>
            <td>{{ v.Modelo }}</td>
            <td>{{ v.AnioMatriculacion }}</td>
            <td>{{ v.Color }}</td>
            <td>{{ v.Puertas }}</td>
            <td>{{ v.Observaciones }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de confirmación -->
    <ModalConfirm
      :visible="mostrarModal"
      title="Confirmar cambio de estado"
      :message="'¿Cambiar el estado de ' + modalNombre + ' a &quot;' + modalEstadoNuevo + '&quot;?'"
      confirmText="Cambiar"
      @confirm="confirmarCambioEstado"
      @cancel="cancelarCambioEstado"
    />
  </div>
</template>

<style scoped>
.admin-panel {
  max-width: 1100px;
  margin: 0 auto;
}

h2 {
  color: #1a365d;
  margin-bottom: 1.5rem;
}

.filtros {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.contador {
  color: #718096;
  font-size: 0.9rem;
  padding-bottom: 0.7rem;
}

.tabla-clientes, .tabla-vehiculos {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.tabla-clientes th, .tabla-vehiculos th {
  background: #1a365d;
  color: white;
  padding: 0.7rem;
  text-align: left;
  font-size: 0.9rem;
}

.tabla-clientes td, .tabla-vehiculos td {
  padding: 0.6rem 0.7rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.tabla-clientes tbody tr:hover {
  background-color: #ebf8ff;
}

.fila-seleccionada {
  background-color: #bee3f8 !important;
}

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.estado-pendiente { background: #fefcbf; color: #975a16; }
.estado-tramite { background: #bee3f8; color: #2a4365; }
.estado-resuelto { background: #c6f6d5; color: #276749; }
.estado-rechazado { background: #fed7d7; color: #9b2c2c; }

.btn-ver {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-ver:hover { background: #2c5282; }

td select {
  padding: 0.3rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 0.85rem;
}

.panel-vehiculos {
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.panel-vehiculos h3 { color: #2d3748; margin-bottom: 1rem; }
.sin-datos { text-align: center; color: #718096; padding: 2rem; }
.loading { text-align: center; color: #718096; }

.mensaje {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.exito { background-color: #c6f6d5; color: #276749; border: 1px solid #9ae6b4; }
.error { background-color: #fed7d7; color: #9b2c2c; border: 1px solid #feb2b2; }
</style>