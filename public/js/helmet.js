const helmet = require('helmet');

exports.helmet = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://api.mapbox.com', 'https://cdnjs.cloudflare.com'],
    styleSrc: [
      "'self'",
      'https://api.mapbox.com',
      'https://fonts.googleapis.com',
      "'unsafe-inline'",
    ],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https://api.mapbox.com', 'https://events.mapbox.com'],
    connectSrc: [
      "'self'",
      'https://api.mapbox.com',
      'https://events.mapbox.com',
      'http://localhost:3000', // 👈 allow your API
      'http://127.0.0.1:3000', // 👈 add both if needed
      'ws://localhost:*', // 👈 allow dev WebSockets
    ],

    workerSrc: ["'self'", 'blob:'],
  },
});
