"use server";

import { AppApiClientConfig, CollectionInfo, isProduction, isStaging } from "@monorepo/core";
import { AppApiClient, getDatabase, getDatabaseAdmin } from "@monorepo/app";
import { CollectionApi, InsertResponse } from "@monorepo/apifront";

const serverBaseUrl = "http://localhost:58837";

const apiKey =
  process.env.MONGO_APIKEY_DEVELOPMENT! ||
  "APP-DEVELOPMENT-c416d09c-3c33-4be7-b0ee-0f9230a1a167";

const dbName = isStaging ? "staging-mainappdb" : "mainappdb";

const gpConfig: AppApiClientConfig = {
  apiKey,
  serverBaseUrl,
  dbName,
};

export async function deleteCollectionAction(
  databaseName: string,
  collectionName: string
): Promise<any> {
  const app = new AppApiClient({
    ...gpConfig,
    serverBaseUrl,

    dbName: databaseName,
  });
  const adminDb = getDatabaseAdmin(app);
  const deleteDatabaseCollectionActionResult = await adminDb
    .collection(collectionName)
    .delete();
  return deleteDatabaseCollectionActionResult;
}

export async function getDocumentsAction<T>(
  databaseName: string,
  collectionName: string,
  page = 1,
  size = 20
): Promise<{
  totalCount: number;
  page: number;
  size: number;
  isPrevious: boolean;
  isNext: boolean;
  data: T[];
}> {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });

  const db = getDatabase(app);

  const getDocumentsResults = await db
    .collection<T>(collectionName)
    .getAll(page, size);

  return getDocumentsResults;
}

export async function createCollectionAction<T>(
  databaseName: string,
  collectionName: string
): Promise<boolean> {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });

  const adminDb = getDatabaseAdmin(app);
  const newCollectionResult = await adminDb
    .collection<T>(collectionName)
    .create();
  return newCollectionResult;
}

export async function insertDocumentAction<T>(
  databaseName: string,
  collectionName: string,
  document: T
): Promise<InsertResponse> {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });

  const db = getDatabase(app);

  const insertResult = await db.collection<T>(collectionName).insert(document);
  return insertResult;
}

export async function updateDocumentAction<T>(
  databaseName: string,
  collectionName: string,
  documentId: string,
  updates: Partial<T>
): Promise<{ modifiedCount: number }> {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });

  const db = getDatabase(app);
  const updateResult = await db

    .collection<T>(collectionName)
    .update(documentId, updates);
  return updateResult;
}

export async function deleteDocumentAction(
  databaseName: string,
  collectionName: string,
  documentId: string
): Promise<{ deletedCount: number }> {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });

  const db = getDatabase(app);
  const deleteResult = await db.collection(collectionName).delete(documentId);
  return deleteResult;
}

export const aggregateRunAction = async (
  databaseName: string,
  collectionName: string,
  pipeline: any[]
) => {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });

  const db = getDatabase(app);

  const aggregateResult = await db
    .collection(collectionName)
    .aggregate(pipeline);
  return aggregateResult;
};
