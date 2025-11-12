import axiosClient from './axiosClient';

export const updateUser = async (data) => {
  const res = await axiosClient.patch('/users/updateMe', data);
  return res.data;
};

export const updatePassword = async (data) => {
  const res = await axiosClient.patch('/users/updateMyPassword', data);
  return res.data;
};
