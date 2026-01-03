// src/api/packageApi.js
import axiosClient from "./axiosClient";

export const getAllPackage = async () => {
  const res = await axiosClient.get("/packages");
  return res.data.data; // backend returns { data: [ ... ] }
};

export const getPackageById = async (id) => {
  const res = await axiosClient.get(`/packages/${id}`);
  return res.data.data;
};
