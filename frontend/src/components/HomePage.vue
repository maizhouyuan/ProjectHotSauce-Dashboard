// THIS IS A SAMPLE HOMEPAGE

<!-- frontend/src/components/HomePage.vue -->
<template>
  <div class="home-page">
    <h1>Sensor Data</h1>
    <ul>
      <li v-for="(data, index) in sensorData" :key="index">
        {{ data }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      sensorData: [23.5, 21.7, 22.3, 20.1], // Simulate sensor data
    };
  },
};
</script>

<style scoped>
.home-page {
  padding: 20px;
}
</style>

