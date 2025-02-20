import { Response } from "miragejs";

/**
 * All the routes related to Product are present here.
 * These are Publicly accessible routes.
 * */

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/products
 * */

export const getAllProductsHandler = function (_, request) {
  const { page = 1, limit = 10 } = request.queryParams;

  // Convert string parameters to numbers
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  // Calculate start and end indices for pagination
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  // Get total count and paginated products
  const allProducts = this.db.products;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  return new Response(200, {}, { 
    products: paginatedProducts,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(allProducts.length / limitNum),
      totalProducts: allProducts.length,
      productsPerPage: limitNum
    }
  });
  // return new Response(200, {}, { products: this.db.products });
};

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/user/products/:productId
 * */

export const getProductHandler = function (schema, request) {
  const productId = request.params.productId;
  try {
    const product = schema.products.findBy({ _id: productId });
    return new Response(200, {}, { product });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        error,
      }
    );
  }
};
