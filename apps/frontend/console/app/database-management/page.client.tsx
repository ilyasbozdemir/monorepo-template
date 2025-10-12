"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Trash2,
  Plus,
  Edit,
  Database,
  FileText,
  RefreshCw,
  FileSearch,
  ChevronLeft,
  Wand2,
  Settings,
} from "lucide-react";

import {
  aggregateRunAction,
  createCollectionAction,
  createDatabaseAction,
  deleteCollectionAction,
  deleteDatabaseAction,
  deleteDocumentAction,
  getDatabaseCollectionDetailsAction,
  getDatabaseSummaryAction,
  getDocumentsAction,
  insertDocumentAction,
  updateDocumentAction,
} from "@/app/actions-with-app";

import { DatabaseDeleteResponse } from "@monorepo/apifront";

import { DatabaseSummary } from "@monorepo/core";
import ApiSetting from "./components/api-settings";

interface PageClientProps {
  //
}

interface DocsState {
  documents: Document[];
  total: number;
}

interface CollectionSummary {
  Name: string;
  DocumentCount: number;
  SizeMB: number;
  StorageMB: number;
}

interface DatabaseDetailsResponse {
  Database: string;
  CollectionCount: number;
  Collections: CollectionSummary[];
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

const PageClient: React.FC<PageClientProps> = ({}) => {
  const [databases, setDatabases] = useState<DatabaseSummary[]>([]);

  const [databaseDetails, setDatabaseDetails] = useState<{
    [dbName: string]: any;
  }>({});

  const [selectedDb, setSelectedDb] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  const [documents, setDocuments] = useState<DocsState>({
    documents: [],
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("databases");

  const [newDatabaseName, setNewDatabaseName] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newDocumentData, setNewDocumentData] = useState("");
  const [editingDocument, setEditingDocument] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [pipelineData, setPipelineData] = useState("");
  const [aggregateResult, setAggregateResult] = useState<any>(null);

  useEffect(() => {
    loadDatabases();
  }, []);

  useEffect(() => {
    if (databases.length > 0) {
      loadDatabaseDetails();
    }
  }, [databases]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadDatabases = async () => {
    try {
      setLoading(true);
      setError(null);

      const summary = await getDatabaseSummaryAction();

      setDatabases(summary ?? []);
    } catch (error) {
      console.error("Failed to load databases:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load databases",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDatabaseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      if (databases.length === 0) return;
      await Promise.all(
        databases.map(async (db) => {
          try {
            const summary = await getDatabaseCollectionDetailsAction(
              db.database,
            );

            setDatabaseDetails((prev) => ({
              ...prev,
              [db.database]: summary,
            }));
          } catch (error) {
            console.error(`Failed to load database ${db.database}:`, error);
          }
        }),
      );
    } catch (error) {
      console.error("Failed to load databases:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load databases",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAggregateRun = async (collectionName: string) => {
    const pipeline = JSON.parse(pipelineData);

    if (!collectionName) return;

    try {
      const result = await aggregateRunAction(
        selectedDb,
        collectionName,
        pipeline,
      );

      setAggregateResult(result);
    } catch (err) {
      console.error(err);
      setAggregateResult({ error: "Geçersiz JSON veya işlem hatası" });
    }
  };

  const loadDocuments = async (collectionName: string) => {
    try {
      setError(null);

      const docs: any = await getDocumentsAction(selectedDb, collectionName);

      setDocuments(docs.data ?? { documents: [], total: 0 });

      setSelectedCollection(collectionName);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load documents",
      );
    }
  };

  const handleViewDocuments = async (
    dbName: string,
    collectionName: string,
  ) => {
    setSelectedDb(dbName);
    await loadDocuments(collectionName);
    setActiveTab("documents");
  };

  const handleDeleteDatabase = async (dbName: string) => {
    try {
      setError(null);

      const result: DatabaseDeleteResponse = await deleteDatabaseAction(
        dbName,
        true,
      );

      console.log("dbName:", dbName);
      console.log("delete result:", result);

      loadDatabases();

      if (result.status) {
        setSuccess(result.message);
        if (result.deletedDatabase) {
          console.log("Deleted database:", result.deletedDatabase);
        }
        if (result.deletedCount !== undefined) {
          console.log("Deleted entries count:", result.deletedCount);
        }
      } else {
        setError(result.message || "Failed to delete database");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete database",
      );
    }
  };

  const handleCreateCollection = async (dbName: string) => {
    if (!newCollectionName.trim()) return;

    try {
      setError(null);

      const success = await createCollectionAction<any>(
        dbName,
        newCollectionName,
      );

      if (success) {
        setSuccess(`Collection '${newCollectionName}' created successfully`);
        setNewCollectionName("");
        loadDatabases();
      } else {
        setError("Failed to create collection");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create collection",
      );
    }
  };

  const handleDeleteCollection = async (
    dbName: string,
    collectionName: string,
  ) => {
    try {
      const data: any = await deleteCollectionAction(dbName, collectionName);

      if (data?.success) {
        setSuccess(`Collection '${collectionName}' deleted successfully`);
        loadDatabases();
        if (selectedCollection === collectionName) {
          setSelectedCollection("");
          setDocuments({ documents: [], total: 0 });
        }
      } else {
        setError("Failed to delete collection");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete collection",
      );
    }
  };

  const handleInsertDocument = async () => {
    if (!newDocumentData && !selectedCollection)
      console.warn("dbName ve collectionName boş!");
    else if (!newDocumentData) console.warn("dbName boş!");
    else if (!selectedCollection) console.warn("collectionName boş!");

    try {
      setError(null);
      const data = JSON.parse(newDocumentData);
      const success = await insertDocumentAction<any>(
        selectedDb,
        selectedCollection,
        data,
      );
      if (success) {
        setSuccess("Document inserted successfully");
        setNewDocumentData("");
        loadDocuments(selectedCollection);
      } else {
        setError("Failed to insert document");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to insert document",
      );
    }
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument || !editingId) return;

    try {
      setError(null);

      const updated = await updateDocumentAction(
        selectedDb,
        selectedCollection,
        editingId,
        editingDocument,
      );

      if (updated) {
        setSuccess("Document updated successfully");
        setEditingDocument(null);
        setEditingId(null);
        loadDocuments(selectedCollection);
      } else {
        setError("Failed to update document");
      }

      setSuccess("Document updated successfully");
      setEditingDocument(null);
      setEditingId(null);
      loadDocuments(selectedCollection);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update document",
      );
    }
  };

  const handleCreateDatabase = async () => {
    if (!newDatabaseName) return;

    const success = await createDatabaseAction(newDatabaseName);

    if (success) {
      setSuccess(`Database '${newDatabaseName}' created successfully`);
      setNewDatabaseName("");
      loadDatabases();
    } else {
      setError("Failed to create database");
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!id) return;

    try {
      const result = await deleteDocumentAction(
        selectedDb,
        selectedCollection,
        id,
      );

      if (result.deletedCount > 0) {
        setError(null);
        setSuccess("Document deleted successfully");
        loadDocuments(selectedCollection);
      } else {
        setError("Failed to delete document");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete document",
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading databases...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <header className="border-b border-border bg-card my-2">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  MongoDB Yönetim Paneli
                </h1>
                <p className="text-sm text-muted-foreground">
                  Koleksiyon, Koleksiyon ve belge yönetimi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={loadDatabases} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Veritabanı Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Veritabanı Oluştur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Label htmlFor="databaseName">Veritabanı Adı</Label>
                    <Input
                      id="databaseName"
                      value={newDatabaseName}
                      onChange={(e) => setNewDatabaseName(e.target.value)}
                      placeholder="Veritabanı adını girin"
                    />
                    <Button onClick={handleCreateDatabase}>Oluştur</Button>
                  </div>
                </DialogContent>
              </Dialog>
          
            </div>
          </div>
        </div>
      </header>

      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="databases">Veritabanları</TabsTrigger>
          <TabsTrigger value="documents" disabled={!selectedCollection}>
            Belgeler
          </TabsTrigger>
          <TabsTrigger value="document-detail" disabled={!selectedDocument}>
            Belge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="databases">
          <div className="space-y-4">
            <div
              className="grid gap-4"
              style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
            >
              {Array.isArray(databases) && databases.length > 0 ? (
                <>
                  {databases.map((db) => (
                    <Card key={db.database}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="flex items-center gap-2 min-w-0">
                              <Database className="h-5 w-5 shrink-0" />
                              <span
                                className="truncate text-sm sm:text-base font-medium"
                                title={db.database}
                              >
                                {db.database}
                              </span>
                            </CardTitle>
                            <CardDescription
                              className="truncate text-xs sm:text-sm text-muted-foreground"
                              title={`${db.collectionCount} koleksiyon`}
                            >
                              {db.collectionCount} koleksiyon
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-1" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Koleksiyon Oluştur</DialogTitle>
                                  <DialogDescription>
                                    {db.database} veritabanına yeni koleksiyon
                                    ekle
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="collectionName">
                                      Koleksiyon Adı
                                    </Label>
                                    <Input
                                      id="collectionName"
                                      value={newCollectionName}
                                      onChange={(e) =>
                                        setNewCollectionName(e.target.value)
                                      }
                                      placeholder="Koleksiyon adını girin"
                                    />
                                  </div>
                                  <Button
                                    onClick={() =>
                                      handleCreateCollection(db.database)
                                    }
                                  >
                                    Koleksiyon Oluştur
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Veritabanını Sil
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    "{db.database}" veritabanını silmek
                                    istediğine emin misin? Bu işlem geri
                                    alınamaz.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex justify-end gap-2 mt-4">
                                  <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() =>
                                      handleDeleteDatabase(db.database)
                                    }
                                  >
                                    Sil
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {db.collections &&
                            db.collections.length > 0 &&
                            db.collections.map((collection) => (
                              <div
                                key={collection.name}
                                className="flex justify-between items-center p-2 bg-muted rounded hover:bg-muted/80 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span
                                      className="font-medium cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDocuments(
                                          db.database,
                                          collection.name,
                                        );
                                      }}
                                    >
                                      {collection.name}
                                    </span>
                                  </div>
                                  <span
                                    className="truncate text-xs sm:text-sm text-muted-foreground"
                                    title={`${collection.documentCount} belge${
                                      collection.sizeMB
                                        ? ` • ${collection.sizeMB} MB`
                                        : ""
                                    }`}
                                  >
                                    {collection.documentCount} belge
                                    {collection.sizeMB &&
                                      ` • ${collection.sizeMB} MB`}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Wand2 className="h-4 w-4 mr-1" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Aggregate Run</DialogTitle>
                                        <DialogDescription>
                                          {selectedCollection
                                            ? `${selectedCollection} koleksiyonunda pipeline çalıştır`
                                            : "Bir koleksiyon seçilmedi"}
                                        </DialogDescription>
                                      </DialogHeader>

                                      <div className="space-y-4">
                                        <Label
                                          htmlFor="pipelineData"
                                          className="my-3"
                                        >
                                          Pipeline JSON
                                        </Label>
                                        <Textarea
                                          id="pipelineData"
                                          value={pipelineData}
                                          onChange={(e) =>
                                            setPipelineData(e.target.value)
                                          }
                                          placeholder='[{"$match": {"field": "value"}}]'
                                          rows={6}
                                          className="h-40 resize-none overflow-y-auto"
                                        />

                                        <Button
                                          onClick={() =>
                                            handleAggregateRun(collection.name)
                                          }
                                        >
                                          Çalıştır
                                        </Button>

                                        {aggregateResult && (
                                          <pre className="bg-muted p-2 rounded mt-4 overflow-auto text-sm">
                                            {JSON.stringify(
                                              aggregateResult,
                                              null,
                                              2,
                                            )}
                                          </pre>
                                        )}
                                      </div>
                                    </DialogContent>
                                  </Dialog>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-1" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Belge Ekle</DialogTitle>
                                        <DialogDescription>
                                          {selectedCollection
                                            ? `${selectedCollection} koleksiyonuna yeni belge ekle`
                                            : "Bir koleksiyon seçilmedi"}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <Label
                                            htmlFor="documentData"
                                            className="my-3"
                                          >
                                            Belge JSON
                                          </Label>
                                          <Textarea
                                            id="documentData"
                                            value={newDocumentData}
                                            onChange={(e) =>
                                              setNewDocumentData(e.target.value)
                                            }
                                            placeholder='{"isim": "Ahmet Yılmaz", "email": "ahmet@example.com"}'
                                            rows={6}
                                            className="h-40 resize-none overflow-y-auto"
                                          />
                                        </div>
                                        <Button
                                          onClick={() => {
                                            setSelectedCollection(
                                              collection.name,
                                            );
                                            handleInsertDocument();
                                          }}
                                        >
                                          Belge Ekle
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDocuments(
                                        db.database,
                                        collection.name,
                                      );
                                    }}
                                  >
                                    <FileSearch className="h-4 w-4 mr-1" />
                                  </Button>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          {" "}
                                          "{collection.name}" Koleksiyonunu Sil
                                          — "{db.database}" Veritabanı
                                        </DialogTitle>
                                        <DialogDescription>
                                          "{collection.name}" koleksiyonunu, "
                                          {db.database}" veritabanından silmek
                                          istediğine emin misin? Bu işlem geri
                                          alınamaz.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="flex justify-end gap-2 mt-4">
                                        <Button
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                        >
                                          Vazgeç
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCollection(
                                              db.database,
                                              collection.name,
                                            );
                                          }}
                                        >
                                          Sil
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <p className="text-gray-500 col-span-full">
                  Gösterilecek liste yok
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          {selectedCollection ? (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {selectedDb}.{selectedCollection} içindeki Belgeler (
                    {Array.isArray(documents) &&
                      documents.length > 0 &&
                      documents.length}
                    )
                  </h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Belge Ekle</DialogTitle>
                        <DialogDescription>
                          {selectedCollection
                            ? `${selectedCollection} koleksiyonuna yeni belge ekle`
                            : "Bir koleksiyon seçilmedi"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="documentData" className="my-3">
                            Belge JSON
                          </Label>
                          <Textarea
                            id="documentData"
                            value={newDocumentData}
                            onChange={(e) => setNewDocumentData(e.target.value)}
                            placeholder='{"isim": "Ahmet Yılmaz", "email": "ahmet@example.com"}'
                            rows={6}
                            className="h-40 resize-none overflow-y-auto"
                          />
                        </div>
                        <Button onClick={handleInsertDocument}>
                          Belge Ekle
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4 max-h-[750px] overflow-y-auto">
                  {Array.isArray(documents) &&
                    documents.map((doc) => (
                      <Card key={doc._id}>
                        <CardHeader
                          id={
                            typeof doc._id === "object"
                              ? JSON.stringify(doc._id)
                              : doc._id
                          }
                        >
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-mono">
                              #
                              {typeof doc._id === "object"
                                ? JSON.stringify(doc._id)
                                : doc._id}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setActiveTab("document-detail");
                                }}
                                variant="outline"
                              >
                                <FileSearch className="h-4 w-4 mr-1" />
                              </Button>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingId(doc._id);
                                      const { _id, ...body } = doc;
                                      setEditingDocument(body);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Belge Düzenle</DialogTitle>
                                    <DialogDescription>
                                      Belge verilerini değiştir
                                    </DialogDescription>
                                  </DialogHeader>
                                  {editingDocument && (
                                    <div className="space-y-4">
                                      <Textarea
                                        value={JSON.stringify(
                                          editingDocument,
                                          null,
                                          2,
                                        )}
                                        onChange={(e) => {
                                          try {
                                            setEditingDocument(
                                              JSON.parse(e.target.value),
                                            );
                                          } catch {
                                            // Geçersiz JSON ise state'i bozma
                                          }
                                        }}
                                        rows={10}
                                      />
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button>Belgeyi Güncelle</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Güncellemek istediğinize Emin
                                              misiniz?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Bu işlem geri alınamaz. Belge
                                              kalıcı olarak güncellenecek.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              İptal
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={handleUpdateDocument}
                                            >
                                              Onayla
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Silmek istediğinize emin misiniz?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bu işlem geri alınamaz. Belge kalıcı
                                      olarak veritabanından silinecek.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() =>
                                        handleDeleteDocument(doc._id)
                                      }
                                    >
                                      Onayla
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                            {JSON.stringify(
                              (() => {
                                const { _id, ...body } = doc;
                                return body;
                              })(),
                              null,
                              2,
                            )}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Gösterilecek belge seçilmedi
            </div>
          )}
        </TabsContent>

        <TabsContent value="document-detail">
          {selectedDocument ? (
            <div className="p-4 bg-muted rounded space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Belge Detayı</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("documents")}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
              </div>
              <pre className="bg-white p-2 rounded overflow-auto text-sm">
                {JSON.stringify(
                  { _id: selectedDocument._id, ...selectedDocument },
                  null,
                  2,
                )}
              </pre>
            </div>
          ) : (
            <div className="text-muted-foreground text-center">
              Gösterilecek belge seçilmedi
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageClient;
