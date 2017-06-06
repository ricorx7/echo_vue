// Import the styles directly. (Or you could add them via script tags.)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-material/dist/vue-material.css';

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueMaterial from 'vue-material';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(BootstrapVue);
Vue.use(VueMaterial);


Vue.material.registerTheme({
  default: {
    primary: {
      color: 'blue-greys',
      hue: 700,
    },
    accent: 'light-blue',
  },
  successFailBtn: {
    primary: 'green',
    warn: 'red',
  },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
