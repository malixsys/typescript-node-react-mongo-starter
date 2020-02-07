import axios from 'axios';

export const getApi = token => {
  const api = axios.create({
    headers: { Authorization: `${token}` }
  });
  return {
    getCart: () => api.get('/api/cart').then(({ data }) => data)
  };
};
