/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type can be 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.assign('/me'); // redirect to account page, not home
      }, 1500);
    }
  } catch (err) {
    console.error('Update error:', err);
    const msg =
      err.response?.data?.message || 'Something went wrong. Please try again.';
    showAlert('error', msg);
  }
};
