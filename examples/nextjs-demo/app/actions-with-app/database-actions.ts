"use server";

import { AppApiClient, getDatabaseAdmin } from "@monorepo/app";

import {
  DatabaseCreateResponse,
  DatabaseDeleteResponse,
  InsertResponse,
} from "@monorepo/apifront";
import {
  isStaging,
  isProduction,
  DatabaseSummary,
  AppApiClientConfig,
} from "@monorepo/core";

const serverBaseUrl = "http://localhost:58837"

const apiKey = isStaging
  ? process.env.MONGO_APIKEY_STAGING!
  : process.env.MONGO_APIKEY_DEVELOPMENT!;

const dbName = isStaging ? "staging-mainappdb" : "mainappdb";

const gpConfig: AppApiClientConfig = {
  apiKey,
  serverBaseUrl,
  dbName,
};

export async function getDatabaseSummaryAction(): Promise<
  DatabaseSummary[] | null
> {
  const app = new AppApiClient({
    ...gpConfig,
  });
  const adminDb = getDatabaseAdmin(app);
  const getDatabaseCollectionSummaryActionResult = await adminDb
    .database(dbName)
    .listCollections();
  return getDatabaseCollectionSummaryActionResult;
}

export async function getDatabaseCollectionDetailsAction(
  databaseName: string
): Promise<any> {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });

  const adminDb = getDatabaseAdmin(app);
  const getDatabaseCollectionDetailsActionResult = await adminDb
    .database(databaseName)
    .listCollectionDetails();

  return getDatabaseCollectionDetailsActionResult;
}

export async function createDatabaseAction(
  databaseName: string
): Promise<DatabaseCreateResponse> {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });
  const adminDb = getDatabaseAdmin(app);
  const createDatabaseActionResult = await adminDb
    .database(databaseName)
    .create();

  return createDatabaseActionResult;
}

export async function deleteDatabaseAction(
  databaseName: string,
  force: boolean = false
): Promise<DatabaseDeleteResponse> {
  const app = new AppApiClient({
    ...gpConfig,
    dbName: databaseName,
  });

  const adminDb = getDatabaseAdmin(app);
  const deleteDatabaseActionResult = await adminDb
    .database(databaseName)
    .delete(force);
  return deleteDatabaseActionResult;
}
