<script setup lang="ts">
import { ref } from 'vue'
import ButtonComponent from './components/ButtonComponent.vue'

const test = 1
const disabled = ref(false)
const rawHtml = '<span style="color: red">This is red</span>'

function setDisabled() {
  console.log('clicked')
  disabled.value = !disabled.value
}

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar'],
})
</script>

<template>
  <h1>Trainer app {{ test }}</h1>
  <p>Using text interpolation: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
  <button :disabled>This is a disabled button</button>
  <button @click="setDisabled">Disable the button</button>

  <br />
  <br />
  <button></button>
  <button @click="obj.nested.count++">Update obj</button>
  <div>
    <p>{{ obj.arr }}</p>
    <p>{{ obj.nested }}</p>
  </div>

  <div>
    <ButtonComponent />
  </div>
</template>
