# MERN Tourism Web App Project

Thi is a **full-stack tour booking application** designed for managing, browsing, and booking tours. It features a robust backend built with **Node.js and Express**, and a frontend for user interaction. The application supports **user authentication**, **role-based access**, **tour and review management**, and **secure payments via Stripe**.

---

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Folder Structure](#folder-structure)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [API Endpoints](#api-endpoints)
* [Frontend Overview](#frontend-overview)
* [Contributing](#contributing)
* [License](#license)

---

## Features

### Backend

* User authentication and authorization (JWT-based)
* Role-based access control (admin, user, guide)
* Tour management (CRUD operations)
* Review system for tours
* Stripe payment integration
* Data sanitization and security:

  * XSS protection
  * NoSQL injection prevention
  * Rate limiting
  * Secure HTTP headers (Helmet)
* Centralized error handling and logging

### Frontend

* User-friendly interface for browsing tours
* User authentication (login & signup)
* Tour booking flow with Stripe checkout
* User dashboard for managing:

  * Profile
  * Bookings
  * Reviews

---

## Technologies Used

### Backend

* **Node.js** – JavaScript runtime
* **Express.js** – Web framework
* **MongoDB** – NoSQL database
* **Mongoose** – MongoDB ODM
* **Stripe** – Payment processing
* **Pug** – Server-side templating
* **dotenv** – Environment variable management
* **Helmet, xss-clean, express-mongo-sanitize** – Security middleware

### Frontend

* **React**
* **Chakra UI**

---


## Installation

### Prerequisites

* Node.js **v16 or higher**
* MongoDB (local or MongoDB Atlas)
* Stripe account

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/jblqc/MERN-Tourism-Web-App.git
   ```

2. **Install dependencies**

   ```bash
   cd backend
   npm install

   cd frontend
   npm install
   ```

3. **Set up environment variables**

   * Create a `.env` file inside the `backend` folder

4. **Start the development server**

   ```bash
   npm run dev

   for both fe and be
   ```

5. **Open the application**

   ```
   http://localhost:5173
   ```

---

## Environment Variables

Create a `.env` file in the `backend` directory and add:

```
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
# =========================
# Email (Mailtrap for dev)
# =========================
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_FROM=
# =========================
# Stripe Keys
# =========================
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
# =========================
# Brevo (Sendinblue SMTP)
# =========================
BREVO_USERNAME=
BREVO_PASSWORD=

```


Create a `.env` file in the `frontend` directory and add:

```
VITE_API_URL=http://127.0.0.1:8000/api/v1
VITE_MAPBOX_TOKEN=
VITE_STRIPE_PUBLIC_KEY=

```
---

## Usage

### Backend

The backend serves both the **REST API** and **server-rendered views**.

Main routes:

* `/api/v1/tours` – Tour management
* `/api/v1/users` – User management
* `/api/v1/reviews` – Reviews
* `/api/v1/booking` – Bookings & payments
* `/api/v1/packages` - Packages

### Frontend

Users can:

* Browse available tours
* Book tours using Stripe
* Leave reviews
* Manage their profile and bookings
* Login using different security options (Google, OTP, Email Code)
---

## API Endpoints

### Authentication

* `POST /api/v1/users/signup` – Create a new user
* `POST /api/v1/users/login` – Login
* `GET /api/v1/users/logout` – Logout

### Tours

* `GET /api/v1/tours` – Get all tours
* `GET /api/v1/tours/:id` – Get a single tour
* `POST /api/v1/tours` – Create tour (admin only)
* `PATCH /api/v1/tours/:id` – Update tour (admin only)
* `DELETE /api/v1/tours/:id` – Delete tour (admin only)

### Reviews

* `GET /api/v1/reviews` – Get all reviews
* `POST /api/v1/reviews` – Create a review
* `PATCH /api/v1/reviews/:id` – Update a review
* `DELETE /api/v1/reviews/:id` – Delete a review


## License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.

---

