// frontend/src/components/HomePage.vue
<template>
  <div>
    <h1>Sensor Readings</h1>
    <div v-if="sensorData">
      <ul>
        <li v-for="sensor in sensorData" :key="sensor.id">
          <p>Sensor ID: {{ sensor.id }}</p>
          <p>Status: {{ sensor.status }}</p>
          <p>Reading: {{ sensor.reading }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Loading sensor data...</p>
    </div>
  </div>
</template>

<script>
import { getSensorData } from '../services';

export default {
  name: 'HomePage',
  data() {
    return {
      sensors: [],
    };
  },
  mounted() {
    this.sensors = getSensorData();
  },
};
</script>
