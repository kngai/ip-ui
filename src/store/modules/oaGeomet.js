// import the api endpoints
import { getCollection, getAllCollections, getConformance, getCollectionItems } from "@/api/oaGeomet.api";

// initial state
const state = () => ({
  collection: {},
  collectionItems: {},
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
  collectionItemsById: (state) => (id) => {
    return state.collectionItems[id]
  },
  conformance: (state) => {
    return state.conformance
  },
  collectionIds: (state) => {
    if (Object.prototype.hasOwnProperty.call(state.collections, 'collections')) {
      return state.collections.collections.map(collection => collection.id)
    } else {
      return []
    }
  },
  conformsTo: (state) => {
    if (Object.prototype.hasOwnProperty.call(state.conformance, 'conformsTo')) {
      return state.conformance.conformsTo
    } else {
      return []
    }
  }
}

// mutations
const mutations = {
  setCollection(state, { collectionId, json }) {
    state.collection[collectionId] = json
  },
  setCollectionItems(state, { collectionId, json }) {
    state.collectionItems[collectionId] = json
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
  async fetchCollectionItems({ commit }, { collectionId }) {
    try {
      const response = await getCollectionItems(collectionId)
      // cleanup hack; OL geometry fix
      response.data.features.forEach(feature => {
        delete feature.properties.geometry
      })
      commit('setCollectionItems', {
        collectionId: collectionId,
        json: response.data
      })
    } catch (error) {
      console.error(error)
      commit('setCollectionItems', {
        collectionId: collectionId,
        json: {
          features: []
        }
      })
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
