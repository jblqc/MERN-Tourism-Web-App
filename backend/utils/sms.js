// utils/sms.js
// Replace this later with Twilio / MessageBird / etc.

exports.sendSms = async (phone, message) => {
  // For now, just log it.
  // Later: integrate Twilio here.
  console.log(`📲 SMS to ${phone}: ${message}`);
  // Example Twilio pseudo:
  // await twilioClient.messages.create({ to: phone, from: TWILIO_FROM, body: message });
};
