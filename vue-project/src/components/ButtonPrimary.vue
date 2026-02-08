<script setup>
const props = defineProps({
  type: { type: String, default: "button" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: "Cargando..." },
});

const emit = defineEmits(["click"]);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="btn-primary"
    @click="emit('click')"
  >
    <slot v-if="!loading" />
    <span v-else>{{ loadingText }}</span>
  </button>
</template>

<style scoped>
.btn-primary {
  background-color: #2b6cb0;
  color: white;
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #2c5282;
}

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
</style>
