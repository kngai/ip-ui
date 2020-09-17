import Vue from 'vue'
import Vuex from 'vuex'

import oa from './modules/oa'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  modules: {
    oa
  }
})
