import oaClient from './oaClient';

const END_POINT_PROCESSES = '/processes';

const getProcesses = (params) => oaClient.get(END_POINT_PROCESSES, {params: params})
const getProcessResults = (processId, jsonRequest) => oaClient.post(END_POINT_PROCESSES + '/' + processId + '/jobs', jsonRequest)

export {
  getProcesses,
  getProcessResults
}
