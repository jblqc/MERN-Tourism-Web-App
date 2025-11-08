import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // Get checkout session from backend
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    // Redirect user to Stripe Checkout (new method)
    window.location.href = session.data.url;
  } catch (err) {
    console.error('Booking error:', err);
    showAlert('error', err.message || 'Something went wrong during checkout.');
  }
};
