<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { addCliente, addVehiculo } from '../services/api'
import { getMarcas, getModelos, getRangoAnios } from '../services/cochesAfectados'
import InputText from '../components/InputText.vue'
import SelectField from '../components/SelectField.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'
import ModalConfirm from '../components/ModalConfirm.vue'

const route = useRoute()

const cliente = reactive({
  DNI: '',
  Nombre: '',
  Apellidos: '',
  Telefono: '',
  Email: ''
})

const vehiculo = reactive({
  Matricula: '',
  Marca: route.query.marca || '',
  Modelo: route.query.modelo || '',
  AnioMatriculacion: route.query.anio || '',
  Color: '',
  Puertas: '5',
  Observaciones: ''
})

const mensaje = ref('')
const tipoMensaje = ref('')
const enviando = ref(false)
const mostrarModal = ref(false)
const paso = ref(1)

const erroresCliente = reactive({
  DNI: '',
  Nombre: '',
  Apellidos: '',
  Telefono: '',
  Email: ''
})

const erroresVehiculo = reactive({
  Matricula: '',
  AnioMatriculacion: ''
})

const marcas = getMarcas()

const modelosDisponibles = computed(() => {
  if (!vehiculo.Marca) return []
  return getModelos(vehiculo.Marca)
})

const rangoAnios = computed(() => {
  return getRangoAnios(vehiculo.Marca)
})

const aniosDisponibles = computed(() => {
  const anios = []
  for (let a = rangoAnios.value.desde; a <= rangoAnios.value.hasta; a++) {
    anios.push(String(a))
  }
  return anios
})

function onMarcaChange() {
  vehiculo.Modelo = ''
  vehiculo.AnioMatriculacion = ''
}

// Validaciones cliente
function validarDNI() {
  const regex = /^[0-9]{8}[A-Z]$/
  if (!cliente.DNI) { erroresCliente.DNI = 'El DNI es obligatorio'; return false }
  if (!regex.test(cliente.DNI)) { erroresCliente.DNI = 'Formato: 8 números + letra mayúscula'; return false }
  erroresCliente.DNI = ''
  return true
}

function validarEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!cliente.Email) { erroresCliente.Email = 'El email es obligatorio'; return false }
  if (!regex.test(cliente.Email)) { erroresCliente.Email = 'Formato de email no válido'; return false }
  erroresCliente.Email = ''
  return true
}

function validarCampo(campo) {
  if (!cliente[campo]) { erroresCliente[campo] = 'Campo obligatorio'; return false }
  erroresCliente[campo] = ''
  return true
}

function validarTelefono() {
  const regex = /^[0-9]{9}$/
  if (!cliente.Telefono) { erroresCliente.Telefono = 'El teléfono es obligatorio'; return false }
  if (!regex.test(cliente.Telefono)) { erroresCliente.Telefono = 'Debe tener 9 dígitos'; return false }
  erroresCliente.Telefono = ''
  return true
}

function validarPaso1() {
  const v1 = validarDNI()
  const v2 = validarCampo('Nombre')
  const v3 = validarCampo('Apellidos')
  const v4 = validarTelefono()
  const v5 = validarEmail()
  return v1 && v2 && v3 && v4 && v5
}

// Validaciones vehículo
function validarMatricula() {
  const regex = /^[0-9]{4}[A-Z]{3}$/
  if (!vehiculo.Matricula) { erroresVehiculo.Matricula = 'La matrícula es obligatoria'; return false }
  if (!regex.test(vehiculo.Matricula)) { erroresVehiculo.Matricula = 'Formato: 4 números + 3 letras (ej: 1234ABC)'; return false }
  erroresVehiculo.Matricula = ''
  return true
}

function validarAnio() {
  if (!vehiculo.AnioMatriculacion) { erroresVehiculo.AnioMatriculacion = 'El año es obligatorio'; return false }
  erroresVehiculo.AnioMatriculacion = ''
  return true
}

function siguientePaso() {
  if (!validarPaso1()) return
  paso.value = 2
}

function pasoAnterior() {
  paso.value = 1
}

function intentarEnviar() {
  const v1 = validarMatricula()
  const v2 = validarAnio()
  if (!v1 || !v2) return
  if (!vehiculo.Marca || !vehiculo.Modelo) {
    mensaje.value = 'Selecciona marca y modelo del vehículo'
    tipoMensaje.value = 'error'
    return
  }
  mostrarModal.value = true
}

