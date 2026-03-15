// src/hooks/useProducts.ts (UPDATED - Fix product details)
import { useState, useEffect, useCallback } from 'react';
import { Product } from '../models/Product';
import { productApi, ApiResponse } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProducts = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      const response: ApiResponse<Product[]> = await productApi.getAllProducts();

      if (response.error) {
        setError(response.error);
        setProducts([]);
      } else if (response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsRefreshing(true);
    await fetchProducts(true);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch,
    isRefreshing,
  };
};

export const useProductDetails = (productId: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      // Don't fetch if productId is 0 (meaning we have passed product)
      if (productId === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching product with ID:', productId); // Debug log

        const response: ApiResponse<Product> = await productApi.getProductById(productId);

        if (response.error) {
          setError(response.error);
          setProduct(null);
        } else if (response.data) {
          console.log('Product fetched:', response.data.title); // Debug log
          setProduct(response.data);
        }
      } catch (err) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
  };
};