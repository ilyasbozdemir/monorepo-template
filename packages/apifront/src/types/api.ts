// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export type InsertResponse = { message: string; id: string };

export interface DatabaseCreateResponse {
  statusCode: number;
  status: boolean;
  message: string;
}

export interface DatabaseDeleteResponse {
  statusCode: number;
  status: boolean;
  message: string;
  deletedDatabase?: string; 
  deletedCount?: number; 
}


export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface PagedResult<T> {
  totalCount: number;
  page: number;
  size: number;
  isPrevious: boolean;
  isNext: boolean;
  data?: T | T[];
}

// bu imzaya api response imzalarını cevircez ve generic colleciton servisine vericez:
export interface ActionResult<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Converts various API response types into a standardized ActionResult.
 *
 * Supports `ApiResponse<T>`, `PagedResult<T>`, and `ApiError`.
 *
 * Example usage:
 * ```ts
 * const apiResp: ApiResponse<{ id: number; name: string }> = {
 *   data: { id: 1, name: "Item 1" },
 *   success: true,
 *   message: "Fetched successfully",
 * };
 *
 * const pagedResp: PagedResult<{ id: number; name: string }> = {
 *   totalCount: 10,
 *   page: 1,
 *   size: 5,
 *   isPrevious: false,
 *   isNext: true,
 *   data: [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }],
 * };
 *
 * const apiErr: ApiError = {
 *   message: "Not Found",
 *   status: 404,
 *   code: "NOT_FOUND",
 * };
 *
 * const result1 = toActionResult(apiResp);
 * // result1: { success: true, data: { id: 1, name: "Item 1" }, message: "Fetched successfully", error: undefined }
 *
 * const result2 = toActionResult(pagedResp);
 * // result2: { success: true, data: [{ id: 1, name: "Item 1" }, ...], message: undefined, error: undefined }
 *
 * const result3 = toActionResult(apiErr);
 * // result3: { success: false, data: undefined, message: undefined, error: "Not Found" }
 * ```
 *
 * @template T - Type of the data contained in the ActionResult (can be a single item or array).
 * @param apiResponse - API response object to convert (ApiResponse<T>, PagedResult<T>, or ApiError).
 * @returns Standardized ActionResult containing success status, data, and optional error/message.
 */
export function toActionResult<T>(
  apiResponse: ApiResponse<T> | PagedResult<T> | ApiError
): ActionResult<T | T[]> {
  // ApiResponse
  if ("success" in apiResponse && "data" in apiResponse) {
    return {
      success: apiResponse.success,
      message: apiResponse.message,
      data: apiResponse.data,
      error: undefined,
    };
  }

  // PagedResult
  if ("totalCount" in apiResponse && "data" in apiResponse) {
    return {
      success: true,
      message: undefined,
      data: apiResponse.data,
      error: undefined,
    };
  }

  // ApiError
  if ("message" in apiResponse && "status" in apiResponse) {
    return {
      success: false,
      message: undefined,
      data: undefined,
      error: apiResponse.message,
    };
  }

  // Unknown format fallback
  return {
    success: false,
    message: undefined,
    data: undefined,
    error: "Unknown response format",
  };
}
