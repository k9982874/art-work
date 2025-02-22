require("../utils/asyncErrorHandler");

const sendEmail = require("../utils/sendEmail");

const Order = require("../../src/models/orderModel");
const Product = require("../../src/models/productModel");
const {
  newOrder,
  getSingleOrderDetails,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../../src/controllers/orderController");

// Mock dependencies
jest.mock("../../src/models/orderModel");
jest.mock("../../src/models/productModel");

describe('Order Controller Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: {
        _id: 'user123',
        email: 'test@test.com',
        name: 'Test User'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('newOrder', () => {
    it('should create a new order successfully', async () => {
      const orderData = {
        shippingInfo: {},
        orderItems: [],
        paymentInfo: 'payment123',
        totalPrice: 1000
      };
      mockReq.body = orderData;

      Order.findOne.mockResolvedValue(null);
      Order.create.mockResolvedValue({ _id: 'order123', ...orderData });
      sendEmail.mockResolvedValue();

      await newOrder(mockReq, mockRes, mockNext);

      expect(Order.create).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        order: expect.any(Object)
      });
    });
  });

  describe('getSingleOrderDetails', () => {
    it('should return single order details', async () => {
      mockReq.params.id = 'order123';
      const mockOrder = { _id: 'order123' };
      
      Order.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrder)
      });

      await getSingleOrderDetails(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        order: mockOrder
      });
    });
  });

  describe('updateOrder', () => {
    it('should update order status to shipped', async () => {
      mockReq.params.id = 'order123';
      mockReq.body.status = 'Shipped';
      
      const mockOrder = {
        _id: 'order123',
        orderStatus: 'Processing',
        orderItems: [{ product: 'prod123', quantity: 2 }],
        save: jest.fn()
      };

      Order.findById.mockResolvedValue(mockOrder);
      Product.findById.mockResolvedValue({
        stock: 10,
        save: jest.fn()
      });

      await updateOrder(mockReq, mockRes, mockNext);

      expect(mockOrder.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true
      });
    });
  });

  describe('deleteOrder', () => {
    it('should delete the order', async () => {
      mockReq.params.id = 'order123';
      
      const mockOrder = {
        _id: 'order123',
        remove: jest.fn()
      };

      Order.findById.mockResolvedValue(mockOrder);

      await deleteOrder(mockReq, mockRes, mockNext);

      expect(mockOrder.remove).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true
      });
    });
  });
});