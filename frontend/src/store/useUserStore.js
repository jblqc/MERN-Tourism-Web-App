import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import {
  signup,
  login as apiLogin,
  logout as apiLogout,
  forgotPassword,
  resetPassword,
  updateMyPassword as apiUpdatePassword,
  updateMe as apiUpdateMe,
  deleteMe,
  getMe,
  getUsers,
} from "../api/userApi";

import {
  googleLogin as googleLoginApi,
  sendEmailCode,
  verifyEmailCode,
  sendSmsOtp as apiSendSms,
  verifySmsOtp as apiVerifySms,
  sendPhoneVerificationOtp,
  verifyPhoneVerificationOtp,
  checkPhoneUnique,
} from "../api/authApi";

export const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        users: [],
        isLoggedIn: false,
        loading: false,
        error: null,

        ready: false, // prevents UI flash on reload

        /* ------------------------------------------------
         * INIT — runs automatically on app load
         * ------------------------------------------------ */
        init: async () => {
          const { ready } = get();
          if (ready) return;

          const token = get().token;

          if (!token) {
            set({ ready: true, isLoggedIn: false });
            return;
          }

          try {
            const me = await getMe();
            set({ user: me, isLoggedIn: true });
          } catch {
            set({ user: null, token: null, isLoggedIn: false });
          } finally {
            set({ ready: true });
          }
        },

        /* ------------------------------------------------
         * SIGNUP
         * ------------------------------------------------ */
        signup: async (data) => {
          set({ loading: true, error: null });
          try {
            const res = await signup(data);

            set({
              user: res.user,
              token: res.token,
              isLoggedIn: true,
              loading: false,
            });

            return res;
          } catch (err) {
            set({
              loading: false,
              error: err.response?.data?.message || "Signup failed",
            });
            throw err;
          }
        },

        /* ------------------------------------------------
         * LOGIN
         * ------------------------------------------------ */
        isLoggedInUser: () => {
          const token = get().token;
          const logged = Boolean(token);

          set({ isLoggedIn: logged });

          return logged;
        },

        login: async (email, password) => {
          set({ loading: true, error: null });

          try {
            const res = await apiLogin(email, password);

            // Save the token
            set({ token: res.token });

            // Fetch logged-in user's profile
            const me = await getMe();

            set({
              user: me,
              loading: false,
              isLoggedIn: true,
            });

            return { user: me, token: res.token };
          } catch (err) {
            set({
              loading: false,
              error:
                err.response?.data?.message || "Incorrect email or password",
            });
            throw err;
          }
        },

        /* ------------------------------------------------
         * GOOGLE LOGIN
         * ------------------------------------------------ */
       googleLogin: async (credential) => {
  set({ loading: true, error: null });

  try {
    const res = await googleLoginApi(credential);

    set({
      token: res.token,
      isLoggedIn: true,
    });

    const me = await getMe();

    set({
      user: me,
      loading: false,
    });

    return res;
  } catch (err) {
    set({
      loading: false,
      error: err.response?.data?.message || "Google login failed",
    });
    throw err;
  }
},


        /* ------------------------------------------------
         * EMAIL CODE LOGIN
         * ------------------------------------------------ */
        sendEmailCode: async (email) => {
          return await sendEmailCode(email);
        },

       verifyEmailCode: async (email, code) => {
  set({ loading: true, error: null });

  try {
    const data = await verifyEmailCode(email, code);

    // Save token
    set({
      token: data.token,
      isLoggedIn: true,
    });

    // Fetch full user profile
    const me = await getMe();

    set({
      user: me,
      loading: false,
      ready: true,
    });

    return me;
  } catch (err) {
    set({
      loading: false,
      error: err.response?.data?.message || "Email verification failed",
    });
    throw err;
  }
},


        /* ------------------------------------------------
         * SMS OTP LOGIN
         * ------------------------------------------------ */
        sendSmsOtp: async (phone) => {
          return await apiSendSms(phone);
        },

        verifySmsOtp: async (phone, code) => {
          const res = await apiVerifySms(phone, code);

          // Save token returned from backend
set({
      token: res.token,
      isLoggedIn: true,
    });

          // Fetch full profile (important!)
          const me = await getMe();

             set({
      user: me,
      loading: false,
      ready: true,
    });


          return me;
        },
        /* ------------------------------------------------
         * PHONE VERIFICATION (account settings)
         * ------------------------------------------------ */
        sendPhoneVerificationOtp,
        verifyPhoneVerificationOtp,
        checkPhoneUnique,

        /* ------------------------------------------------
         * LOGOUT
         * ------------------------------------------------ */
        logout: async () => {
          try {
            await apiLogout();
          } finally {
            set({ user: null, token: null, isLoggedIn: false });
          }
        },

        /* ------------------------------------------------
         * FORGOT PASSWORD
         * ------------------------------------------------ */
        forgotPassword: async (email) => {
          try {
            return await forgotPassword(email);
          } catch (err) {
            throw err.response?.data?.message || "Error sending reset email";
          }
        },

        /* ------------------------------------------------
         * RESET PASSWORD
         * ------------------------------------------------ */
        resetPassword: async (token, body) => {
          try {
            const res = await resetPassword(token, body);

            set({
              user: res.user,
              token: res.token,
            });

            return res;
          } catch (err) {
            throw err.response?.data?.message || "Reset password failed";
          }
        },

        /* ------------------------------------------------
         * UPDATE PROFILE
         * ------------------------------------------------ */
        updateProfile: async (formData) => {
          try {
            await apiUpdateMe(formData);

            // re-fetch full user
            const me = await getMe();
            set({ user: me });

            return me;
          } catch (err) {
            throw err.response?.data?.message || "Failed updating profile";
          }
        },

        /* ------------------------------------------------
         * UPDATE PASSWORD
         * ------------------------------------------------ */
        updateMyPassword: async (body) => {
          try {
            const res = await apiUpdatePassword(body);

            // Save new token from backend
            set({ token: res.token });

            // Fetch fresh user
            const me = await getMe();
            set({ user: me });

            return res;
          } catch (err) {
            throw err.response?.data?.message || "Password update failed";
          }
        },

        /* ------------------------------------------------
         * DELETE ACCOUNT
         * ------------------------------------------------ */
        deleteAccount: async () => {
          try {
            await deleteMe();
            set({ user: null, token: null });
          } catch (err) {
            throw err.response?.data?.message || "Delete account failed";
          }
        },

        /* ------------------------------------------------
         * ADMIN - GET USER LIST
         * ------------------------------------------------ */
        fetchUsers: async (role = "user") => {
          try {
            const users = await getUsers(role);
            set({ users });
          } catch (err) {
            throw err.response?.data?.message || "Failed to load users";
          }
        },
      }),
      {
        name: "user-storage",
        getStorage: () => localStorage,
      }
    ),
    { name: "UserStore" }
  )
);
