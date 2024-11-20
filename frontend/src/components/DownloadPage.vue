// THIS IS A SAMPLE DOWNLOAD PAGE

<!-- frontend/src/components/DownloadPage.vue -->
<template>
  <div class="download-page">
    <h1>Download Sensor Data</h1>
    <div>
      <label>Time Range:</label>
      <input type="date" v-model="startDate" /> - <input type="date" v-model="endDate" />
    </div>
    <div>
      <label>Fields:</label>
      <select v-model="selectedField">
        <option value="temperature">Temperature</option>
        <option value="humidity">Humidity</option>
        <option value="pressure">Pressure</option>
      </select>
    </div>
    <button @click="downloadData">Download</button>
  </div>
</template>

<script>
export default {
  name: 'DownloadPage',
  data() {
    return {
      startDate: '',
      endDate: '',
      selectedField: 'temperature',
    };
  },
  methods: {
    downloadData() {
      // Logic of downloading report
      alert(`Downloading data from ${this.startDate} to ${this.endDate} for field ${this.selectedField}`);
    },
  },
};
</script>

<style scoped>
.download-page {
  padding: 20px;
}
</style>


