import oaClient from './oaGeometClient';

const END_POINT_COLLECTION = '/collections';
const END_POINT_CONFORMANCE = '/conformance';

const getAllCollections = () => oaClient.get(END_POINT_COLLECTION)
const getCollection = (collectionId) => oaClient.get(END_POINT_COLLECTION + '/' + collectionId);
const getCollectionItems = (collectionId) => oaClient.get(END_POINT_COLLECTION + '/' + collectionId + '/items');
const getConformance = () => oaClient.get(END_POINT_CONFORMANCE)

export {
  getAllCollections,
  getCollection,
  getConformance,
  getCollectionItems
}
