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
    googleLogin,

    // OTP actions
    sendEmailCode,
    verifyEmailCode,
    sendSmsOtp,
    verifySmsOtp,
  } = useUserStore();

  /* ----------------------------------------------------------------
     GOOGLE LOGIN BUTTON INITIALIZER
  ---------------------------------------------------------------- */
  const initGoogleLoginButton = (onSuccess) => {
    // google script not loaded yet
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: onSuccess,
    });

    const btn = document.getElementById("google-btn");
    if (!btn) return;

    // Prevent double buttons when switching login/signup
    btn.innerHTML = "";

    window.google.accounts.id.renderButton(btn, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: Math.floor(btn.offsetWidth),
    });
  };

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
    googleLogin,

    // OTP EMAIL
    sendEmailCode,
    verifyEmailCode,

    // OTP SMS
    sendSmsOtp,
    verifySmsOtp,

    // GOOGLE BTN
    initGoogleLoginButton,
  };
};
