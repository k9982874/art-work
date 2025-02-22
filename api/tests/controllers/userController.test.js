require("../utils/asyncErrorHandler");

const sendEmail = require("../utils/sendEmail");

const User = require("../../src/models/userModel");
const cloudinary = require("cloudinary");
const { 
  registerUser, 
  loginUser, 
  forgotPassword,
  resetPassword,
  updateProfile 
} = require("../../src/controllers/userController");

// Mock dependencies
jest.mock("../../src/models/userModel");
jest.mock("cloudinary");

describe("User Controller", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: "mockUserId" },
      params: {},
      get: jest.fn()
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe("registerUser", () => {
    beforeEach(() => {
      mockReq.body = {
        name: "Test User",
        email: "test@test.com",
        gender: "male",
        password: "password123",
        avatar: "base64image"
      };
      
      cloudinary.v2.uploader.upload.mockResolvedValue({
        public_id: "avatar_id",
        secure_url: "https://example.com/avatar.jpg"
      });
    });

    it("should register a new user successfully", async () => {
      const mockUser = {
        name: mockReq.body.name,
        email: mockReq.body.email
      };
      
      User.create.mockResolvedValue(mockUser);

      await registerUser(mockReq, mockRes, mockNext);

      expect(cloudinary.v2.uploader.upload).toHaveBeenCalledWith(
        mockReq.body.avatar,
        expect.any(Object)
      );
      expect(User.create).toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("should return error if email or password is missing", async () => {
      mockReq.body = {};
      
      await loginUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Please Enter Email And Password"
        })
      );
    });

    it("should login user successfully", async () => {
      mockReq.body = {
        email: "test@test.com",
        password: "password123"
      };

      const mockUser = {
        email: mockReq.body.email,
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await loginUser(mockReq, mockRes, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockReq.body.email });
    });
  });

  describe("forgotPassword", () => {
    it("should send reset password email successfully", async () => {
      mockReq.body = { email: "test@test.com" };
      mockReq.get.mockReturnValue("example.com");

      const mockUser = {
        email: mockReq.body.email,
        getResetPasswordToken: jest.fn().mockResolvedValue("resetToken"),
        save: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);

      await forgotPassword(mockReq, mockRes, mockNext);

      expect(sendEmail).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("resetPassword", () => {
    it("should reset password successfully", async () => {
      mockReq.params.token = "validtoken";
      mockReq.body.password = "newpassword123";

      const mockUser = {
        password: "oldpassword",
        save: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);

      await resetPassword(mockReq, mockRes, mockNext);

      expect(mockUser.password).toBe(mockReq.body.password);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe("updateProfile", () => {
    it("should update user profile with new avatar", async () => {
      mockReq.body = {
        name: "Updated Name",
        email: "updated@test.com",
        avatar: "newbase64image"
      };

      const mockUser = {
        avatar: {
          public_id: "old_avatar_id"
        }
      };

      User.findById.mockResolvedValue(mockUser);
      cloudinary.v2.uploader.destroy.mockResolvedValue({});
      cloudinary.v2.uploader.upload.mockResolvedValue({
        public_id: "new_avatar_id",
        secure_url: "https://example.com/new-avatar.jpg"
      });

      await updateProfile(mockReq, mockRes, mockNext);

      expect(cloudinary.v2.uploader.destroy).toHaveBeenCalledWith("old_avatar_id");
      expect(cloudinary.v2.uploader.upload).toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
});