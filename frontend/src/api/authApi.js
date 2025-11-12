import axiosClient from './axiosClient';

export const login = async (email, password) => {
  const res = await axiosClient.post('/users/login', { email, password });
  return res.data;
};

export const logout = async () => {
  await axiosClient.get('/users/logout');
};
