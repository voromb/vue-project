<script setup>
import { ref, computed } from 'vue'
import { getMarcas, getModelos, getRangoAnios, comprobarAfectado } from '../services/cochesAfectados'
import SelectField from '../components/SelectField.vue'
import InputText from '../components/InputText.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'

const marcaSeleccionada = ref('')
const modeloSeleccionado = ref('')
const anioSeleccionado = ref('')
const verificado = ref(false)
const resultado = ref(null)

const marcas = getMarcas()

const modelosDisponibles = computed(() => {
  if (!marcaSeleccionada.value) return []
  return getModelos(marcaSeleccionada.value)
})

const rangoAnios = computed(() => {
  if (!marcaSeleccionada.value) return { desde: 2006, hasta: 2013 }
  return getRangoAnios(marcaSeleccionada.value)
})

const aniosDisponibles = computed(() => {
  const anios = []
  for (let a = rangoAnios.value.desde; a <= rangoAnios.value.hasta; a++) {
    anios.push(String(a))
  }
  return anios
})

function onMarcaChange() {
  modeloSeleccionado.value = ''
  anioSeleccionado.value = ''
  verificado.value = false
  resultado.value = null
}

function onModeloChange() {
  anioSeleccionado.value = ''
  verificado.value = false
  resultado.value = null
}

function comprobar() {
  if (!marcaSeleccionada.value || !modeloSeleccionado.value || !anioSeleccionado.value) return
  resultado.value = comprobarAfectado(marcaSeleccionada.value, modeloSeleccionado.value, anioSeleccionado.value)
  verificado.value = true
}

function resetear() {
  marcaSeleccionada.value = ''
  modeloSeleccionado.value = ''
  anioSeleccionado.value = ''
  verificado.value = false
  resultado.value = null
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h2>Cártel de Coches - Comprueba si tu vehículo está afectado</h2>
      <p>
        Entre 2006 y 2013, 27 fabricantes de coches en España intercambiaron
        información comercial sensible para fijar precios, afectando a millones de consumidores.
        Comprueba si tu vehículo está en la lista de afectados y presenta tu reclamación.
      </p>
    </section>

    <section class="comprobacion">
      <h3>1. Comprueba tu vehículo</h3>
      <p class="instrucciones">Selecciona marca, modelo y año de matriculación para verificar si tu coche fue afectado por el cártel.</p>

      <div class="form-row">
        <SelectField
          id="marca"
          label="Marca"
          v-model="marcaSeleccionada"
          :options="marcas"
          placeholder="-- Selecciona marca --"
          :required="true"
          @change="onMarcaChange"
        />
        <SelectField
          id="modelo"
          label="Modelo"
          v-model="modeloSeleccionado"
          :options="modelosDisponibles"
          placeholder="-- Selecciona modelo --"
          :disabled="!marcaSeleccionada"
          :required="true"
          @change="onModeloChange"
        />
        <SelectField
          id="anio"
          label="Año matriculación"
          v-model="anioSeleccionado"
          :options="aniosDisponibles"
          placeholder="-- Año --"
          :disabled="!modeloSeleccionado"
          :required="true"
        />
      </div>

      <ButtonPrimary
        @click="comprobar"
        :disabled="!marcaSeleccionada || !modeloSeleccionado || !anioSeleccionado"
      >
        Comprobar vehículo
      </ButtonPrimary>
    </section>

    <!-- Resultado -->
    <section v-if="verificado && resultado" class="resultado">
      <div v-if="resultado.afectado" class="resultado-afectado">
        <h3>✅ Tu vehículo está afectado por el cártel</h3>
        <p>{{ resultado.motivo }}</p>
        <p>Tienes derecho a presentar una reclamación y podrías recuperar entre un 10% y un 17,5% del precio de compra.</p>
        <div class="resultado-acciones">
          <RouterLink
            :to="{ path: '/registro', query: { marca: marcaSeleccionada, modelo: modeloSeleccionado, anio: anioSeleccionado } }"
            class="btn-reclamar"
          >
            Presentar reclamación
          </RouterLink>
          <button class="btn-secundario" @click="resetear">Comprobar otro vehículo</button>
        </div>
      </div>

      <div v-else class="resultado-no-afectado">
        <h3>❌ Tu vehículo no está afectado</h3>
        <p>{{ resultado.motivo }}</p>
        <button class="btn-secundario" @click="resetear">Comprobar otro vehículo</button>
      </div>
    </section>

    <section class="info-cartel">
      <h3>Marcas afectadas por el cártel</h3>
      <p>El cártel afectó a 27 marcas con diferentes periodos. Algunas de las principales:</p>
      <div class="marcas-grid">
        <span class="marca-tag">Seat (2006–2013)</span>
        <span class="marca-tag">Volkswagen (2008–2013)</span>
        <span class="marca-tag">Renault (2006–2013)</span>
        <span class="marca-tag">Peugeot (2006–2013)</span>
        <span class="marca-tag">Ford (2006–2013)</span>
        <span class="marca-tag">BMW (2008–2013)</span>
        <span class="marca-tag">Toyota (2006–2013)</span>
        <span class="marca-tag">Mercedes-Benz (2010–2013)</span>
        <span class="marca-tag">Audi (2008–2013)</span>
        <span class="marca-tag">Citroën (2006–2013)</span>
        <span class="marca-tag">Hyundai (2010–2013)</span>
        <span class="marca-tag">Opel (2006–2013)</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 850px;
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
  max-width: 650px;
  margin: 0 auto;
}

.comprobacion {
  padding: 1.5rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.comprobacion h3 {
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.instrucciones {
  color: #718096;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.resultado {
  margin-top: 1.5rem;
}

.resultado-afectado {
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  padding: 1.5rem;
}

.resultado-afectado h3 {
  color: #276749;
  margin-bottom: 0.5rem;
}

.resultado-afectado p {
  color: #2f855a;
  margin-bottom: 0.5rem;
}

.resultado-no-afectado {
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  padding: 1.5rem;
}

.resultado-no-afectado h3 {
  color: #9b2c2c;
  margin-bottom: 0.5rem;
}

.resultado-no-afectado p {
  color: #c53030;
  margin-bottom: 1rem;
}

.resultado-acciones {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.btn-reclamar {
  background-color: #276749;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}

.btn-reclamar:hover {
  background-color: #22543d;
}

.btn-secundario {
  background: transparent;
  border: 1px solid #cbd5e0;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  color: #4a5568;
}

.btn-secundario:hover {
  background: #edf2f7;
}

.info-cartel {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 8px;
}

.info-cartel h3 {
  color: #2a4365;
  margin-bottom: 0.5rem;
}

.info-cartel > p {
  color: #4a5568;
  margin-bottom: 1rem;
}

.marcas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.marca-tag {
  background: white;
  border: 1px solid #bee3f8;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #2a4365;
}
</style>