import { ApiEndpoints, getApiBaseUrl } from "@/constants";

const API_VERSION = "v1";
const baseUrl = getApiBaseUrl();

export const DatabaseApi = {
  create: (dbName: string, firstCollection: string = "defaultCollection") =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.DATABASE_MANAGEMENT
    }/create?dbName=${encodeURIComponent(
      dbName
    )}&firstCollection=${encodeURIComponent(firstCollection)}`,

  delete: (name: string, force: boolean = false) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.DATABASE_MANAGEMENT
    }/delete?name=${encodeURIComponent(name)}&force=${force}`,

  list: () =>
    `${baseUrl}/${API_VERSION}/${ApiEndpoints.DATABASE_MANAGEMENT}/list`,

  details: (dbName: string) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.DATABASE_MANAGEMENT
    }/${encodeURIComponent(dbName)}/details`,

  summaryList: () =>
    `${baseUrl}/${API_VERSION}/${ApiEndpoints.DATABASE_MANAGEMENT}/db-summary-list`,
};

export const CollectionApi = {
  createCollection: (dbName: string, collectionName: string) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(
      dbName
    )}/create-collection?collectionName=${encodeURIComponent(collectionName)}`,

  deleteCollection: (dbName: string, collectionName: string) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(
      dbName
    )}/delete-collection?collectionName=${encodeURIComponent(collectionName)}`,

  listByDatabase: (dbName: string) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/list?dbName=${encodeURIComponent(dbName)}`,

  getAllDocuments: (
    dbName: string,
    collectionName: string,
    page?: number,
    size?: number
  ) => {
    let url = `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(collectionName)}?dbName=${encodeURIComponent(
      dbName
    )}`;
    if (page !== undefined) url += `&page=${page}`;
    if (size !== undefined) url += `&size=${size}`;
    return url;
  },

  getDocument: (dbName: string, collectionName: string, documentId: string) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(collectionName)}/${encodeURIComponent(
      documentId
    )}?dbName=${encodeURIComponent(dbName)}`,

  insertDocument: (dbName: string, collectionName: string) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(collectionName)}/insert${
      dbName ? `?dbName=${encodeURIComponent(dbName)}` : ""
    }`,

  insertManyDocuments: (dbName: string, collectionName: string) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(collectionName)}/insert-many${
      dbName ? `?dbName=${encodeURIComponent(dbName)}` : ""
    }`,

  updateDocument: (
    dbName: string | undefined,
    collectionName: string,
    id: string
  ) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(collectionName)}/update/${encodeURIComponent(id)}${
      dbName ? `?dbName=${encodeURIComponent(dbName)}` : ""
    }`,

  deleteDocument: (
    dbName: string | undefined,
    collectionName: string,
    id: string
  ) =>
    `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(collectionName)}/delete/${encodeURIComponent(id)}${
      dbName ? `?dbName=${encodeURIComponent(dbName)}` : ""
    }`,

aggregateRun: (collectionName: string, dbName?: string) =>
  `${baseUrl}/${API_VERSION}/api/${
    ApiEndpoints.COLLECTION_MANAGEMENT
  }/${encodeURIComponent(collectionName)}/aggregate-run${
    dbName ? `?dbName=${encodeURIComponent(dbName)}` : ""
  }`,

  getAllWithCursor: (
    dbName: string,
    collectionName: string,
    page?: number,
    size?: number
  ) => {
    let url = `${baseUrl}/${API_VERSION}/api/${
      ApiEndpoints.COLLECTION_MANAGEMENT
    }/${encodeURIComponent(collectionName)}/cursor?dbName=${encodeURIComponent(
      dbName
    )}`;
    if (page !== undefined) url += `&page=${page}`;
    if (size !== undefined) url += `&size=${size}`;
    return url;
  },
};