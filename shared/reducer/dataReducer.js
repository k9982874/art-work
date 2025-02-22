export const initialState = {
  allProductsFromApi: [],
  allCategories: [],
  inputSearch: "",
  filters: {
    rating: "",
    categories: [],
    price: [],
    sort: "",
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: 10,
  },
};

export const dataReducer = (state, action) => {
  switch (action.type) {
    case "GET_ALL_PRODUCTS_FROM_API":
      return {
        ...state,
        allProductsFromApi: [
        ...state.allProductsFromApi,
        ...action.payload,
        ],
        pagination: {...action.pagination},
      };

    case "GET_ALL_CATEGORIES":
      return { ...state, allCategories: action.payload };

    case "SEARCH":
      return {
        ...state,
        allProductsFromApi: [],
        inputSearch: action.payload,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          productsPerPage: 10,
        },
      };

    case "ADD_RATINGS":
      return {
        ...state,
        allProductsFromApi: [],
        filters: { ...state.filters, rating: action.payload },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          productsPerPage: 10,
        },
      };

    case "ADD_CATEGORIES": {
      const isCategoryPresent = state.filters.categories.find(
        (category) => category === action.payload
      );

      return {
        ...state,
        allProductsFromApi: [],
        filters: {
          ...state.filters,
          categories: isCategoryPresent
            ? state.filters.categories.filter(
                (category) => category !== action.payload
              )
            : [...state.filters.categories, action.payload],
        },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          productsPerPage: 10,
        },
      };
    }

    case "ADD_SORT":
      return {
        ...state,
        allProductsFromApi: [],
        filters: { ...state.filters, sort: action.payload },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          productsPerPage: 10,
        },
      };

    case "ADD_PRICE": {
      const isPricePresent = state.filters.price.find(
        (price) => price.min === action.payload.min
      );
      return {
        ...state,
        allProductsFromApi: [],
        filters: {
          ...state.filters,
          price: isPricePresent
            ? state.filters.price.filter(
                (price) => price.min !== action.payload.min
              )
            : [...state.filters.price, action.payload],
        },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          productsPerPage: 10,
        },
      };
    }

    case "ADD_CATEGORIES_FROM_HOME":
      return {
        ...state,
        allProductsFromApi: [],
        filters: { ...state.filters, categories: [action.payload] },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          productsPerPage: 10,
        },
      };

    case "RESET":
      return {
        ...state,
        allProductsFromApi: [],
        filters: { ...action.payload },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          productsPerPage: 10,
        },
      };

    default:
      return state;
  }
};
