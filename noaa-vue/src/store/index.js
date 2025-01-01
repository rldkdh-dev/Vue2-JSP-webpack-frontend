import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

import global from './modules/global';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: { 
    global,
  },

  plugins: [
    createPersistedState({
      paths: ["global"]
    })
  ]
});