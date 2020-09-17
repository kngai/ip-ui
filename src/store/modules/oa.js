// import the api endpoints
import { getCollection, getAllCollections } from "@/api/oa.api";

// initial state
const state = () => ({
  collection: {},
  collections: {},
  conformance: {}
})

// getters
const getters = {
  loadedCollections: (state) => {
    return state.collection
  },
  allCollections: (state) => {
    return state.collections
  },
  conformance: (state) => {
    return state.conformance
  }
}

// mutations
const mutations = {
  setCollection(state, { collectionId, json }) {
    state.collection[collectionId] = json
  },
  setAllCollections(state, { json }) {
    state.collections = json
  }
}

// actions
const actions = {
  async fetchCollection({ commit }, { collectionId }) {
    try {
      const response = await getCollection(collectionId)
      commit('setCollection', {
        collectionId: collectionId,
        json: response
      })
    } catch (error) {
      console.error(error)
    }
  },
  async fetchAllCollections({ commit }) {
    try {
      const response = await getAllCollections()
      commit('setAllCollections', {
        json: response
      })
    } catch (error) {
      console.error(error)
    }
  }
  // getJsonld({commit, state}) {
  //   if (state.jsonldLoaded) {
  //     return false // no need to reload if exists
  //   }
  //   axios.get(PYGEOAPI_HOST + '?f=jsonld')
  //     .then((res) => {
  //       commit('setJsonld', { jsonld: res.data })
  //       commit('setLoadedJsonld', true)
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //       commit('setJsonld', { jsonld: {} })
  //       commit('setLoadedJsonld', false)
  //     })
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