async function confirmarRegistro() {
  mostrarModal.value = false
  enviando.value = true
  mensaje.value = ''

  try {
    // 1. Registrar cliente
    const resultCliente = await addCliente({
      ...cliente,
      FechaRegistro: new Date().toISOString().split('T')[0],
      Estado: 'pendiente'
    })

    if (!resultCliente.success) {
      mensaje.value = resultCliente.error || 'Error al registrar el cliente'
      tipoMensaje.value = 'error'
      enviando.value = false
      return
    }

    // 2. Registrar vehículo vinculado al cliente
    const resultVehiculo = await addVehiculo({
      ...vehiculo,
      DNICliente: cliente.DNI
    })

    if (resultVehiculo.success) {
      mensaje.value = 'Reclamación registrada correctamente.'
      tipoMensaje.value = 'exito'
      paso.value = 3
    } else {
      mensaje.value = 'Cliente registrado pero hubo un error con el vehículo: ' + (resultVehiculo.error || '')
      tipoMensaje.value = 'error'
    }
  } catch (e) {
    mensaje.value = 'Error de conexión con la base de datos'
    tipoMensaje.value = 'error'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="registro">
    <h2>Presentar Reclamación</h2>

    <!-- Indicador de pasos -->
    <div v-if="paso < 3" class="pasos">
      <div :class="['paso', { activo: paso === 1, completado: paso > 1 }]">
        <span class="paso-num">1</span> Datos personales
      </div>
      <div class="paso-linea"></div>
      <div :class="['paso', { activo: paso === 2 }]">
        <span class="paso-num">2</span> Datos del vehículo
      </div>
    </div>

    <div v-if="mensaje && paso !== 3" :class="['mensaje', tipoMensaje]" role="alert">
      {{ mensaje }}
    </div>

    <!-- PASO 1: Datos del cliente -->
    <form v-if="paso === 1" @submit.prevent="siguientePaso" novalidate>
      <h3>Datos personales</h3>

      <InputText
        id="dni"
        label="DNI"
        v-model="cliente.DNI"
        placeholder="12345678A"
        maxlength="9"
        :error="erroresCliente.DNI"
        :required="true"
        @blur="validarDNI"
      />

      <div class="form-row">
        <InputText
          id="nombre"
          label="Nombre"
          v-model="cliente.Nombre"
          placeholder="Juan"
          :error="erroresCliente.Nombre"
          :required="true"
          @blur="validarCampo('Nombre')"
        />
        <InputText
          id="apellidos"
          label="Apellidos"
          v-model="cliente.Apellidos"
          placeholder="García López"
          :error="erroresCliente.Apellidos"
          :required="true"
          @blur="validarCampo('Apellidos')"
        />
      </div>

      <div class="form-row">
        <InputText
          id="telefono"
          label="Teléfono"
          v-model="cliente.Telefono"
          type="tel"
          placeholder="612345678"
          maxlength="9"
          :error="erroresCliente.Telefono"
          :required="true"
          @blur="validarTelefono"
        />
        <InputText
          id="email"
          label="Email"
          v-model="cliente.Email"
          type="email"
          placeholder="correo@ejemplo.com"
          :error="erroresCliente.Email"
          :required="true"
          @blur="validarEmail"
        />
      </div>

      <ButtonPrimary type="submit">
        Siguiente: Datos del vehículo
      </ButtonPrimary>
    </form>

    <!-- PASO 2: Datos del vehículo -->
    <form v-if="paso === 2" @submit.prevent="intentarEnviar" novalidate>
      <h3>Datos del vehículo</h3>

      <div v-if="vehiculo.Marca && vehiculo.Modelo" class="vehiculo-preseleccionado">
        <p>Vehículo verificado: <strong>{{ vehiculo.Marca }} {{ vehiculo.Modelo }} ({{ vehiculo.AnioMatriculacion }})</strong></p>
      </div>

      <div class="form-row">
        <InputText
          id="matricula"
          label="Matrícula"
          v-model="vehiculo.Matricula"
          placeholder="1234ABC"
          maxlength="7"
          :error="erroresVehiculo.Matricula"
          :required="true"
          @blur="validarMatricula"
        />
        <SelectField
          id="anio"
          label="Año de matriculación"
          v-model="vehiculo.AnioMatriculacion"
          :options="aniosDisponibles"
          placeholder="-- Año --"
          :required="true"
          :error="erroresVehiculo.AnioMatriculacion"
          @blur="validarAnio"
        />
      </div>

      <div class="form-row">
        <SelectField
          id="marca"
          label="Marca"
          v-model="vehiculo.Marca"
          :options="marcas"
          placeholder="-- Selecciona marca --"
          :required="true"
          @change="onMarcaChange"
        />
        <SelectField
          id="modelo"
          label="Modelo"
          v-model="vehiculo.Modelo"
          :options="modelosDisponibles"
          placeholder="-- Selecciona modelo --"
          :disabled="!vehiculo.Marca"
          :required="true"
        />
      </div>

      <div class="form-row">
        <InputText
          id="color"
          label="Color"
          v-model="vehiculo.Color"
          placeholder="Blanco"
        />
        <SelectField
          id="puertas"
          label="Nº Puertas"
          v-model="vehiculo.Puertas"
          :options="['3', '4', '5']"
        />
      </div>

      <div class="form-group">
        <label for="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          v-model="vehiculo.Observaciones"
          rows="3"
          placeholder="Datos adicionales..."
        ></textarea>
      </div>

      <div class="botones-paso2">
        <button type="button" class="btn-secundario" @click="pasoAnterior">Volver</button>
        <ButtonPrimary type="submit" :loading="enviando" loadingText="Enviando...">
          Enviar reclamación
        </ButtonPrimary>
      </div>
    </form>

    <!-- PASO 3: Confirmación -->
    <div v-if="paso === 3" class="confirmacion">
      <div class="confirmacion-box">
        <h3>Reclamación registrada</h3>
        <p>Tus datos han sido registrados correctamente. Te contactaremos para informarte sobre el estado de tu reclamación.</p>
        <div class="resumen-datos">
          <p><strong>Cliente:</strong> {{ cliente.Nombre }} {{ cliente.Apellidos }} ({{ cliente.DNI }})</p>
          <p><strong>Vehículo:</strong> {{ vehiculo.Marca }} {{ vehiculo.Modelo }} - {{ vehiculo.Matricula }}</p>
          <p><strong>Año:</strong> {{ vehiculo.AnioMatriculacion }}</p>
          <p><strong>Estado:</strong> Pendiente de revisión</p>
        </div>
        <RouterLink to="/" class="btn-volver">Volver al inicio</RouterLink>
      </div>
    </div>

    <ModalConfirm
      :visible="mostrarModal"
      title="Confirmar reclamación"
      :message="'¿Enviar reclamación para ' + vehiculo.Marca + ' ' + vehiculo.Modelo + ' (' + vehiculo.Matricula + ')?'"
      confirmText="Enviar"
      @confirm="confirmarRegistro"
      @cancel="mostrarModal = false"
    />
  </div>
</template>

<style scoped>
.registro {
  max-width: 750px;
  margin: 0 auto;
}

h2 {
  color: #1a365d;
  margin-bottom: 1rem;
}

h3 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.pasos {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.paso {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0aec0;
  font-size: 0.95rem;
}

.paso.activo { color: #2b6cb0; font-weight: 600; }
.paso.completado { color: #276749; }

.paso-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 600;
}

.paso.activo .paso-num { background: #2b6cb0; color: white; }
.paso.completado .paso-num { background: #48bb78; color: white; }

.paso-linea {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 1rem;
}

.form-row { display: flex; gap: 1rem; }

.form-group { margin-bottom: 1rem; }

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #2d3748;
}

textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.vehiculo-preseleccionado {
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  padding: 0.8rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  color: #2a4365;
}

.botones-paso2 {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.btn-secundario {
  background: transparent;
  border: 1px solid #cbd5e0;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  color: #4a5568;
  font-size: 1rem;
}

.btn-secundario:hover { background: #edf2f7; }

.confirmacion-box {
  text-align: center;
  padding: 2rem;
  background: #f0fff4;
  border: 1px solid #c6f6d5;
  border-radius: 8px;
}

.confirmacion-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
.confirmacion-box h3 { color: #276749; }
.confirmacion-box p { color: #2f855a; }

.resumen-datos {
  background: white;
  border: 1px solid #c6f6d5;
  border-radius: 4px;
  padding: 1rem;
  margin: 1.5rem auto;
  max-width: 400px;
  text-align: left;
}

.resumen-datos p { color: #4a5568; margin: 0.3rem 0; }

.btn-volver {
  display: inline-block;
  background: #2b6cb0;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 1rem;
}

.btn-volver:hover { background: #2c5282; }

.mensaje { padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
.exito { background-color: #c6f6d5; color: #276749; border: 1px solid #9ae6b4; }
.error { background-color: #fed7d7; color: #9b2c2c; border: 1px solid #feb2b2; }
</style>