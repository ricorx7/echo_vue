import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import EchoWampMat from '@/components/VueWampMat';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/',
      name: 'EchoWampMat',
      component: EchoWampMat,
    },
  ],
});
