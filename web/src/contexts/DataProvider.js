import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { getAllCategories, getAllProducts } from "@sneakers/shared/services";
import { dataReducer, initialState } from "@sneakers/shared/reducer";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);

  const getAllSneakers = async (page = 1, limit = 10) => {
    try {
      setError(false);
      setLoading(true);
      const response = await getAllProducts(
        page,
        limit,
        state.inputSearch,
        state.filters.price,
        state.filters.categories,
        state.filters.rating,
        state.filters.sort
      );
      if (response.request.status === 200) {
        setLoading(false);
        dispatch({
          type: "GET_ALL_PRODUCTS_FROM_API",
          payload: [
            ...response.data.products
              .map((value) => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value),
          ],
          pagination: response.data.pagination,
        });
      }
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.request.status === 200) {
        dispatch({
          type: "GET_ALL_CATEGORIES",
          payload: response.data.categories,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSneakers();
    getCategories();
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch, loading, getAllSneakers }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
