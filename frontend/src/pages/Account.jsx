// src/pages/Account.jsx
import { useState, useEffect } from 'react';
import { updateUser, updatePassword } from '../api/userApi';
import Alert from '../components/Alert';
import axiosClient from '../api/axiosClient';

export default function Account() {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);

  // fetch current user
  useEffect(() => {
    axiosClient
      .get('/users/me')
      .then((res) => setUser(res.data.data.data || res.data.data.user))
      .catch(console.error);
  }, []);

  const handleUserData = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      await updateUser(form);
      setAlert({ type: 'success', message: 'Settings updated!' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Could not update settings' });
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    try {
      await updatePassword(payload);
      setAlert({ type: 'success', message: 'Password updated!' });
      e.target.reset();
    } catch (err) {
      setAlert({ type: 'error', message: 'Could not update password' });
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className="side-nav--active">
              <a href="#">Settings</a>
            </li>
            <li>
              <a href="/my-bookings">My bookings</a>
            </li>
            <li>
              <a href="#">My reviews</a>
            </li>
            <li>
              <a href="#">Billing</a>
            </li>
          </ul>
          {user.role === 'admin' && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <li>
                  <a href="#">Manage tours</a>
                </li>
                <li>
                  <a href="#">Manage users</a>
                </li>
                <li>
                  <a href="#">Manage reviews</a>
                </li>
                <li>
                  <a href="#">Manage billing</a>
                </li>
              </ul>
            </div>
          )}
        </nav>

        <div className="user-view__content">
          {/* account settings */}
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            <form className="form form-user-data" onSubmit={handleUserData}>
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="form__input"
                  type="text"
                  defaultValue={user.name}
                  required
                />
              </div>
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  className="form__input"
                  type="email"
                  defaultValue={user.email}
                  required
                />
              </div>
              <div className="form__group form__photo-upload">
                <img
                  src={`/img/users/${user.photo}`}
                  alt={user.name}
                  className="form__user-photo"
                />
                <input
                  className="form__upload"
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                />
                <label htmlFor="photo">Choose new photo</label>
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green" type="submit">
                  Save settings
                </button>
              </div>
            </form>
          </div>

          <div className="line">&nbsp;</div>

          {/* password change */}
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form className="form form-user-password" onSubmit={handlePassword}>
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Current password
                </label>
                <input
                  id="password-current"
                  name="passwordCurrent"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  name="passwordConfirm"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green" type="submit">
                  Save password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </main>
  );
}
