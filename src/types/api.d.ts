/**
 * API Request/Response Types
 */

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    total: number;
    results: T[];
  };
  message: string;
  success: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}
