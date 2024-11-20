import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from './components/LoginPage.vue';
import HomePage from './components/HomePage.vue';
import DownloadPage from './components/DownloadPage.vue';
import SensorsMap from './components/SensorsMap.vue';

const routes = [
  { path: '/login', component: LoginPage },
  {
    path: '/',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/download',
    component: DownloadPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/sensors-map',
    component: SensorsMap,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');  // Check if there's JWT token
  if (to.meta.requiresAuth && !token) {
    next('/login'); // Not authenticated, jump to login page
  } else {
    next(); // Allowed to visit the site after authentication
  }
});

const app = createApp(App);
app.use(router);
app.mount('#app');
