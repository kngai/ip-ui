import oaClient from './oaClient';

const END_POINT_PROCESSES = '/processes';

const getProcesses = () => oaClient.get(END_POINT_PROCESSES)
const getProcessResults = (processId, jsonRequest) => oaClient.post(END_POINT_PROCESSES + '/' + processId, jsonRequest)

export {
  getProcesses,
  getProcessResults
}
