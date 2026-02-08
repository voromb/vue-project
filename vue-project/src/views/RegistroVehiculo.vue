<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { addVehiculo, getClientes, MARCAS_MODELOS } from "../services/api";
import InputText from "../components/InputText.vue";
import SelectField from "../components/SelectField.vue";
import ButtonPrimary from "../components/ButtonPrimary.vue";
import ModalConfirm from "../components/ModalConfirm.vue";

const form = reactive({
  Matricula: "",
  DNICliente: "",
  Marca: "",
  Modelo: "",
  AnioMatriculacion: "",
  Color: "",
  Puertas: "5",
  Observaciones: "",
});

const mensaje = ref("");
const tipoMensaje = ref("");
const enviando = ref(false);
const mostrarModal = ref(false);
const clientes = ref([]);
const cargandoClientes = ref(true);

const errores = reactive({
  Matricula: "",
  DNICliente: "",
  Marca: "",
  Modelo: "",
  AnioMatriculacion: "",
});

onMounted(async () => {
  try {
    const result = await getClientes();
    if (result.success) {
      clientes.value = result.data;
    }
  } catch (e) {
    console.error("Error cargando clientes:", e);
  } finally {
    cargandoClientes.value = false;
  }
});

const clientesOptions = computed(() => {
  return clientes.value.map((c) => ({
    value: c.DNI,
    label: c.DNI + " - " + c.Nombre + " " + c.Apellidos,
  }));
});

const marcasOptions = Object.keys(MARCAS_MODELOS);

const modelosDisponibles = computed(() => {
  if (!form.Marca) return [];
  return MARCAS_MODELOS[form.Marca] || [];
});

const puertasOptions = ["3", "4", "5"];

function validarMatricula() {
  const regex = /^[0-9]{4}[A-Z]{3}$/;
  if (!form.Matricula) {
    errores.Matricula = "La matrícula es obligatoria";
    return false;
  }
  if (!regex.test(form.Matricula)) {
    errores.Matricula = "Formato: 4 números + 3 letras (ej: 1234ABC)";
    return false;
  }
  errores.Matricula = "";
  return true;
}

function validarSelect(campo) {
  if (!form[campo]) {
    errores[campo] = "Este campo es obligatorio";
    return false;
  }
  errores[campo] = "";
  return true;
}

function validarAnio() {
  const anio = parseInt(form.AnioMatriculacion);
  if (!form.AnioMatriculacion) {
    errores.AnioMatriculacion = "El año es obligatorio";
    return false;
  }
  if (isNaN(anio) || anio < 2000 || anio > 2013) {
    errores.AnioMatriculacion =
      "Debe estar entre 2000 y 2013 (periodo del cártel)";
    return false;
  }
  errores.AnioMatriculacion = "";
  return true;
}

function onMarcaChange() {
  form.Modelo = "";
}

function validarFormulario() {
  const v1 = validarMatricula();
  const v2 = validarSelect("DNICliente");
  const v3 = validarSelect("Marca");
  const v4 = validarSelect("Modelo");
  const v5 = validarAnio();
  return v1 && v2 && v3 && v4 && v5;
}

function intentarEnviar() {
  if (!validarFormulario()) return;
  mostrarModal.value = true;
}

async function confirmarRegistro() {
  mostrarModal.value = false;
  enviando.value = true;
  mensaje.value = "";

  try {
    const result = await addVehiculo({ ...form });

    if (result.success) {
      mensaje.value = "Vehículo registrado correctamente";
      tipoMensaje.value = "exito";
      Object.keys(form).forEach((key) => {
        form[key] = key === "Puertas" ? "5" : "";
      });
    } else {
      mensaje.value = result.error || "Error al registrar el vehículo";
      tipoMensaje.value = "error";
    }
  } catch (e) {
    mensaje.value = "Error de conexión con la base de datos";
    tipoMensaje.value = "error";
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
  <div class="registro-vehiculo">
    <h2>Registro de Vehículo</h2>

    <div v-if="mensaje" :class="['mensaje', tipoMensaje]" role="alert">
      {{ mensaje }}
    </div>

    <form @submit.prevent="intentarEnviar" novalidate>
      <div class="form-row">
        <InputText
          id="matricula"
          label="Matrícula"
          v-model="form.Matricula"
          placeholder="1234ABC"
          maxlength="7"
          :error="errores.Matricula"
          :required="true"
          @blur="validarMatricula"
        />
        <SelectField
          id="dniCliente"
          label="Cliente (DNI)"
          v-model="form.DNICliente"
          :options="clientesOptions"
          placeholder="-- Selecciona cliente --"
          :error="errores.DNICliente"
          :required="true"
          @blur="validarSelect('DNICliente')"
        />
      </div>

      <div class="form-row">
        <SelectField
          id="marca"
          label="Marca"
          v-model="form.Marca"
          :options="marcasOptions"
          placeholder="-- Selecciona marca --"
          :error="errores.Marca"
          :required="true"
          @blur="validarSelect('Marca')"
          @change="onMarcaChange"
        />
        <SelectField
          id="modelo"
          label="Modelo"
          v-model="form.Modelo"
          :options="modelosDisponibles"
          placeholder="-- Selecciona modelo --"
          :disabled="!form.Marca"
          :error="errores.Modelo"
          :required="true"
          @blur="validarSelect('Modelo')"
        />
      </div>

      <div class="form-row">
        <InputText
          id="anio"
          label="Año de matriculación"
          v-model="form.AnioMatriculacion"
          type="number"
          placeholder="2010"
          :error="errores.AnioMatriculacion"
          :required="true"
          @blur="validarAnio"
        />
        <InputText
          id="color"
          label="Color"
          v-model="form.Color"
          placeholder="Blanco"
        />
        <SelectField
          id="puertas"
          label="Nº Puertas"
          v-model="form.Puertas"
          :options="puertasOptions"
        />
      </div>

      <div class="form-group">
        <label for="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          v-model="form.Observaciones"
          rows="3"
          placeholder="Datos adicionales del vehículo..."
        ></textarea>
      </div>

      <ButtonPrimary
        type="submit"
        :loading="enviando"
        loadingText="Registrando..."
      >
        Registrar Vehículo
      </ButtonPrimary>
    </form>

    <ModalConfirm
      :visible="mostrarModal"
      title="Confirmar registro"
      :message="
        '¿Registrar vehículo ' +
        form.Matricula +
        ' (' +
        form.Marca +
        ' ' +
        form.Modelo +
        ')?'
      "
      confirmText="Registrar"
      @confirm="confirmarRegistro"
      @cancel="mostrarModal = false"
    />
  </div>
</template>

<style scoped>
.registro-vehiculo {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #1a365d;
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
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

.mensaje {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.exito {
  background-color: #c6f6d5;
  color: #276749;
  border: 1px solid #9ae6b4;
}

.error {
  background-color: #fed7d7;
  color: #9b2c2c;
  border: 1px solid #feb2b2;
}
</style>
