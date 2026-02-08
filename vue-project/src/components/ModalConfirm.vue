<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "Confirmar acción" },
  message: { type: String, default: "¿Estás seguro?" },
  confirmText: { type: String, default: "Confirmar" },
  cancelText: { type: String, default: "Cancelar" },
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="emit('cancel')">
      <div
        class="modal-box"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="emit('cancel')">
            {{ cancelText }}
          </button>
          <button class="btn-confirm" @click="emit('confirm')">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h3 {
  color: #1a365d;
  margin-bottom: 0.5rem;
}

p {
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.5rem 1.2rem;
  border: 1px solid #cbd5e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-cancel:hover {
  background: #f7fafc;
}

.btn-confirm {
  padding: 0.5rem 1.2rem;
  border: none;
  background: #2b6cb0;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-confirm:hover {
  background: #2c5282;
}
</style>
