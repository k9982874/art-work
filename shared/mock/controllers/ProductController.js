import { Response } from "miragejs";

/**
 * All the routes related to Product are present here.
 * These are Publicly accessible routes.
 * */

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/products
 * */

import {
  getCategoryWiseProducts,
  getRatedProducts,
  getPricedProducts,
  getSortedProducts
} from "../../helpers/filter-functions/index.js";

import { getSearchedProducts } from "../../helpers/searchedProducts.js";

export const getAllProductsHandler = function (_, request) {
  const {
    page = 1,
    limit = 10,
    search = '',
    rating = '',
    sort = '',
    price,
    categories,
  } = request.queryParams;

  // Convert string parameters to numbers
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  // Calculate start and end indices for pagination
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  // Get total count and paginated products
  const allProducts = this.db.products;

  let filteredProducts = allProducts;
  if (search) {
    filteredProducts = getSearchedProducts(filteredProducts, search);
  }

  if (rating) {
    filteredProducts = getRatedProducts(filteredProducts, rating);
  }

  if (categories) {
    filteredProducts = getCategoryWiseProducts(filteredProducts, categories.split('|'));
  }

  if (price) {
    filteredProducts = getPricedProducts(filteredProducts, price.split('|'));
  }

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return new Response(200, {}, {
    products: paginatedProducts,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(filteredProducts.length / limitNum),
      totalProducts: filteredProducts.length,
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
