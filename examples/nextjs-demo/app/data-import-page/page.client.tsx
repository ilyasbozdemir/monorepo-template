"use client";

import axios from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileJson,
  Database,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
  Plus,
  Settings,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatabaseSummary, AppApiClientConfig } from "@monorepo/core";
import {
  AppApiClient,
  getDatabase,
  getDatabaseAdmin,
} from "@monorepo/app";
import {
  CarListingCoreModel,
  CarListingDetailsModel,
  CarListingEquipmentModel,
  CarListingMediaModel,
  CarListingMessageModel,
  CarListingMetricsModel,
  CarListingNoteModel,
  CarListingSellerModel,
  CarListingDTO,
  //
  IAppUserCoreModel, // app-user
  IAppUserDetailsModel, // app-user-details
  IAppUserCompanyModel, // app-user-company
  IAppUserSecurityModel, // app-user-security
  IAppUserNotificationModel, // app-user-notification
  IAppUserFavoritesModel, // app-user-favorites
  IAppUserSavedSearchModel, // app-user-saved-search
  IAppUserTermsModel, // app-user-terms
  IAppUserBusinessProfileModel, // app-user-business-profile-card
  IAppUserAccountModel, // app-user-account
  IAppUserPackageModel, // app-user-user-package
  IAppUserSupportRequestModel, // app-user-support-request
  IAppUserAddressModel, // app-user-address
  IAppUserDTO,
  IMediaCoreModel,
  IMediaDetailsModel,
  IMediaMetadataModel,
  IMediaTagModel,
  IMediaDTO,
} from "@monorepo/models";

import {
  createDatabaseAction,
  getDatabaseSummaryAction,
} from "../actions-with-app";
import { UserType } from "@/enums/UserType";
import { SimpleDate } from "@/models/app-user";

type ModelQueueItem = {
  id: string;
  modelType: string;
  jsonData: any;
  idMapping: {
    enabled: boolean;
    field?: string;
    type?: string;
  };
  recordCount: number;
};

export const SELECT_USERS = "users";
export const SELECT_CARLISTING = "carlisting";
export const SELECT_MEDIAS = "medias";

type InfoMessageType = "success" | "error" | "warning";

interface InfoMessage {
  type: InfoMessageType | null;
  text: string | null;
}

const envConfig = {
  LIVE: {
    apiKey: process.env.MONGO_APIKEY_PRODUCTION,
    baseUrl: process.env.MONGO_BASEURL_PRODUCTION,
  },
  STAGING: {
    apiKey: process.env.MONGO_APIKEY_STAGING,
    baseUrl: process.env.MONGO_BASEURL_STAGING,
  },
  TEST: {
    apiKey: process.env.MONGO_APIKEY_TEST,
    baseUrl: process.env.MONGO_BASEURL_TEST,
  },
  DEVELOPMENT: {
    apiKey: process.env.MONGO_APIKEY_DEVELOPMENT,
    baseUrl: process.env.MONGO_BASEURL_DEVELOPMENT,
  },
};

type EnvType = "LIVE" | "STAGING" | "TEST" | "DEVELOPMENT";

