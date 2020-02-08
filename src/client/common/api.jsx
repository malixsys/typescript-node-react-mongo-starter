import axios from 'axios';

export const getApi = token => {
  const api = axios.create({
    headers: { Authorization: `${token}` }
  });
  return {
    getUser: () => api.get('/app/user').then(({ data }) => data)
  };
};
