<script setup>
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  maxlength: { type: String, default: "" },
  error: { type: String, default: "" },
  required: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "blur"]);
</script>

<template>
  <div class="form-group">
    <label :for="id">{{ label }} <span v-if="required">*</span></label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength || undefined"
      :class="{ 'input-error': error }"
      @input="emit('update:modelValue', $event.target.value)"
      @blur="emit('blur')"
    />
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

input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
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
