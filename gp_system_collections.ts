const SYSTEM_COLLECTION = "gp_system_collections";

export type DatabaseProvider = "mongodb" | "postgres" | "firebase" | "memory";

export interface GlobalPolicyRule {
  action: "read" | "create" | "update" | "delete";
  condition: string; // "@request.auth.id != null" gibi
  allow: boolean;
}

export type DatabaseEnvironment =
  | "PRODUCTION"
  | "STAGING"
  | "TEST"
  | "DEVELOPMENT";

export interface IndexDefinition {
  keys: Record<string, 1 | -1>; // 1: ascending, -1: descending
  unique?: boolean;
  sparse?: boolean;
  expireAfterSeconds?: number; // TTL
}

export interface CollectionRule {
  listRule?: string;
  viewRule?: string;
  createRule?: string;
  updateRule?: string;
  deleteRule?: string;
}

export interface SubCollection {
  name: string;
  description?: string;
  parent?: string;
}

export interface Collection {
  name: string;
  description?: string;
  system?: boolean; // Sistem koleksiyonu mu?
  createdAt?: number; // Timestamp (ms)
  subCollections?: SubCollection[];
  rules?: CollectionRule;
  indexes?: IndexDefinition[];
}

export interface Database {
  name: string;
  collections: Collection[];
  provider: DatabaseProvider;
  environment: DatabaseEnvironment;
  globalPolicy?: GlobalPolicyRule[];
}

export const collections: Collection[] = [
  {
    name: "car_listings",
    description: "Araç ilanları",
    subCollections: [
      {
        name: "car_listings",
        parent: "car_listings",
        description: "Araç fotoğrafları",
      },
      {
        name: "car_listings_details",
        parent: "car_listings",
        description: "Araç İlan Detayları",
      },
      {
        name: "car_listings_photo_datas",
        parent: "car_listings",
        description: "Araç fotoğraf veri detayları",
      },
      {
        name: "car_listings_metrics",
        parent: "car_listings",
        description: "Araç ilan metrikleri",
      },
      {
        name: "car_listings_notes",
        parent: "car_listings",
        description: "İlan notları",
      },
      {
        name: "car_listings_equipment",
        parent: "car_listings",
        description: "Seçilen donanım özellikleri",
      },
      {
        name: "car_listings_seller_info",
        parent: "car_listings",
        description: "İlan satıcı bilgileri",
      },
      {
        name: "car_listings_messaging",
        parent: "car_listings",
        description: "İlan mesajlaşma geçmişi",
      },
    ],
    rules: {
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id = @record.author",
      deleteRule: "@request.auth.id = @record.author",
    },
    indexes: [
      { keys: { listingId: 1 }, unique: true },
      { keys: { createdAt: -1 } },
    ],
  },
];

export const databases: Database[] = [
  {
    name: "db",
    provider: "mongodb",
    environment: "PRODUCTION",
    globalPolicy: [
      { action: "read", condition: "@request.auth.id != null", allow: true },
      {
        action: "create",
        condition: "@request.auth.roles contains 'editor'",
        allow: true,
      },
    ],

    collections: [
      {
        name: "car_listings",
        description: "Araç ilanları",
        system: false,
        createdAt: Date.now(),
        subCollections: [
          { name: "car_listings_photos", parent: "car_listings" },
          { name: "car_listings_videos", parent: "car_listings" },
        ],
        rules: {
          listRule: "@request.auth.id != null",
          createRule: "@request.auth.id != ''",
        },
        indexes: [
          { keys: { listingId: 1 }, unique: true },
          { keys: { createdAt: -1 } },
        ],
      },
      {
        name: "medias",
        description: "Medya dosyaları",
        system: true,
        createdAt: Date.now(),
        subCollections: [{ name: "media_thumbnails", parent: "medias" }],
      },
    ],
  },
  {
    name: "staging-db",
    provider: "mongodb",
    environment: "PRODUCTION",
    collections: [
      {
        name: "car_listings",
        description: "Araç ilanları",
        system: false,
        createdAt: Date.now(),
        subCollections: [
          { name: "car_listings_photos", parent: "car_listings" },
          { name: "car_listings_videos", parent: "car_listings" },
        ],
        rules: {
          listRule: "@request.auth.id != null",
          createRule: "@request.auth.id != ''",
        },
        indexes: [
          { keys: { listingId: 1 }, unique: true },
          { keys: { createdAt: -1 } },
        ],
      },
      {
        name: "medias",
        description: "Medya dosyaları",
        system: true,
        createdAt: Date.now(),
        subCollections: [{ name: "media_thumbnails", parent: "medias" }],
      },
    ],
  },
];

// helper.ts

export const getSubCollectionNames = (collectionName: string): string[] => {
  const col = collections.find((c) => c.name === collectionName);
  if (!col || !col.subCollections) return [];
  return col.subCollections.map((sub) => sub.name);
};

// Kullanım örneği
const mediasSubs = getSubCollectionNames("medias");
console.log(mediasSubs);
// → ["media_details", "media_thumbnails"]

const carListingsSubs = getSubCollectionNames("car_listings");
console.log(carListingsSubs);
// → ["photos", "videos"]
