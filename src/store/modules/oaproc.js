// import the api endpoints
import { getProcesses, getProcessResults } from "@/api/oa.processes.api";

// initial state
const state = () => ({
  rasterExtract: null,
  processes: []
})

// getters
const getters = {

}

// mutations
const mutations = {
  setProcesses(state, { json }) {
    state.processes = json.processes
  },
  setRasterExtract(state, { json }) {
    state.rasterExtract = json
  }
}

// actions
const actions = {
  async fetchProcessResults({ commit }, { processId, jsonRequest }) {
    try {
      const response = await getProcessResults(processId, jsonRequest)
      commit('setRasterExtract', {
        json: response.data
      })
    } catch (error) {
      console.error(error)
    }
  },
  async fetchProcesses({ commit }) {
    try {
      const response = await getProcesses()
      commit('setProcesses', {
        json: response.data
      })
    } catch (error) {
      console.error(error)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
