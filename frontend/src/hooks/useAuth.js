// src/hooks/useAuth.js
import { useUserStore } from "../store/useUserStore";

export const useAuth = () => {
  const {
    user,
    token,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    deleteAccount,
  } = useUserStore();

  return {
    user,
    token,
    isLoggedIn: !!token,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    deleteAccount,
  };
};
