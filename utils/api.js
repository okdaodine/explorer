import Axios from 'axios';
import qs from 'query-string';

const axios = Axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const Api = {
  blocks: {
    list: (blockchain, p = {}) => axios.get(`/api/${blockchain}/blocks?${qs.stringify(p)}`).then(res => res.data),
    get: (blockchain, number, p = {}) => axios.get(`/api/${blockchain}/blocks/${number}?${qs.stringify(p)}`).then(res => res.data),
  },
  transactions: {
    list: (blockchain, p = {}) => axios.get(`/api/${blockchain}/transactions?${qs.stringify(p)}`).then(res => res.data),
    get: (blockchain, hash) => axios.get(`/api/${blockchain}/transactions/${hash}`).then(res => res.data),
    listAll: (p = {}) => axios.get(`/api/transactions?${qs.stringify(p)}`).then(res => res.data),
  },
  summary: {
    get: (blockchain) => axios.get(`/api/${blockchain}/summary`).then(res => res.data),
  },
};

export default Api;