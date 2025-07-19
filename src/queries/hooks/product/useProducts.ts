//@ts-nocheck
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { Product, ProductsQuery, ProductsResponse } from "../../types/product"

export const useProducts = (params?: ProductsQuery) => {
  return useQuery({
    queryKey: queryKeys.products.all(params),
    queryFn: (): Promise<ProductsResponse> => apiClient.get("/products", params),
    keepPreviousData: true,
  })
}

export const useInfiniteProducts = (params?: ProductsQuery) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.all(params),
    queryFn: ({ pageParam = 1 }): Promise<ProductsResponse> =>
      apiClient.get("/products", { ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage
      return pagination.hasNextPage ? pagination.currentPage + 1 : undefined
    },
    keepPreviousData: true,
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: (): Promise<{ success: boolean; data: Product }> => apiClient.get(`/products/${id}`),
    select: (data) => data.data,
    enabled: !!id,
  })
}

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.products.bySlug(slug),
    queryFn: (): Promise<{ success: boolean; data: Product }> => apiClient.get(`/products/slug/${slug}`),
    select: (data) => data.data,
    enabled: !!slug,
  })
}

export const useFeaturedProducts = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.products.featured(limit),
    queryFn: (): Promise<{ success: boolean; count: number; data: Product[] }> =>
      apiClient.get("/products/featured", { limit }),
    select: (data) => data.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useLatestProducts = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.products.latest(limit),
    queryFn: (): Promise<{ success: boolean; count: number; data: Product[] }> =>
      apiClient.get("/products/latest", { limit }),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useBestSellingProducts = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.products.bestSelling(limit),
    queryFn: (): Promise<{ success: boolean; count: number; data: Product[] }> =>
      apiClient.get("/products/best-selling", { limit }),
    select: (data) => data.data,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useTopRatedProducts = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.products.topRated(limit),
    queryFn: (): Promise<{ success: boolean; count: number; data: Product[] }> =>
      apiClient.get("/products/top-rated", { limit }),
    select: (data) => data.data,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useSearchProducts = (query: string, params?: ProductsQuery) => {
  return useQuery({
    queryKey: queryKeys.products.search(query, params),
    queryFn: (): Promise<ProductsResponse> => apiClient.get("/products/search", { q: query, ...params }),
    enabled: !!query && query.length > 2,
    keepPreviousData: true,
  })
}

export const useRelatedProducts = (id: string, limit?: number) => {
  return useQuery({
    queryKey: queryKeys.products.related(id, limit),
    queryFn: (): Promise<{ success: boolean; count: number; data: Product[] }> =>
      apiClient.get(`/products/${id}/related`, { limit }),
    select: (data) => data.data,
    enabled: !!id,
  })
}
