import axios from 'axios';

const oaGeometClient = axios.create({
  baseURL: process.env.VUE_APP_GEOMET + process.env.VUE_APP_WFS3_PATH,
  timeout: 9000,
  headers: {
    'content-Type': 'application/json'
  },
  params: {
    f: 'json',
    limit: 10000
  }
});

export default oaGeometClient;
