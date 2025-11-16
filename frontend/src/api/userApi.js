import axiosClient from "./axiosClient";

export const signup = async (data) => {
  const res = await axiosClient.post("/users/signup", data);
  return res.data;
};

export const login = async (email, password) => {
  const res = await axiosClient.post("/users/login", { email, password });
  return res.data;
};

export const logout = async () => {
  return axiosClient.get("/users/logout");
};

export const forgotPassword = async (email) => {
  const res = await axiosClient.post("/users/forgotPassword", { email });
  return res.data;
};

export const resetPassword = async (token, data) => {
  const res = await axiosClient.patch(`/users/resetPassword/${token}`, data);
  return res.data;
};

export const updatePassword = async (body) => {
  const res = await axiosClient.patch(`/users/updatePassword`, body);
  return res.data;
};

// UPDATE profile (form-data allowed)
export const updateMe = async (data) => {
  const res = await axiosClient.patch("/users/updateMe", data);
  return res.data;
};

// DELETE yourself
export const deleteMe = async () => {
  return axiosClient.delete("/users/deleteMe");
};

// GET current logged-in user
export const getMe = async () => {
  const res = await axiosClient.get("/users/me");
  return res.data.data.doc;
};

// GET users (admin)
export const getUsers = async (role) => {
  const res = await axiosClient.get(`/users?role=${role}`);
  return res.data.data.users;
};
