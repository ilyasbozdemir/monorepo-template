import { ApiEndpoints } from "@/constants";
import { UrlBuilder } from "./url-builder";

/**
 * Placeholder string for the base URL in dynamic URL construction.
 * Can be used in paths and replaced by the actual base URL at runtime.
 *
 * Example:
 * ```ts
 * const path = `${baseUrlScheme}/users`;
 * // Later replaced with: "https://api.example.com/users"
 * ```
 */
const baseUrlScheme = `{BASE_URL}`;

/**
 * Placeholder string for the API version in dynamic URL construction.
 * Can be used in paths and replaced by the actual API version at runtime.
 *
 * Example:
 * ```ts
 * const path = `${ApiVersionScheme}/users`;
 * // Later replaced with: "v1/users"
 * ```
 */
const ApiVersionScheme = `{API_VERSION}`;

/**
 * Replaces placeholders in a URL path with the actual base URL and API version.
 *
 * This function looks for `{BASE_URL}` and `{API_VERSION}` placeholders in the given path
 * and replaces them with the provided `baseUrl` and `apiVersion` values.
 *
 * Example:
 * ```ts
 * const url = withFullUrl("https://api.example.com", "v1", "{BASE_URL}/{API_VERSION}/users");
 * // url => "https://api.example.com/v1/users"
 * ```
 *
 * @param baseUrl - The base URL to replace `{BASE_URL}` in the path.
 * @param apiVersion - The API version to replace `{API_VERSION}` in the path.
 * @param path - The URL path containing placeholders `{BASE_URL}` and `{API_VERSION}`.
 * @returns The full URL string with placeholders replaced.
 */
export const withFullUrl = (
  baseUrl: string,
  apiVersion: string,
  path: string
) => {
  const fullUrl = path
    .replace(baseUrlScheme, baseUrl)
    .replace(ApiVersionScheme, apiVersion);

  return fullUrl;
};
/**
 * Provides MongoDB database management endpoints.
 * Includes operations for creating, deleting, listing, and getting database details.
 */
export const DatabaseApi = {
  /**
   * Creates a new database with the given name and an optional first collection.
   *
   * @param dbName - Name of the database to create.
   * @param firstCollection - Optional name of the first collection. Defaults to "defaultCollection".
   * @returns The fully built URL for creating the database.
   */
  create: (dbName: string, firstCollection: string = "defaultCollection") =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.DATABASE_MANAGEMENT)
      .addSegment("create")
      .setQuery({ dbName, firstCollection })
      .build(),
  /**
   * Deletes a database by name.
   *
   * @param name - Name of the database to delete.
   * @param force - If true, forces deletion even if database is not empty.
   * @returns The fully built URL for deleting the database.
   */
  delete: (dbName: string, force: boolean = false) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.DATABASE_MANAGEMENT)
      .addSegment("delete")
      .setQuery({ dbName, force })
      .build(),
  /**
   * Lists all databases.
   *
   * @returns The fully built URL for listing databases.
   */
  list: () =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.DATABASE_MANAGEMENT)
      .addSegment("list")
      .build(),
  /**
   * Gets details of a database by name.
   *
   * @param dbName - Name of the database.
   * @returns The fully built URL for fetching database details.
   */
  details: (dbName: string) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.DATABASE_MANAGEMENT)
      .addSegment(dbName)
      .addSegment("details")
      .build(),
  /**
   * Gets details of a database by name.
   *
   * @param dbName - Name of the database.
   * @returns The fully built URL for fetching database details.
   */
  summaryList: () =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.DATABASE_MANAGEMENT)
      .addSegment("db-summary-list")
      .build(),
};

// ==================== CollectionApi ====================

