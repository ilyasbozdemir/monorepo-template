export interface DatabaseSummary {
  database: string;
  collectionCount: number;
  collections: CollectionSummary[];
}

export interface CollectionSummary {
  name: string;
  documentCount: number;
  sizeMB?: number;
  storageMB?: number;
}

export interface DatabaseDetails {
  Database: string;
  CollectionCount: number;
  Collections: CollectionSummary[];
}

export interface DeleteDatabaseResponse {
  message: string;
  CollectionsDeleted: CollectionSummary[];
}

export interface ConflictResponse {
  message: string;
  Collections: CollectionSummary[];
}

export interface InsertResponse {
  message: string;
}

export interface Document {
  _id: string;
  [key: string]: any;
}


export interface CollectionInfo {
  name: string
  documentCount: number
  avgDocSize: string
  indexes: number
}
export interface DeleteResult {
  DeletedCount: number;
}

export interface UpdateResult {
  ModifiedCount: number;
}

export interface CreateCollectionResponse {
  message: string;
}

export interface DeleteCollectionResponse {
  message: string;
}

export interface DocumentInsertResponse {
  message: string;
  insertedId?: string;
}

export interface DocumentUpdateResponse {
  modifiedCount: number;
  message?: string;
}

export interface DocumentDeleteResponse {
  deletedCount: number;
  message?: string;
}