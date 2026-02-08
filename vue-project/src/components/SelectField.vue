<script setup>
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '-- Selecciona --' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'blur', 'change'])
</script>

<template>
  <div class="form-group">
    <label :for="id">{{ label }} <span v-if="required">*</span></label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :class="{ 'input-error': error }"
      @change="emit('update:modelValue', $event.target.value); emit('change', $event.target.value)"
      @blur="emit('blur')"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value || opt" :value="opt.value || opt">
        {{ opt.label || opt }}
      </option>
    </select>
    <span v-if="error" class="error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #2d3748;
}

label span {
  color: #e53e3e;
}

select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  background: white;
}

select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

select:disabled {
  background: #edf2f7;
  cursor: not-allowed;
}

.input-error {
  border-color: #e53e3e;
}

.error {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 0.2rem;
  display: block;
}
</style>