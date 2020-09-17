import oaClient from './oaClient';

const END_POINT_COLLECTION = '/collections';
const END_POINT_CONFORMANCE = '/conformance';

const getAllCollections = () => oaClient.get(END_POINT_COLLECTION)
const getCollection = (collection) => oaClient.get(END_POINT_COLLECTION + '/' + collection);
const getConformance = () => oaClient.get(END_POINT_CONFORMANCE)

export {
  getAllCollections,
  getCollection,
  getConformance
}
