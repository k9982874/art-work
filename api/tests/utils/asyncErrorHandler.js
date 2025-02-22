const asyncErrorHandler = require("../../src/middlewares/helpers/asyncErrorHandler");

// Mock asyncErrorHandler
jest.mock('../../src/middlewares/helpers/asyncErrorHandler', () =>
  (e) => (o, r, s) =>
    Promise.resolve(e(o, r, s)).catch(s)
);

module.exports = asyncErrorHandler;
