import { createRouter, createWebHistory } from 'vue-router';
import CartView from '../views/CartView.vue';

const routes = [
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;