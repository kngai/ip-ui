import axios from 'axios';

const oaClient = axios.create({
  baseUrl: process.env.VUE_APP_OGC_API,
  timeout: 9000,
  headers: {
    'content-Type': 'application/json'
  },
  params: {
    f: 'json'
  }
});

export default oaClient;
