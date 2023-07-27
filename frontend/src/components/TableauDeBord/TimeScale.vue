<script setup>
import {ref} from "vue";

const props = defineProps({
  periods: {
    type: Array,
    default: () => []
  }
})

defineEmits(["updatePeriod"]);

const periodSelected = ref(props.periods[0].value);
</script>

<template>
  <select class="card__footer__period" v-model="periodSelected" @change="$emit('updatePeriod', periodSelected)">
    <option
        v-for="period in props.periods"
        :key="period"
        :value="period.value"
    >
      {{ period.label }}
    </option>
  </select>
</template>

<style scoped lang="scss">
.card__footer__period {
  font-size: 1rem; // 16px
  cursor: pointer;

  &:focus {
    outline: none;
  }
}
</style>