import axiosClient from "./axiosClient";

export const login = async (email, password) => {
  const res = await axiosClient.post("/users/login", { email, password });
  return res.data;
};

export const logout = async () => {
  await axiosClient.get("/users/logout");
};
export const googleLogin = async (credential) => {
  const res = await axiosClient.post(
    "/users/google-login",
    { credential },
    { withCredentials: true }
  );

  return res.data;
};
export const sendEmailCode = async (email) => {
  const res = await axiosClient.post("/users/send-email-code", { email });
  return res.data;
};

export const verifyEmailCode = async (email, code) => {
  const res = await axiosClient.post("/users/verify-email-code", {
    email,
    code,
  });
  return res.data;
};

export const sendSmsOtp = (phone) =>
  axiosClient.post("/users/send-otp", { phone });

export const verifySmsOtp = (phone, code) =>
  axiosClient.post("/users/verify-otp", { phone, code });
