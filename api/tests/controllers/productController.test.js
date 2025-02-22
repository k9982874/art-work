require("../utils/asyncErrorHandler");

const Product = require("../../src/models/productModel");
const ErrorHandler = require("../../src/utils/errorHandler");
const SearchFeatures = require("../../src/utils/searchFeatures");
const cloudinary = require("cloudinary");
const {
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require("../../src/controllers/productController");

// Mock依赖
jest.mock("../../src/models/productModel");
jest.mock("../../src/utils/searchFeatures");
jest.mock("cloudinary");

describe("Product Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    SearchFeatures.mockImplementation(() => ({
      search: jest.fn().mockReturnThis(),
      filter: jest.fn().mockReturnThis(),
      pagination: jest.fn().mockReturnThis(),
      query: {
        clone: jest.fn().mockResolvedValue([])
      }
    }));

    req = {
      query: {},
      params: {},
      body: {},
      user: { id: "testUserId", _id: "testUserId", name: "Test User" }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should successfully get all products", async () => {
      const mockProducts = [{ name: "Product 1" }, { name: "Product 2" }];
      Product.countDocuments.mockResolvedValue(2);
      Product.find.mockReturnValue({
        clone: jest.fn().mockResolvedValue(mockProducts)
      });

      SearchFeatures.mockImplementation(() => ({
        search: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        pagination: jest.fn().mockReturnThis(),
        query: {
          clone: jest.fn().mockResolvedValue(mockProducts),
          length: 0,
        }
      }));

      await getAllProducts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        products: mockProducts,
        productsCount: 2,
        resultPerPage: 12,
        filteredProductsCount: 0
      });
    });
  });

  describe("getProductDetails", () => {
    it("should return product details", async () => {
      const mockProduct = { name: "Test Product" };
      req.params.id = "testId";
      Product.findById.mockResolvedValue(mockProduct);

      await getProductDetails(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        product: mockProduct
      });
    });

    it("should return error when product does not exist", async () => {
      req.params.id = "nonExistentId";
      Product.findById.mockResolvedValue(null);

      await getProductDetails(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.any(ErrorHandler)
      );
    });
  });

  describe("createProduct", () => {
    it("should successfully create product", async () => {
      const mockProduct = { name: "New Product" };
      req.body = {
        images: ["image1", "image2"],
        logo: "brandLogo",
        brandname: "TestBrand",
        specifications: ['{"key":"value"}'],
      };

      cloudinary.v2.uploader.upload.mockResolvedValue({
        public_id: "test_id",
        secure_url: "test_url"
      });

      Product.create.mockResolvedValue(mockProduct);

      await createProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        product: mockProduct
      });
    });
  });

  describe("createProductReview", () => {
    it("should successfully create product review", async () => {
      const mockProduct = {
        reviews: [],
        save: jest.fn().mockResolvedValue(true)
      };
      req.body = {
        rating: 5,
        comment: "Great product",
        productId: "testProductId"
      };

      Product.findById.mockResolvedValue(mockProduct);

      await createProductReview(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true
      });
    });

    it("should return error when product does not exist", async () => {
      req.body = {
        rating: 5,
        comment: "Great product",
        productId: "nonExistentId"
      };

      Product.findById.mockResolvedValue(null);

      await createProductReview(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.any(ErrorHandler)
      );
    });
  });
});