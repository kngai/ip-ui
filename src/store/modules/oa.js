// import the api endpoints
import { getCollection, getAllCollections, getConformance } from "@/api/oa.api";

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
  collectionById: (state) => (id) => {
    return state.collection[id]
  },
  conformance: (state) => {
    return state.conformance
  },
  collectionIds: (state) => {
    if (Object.prototype.hasOwnProperty.call(state.collections, 'collections')) {
      return state.allCollections.collections.map(collection => collection.id)
    } else {
      return []
    }
  },
  conformsTo: (state) => {
    return state.conformance.conformsTo
  }
}

// mutations
const mutations = {
  setCollection(state, { collectionId, json }) {
    state.collection[collectionId] = json
  },
  setAllCollections(state, { json }) {
    state.collections = json
  },
  setConformance(state, { json }) {
    state.conformance = json
  }
}

// actions
const actions = {
  async fetchCollection({ commit }, { collectionId }) {
    try {
      const response = await getCollection(collectionId)
      commit('setCollection', {
        collectionId: collectionId,
        json: response.data
      })
    } catch (error) {
      console.error(error)
    }
  },
  async fetchAllCollections({ commit }) {
    try {
      const response = await getAllCollections()
      commit('setAllCollections', {
        json: response.data
      })
    } catch (error) {
      console.error(error)
    }
  },
  async fetchConformance({ commit }) {
    try {
      const response = await getConformance()
      commit('setConformance', {
        json: response.data
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
