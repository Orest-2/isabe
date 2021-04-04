import Vue from 'vue'
import Vuex from 'vuex'

import { general } from './modules/general'
import { calculator } from './modules/calculator'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    general,
    calculator,
  },
})
