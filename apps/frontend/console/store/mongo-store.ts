import { create } from "zustand"

interface Document {
  _id: string
  [key: string]: any
}

interface Collection {
  [collectionName: string]: Document[]
}

interface Database {
  collections: Collection
}

interface DatabaseStats {
  storageSize: string
  collectionsCount: number
  indexesCount: number
}

interface MongoStore {
  databases: Record<string, Database>
  getDatabaseStats: (dbName: string) => DatabaseStats
  addDatabase: (name: string) => void
  deleteDatabase: (name: string) => void
  addCollection: (dbName: string, collectionName: string) => void
  deleteCollection: (dbName: string, collectionName: string) => void
  addDocument: (dbName: string, collectionName: string, doc: any) => void
  updateDocument: (dbName: string, collectionName: string, docId: string, doc: any) => void
  deleteDocument: (dbName: string, collectionName: string, docId: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useMongoStore = create<MongoStore>((set, get) => ({
  databases: {
    admin: {
      collections: {
        system_version: [
          { _id: generateId(), version: "5.0.0", gitVersion: "1184f004a99660de6f5e745573419bda8a28c0e9" },
        ],
        system_users: [{ _id: generateId(), user: "admin", db: "admin", roles: [{ role: "root", db: "admin" }] }],
      },
    },
    config: {
      collections: {
        system_sessions: [],
      },
    },
    local: {
      collections: {
        startup_log: [{ _id: generateId(), hostname: "localhost", startTime: new Date().toISOString(), pid: 12345 }],
      },
    },
    TESTDB: {
      collections: {
        tested_collection: [
          {
            _id: generateId(),
            name: "Test Document 1",
            value: 100,
            tags: ["test", "sample"],
            createdAt: new Date().toISOString(),
          },
          {
            _id: generateId(),
            name: "Test Document 2",
            value: 200,
            tags: ["test", "demo"],
            createdAt: new Date().toISOString(),
          },
        ],
      },
    },
  },

  getDatabaseStats: (dbName) => {
    const state = get()
    const db = state.databases[dbName]
    if (!db) return { storageSize: "0 kB", collectionsCount: 0, indexesCount: 0 }

    const collectionsCount = Object.keys(db.collections).length
    const totalDocs = Object.values(db.collections).reduce((sum, docs) => sum + docs.length, 0)
    const storageSize = (totalDocs * 2.5 + Math.random() * 50).toFixed(2)
    const indexesCount = collectionsCount + Math.floor(Math.random() * 3)

    return {
      storageSize: `${storageSize} kB`,
      collectionsCount,
      indexesCount,
    }
  },

  addDatabase: (name) =>
    set((state) => ({
      databases: {
        ...state.databases,
        [name]: { collections: {} },
      },
    })),

  deleteDatabase: (name) =>
    set((state) => {
      const { [name]: _, ...rest } = state.databases
      return { databases: rest }
    }),

  addCollection: (dbName, collectionName) =>
    set((state) => ({
      databases: {
        ...state.databases,
        [dbName]: {
          ...state.databases[dbName],
          collections: {
            ...state.databases[dbName].collections,
            [collectionName]: [],
          },
        },
      },
    })),

  deleteCollection: (dbName, collectionName) =>
    set((state) => {
      const { [collectionName]: _, ...rest } = state.databases[dbName].collections
      return {
        databases: {
          ...state.databases,
          [dbName]: {
            ...state.databases[dbName],
            collections: rest,
          },
        },
      }
    }),

  addDocument: (dbName, collectionName, doc) =>
    set((state) => ({
      databases: {
        ...state.databases,
        [dbName]: {
          ...state.databases[dbName],
          collections: {
            ...state.databases[dbName].collections,
            [collectionName]: [
              ...state.databases[dbName].collections[collectionName],
              { ...doc, _id: doc._id || generateId() },
            ],
          },
        },
      },
    })),

  updateDocument: (dbName, collectionName, docId, doc) =>
    set((state) => ({
      databases: {
        ...state.databases,
        [dbName]: {
          ...state.databases[dbName],
          collections: {
            ...state.databases[dbName].collections,
            [collectionName]: state.databases[dbName].collections[collectionName].map((d) =>
              d._id === docId ? { ...doc, _id: docId } : d,
            ),
          },
        },
      },
    })),

  deleteDocument: (dbName, collectionName, docId) =>
    set((state) => ({
      databases: {
        ...state.databases,
        [dbName]: {
          ...state.databases[dbName],
          collections: {
            ...state.databases[dbName].collections,
            [collectionName]: state.databases[dbName].collections[collectionName].filter((d) => d._id !== docId),
          },
        },
      },
    })),
}))
