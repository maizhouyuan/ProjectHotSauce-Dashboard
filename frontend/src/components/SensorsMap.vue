<!-- frontend/src/components/SensorsMap.vue -->
<template>
  <div class="sensors-map">
    <h1>Sensors Map</h1>
    <div v-if="loading">Loading sensors data...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="(sensor, index) in sensors" :key="index" class="sensor-card">
        <h3>{{ sensor.name }}</h3>
        <p>Status: <span :class="{'active': sensor.status === 'active', 'inactive': sensor.status !== 'active'}">
          {{ sensor.status }}
        </span></p>
        <p>Reading: {{ sensor.reading }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SensorsMap',
  data() {
    return {
      sensors: [], // Store data from DynamoDB
      loading: true,
      error: null,
    };
  },
  async created() {
    try {
      const response = await fetch('/api/sensors'); // Fetch backend API
      if (!response.ok) {
        throw new Error('Failed to fetch sensors data');
      }
      const data = await response.json();
      this.sensors = data;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.sensors-map {
  padding: 20px;
}
.sensor-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}
.sensor-card .active {
  color: green;
}
.sensor-card .inactive {
  color: red;
}
</style>