export default function PageClient() {
  const [databases, setDatabases] = useState<DatabaseSummary[]>([]);

  const [config, setConfig] = useState<AppApiClientConfig>({
    apiKey: "",
    serverBaseUrl: "",
    dbName: "",
    apiVersion: "v1",
  });

  const [currentEnv, setCurrentEnv] =
    useState<keyof typeof envConfig>("DEVELOPMENT");

  const [appClient, setAppClient] = useState<AppApiClient | null>(null);

  const [isConfigValid, setIsConfigValid] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] =
    useState<boolean>(false);

  const [infoMessages, setInfoMessages] = useState<InfoMessage[]>([]);

  const [jsonContent, setJsonContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState<boolean | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [useCustomIdMapping, setUseCustomIdMapping] = useState<boolean>(false);

  const [loadedModels, setLoadedModels] = useState<ModelQueueItem[]>([]);
  const [importResults, setImportResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);

  const [mongoServerStatus, setMongoServerStatus] = useState<
    "connected" | "disconnected"
  >("disconnected");
  const [mongoDbStatus, setMongoDbStatus] = useState<
    "ready" | "busy" | "error" | "info"
  >("error");
  const [isMappingEnabled, setIsMappingEnabled] = useState<boolean>(false);
  const [updatingModelId, setUpdatingModelId] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<{
    dbName: string;
    environment: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    loadDatabases();
  }, []);

  useEffect(() => {
    if (config.apiKey && config.serverBaseUrl && config.dbName) {
      const client = new AppApiClient(config);
      setAppClient(client);
    } else {
      setAppClient(null);
    }
  }, [config]);

  useEffect(() => {
    const env = envConfig[currentEnv];
    setConfig((prev) => ({
      ...prev,
      apiKey: env.apiKey || "",
      serverBaseUrl: env.baseUrl || "",
    }));
    loadDatabases();
  }, [currentEnv]);

  const loadDatabases = async () => {
    try {
      setLoading(true);

      const summary = await getDatabaseSummaryAction();

      setDatabases(summary ?? []);
    } catch (error) {
      console.error("Failed to load databases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (
    field: keyof AppApiClientConfig,
    value: string
  ) => {
    setConfig({ ...config, [field]: value });
  };

  const getEnvironmentFromApiKey = (apiKey: string): string => {
    if (
      apiKey.startsWith("gp-live-") ||
      apiKey.toUpperCase().includes("LIVE")
    ) {
      return "Production";
    } else if (apiKey.toUpperCase().includes("DEVELOPMENT")) {
      return "Development";
    } else if (apiKey.toUpperCase().includes("STAGING")) {
      return "Staging";
    } else if (apiKey.toUpperCase().includes("TEST")) {
      return "Test";
    }
    return "Unknown";
  };

  const handleTestConnection = async () => {
    console.log("Testing connection with config:", config);
    setIsTestingConnection(true);
    setConnectionStatus(null);

    if (!config.apiKey || !config.serverBaseUrl) {
      setIsConfigValid(false);
      setMongoServerStatus("disconnected");
      setMongoDbStatus("error");
      console.log("Connection failed - missing config");
      return;
    }

    setIsTestingConnection(true);

    try {
      const response = await axios.get("/health", {
        baseURL: config.serverBaseUrl,
        timeout: 60000,
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          accept: "*/*",
          Accept: "application/json",
        },
      });

      // MongoDB servisini bul
      const mongoCheck = response.data?.checks?.find(
        (c: any) => c.name === "MongoDB"
      );

      const serverStatus =
        mongoCheck?.status === "Healthy" ? "connected" : "disconnected";
      setMongoServerStatus(serverStatus);

      // DB status'ı serverStatus ile aynı kabul edebiliriz
      const dbStatus = serverStatus === "connected" ? "ready" : "error";
      setMongoDbStatus(dbStatus);

      setIsConnected(serverStatus === "connected");
      setConnectionInfo({
        dbName: config.dbName,
        environment: getEnvironmentFromApiKey(config.apiKey),
        status: serverStatus === "connected" ? "Bağlı" : "Bağlanamıyor",
      });

      setIsConfigValid(serverStatus === "connected");
      console.log("Health check result:", response.data);
    } catch (error: any) {
      const code = error.code || error?.response?.status;
      if (code === "ECONNREFUSED")
        console.log("Connection refused - server unreachable");
      else if (code === "ECONNABORTED") console.log("Connection timed out");
      else
        console.log(
          "Connection failed - unknown error:",
          error.message || error
        );

      setIsConfigValid(false);
      setMongoServerStatus("disconnected");
      setMongoDbStatus("error");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonContent(content);
        validateJson(content);
      };
      reader.readAsText(file);
    }
  };

  const validateJson = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      setParsedData(parsed);
      setIsValidJson(true);
      console.log(" JSON validated successfully:", parsed);
    } catch (error) {
      setIsValidJson(false);
      setParsedData(null);
      console.log(" JSON validation failed:", error);
    }
  };

  const handleJsonTextChange = (value: string) => {
    setJsonContent(value);
    if (value.trim()) {
      validateJson(value);
    } else {
      setIsValidJson(null);
      setParsedData(null);
    }
  };

  const getIdMappingInfo = () => {
    if (!useCustomIdMapping || !selectedModel) return null;

    const mappings: Record<
      string,
      { field: string; description: string; type: string }
    > = {
      [SELECT_USERS]: {
        field: "uid",
        description: "uid alanı MongoDB _id olarak kullanılacak",
        type: "primary",
      },
      [SELECT_CARLISTING]: {
        field: "seller.uid",
        description:
          "seller.uid alanı users collection'daki _id'ye referans olacak",
        type: "reference",
      },
      [SELECT_MEDIAS]: {
        field: "mediaId",
        description: "mediaId alanı MongoDB _id olarak kullanılacak",
        type: "primary",
      },
    };

    const mapping = mappings[selectedModel.toLowerCase()];
    return mapping;
  };

  const handleAddModel = () => {
    console.log(" Add model clicked");
    console.log(" Model Type:", selectedModel);
    console.log(" JSON Data:", parsedData);
    console.log(" ID Mapping:", useCustomIdMapping);
    console.log(" Config:", config);

    const mappingInfo = getIdMappingInfo();

    const newItem: ModelQueueItem = {
      id: updatingModelId || Date.now().toString(),
      modelType: selectedModel,
      jsonData: parsedData,
      idMapping: {
        enabled: useCustomIdMapping,
        field: mappingInfo?.field,
        type: mappingInfo?.type,
      },
      recordCount: Array.isArray(parsedData)
        ? parsedData.length
        : Object.keys(parsedData).length,
    };

    if (updatingModelId) {
      setLoadedModels(
        loadedModels.map((item) =>
          item.id === updatingModelId ? newItem : item
        )
      );
      console.log(" Updated model:", newItem);
    } else {
      setLoadedModels([...loadedModels, newItem]);
      console.log(" Added model:", newItem);
    }

    setLoadedModels([...loadedModels, newItem]);

    // Clear form after adding
    setJsonContent("");
    setFileName("");
    setSelectedModel("");
    setIsValidJson(null);
    setParsedData(null);
    setUseCustomIdMapping(false);

    console.log(" Added model:", newItem);
    setUpdatingModelId(null);
  };

  const handleRemoveFromQueue = (id: string) => {
    console.log(" Remove model:", id);
    setLoadedModels(loadedModels.filter((item) => item.id !== id));
  };

  const convertAndUploadModel = async (
    item: ModelQueueItem
  ): Promise<{ success: boolean }> => {
    try {
      let status: boolean;

      switch (item.modelType) {
        case SELECT_USERS:
          status = await transformAppUser(item.jsonData);
          break;
        case SELECT_CARLISTING:
          status = await transformCarListing(item.jsonData);
          break;

        case SELECT_MEDIAS:
          status = await transformMediaDatas(item.jsonData);
          break;

        default:
          status = item.jsonData;
      }

      return {
        success: status,
      };
    } catch (err) {
      console.error("convertAndUploadModel error:", err);
      return {
        success: false,
      };
    }
  };

  const transformCarListing = async (
    dataArray: CarListingDTO[]
  ): Promise<boolean> => {
    if (!dataArray) return Promise.resolve(false);

    if (appClient === null) {
      console.log("App client is not initialized");
      return Promise.resolve(false);
    }

    const adminDb = getDatabaseAdmin(appClient);
    const db = getDatabase(appClient);

    const createDatabaseResult = await adminDb.database(config.dbName).create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type:
          createDatabaseResult.statusCode >= 200 &&
          createDatabaseResult.statusCode < 300
            ? "success"
            : createDatabaseResult.statusCode >= 400 &&
              createDatabaseResult.statusCode < 500
            ? "warning"
            : "error",
        text: createDatabaseResult.message,
      },
    ]);

    const carListingCoreCollectionResult = await adminDb
      .collection<CarListingCoreModel>("car_listings")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: carListingCoreCollectionResult.success ? "success" : "warning",
        text: carListingCoreCollectionResult.message,
      },
    ]);

    const carListingDetailCollectionResult = await adminDb
      .collection<CarListingCoreModel>("car_listings_details")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: carListingDetailCollectionResult.success ? "success" : "warning",
        text: carListingDetailCollectionResult.message,
      },
    ]);

    const carListingEquipmentsCollectionResult = await adminDb
      .collection<CarListingCoreModel>("car_listings_equipments")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: carListingEquipmentsCollectionResult.success
          ? "success"
          : "warning",
        text: carListingEquipmentsCollectionResult.message,
      },
    ]);

    const carListingMetricsCollectionResult = await adminDb
      .collection<CarListingMetricsModel>("car_listings_metrics")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: carListingMetricsCollectionResult.success ? "success" : "warning",
        text: carListingMetricsCollectionResult.message,
      },
    ]);

    const carListingNotesCollectionResult = await adminDb
      .collection<CarListingNoteModel>("car_listings_notes")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: carListingNotesCollectionResult.success ? "success" : "warning",
        text: carListingNotesCollectionResult.message,
      },
    ]);

    const carListingMediasCollectionResult = await adminDb
      .collection<CarListingMediaModel>("car_listings_photo_datas")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: carListingMediasCollectionResult.success ? "success" : "warning",
        text: carListingMediasCollectionResult.message,
      },
    ]);

    const carListingSellerCollectionResult = await adminDb
      .collection<CarListingSellerModel>("car_listings_seller_profile")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: carListingSellerCollectionResult.success ? "success" : "warning",
        text: carListingSellerCollectionResult.message,
      },
    ]);

    const carListingMessageCollectionResult = await adminDb
      .collection<CarListingMessageModel>("car_listings_messaging")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: carListingMessageCollectionResult.success ? "success" : "warning",
        text: carListingMessageCollectionResult.message,
      },
    ]);

    for (const dataItem of dataArray) {
      const coreDocument: Omit<CarListingCoreModel, "_id"> = {
        title: dataItem.title,
        variantTitle: dataItem.variantTitle,
        slug: dataItem.slug,
        status: dataItem.status,
        listingType: dataItem.listingType,
        price: dataItem.price,
        bodyType: dataItem.bodyType,
        transmissionType: dataItem.transmissionType,
        brand: dataItem.brand,
        model: dataItem.model,
        submodel: dataItem.submodel,
        year: dataItem.year,
        imageUrl: dataItem.imageUrl,
        mileage: dataItem.mileage,
        listingDate: dataItem.listingDate,
        publishDate: dataItem.publishDate,
        updatedAt: dataItem.updatedAt,
        expiryDate: dataItem.expiryDate,
        sellerUId: dataItem.seller.uid,
      };

      const coreDocumentInsertResult = await db
        .collection<Omit<CarListingCoreModel, "_id">>("car_listings")
        .insert(coreDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: coreDocumentInsertResult.id ? "success" : "warning",
          text: coreDocumentInsertResult.message,
        },
      ]);

      const detailsDocument: Omit<CarListingDetailsModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        fuelType: dataItem.fuelType,
        engineVolume: dataItem.engineVolume,
        enginePower: dataItem.enginePower,
        driveType: dataItem.driveType,
        steeringType: dataItem.steeringType,
        isPriceHidden: dataItem.isPriceHidden,
        isNegotiable: dataItem.isNegotiable,
        isExchange: dataItem.isExchange,
        location: dataItem.location,
      };

      const detailsDocumentInsertResult = await db
        .collection<Omit<CarListingDetailsModel, "_id">>("car_listings_details")
        .insert(detailsDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: detailsDocumentInsertResult.id ? "success" : "warning",
          text: detailsDocumentInsertResult.message,
        },
      ]);

      const equipmentsDocument: Omit<CarListingEquipmentModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        selectedEquipmentFeatures: dataItem.selectedEquipmentFeatures || [],
      };

      const equipmentDocumentInsertResult = await db
        .collection<Omit<CarListingEquipmentModel, "_id">>(
          "car_listings_equipment"
        )
        .insert(equipmentsDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: equipmentDocumentInsertResult.id ? "success" : "warning",
          text: equipmentDocumentInsertResult.message,
        },
      ]);

      const metricsDocument: Omit<CarListingMetricsModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        viewCount: dataItem.viewCount || 0,
        favoriteCount: dataItem.favoriteCount || 0,

        priceHistory: dataItem.priceHistory,
      };

      const metricsDocumentInsertResult = await db
        .collection<Omit<CarListingMetricsModel, "_id">>("car_listings_metrics")
        .insert(metricsDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: metricsDocumentInsertResult.id ? "success" : "warning",
          text: metricsDocumentInsertResult.message,
        },
      ]);

      const notesDocument: Omit<CarListingNoteModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,

        notes: dataItem.notes?.map((note) => ({
          id: note.id,
          createdBy: note.createdBy,
          name_surname: note.name_surname,
          role: note.role,
          text: note.text,
          at: note.at,
        })),
      };

      const notesDocumentInsertResult = await db
        .collection<Omit<CarListingNoteModel, "_id">>("car_listings_notes")
        .insert(notesDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: notesDocumentInsertResult.id ? "success" : "warning",
          text: notesDocumentInsertResult.message,
        },
      ]);

      const sellerDcoument: Omit<CarListingSellerModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        uid: dataItem.seller.uid,
        name: dataItem.seller.name,
        type: dataItem.seller.type,
        phone: dataItem.seller.phone,
        location: dataItem.seller.location,
        memberSince: dataItem.seller.memberSince,
        verifiedSeller: dataItem.seller.verifiedSeller,
        badges: dataItem.seller.badges || [],
        contactPreferences: dataItem.seller.contactPreferences,
      };

      const sellerDocumentInsertResult = await db
        .collection<Omit<CarListingSellerModel, "_id">>(
          "car_listings_seller_profile"
        )
        .insert(sellerDcoument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: sellerDocumentInsertResult.id ? "success" : "warning",
          text: sellerDocumentInsertResult.message,
        },
      ]);

      const messagesDocument: Omit<CarListingMessageModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
      };

      const messagesDocumentInsertResult = await db

        .collection<Omit<CarListingMessageModel, "_id">>(
          "car_listings_messaging"
        )
        .insert(messagesDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: messagesDocumentInsertResult.id ? "success" : "warning",
          text: messagesDocumentInsertResult.message,
        },
      ]);

      // Medya verileri

      const mediaDocuments: Omit<CarListingMediaModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        images: dataItem.images,
        approvedImages: dataItem.approvedImages,
        rejectedImages: dataItem.rejectedImages,
      };

      const mediaDocumentInsertResult = await db
        .collection<Omit<CarListingMediaModel, "_id">>(
          "car_listings_photo_datas"
        )
        .insert(mediaDocuments);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: mediaDocumentInsertResult.id ? "success" : "warning",
          text: mediaDocumentInsertResult.message,
        },
      ]);

      const equipmentsDocuments: Omit<CarListingEquipmentModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        selectedEquipmentFeatures: dataItem.selectedEquipmentFeatures,
      };

      const equipmentsDocumentInsertResult = await db
        .collection<Omit<CarListingEquipmentModel, "_id">>(
          "car_listings_equipments "
        )
        .insert(equipmentsDocuments);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: equipmentsDocumentInsertResult.id ? "success" : "warning",
          text: equipmentsDocumentInsertResult.message,
        },
      ]);
    } // end for dataArray

    return Promise.resolve(true);
  };

  const transformAppUser = async (
    dataArray: IAppUserDTO[]
  ): Promise<boolean> => {
    if (!dataArray) return Promise.resolve(false);

    if (appClient === null) {
      console.log("App client is not initialized");
      return Promise.resolve(false);
    }

    const adminDb = getDatabaseAdmin(appClient);
    const db = getDatabase(appClient);

    const createDatabaseResult = await adminDb.database(config.dbName).create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type:
          createDatabaseResult.statusCode >= 200 &&
          createDatabaseResult.statusCode < 300
            ? "success"
            : createDatabaseResult.statusCode >= 400 &&
              createDatabaseResult.statusCode < 500
            ? "warning"
            : "error",
        text: createDatabaseResult.message,
      },
    ]);

    const appUserCoreCollectionResult = await adminDb
      .collection<IAppUserCoreModel>("app_users")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserCoreCollectionResult.success ? "success" : "warning",
        text: appUserCoreCollectionResult.message,
      },
    ]);

    const appUserDetailsCollectionResult = await adminDb
      .collection<IAppUserDetailsModel>("app_user_details")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserDetailsCollectionResult.success ? "success" : "warning",
        text: appUserDetailsCollectionResult.message,
      },
    ]);

    const appUserCompanyCollectionResult = await adminDb
      .collection<IAppUserCompanyModel>("app_user_companies")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserCompanyCollectionResult.success ? "success" : "warning",
        text: appUserCompanyCollectionResult.message,
      },
    ]);
    const appUserSecurityCollectionResult = await adminDb
      .collection<IAppUserSecurityModel>("app_user_security")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserSecurityCollectionResult.success ? "success" : "warning",
        text: appUserSecurityCollectionResult.message,
      },
    ]);

    const appUserNotificationCollectionResult = await adminDb
      .collection<IAppUserNotificationModel>("app_user_notifications")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserNotificationCollectionResult.success
          ? "success"
          : "warning",
        text: appUserNotificationCollectionResult.message,
      },
    ]);

    const appUserFavoritesCollectionResult = await adminDb
      .collection<IAppUserFavoritesModel>("app_user_favorites")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserFavoritesCollectionResult.success ? "success" : "warning",
        text: appUserFavoritesCollectionResult.message,
      },
    ]);

    const appUserSavedSearchCollectionResult = await adminDb
      .collection<IAppUserSavedSearchModel>("app_user_saved_searches")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserSavedSearchCollectionResult.success
          ? "success"
          : "warning",
        text: appUserSavedSearchCollectionResult.message,
      },
    ]);

    const appUserTermsCollectionResult = await adminDb
      .collection<IAppUserTermsModel>("app_user_terms")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserTermsCollectionResult.success ? "success" : "warning",
        text: appUserTermsCollectionResult.message,
      },
    ]);

    const appUserBusinessProfileCollectionResult = await adminDb
      .collection<IAppUserBusinessProfileModel>("app_user_business_profiles")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserBusinessProfileCollectionResult.success
          ? "success"
          : "warning",
        text: appUserBusinessProfileCollectionResult.message,
      },
    ]);

    const appUserAccountCollectionResult = await adminDb
      .collection<IAppUserAccountModel>("app_user_accounts")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserAccountCollectionResult.success ? "success" : "warning",
        text: appUserAccountCollectionResult.message,
      },
    ]);

    const appUserPackageCollectionResult = await adminDb
      .collection<IAppUserPackageModel>("app_user_packages")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserPackageCollectionResult.success ? "success" : "warning",
        text: appUserPackageCollectionResult.message,
      },
    ]);

    const appUserSupportRequestCollectionResult = await adminDb
      .collection<IAppUserSupportRequestModel>("app_user_support_requests")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserSupportRequestCollectionResult.success
          ? "success"
          : "warning",
        text: appUserSupportRequestCollectionResult.message,
      },
    ]);

    const appUserAddressCollectionResult = await adminDb
      .collection<IAppUserAddressModel>("app_user_addresses")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserAddressCollectionResult.success ? "success" : "warning",
        text: appUserAddressCollectionResult.message,
      },
    ]);

    for (const dataItem of dataArray) {
      const coreDocument: Omit<IAppUserCoreModel, "_id"> = {
        uid: dataItem.uid,
        email: dataItem.email,
        name: dataItem.name,
        surname: dataItem.surname,
      };

      const coreDocumentInsertResult = await db
        .collection<Omit<IAppUserCoreModel, "_id">>("app_users")
        .insert(coreDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: coreDocumentInsertResult.id ? "success" : "warning",
          text: coreDocumentInsertResult.message,
        },
      ]);

      //IAppUserDetailsModel
      const detailsDocument: Omit<IAppUserDetailsModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        phone: dataItem.phone,
        avatarURL: dataItem?.avatarURL || undefined,
        coverPhotoURL: dataItem?.coverPhotoURL || undefined,
        avatarType: dataItem?.avatarType || undefined,

        userType: dataItem?.userType || UserType.Individual,

        username: dataItem.username,
        roles: dataItem.roles,
        gender: dataItem.gender,
        country: dataItem.country,
        language: dataItem.language,

        createdAt: dataItem.createdAt,
        updatedAt: dataItem.updatedAt,
      };

      const detailsDocumentInsertResult = await db
        .collection<Omit<IAppUserDetailsModel, "_id">>("app_user_details")
        .insert(detailsDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: detailsDocumentInsertResult.id ? "success" : "warning",
          text: detailsDocumentInsertResult.message,
        },
      ]);

      // IApppUserCompanyModel

      const companyDocument: Omit<IAppUserCompanyModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,

        companyName: dataItem.company?.companyName || "Bilinmeyen  Firma",
        companyType: dataItem.company?.companyType as
          | "Sole Proprietorship"
          | "Limited"
          | "Joint Stock Company",

        taxNumber: dataItem.company?.taxNumber || undefined,
        subdomain: dataItem.company?.subdomain || "-",

        businessType: dataItem.company?.businessType || undefined,

        schedule: dataItem.company?.schedule || undefined,

        address: dataItem.company?.companyAddress || undefined,

        nationalId: dataItem.company?.nationalId || undefined,

        corporateStatus: dataItem.company?.corporateStatus || undefined,

        dateOfBirth: (dataItem?.dateOfBirth as SimpleDate) || undefined,
        foundationDate: (dataItem?.foundationDate as SimpleDate) || undefined,

        createdAt: dataItem.createdAt,
        updatedAt: dataItem.updatedAt,
      };

      const companyDocumentInsertResult = await db
        .collection<Omit<IAppUserCompanyModel, "_id">>("app_user_companies")
        .insert(companyDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: companyDocumentInsertResult.id ? "success" : "warning",
          text: companyDocumentInsertResult.message,
        },
      ]);

      // IAppUserSecurityModel

      const securityDocument: Omit<IAppUserSecurityModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,

        twoFactorEnabled: dataItem.security?.twoFactorEnabled || false,
        twoFactorMethod: dataItem.security?.twoFactorMethod || null,

        accountVerification: dataItem.accountVerification || undefined,
      };

      const securityDocumentInsertResult = await db
        .collection<Omit<IAppUserSecurityModel, "_id">>("app_user_security")
        .insert(securityDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: securityDocumentInsertResult.id ? "success" : "warning",
          text: securityDocumentInsertResult.message,
        },
      ]);

      // IAppUserNotificationModel

      const notificationDocument: Omit<IAppUserNotificationModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,

        email: dataItem.notificationPreferences?.email || false,
        sms: dataItem.notificationPreferences?.sms || false,
        push: dataItem.notificationPreferences?.push || false,

        newsletter: dataItem.notificationPreferences?.newsletter || false,
        browser: dataItem.notificationPreferences?.browser || false,
        desktop: dataItem.notificationPreferences?.desktop || false,

        digest: dataItem.notificationPreferences?.digest || "daily",

        quietHours: dataItem.notificationPreferences?.quiet_hours || undefined,
      };

      const notificationDocumentInsertResult = await db

        .collection<Omit<IAppUserNotificationModel, "_id">>(
          "app_user_notifications"
        )
        .insert(notificationDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: notificationDocumentInsertResult.id ? "success" : "warning",
          text: notificationDocumentInsertResult.message,
        },
      ]);

      // IAppUserFavoritesModel

      const favoritesDocument: Omit<IAppUserFavoritesModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,

        listings: dataItem.favorites?.listings || [],

        createdAt: dataItem.createdAt,
        updatedAt: dataItem.updatedAt,
      };
      const favoritesDocumentInsertResult = await db
        .collection<Omit<IAppUserFavoritesModel, "_id">>("app_user_favorites")
        .insert(favoritesDocument);
      setInfoMessages((prev) => [
        ...prev,
        {
          type: favoritesDocumentInsertResult.id ? "success" : "warning",
          text: favoritesDocumentInsertResult.message,
        },
      ]);

      // IAppUserSavedSearchModel

      const savedSearchDocument: Omit<IAppUserSavedSearchModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        searches: [],

        createdAt: dataItem.createdAt,
        updatedAt: dataItem.updatedAt,
      };

      const savedSearchDocumentInsertResult = await db
        .collection<Omit<IAppUserSavedSearchModel, "_id">>(
          "app_user_saved_searches"
        )
        .insert(savedSearchDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: savedSearchDocumentInsertResult.id ? "success" : "warning",
          text: savedSearchDocumentInsertResult.message,
        },
      ]);

      //IAppUserTermsModel

      const termsDocument: Omit<IAppUserTermsModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        termsAccepted: dataItem.termsAccepted || undefined,
      };

      const termsDocumentInsertResult = await db
        .collection<Omit<IAppUserTermsModel, "_id">>("app_user_terms")
        .insert(termsDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: termsDocumentInsertResult.id ? "success" : "warning",
          text: termsDocumentInsertResult.message,
        },
      ]);

      // IAppUserBusinessProfileModel

      const businessProfileDocument: Omit<IAppUserBusinessProfileModel, "_id"> =
        {
          baseId: coreDocumentInsertResult.id,

          businesses: dataItem?.businesses || [],
        };

      const businessProfileDocumentInsertResult = await db

        .collection<Omit<IAppUserBusinessProfileModel, "_id">>(
          "app_user_business_profiles"
        )
        .insert(businessProfileDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: businessProfileDocumentInsertResult.id ? "success" : "warning",
          text: businessProfileDocumentInsertResult.message,
        },
      ]);

      // IAppUserAccountModel

      const accountDocument: Omit<IAppUserAccountModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        accounts: dataItem?.account ? [dataItem.account] : [],
      };

      const accountDocumentInsertResult = await db
        .collection<Omit<IAppUserAccountModel, "_id">>("app_user_accounts")
        .insert(accountDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: accountDocumentInsertResult.id ? "success" : "warning",
          text: accountDocumentInsertResult.message,
        },
      ]);

      //IAppUserPackageModel

      const packageDocument: Omit<IAppUserPackageModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        packages: [],
      };

      const packageDocumentInsertResult = await db
        .collection<Omit<IAppUserPackageModel, "_id">>("app_user_packages")
        .insert(packageDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: packageDocumentInsertResult.id ? "success" : "warning",
          text: packageDocumentInsertResult.message,
        },
      ]);

      // IAppUserSupportRequestModel

      const supportRequestDocument: Omit<IAppUserSupportRequestModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        supportRequests: dataItem?.supportRequests || [],
      };

      const supportRequestDocumentInsertResult = await db
        .collection<Omit<IAppUserSupportRequestModel, "_id">>(
          "app_user_support_requests"
        )
        .insert(supportRequestDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: supportRequestDocumentInsertResult.id ? "success" : "warning",
          text: supportRequestDocumentInsertResult.message,
        },
      ]);

      // IAppUserAddressModel

      const addressDocument: Omit<IAppUserAddressModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        addresses: dataItem?.addresses || [],
      };

      const addressDocumentInsertResult = await db
        .collection<Omit<IAppUserAddressModel, "_id">>("app_user_addresses")
        .insert(addressDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: addressDocumentInsertResult.id ? "success" : "warning",
          text: addressDocumentInsertResult.message,
        },
      ]);
    }

    return Promise.resolve(true);
  };

  const transformMediaDatas = async (
    dataArray: IMediaDTO[]
  ): Promise<boolean> => {
    if (!dataArray) return Promise.resolve(false);

    if (appClient === null) {
      console.log("App client is not initialized");
      return Promise.resolve(false);
    }

    const adminDb = getDatabaseAdmin(appClient);
    const db = getDatabase(appClient);

    const createDatabaseResult = await adminDb.database(config.dbName).create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type:
          createDatabaseResult.statusCode >= 200 &&
          createDatabaseResult.statusCode < 300
            ? "success"
            : createDatabaseResult.statusCode >= 400 &&
              createDatabaseResult.statusCode < 500
            ? "warning"
            : "error",
        text: createDatabaseResult.message,
      },
    ]);

    const appUserCoreCollectionResult = await adminDb
      .collection<IMediaCoreModel>("app_users")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserCoreCollectionResult.success ? "success" : "warning",
        text: appUserCoreCollectionResult.message,
      },
    ]);

    // IMediaDetailsModel

    const appUserDetailsCollectionResult = await adminDb
      .collection<IMediaDetailsModel>("media_details")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserDetailsCollectionResult.success ? "success" : "warning",
        text: appUserDetailsCollectionResult.message,
      },
    ]);

    // IMediaMetadataModel
    const appUserMetadataCollectionResult = await adminDb
      .collection<IMediaMetadataModel>("media_metadata")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserMetadataCollectionResult.success ? "success" : "warning",
        text: appUserMetadataCollectionResult.message,
      },
    ]);

    // IMediaTagModel

    const appUserTagCollectionResult = await adminDb
      .collection<IMediaTagModel>("media_tags")
      .create();

    setInfoMessages((prev) => [
      ...prev,
      {
        type: appUserTagCollectionResult.success ? "success" : "warning",
        text: appUserTagCollectionResult.message,
      },
    ]);

    for (const dataItem of dataArray) {
      const coreDocument: Omit<IMediaCoreModel, "_id"> = {
        id: dataItem.id,

        //
      };

      const coreDocumentInsertResult = await db
        .collection<Omit<IMediaCoreModel, "_id">>("media_core")
        .insert(coreDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: coreDocumentInsertResult.id ? "success" : "warning",
          text: coreDocumentInsertResult.message,
        },
      ]);

      //IMediaDetailsModel

      const detailsDocument: Omit<IMediaDetailsModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,

        //
      };
      const detailsDocumentInsertResult = await db
        .collection<Omit<IMediaDetailsModel, "_id">>("media_details")
        .insert(detailsDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: detailsDocumentInsertResult.id ? "success" : "warning",
          text: detailsDocumentInsertResult.message,
        },
      ]);

      // IMediaMetadataModel

      const metadataDocument: Omit<IMediaMetadataModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,

        //
      };

      const metadataDocumentInsertResult = await db

        .collection<Omit<IMediaMetadataModel, "_id">>("media_metadata")
        .insert(metadataDocument);

      setInfoMessages((prev) => [
        ...prev,
        {
          type: metadataDocumentInsertResult.id ? "success" : "warning",
          text: metadataDocumentInsertResult.message,
        },
      ]);

      // IMediaTagModel

      const tagDocument: Omit<IMediaTagModel, "_id"> = {
        baseId: coreDocumentInsertResult.id,
        tags:[]
      };

      const tagDocumentInsertResult = await db
        .collection<Omit<IMediaTagModel, "_id">>("media_tags")
        .insert(tagDocument);
      setInfoMessages((prev) => [
        ...prev,
        {
          type: tagDocumentInsertResult.id ? "success" : "warning",
          text: tagDocumentInsertResult.message,
        },
      ]);
    }

    return Promise.resolve(true);
  };

  const handleBulkMapping = () => {
    console.log(" Bulk ID Mapping button clicked");
    console.log(" Config:", config);
    console.log(" Models:", loadedModels);
  };

  const handleClear = () => {
    console.log(" Clear button clicked");
    setJsonContent("");
    setFileName("");
    setSelectedModel("");
    setIsValidJson(null);
    setParsedData(null);
    setUseCustomIdMapping(false);
    setUpdatingModelId(null);
  };

  const getDataPreview = () => {
    if (!parsedData) return null;

    if (Array.isArray(parsedData)) {
      return `Array with ${parsedData.length} items`;
    } else if (typeof parsedData === "object") {
      const keys = Object.keys(parsedData);
      return `Object with ${keys.length} keys: ${keys.slice(0, 5).join(", ")}${
        keys.length > 5 ? "..." : ""
      }`;
    }
    return "Unknown data structure";
  };

  const handleUpdateModel = (id: string) => {
    console.log(" Update model clicked:", id);
    const modelToUpdate = loadedModels.find((item) => item.id === id);

    if (modelToUpdate) {
      setSelectedModel(modelToUpdate.modelType);
      setJsonContent(JSON.stringify(modelToUpdate.jsonData, null, 2));
      setParsedData(modelToUpdate.jsonData);
      setIsValidJson(true);
      setUseCustomIdMapping(modelToUpdate.idMapping.enabled);
      setUpdatingModelId(id);

      console.log(" Model loaded for update:", modelToUpdate);

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleImportAll = async () => {
    console.log("Import All button clicked");
    console.log("Config:", config);
    console.log("Database:", config.dbName);
    console.log("Models to import:", loadedModels);

    setMongoDbStatus("busy");
    setIsImporting(true);
    setImportProgress(0);

    const results: string[] = [];
    const total = loadedModels.length;

    const totalRecords = loadedModels.reduce(
      (sum, item) => sum + (item.jsonData?.length || 0),
      0
    );

    for (let i = 0; i < total; i++) {
      const item = loadedModels[i];
      const { success } = await convertAndUploadModel(item);

      if (!success) results.push(`✗ ${item.modelType}: İçe aktarma başarısız`);

      results.push(
        `✓ ${item.modelType}: ${item.recordCount} kayıt ${
          item.idMapping.enabled ? `(ID Mapping: ${item.idMapping.field})` : ""
        }`
      );

      // progress güncelle
      const progress = Math.round(((i + 1) / total) * 100);

      setImportProgress(progress);

      setImportProgress(100);
    }

    setImportResults(results);
    setShowResults(true);
    setIsImporting(false);

    setTimeout(() => {
      setMongoDbStatus("ready");
      setIsMappingEnabled(true);
      setImportProgress(0);
    }, 500);
  };

  const counts = infoMessages.reduce(
    (acc, msg) => {
      if (!msg.type) return acc;
      acc[msg.type]++;
      return acc;
    },
    { success: 0, error: 0, warning: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Firebase JSON Import
          </h1>
          <p className="text-slate-600">
            Firebase JSON dosyalarınızı MongoDB'ye aktarın
          </p>
        </div>

        {isConnected && connectionInfo && (
          <Card className="space-y-6 p-6">
            <Card className="border-green-200 shadow-lg bg-green-100 dark:bg-gray-800 dark:border-green-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Bağlantı Durumu
                </CardTitle>
                <CardDescription>
                  Aktif veritabanı bağlantı bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500 dark:text-gray-400">
                      Database Adı
                    </Label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {connectionInfo.dbName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500 dark:text-gray-400">
                      Ortam
                    </Label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {connectionInfo.environment}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500 dark:text-gray-400">
                      Durum
                    </Label>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5" />
                      {connectionInfo.status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card
                className={`${
                  mongoServerStatus === "connected"
                    ? "border-green-200 bg-green-100 dark:bg-green-900/30"
                    : "border-slate-200 bg-slate-50 dark:bg-gray-700/30"
                }`}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        mongoServerStatus === "connected"
                          ? "bg-green-500/80 animate-pulse"
                          : "bg-slate-400/80"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                        MongoDB Server
                      </p>
                      <p className="text-xs text-slate-600 dark:text-gray-400">
                        {mongoServerStatus === "connected"
                          ? "Bağlantı Aktif"
                          : "Bağlantı Bekleniyor"}
                      </p>
                    </div>
                  </div>
                  {mongoServerStatus === "connected" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-slate-400 dark:text-gray-400" />
                  )}
                </CardContent>
              </Card>

              <Card
                className={`${
                  mongoDbStatus === "ready"
                    ? "border-green-200 bg-green-100 dark:bg-green-900/30"
                    : mongoDbStatus === "busy"
                    ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20"
                    : "border-slate-200 bg-slate-50 dark:bg-gray-700/30"
                }`}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        mongoDbStatus === "ready"
                          ? "bg-green-500"
                          : mongoDbStatus === "busy"
                          ? "bg-amber-500/80 animate-pulse"
                          : "bg-slate-400/80"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                        MongoDB Database
                      </p>
                      <p className="text-xs text-slate-600 dark:text-gray-400">
                        {mongoDbStatus === "ready"
                          ? `Hazır (${config.dbName || "N/A"})`
                          : mongoDbStatus === "busy"
                          ? "İşlem Yapılıyor..."
                          : "Yapılandırma Bekleniyor"}
                      </p>
                    </div>
                  </div>
                  <Database
                    className={`h-5 w-5 ${
                      mongoDbStatus === "ready"
                        ? "text-green-600"
                        : mongoDbStatus === "busy"
                        ? "text-amber-600"
                        : mongoDbStatus === "info"
                        ? "text-blue-600"
                        : "text-slate-400 dark:text-gray-400"
                    }`}
                  />
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => {
                setIsConfigValid(false);
                setIsConnected(false);
                setConnectionInfo(null);
              }}
              disabled={isTestingConnection}
              variant="outline"
              className="w-full border-green-300 hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-900/20 bg-transparent transition-colors duration-200"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yenileniyor...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Bağlantıyı Yenile
                </>
              )}
            </Button>
          </Card>
        )}

        {infoMessages.length > 0 && (
          <>
            <Card className="shadow-sm rounded-md border p-4 ">
              <CardHeader>
                <CardTitle>Özet Mesajlar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between space-x-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>{counts.success} Başarılı</span>
                </div>
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span>{counts.error} Hatalı</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{counts.warning} Uyarı</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto border rounded p-2 bg-slate-50">
          {infoMessages.length > 0 &&
            infoMessages.map((msg, index) => (
              <Alert
                key={index}
                variant={
                  msg.type === "success"
                    ? "default"
                    : msg.type === "error"
                    ? "destructive"
                    : "warning"
                }
              >
                <div className="flex justify-between items-center">
                  <AlertDescription>{msg.text}</AlertDescription>
                  <button
                    className="ml-2 text-sm text-slate-500 hover:text-slate-800"
                    onClick={() =>
                      setInfoMessages((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    ✕
                  </button>
                </div>
              </Alert>
            ))}
        </div>

        {showResults && importResults.length > 0 && (
          <Card className="border-green-200 shadow-lg bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Import Tamamlandı
              </CardTitle>
              <CardDescription className="text-green-700">
                Yükleme sonrası bilgiler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {importResults.map((result, index) => (
                <div
                  key={index}
                  className="text-sm text-green-800 font-mono bg-white rounded p-2"
                >
                  {result}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setImportResults([]);
                  setLoadedModels([]);
                  setIsMappingEnabled(false);
                }}
                className="w-full mt-4"
              >
                Yeni Import Başlat
              </Button>
            </CardContent>
          </Card>
        )}

        {!isConfigValid ? (
          <>
            <Card className="border-blue-200 shadow-lg bg-blue-50 dark:bg-gray-800 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  API Konfigürasyonu
                </CardTitle>
                <CardDescription>
                  MAIN_APP API bağlantı ayarları
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Ortam Seçimi */}
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  <Label htmlFor="env">Sunucu Ortamı</Label>
                  <Select
                    value={currentEnv}
                    onValueChange={(value) =>
                      setCurrentEnv(value as keyof typeof envConfig)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ortam Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(envConfig).map((env) => (
                        <SelectItem key={env} value={env}>
                          {env}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Server & API Key */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="serverBaseUrl">Server Base URL *</Label>
                    <Input
                      id="serverBaseUrl"
                      value={config.serverBaseUrl}
                      onChange={(e) =>
                        handleConfigChange("serverBaseUrl", e.target.value)
                      }
                      readOnly
                      className="bg-blue-50 dark:bg-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key *</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={config.apiKey}
                      onChange={(e) =>
                        handleConfigChange("apiKey", e.target.value)
                      }
                      readOnly
                      className="bg-blue-50 dark:bg-gray-700"
                    />
                  </div>
                </div>

                {/* Database Seçimi */}
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  <Label htmlFor="databaseName">Database Name *</Label>
                  <Select
                    value={config.dbName}
                    onValueChange={(value: string) =>
                      handleConfigChange("dbName", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {config.dbName || "Veritabanı adını seçin veya yazın"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Ara veya yeni ekle..."
                          value={config.dbName}
                          onChange={(e) =>
                            handleConfigChange("dbName", e.target.value)
                          }
                          className="px-2 py-1 mb-2 border rounded w-full"
                        />
                        <div className="max-h-40 overflow-y-auto">
                          {databases
                            .filter((db) => db.database)
                            .map((db) => (
                              <SelectItem key={db.database} value={db.database}>
                                {db.database}
                              </SelectItem>
                            ))}
                          {config.dbName &&
                            !databases.some(
                              (db) => db.database === config.dbName
                            ) && (
                              <SelectItem value={config.dbName}>
                                Yeni ekle: {config.dbName}
                              </SelectItem>
                            )}
                        </div>
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* API Version */}
                <div className="space-y-2 w-full max-w-sm">
                  <Label htmlFor="apiVersion">API Version *</Label>
                  <Input
                    id="apiVersion"
                    value={config.apiVersion}
                    onChange={(e) =>
                      handleConfigChange("apiVersion", e.target.value)
                    }
                    readOnly
                    className="bg-blue-50 dark:bg-gray-700"
                  />
                </div>

                {/* Bağlantı Test Butonu */}
                <Button
                  onClick={handleTestConnection}
                  disabled={
                    !config.apiKey ||
                    !config.serverBaseUrl ||
                    !config.dbName ||
                    isTestingConnection
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Bağlantı Test Ediliyor...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Bağlantıyı Test Et
                    </>
                  )}
                </Button>

                {/* Başarılı Bağlantı Alert */}
                {isConfigValid && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      ✓ Bağlantı başarılı! Database:{" "}
                      <strong>{config.dbName}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Upload Section */}

              <Card className="border-slate-200 shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    {updatingModelId
                      ? "JSON Dosyası Güncelle"
                      : "JSON Dosyası Yükle"}
                  </CardTitle>
                  <CardDescription>
                    {updatingModelId
                      ? "Seçili modelin JSON içeriğini güncelleyin"
                      : "Firebase export JSON dosyanızı yükleyin veya yapıştırın"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {updatingModelId && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Model güncelleme modundasınız. Değişiklikleri kaydetmek
                        için "Model Güncelle" butonuna basın.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="file-upload"
                      className="text-sm font-medium"
                    >
                      Dosya Seç
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                        disabled={!isConfigValid}
                      />
                      {fileName && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <FileJson className="h-4 w-4" />
                          <span className="truncate max-w-[150px]">
                            {fileName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* JSON Text Area */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="json-content"
                      className="text-sm font-medium"
                    >
                      veya JSON İçeriğini Yapıştırın
                    </Label>
                    <Textarea
                      id="json-content"
                      placeholder='{"users": [...], "posts": [...]}'
                      value={jsonContent}
                      onChange={(e) => handleJsonTextChange(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                      disabled={!isConfigValid}
                    />
                  </div>

                  {/* Validation Status */}
                  {isValidJson !== null && (
                    <Alert variant={isValidJson ? "default" : "destructive"}>
                      {isValidJson ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>
                        {isValidJson
                          ? `✓ Geçerli JSON formatı - ${getDataPreview()}`
                          : "✗ Geçersiz JSON formatı. Lütfen kontrol edin."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-sm font-medium">
                      Model Tipi *
                    </Label>
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={!isConfigValid}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Model seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SELECT_USERS}>
                          {SELECT_USERS}
                        </SelectItem>
                        <SelectItem value={SELECT_CARLISTING}>
                          {SELECT_CARLISTING}
                        </SelectItem>
                        <SelectItem value={SELECT_MEDIAS}>
                          {SELECT_MEDIAS}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      Önemli modeller: users, carlisting, medias
                    </p>
                  </div>

                  {/* ID Mapping Toggle Section */}
                  <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label
                          htmlFor="id-mapping"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Info className="h-4 w-4 text-blue-600" />
                          ID Mapping Ayarı
                        </Label>
                        <p className="text-xs text-slate-600">
                          Model'e özel ID mapping'i aktif et
                        </p>
                      </div>
                      <Switch
                        id="id-mapping"
                        checked={useCustomIdMapping}
                        onCheckedChange={setUseCustomIdMapping}
                        disabled={!isConfigValid}
                      />
                    </div>

                    {useCustomIdMapping &&
                      selectedModel &&
                      getIdMappingInfo() && (
                        <Alert
                          className={
                            getIdMappingInfo()?.type === "primary"
                              ? "bg-green-50 border-green-200"
                              : "bg-amber-50 border-amber-200"
                          }
                        >
                          <Info
                            className={`h-4 w-4 ${
                              getIdMappingInfo()?.type === "primary"
                                ? "text-green-600"
                                : "text-amber-600"
                            }`}
                          />
                          <AlertDescription
                            className={`text-xs ${
                              getIdMappingInfo()?.type === "primary"
                                ? "text-green-800"
                                : "text-amber-800"
                            }`}
                          >
                            <div className="space-y-1">
                              <p className="font-semibold">
                                {selectedModel} →{" "}
                                <code className="bg-white px-1.5 py-0.5 rounded">
                                  {getIdMappingInfo()?.field}
                                </code>
                              </p>
                              <p>{getIdMappingInfo()?.description}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>

                  {/* Data Preview */}
                  {parsedData && (
                    <div className="rounded-lg bg-slate-50 p-4 space-y-2">
                      <h4 className="text-sm font-semibold text-slate-700">
                        Veri Önizleme
                      </h4>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium">Tip:</span>{" "}
                          {Array.isArray(parsedData) ? "Array" : "Object"}
                        </p>
                        {Array.isArray(parsedData) && (
                          <p>
                            <span className="font-medium">Kayıt Sayısı:</span>{" "}
                            {parsedData.length}
                          </p>
                        )}
                      </div>
                      <pre className="mt-2 max-h-[150px] overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
                        {JSON.stringify(parsedData, null, 2).slice(0, 300)}
                        {JSON.stringify(parsedData, null, 2).length > 300 &&
                          "\n..."}
                      </pre>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddModel}
                      disabled={
                        !isValidJson || !isConfigValid || !selectedModel
                      }
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      {updatingModelId ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Model Güncelle
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Model Ekle
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClear}
                      disabled={!jsonContent}
                    >
                      Temizle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Kuyruktaki Modeller
                  </CardTitle>
                  <CardDescription>
                    {loadedModels.length} model yüklendi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadedModels.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      <Database className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Henüz model yüklenmedi</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {loadedModels.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-2 rounded-lg border border-green-200 bg-green-50 p-3"
                        >
                          <div className="flex-1 space-y-1">
                            <p className="font-semibold text-sm text-slate-900">
                              {item.modelType}
                            </p>
                            <p className="text-xs text-slate-600">
                              {item.recordCount} kayıt
                            </p>
                            {item.idMapping.enabled && (
                              <p className="text-xs text-green-600">
                                ✓ ID Mapping: {item.idMapping.field}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateModel(item.id)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Güncelle"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromQueue(item.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {loadedModels.length > 0 && (
                    <>
                      <Button
                        onClick={handleBulkMapping}
                        disabled={!isMappingEnabled}
                        variant="outline"
                        className="w-full bg-transparent"
                        size="lg"
                      >
                        <Database className="mr-2 h-4 w-4" />
                        Toplu ID Mapping
                      </Button>

                      <Button
                        onClick={handleImportAll}
                        disabled={!isConfigValid || isImporting}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        size="lg"
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Import Ediliyor... {importProgress}%
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Tümünü Import Et
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowResults(false);
                          setImportResults([]);
                          setLoadedModels([]);
                          setIsMappingEnabled(false);
                          setIsValidJson(null);
                          setIsConfigValid(false);
                        }}
                        className="w-full mt-4"
                      >
                        Yeni Import Başlat
                      </Button>

                      {isImporting && (
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                              style={{ width: `${importProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-center text-slate-600">
                            {importProgress}% tamamlandı
                          </p>
                        </div>
                      )}

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {loadedModels.length} model {config.dbName}{" "}
                          database'ine aktarılacak
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
