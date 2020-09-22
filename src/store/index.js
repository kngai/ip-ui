import Vue from 'vue'
import Vuex from 'vuex'

import oa from './modules/oa'
import oaGeomet from './modules/oaGeomet'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  modules: {
    oa,
    oaGeomet
  }
})
