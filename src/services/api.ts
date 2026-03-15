import axios, { AxiosInstance, AxiosError } from 'axios';
import { Product } from '../models/Product';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number | null;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging (optional)
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here later
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response Error:', error.message);
    return Promise.reject(error);
  }
);

// Product API service
export const productApi = {
  /**
   * Fetch all products
   */
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await apiClient.get<Product[]>('/products');
      
      return {
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Fetch single product by ID
   */
  getProductById: async (id: number): Promise<ApiResponse<Product>> => {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      
      return {
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Fetch products by category
   */
  getProductsByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await apiClient.get<Product[]>(`/products/category/${category}`);
      
      return {
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Fetch all categories
   */
  getAllCategories: async (): Promise<ApiResponse<string[]>> => {
    try {
      const response = await apiClient.get<string[]>('/products/categories');
      
      return {
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Fetch limited products (for pagination)
   */
  getLimitedProducts: async (limit: number): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await apiClient.get<Product[]>(`/products?limit=${limit}`);
      
      return {
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Centralized error handler
const handleApiError = <T>(error: unknown): ApiResponse<T> => {
  let message = 'An unexpected error occurred';
  let status: number | null = null;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    status = axiosError.response?.status || null;

    if (!axiosError.response) {
      message = 'Network error. Please check your internet connection.';
    } else {
      switch (status) {
        case 400: message = 'Bad request. Please try again.'; break;
        case 401: message = 'Unauthorized. Please login again.'; break;
        case 404: message = 'Products not found.'; break;
        case 500: message = 'Server error. Please try again later.'; break;
        default: message = axiosError.message;
      }
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return {
    data: null,
    error: message,
    status: status,
  };
};

// Create a custom hook for API calls (we'll use this in screens)
export const useApi = () => {
  const fetchProducts = async (): Promise<ApiResponse<Product[]>> => {
    return productApi.getAllProducts();
  };

  const fetchProductById = async (id: number): Promise<ApiResponse<Product>> => {
    return productApi.getProductById(id);
  };

  return {
    fetchProducts,
    fetchProductById,
  };
};