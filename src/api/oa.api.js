import oaClient from './oaClient';

const END_POINT_COLLECTION = '/collections';
const END_POINT_CONFORMANCE = '/conformance';

const getAllCollections = () => oaClient.get(END_POINT_COLLECTION)
const getCollection = (collectionId) => oaClient.get(END_POINT_COLLECTION + '/' + collectionId);
const getCollectionItems = (collectionId, params) => oaClient.get(END_POINT_COLLECTION + '/' + collectionId + '/items', {params: params});
const getConformance = () => oaClient.get(END_POINT_CONFORMANCE)

export {
  getAllCollections,
  getCollection,
  getConformance,
  getCollectionItems
}
