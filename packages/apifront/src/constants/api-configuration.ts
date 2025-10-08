// API Configuration

export const getApiBaseUrl = () => {
  const baseUrl =
    process.env.MONGODB_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://api.ilyasbozdemir.dev"
      : "http://localhost:58837");

  return baseUrl;
};

export enum ApiEndpoints {
  COLLECTION_MANAGEMENT = "collection-management",
  DATABASE_MANAGEMENT = "database-management",
}