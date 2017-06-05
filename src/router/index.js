import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import EchoWamp from '@/components/EchoWamp';
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
      name: 'EchoWamp',
      component: EchoWamp,
    },
    {
      path: '/mat',
      name: 'EchoWampMat',
      component: EchoWampMat,
    },
  ],
});
