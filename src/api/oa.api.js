import oaClient from './oaClient';

const END_POINT_COLLECTION = '/collections';
const END_POINT_CONFORMANCE = '/conformance';

const getAllCollections = (params) => oaClient.get(END_POINT_COLLECTION, {params: params})
const getCollection = (collectionId, params) => oaClient.get(END_POINT_COLLECTION + '/' + collectionId, {params: params});
const getCollectionItems = (collectionId, params) => oaClient.get(END_POINT_COLLECTION + '/' + collectionId + '/items', {params: params});
const getConformance = (params) => oaClient.get(END_POINT_CONFORMANCE, {params: params})

export {
  getAllCollections,
  getCollection,
  getConformance,
  getCollectionItems
}