export const CollectionApi = {
  /**
   * Creates a new collection in the specified database.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the new collection.
   * @returns The fully built URL for creating the collection.
   */
  createCollection: (dbName: string, collectionName: string) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(dbName)
      .addSegment("create-collection")
      .setQuery({ collectionName })
      .build(),

  /**
   * Deletes a collection in the specified database.
   * Bu aslında bd  kısmında da tekrar etmiş,veya refactoring yapılcak.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the collection to delete.
   * @returns The fully built URL for deleting the collection.
   */
  deleteCollection: (dbName: string, collectionName: string) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(dbName)
      .addSegment("delete-collection")
      .setQuery({ collectionName })
      .build(),
  /**
   * Lists all collections for a given database.
   *
   * @param dbName - Name of the database.
   * @returns The fully built URL for listing collections.
   */
  listByDatabase: (dbName: string) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment("list")
      .setQuery({ dbName })
      .build(),

  /**
   * Retrieves all documents from a collection with optional pagination.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the collection.
   * @param page - Optional page number.
   * @param size - Optional page size.
   * @returns The fully built URL for fetching all documents.
   */
  getAllDocuments: (
    dbName: string,
    collectionName: string,
    page?: number,
    size?: number
  ) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(collectionName)
      .setQuery({ dbName, page, size })
      .build(),
  /**
   * Retrieves a document by id from a collection.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the collection.
   * @param documentId - ID of the document to retrieve.
   * @returns The fully built URL for fetching the document by id.
   */
  getDocument: (dbName: string, collectionName: string, documentId: string) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(ApiVersionScheme)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(collectionName)
      .addSegment(documentId)
      .setQuery({ dbName })
      .build(),
  /**
   * Inserts a single document into a collection.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the collection.
   * @returns The fully built URL for inserting a document.
   */
  insertDocument: (dbName: string, collectionName: string) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(`{API_VERSION}`)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(collectionName)
      .addSegment("insert")
      .setQuery({ dbName })
      .build(),
  /**
   * Inserts multiple documents into a collection.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the collection.
   * @returns The fully built URL for inserting multiple documents.
   */
  insertManyDocuments: (dbName: string, collectionName: string) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(`{API_VERSION}`)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(collectionName)
      .addSegment("insert-many")
      .setQuery({ dbName })
      .build(),
  /**
   * Updates a document in a collection by id.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the collection.
   * @param id - ID of the document to update.
   * @returns The fully built URL for updating the document.
   */
  updateDocument: (
    dbName: string | undefined,
    collectionName: string,
    id: string
  ) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(`{API_VERSION}`)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(collectionName)
      .addSegment("update")
      .addSegment(id)
      .setQuery({ dbName })
      .build(),

  /**
   * Deletes a document in a collection by id.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the collection.
   * @param id - ID of the document to delete.
   * @returns The fully built URL for deleting the document.
   */
  deleteDocument: (
    dbName: string | undefined,
    collectionName: string,
    id: string
  ) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(`{API_VERSION}`)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(collectionName)
      .addSegment("delete")
      .addSegment(id)
      .setQuery({ dbName })
      .build(),
  /**
   * Executes a MongoDB aggregation pipeline on the specified collection.
   *
   * @param collectionName - Name of the MongoDB collection.
   * @param dbName - Optional database name. If omitted, uses default database.
   * @returns The fully built URL for running the aggregation pipeline.
   */
  aggregateRun: (collectionName: string, dbName?: string) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(`{API_VERSION}`)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(collectionName)
      .addSegment("aggregate-run")
      .setQuery({ dbName })
      .build(),
  /**
   * Retrieves all documents using cursor pagination.
   *
   * @param dbName - Name of the database.
   * @param collectionName - Name of the collection.
   * @param page - Optional page number.
   * @param size - Optional page size.
   * @returns The fully built URL for fetching documents with cursor.
   */
  getAllWithCursor: (
    dbName: string,
    collectionName: string,
    page?: number,
    size?: number
  ) =>
    new UrlBuilder(baseUrlScheme)
      .addSegment(`{API_VERSION}`)
      .addSegment(ApiEndpoints.COLLECTION_MANAGEMENT)
      .addSegment(collectionName)
      .addSegment("cursor")
      .setQuery({ dbName, page, size })
      .build(),
};
