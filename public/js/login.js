/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login', // 👈 relative, no host
      data: {
        email,
        password,
      },
      withCredentials: true, // 👈 critical line
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.error('Login error:', err);
    const msg =
      err.response?.data?.message || 'Something went wrong. Please try again.';
    showAlert('error', msg);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
      withCredentials: true,
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.error(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
