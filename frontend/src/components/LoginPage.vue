<!-- frontend/src/components/LoginPage.vue -->
<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        if (!response.ok) {
          throw new Error('Invalid username or password');
        }
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store token
        this.$emit('authenticated', true);
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}
.error {
  color: red;
}
</style>
