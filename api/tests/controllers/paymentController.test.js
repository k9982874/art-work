require("../utils/asyncErrorHandler");

const { processPayment, paytmResponse, getPaymentStatus } = require('../../src/controllers/paymentController');
const Payment = require("../../src//models/paymentModel");
const paytm = require("paytmchecksum");
const https = require("https");

// Mock dependencies
jest.mock("../../src/models/paymentModel");
jest.mock("paytmchecksum");
jest.mock("https");

describe('Payment Controller Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {
        amount: 1000,
        email: 'test@example.com',
        phoneNo: '1234567890'
      },
      protocol: 'https',
      get: jest.fn().mockReturnValue('example.com')
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
    };
    mockNext = jest.fn();
    process.env.PAYTM_MID = 'test_mid';
    process.env.PAYTM_WEBSITE = 'test_website';
    process.env.PAYTM_CHANNEL_ID = 'test_channel';
    process.env.PAYTM_INDUSTRY_TYPE = 'test_industry';
    process.env.PAYTM_CUST_ID = 'test_cust';
    process.env.PAYTM_MERCHANT_KEY = 'test_merchant_key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const mockChecksum = 'mock_checksum';
      paytm.generateSignature.mockResolvedValue(mockChecksum);

      await processPayment(mockReq, mockRes, mockNext);

      expect(paytm.generateSignature).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        paytmParams: expect.objectContaining({
          MID: process.env.PAYTM_MID,
          CHECKSUMHASH: mockChecksum
        })
      });
    });

    it('should handle payment processing error', async () => {
      paytm.generateSignature.mockRejectedValue(new Error('Processing failed'));
      console.log = jest.fn();

      await processPayment(mockReq, mockRes, mockNext);

      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status when payment exists', async () => {
      const mockPayment = {
        txnId: 'test_txn',
        resultInfo: {
          resultStatus: 'SUCCESS'
        }
      };
      Payment.findOne.mockResolvedValue(mockPayment);
      mockReq.params = { id: 'test_order_id' };

      await getPaymentStatus(mockReq, mockRes, mockNext);

      expect(Payment.findOne).toHaveBeenCalledWith({ orderId: 'test_order_id' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        txn: {
          id: 'test_txn',
          status: 'SUCCESS'
        }
      });
    });

    it('should call next with error when payment not found', async () => {
      Payment.findOne.mockResolvedValue(null);
      mockReq.params = { id: 'invalid_order_id' };

      await getPaymentStatus(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Payment Details Not Found'
        })
      );
    });
  });
});