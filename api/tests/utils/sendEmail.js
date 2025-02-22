const sendEmail = require("../../src/utils/sendEmail");

// Mock SendGrid
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn()
}));

jest.mock("../../src/utils/sendEmail", () =>
  jest.fn().mockResolvedValue(),
);

module.exports = sendEmail;
