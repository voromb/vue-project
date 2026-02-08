<script setup>
import { ref, reactive } from "vue";
import { addCliente } from "../services/api";
import InputText from "../components/InputText.vue";
import ButtonPrimary from "../components/ButtonPrimary.vue";
import ModalConfirm from "../components/ModalConfirm.vue";

const form = reactive({
  DNI: "",
  Nombre: "",
  Apellidos: "",
  Telefono: "",
  Email: "",
  Estado: "pendiente",
});

const mensaje = ref("");
const tipoMensaje = ref("");
const enviando = ref(false);
const mostrarModal = ref(false);

const errores = reactive({
  DNI: "",
  Nombre: "",
  Apellidos: "",
  Telefono: "",
  Email: "",
});

function validarDNI() {
  const regex = /^[0-9]{8}[A-Z]$/;
  if (!form.DNI) {
    errores.DNI = "El DNI es obligatorio";
    return false;
  }
  if (!regex.test(form.DNI)) {
    errores.DNI = "Formato: 8 números + letra mayúscula (ej: 12345678A)";
    return false;
  }
  errores.DNI = "";
  return true;
}

function validarEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.Email) {
    errores.Email = "El email es obligatorio";
    return false;
  }
  if (!regex.test(form.Email)) {
    errores.Email = "Formato de email no válido";
    return false;
  }
  errores.Email = "";
  return true;
}

function validarCampo(campo) {
  if (!form[campo]) {
    errores[campo] = `El campo ${campo.toLowerCase()} es obligatorio`;
    return false;
  }
  errores[campo] = "";
  return true;
}

function validarTelefono() {
  const regex = /^[0-9]{9}$/;
  if (!form.Telefono) {
    errores.Telefono = "El teléfono es obligatorio";
    return false;
  }
  if (!regex.test(form.Telefono)) {
    errores.Telefono = "Debe tener 9 dígitos";
    return false;
  }
  errores.Telefono = "";
  return true;
}

function validarFormulario() {
  const v1 = validarDNI();
  const v2 = validarCampo("Nombre");
  const v3 = validarCampo("Apellidos");
  const v4 = validarTelefono();
  const v5 = validarEmail();
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
    const result = await addCliente({
      ...form,
      FechaRegistro: new Date().toISOString().split("T")[0],
    });

    if (result.success) {
      mensaje.value = "Cliente registrado correctamente";
      tipoMensaje.value = "exito";
      Object.keys(form).forEach((key) => {
        form[key] = key === "Estado" ? "pendiente" : "";
      });
    } else {
      mensaje.value = result.error || "Error al registrar el cliente";
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
  <div class="registro-cliente">
    <h2>Registro de Cliente Afectado</h2>

    <div v-if="mensaje" :class="['mensaje', tipoMensaje]" role="alert">
      {{ mensaje }}
    </div>

    <form @submit.prevent="intentarEnviar" novalidate>
      <InputText
        id="dni"
        label="DNI"
        v-model="form.DNI"
        placeholder="12345678A"
        maxlength="9"
        :error="errores.DNI"
        :required="true"
        @blur="validarDNI"
      />

      <div class="form-row">
        <InputText
          id="nombre"
          label="Nombre"
          v-model="form.Nombre"
          placeholder="Juan"
          :error="errores.Nombre"
          :required="true"
          @blur="validarCampo('Nombre')"
        />
        <InputText
          id="apellidos"
          label="Apellidos"
          v-model="form.Apellidos"
          placeholder="García López"
          :error="errores.Apellidos"
          :required="true"
          @blur="validarCampo('Apellidos')"
        />
      </div>

      <div class="form-row">
        <InputText
          id="telefono"
          label="Teléfono"
          v-model="form.Telefono"
          type="tel"
          placeholder="612345678"
          maxlength="9"
          :error="errores.Telefono"
          :required="true"
          @blur="validarTelefono"
        />
        <InputText
          id="email"
          label="Email"
          v-model="form.Email"
          type="email"
          placeholder="correo@ejemplo.com"
          :error="errores.Email"
          :required="true"
          @blur="validarEmail"
        />
      </div>

      <ButtonPrimary
        type="submit"
        :loading="enviando"
        loadingText="Registrando..."
      >
        Registrar Cliente
      </ButtonPrimary>
    </form>

    <ModalConfirm
      :visible="mostrarModal"
      title="Confirmar registro"
      :message="
        '¿Registrar al cliente ' +
        form.Nombre +
        ' ' +
        form.Apellidos +
        ' con DNI ' +
        form.DNI +
        '?'
      "
      confirmText="Registrar"
      @confirm="confirmarRegistro"
      @cancel="mostrarModal = false"
    />
  </div>
</template>

<style scoped>
.registro-cliente {
  max-width: 700px;
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
