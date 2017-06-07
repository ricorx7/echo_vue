import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    wampURL: 'ws://127.0.0.1:55058/ws',
  },

  actions: {

  },

  /* eslint-disable no-param-reassign */
  mutations: {
    SET_WAMP_URL(state, url) {
      state.wampURL = url;
    },
  },

  getters: {

  },
});

export default store;
