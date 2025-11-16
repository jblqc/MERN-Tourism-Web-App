import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  signup,
  login as apiLogin,
  logout as apiLogout,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
  getMe,
  getUsers,
} from "../api/userApi";

export const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        users: [], // admin list
        loading: false,
        error: null,

        // -------------------------------------
        // INIT (loads persisted user)
        // -------------------------------------
        init: async () => {
          const persistedToken = get().token;
          if (!persistedToken) return;

          try {
            const me = await getMe();
            set({ user: me });
          } catch {
            set({ user: null, token: null });
          }
        },

        // -------------------------------------
        // SIGNUP
        // -------------------------------------
        signup: async (data) => {
          set({ loading: true, error: null });
          try {
            const res = await signup(data);
            set({
              user: res.user,
              token: res.token,
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

        // -------------------------------------
        // LOGIN
        // -------------------------------------
        login: async (email, password) => {
          set({ loading: true, error: null });
          try {
            const res = await apiLogin(email, password);
            set({
              user: res.user,
              token: res.token,
              loading: false,
            });
            return res;
          } catch (err) {
            set({
              loading: false,
              error:
                err.response?.data?.message || "Incorrect email or password",
            });
            throw err;
          }
        },

        // -------------------------------------
        // LOGOUT
        // -------------------------------------
        logout: async () => {
          try {
            await apiLogout();
          } finally {
            set({ user: null, token: null });
          }
        },

        // -------------------------------------
        // FORGOT PASSWORD
        // -------------------------------------
        forgotPassword: async (email) => {
          try {
            return await forgotPassword(email);
          } catch (err) {
            throw err.response?.data?.message || "Error sending reset email";
          }
        },

        // -------------------------------------
        // RESET PASSWORD
        // -------------------------------------
        resetPassword: async (token, data) => {
          try {
            const res = await resetPassword(token, data);
            set({
              user: res.user,
              token: res.token,
            });
            return res;
          } catch (err) {
            throw err.response?.data?.message || "Reset password failed";
          }
        },

        // -------------------------------------
        // UPDATE PROFILE (name, email, photo)
        // -------------------------------------
        updateProfile: async (formData) => {
          try {
            const res = await updateMe(formData);
            set({ user: res.data.user });
            return res.data.user;
          } catch (err) {
            throw err.response?.data?.message || "Failed updating profile";
          }
        },

        // -------------------------------------
        // UPDATE PASSWORD
        // -------------------------------------
        updatePassword: async (body) => {
          try {
            const res = await updatePassword(body);
            set({
              user: res.user,
              token: res.token,
            });
            return res;
          } catch (err) {
            throw err.response?.data?.message || "Password update failed";
          }
        },

        // -------------------------------------
        // DELETE USER (self)
        // -------------------------------------
        deleteAccount: async () => {
          try {
            await deleteMe();
            set({ user: null, token: null });
          } catch (err) {
            throw err.response?.data?.message || "Delete account failed";
          }
        },

        // -------------------------------------
        // ADMIN: GET USER LIST
        // -------------------------------------
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
