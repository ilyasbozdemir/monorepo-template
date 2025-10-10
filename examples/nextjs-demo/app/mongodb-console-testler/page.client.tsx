"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  Database,
  Layers,
  FileText,
  Plus,
  Grid,
  Edit,
  Trash2,
  List,
} from "lucide-react";

import {
  isStaging,
  isProduction,
  AppApiClientConfig,
  isDevelopment,
} from "@monorepo/core";

import { AppApiClient, getDatabase, getDatabaseAdmin } from "@monorepo/app";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const serverBaseUrl = "http://localhost:58837";

const apiKey = isStaging
  ? process.env.MONGO_APIKEY_STAGING!
  : process.env.MONGO_APIKEY_DEVELOPMENT!;

const dbName = isStaging ? "staging-mainappdb" : "mainappdb";

const gpConfig: AppApiClientConfig = {
  apiKey,
  serverBaseUrl,
  dbName,
};

interface DatabaseSource {
  id: string;
  name: string;
  type: "MongoDB" | "PostgreSQL" | "MySQL";
  url: string;
  active: boolean;
  disabled: boolean;
}

interface Document {
  _id: string;
  [key: string]: any;
}

const mockDatabases = ["db1", "db2", "db3"]; // Şu anlık mock
const mockCollections = ["c1", "c2", "c3"]; // Şu anlık mock

/*
  Şu anda dbName gibi parametreler fonksiyonlara geçiyor, ancak ileride refactor ile kaldırılacaktır.
  Config dosyasında hangi veritabanına bağlanılacağı zaten tanımlı.
  Bu yaklaşım, güvenlik açısından önemlidir: sadece config üzerinden belirlenen veritabanı ile işlem yapılacaktır.
*/

export default function PageClient() {
  const { toast } = useToast();

  const [databases, setDatabases] = useState<DatabaseSource[]>([
    {
      id: "1",
      name: "Production DB",
      type: "MongoDB",
      url: "https://api.ilyasbozdemir.dev",
      active: false,
      disabled: true,
    },
    {
      id: "2",
      name: "Staging DB",
      type: "MongoDB",
      url: "https://api.ilyasbozdemir.dev",
      active: false,
      disabled: isStaging,
    },
    {
      id: "3",
      name: "Test DB",
      type: "MongoDB",
      url: "http://localhost:58837",
      active: false,
      disabled: isDevelopment,
    },
  ]);

  const [documents, setDocuments] = useState<Document[]>([]);

  const [selectedDatabase, setSelectedDatabase] = useState(mockDatabases[0]);
  const [collectionName, setCollectionName] = useState("");
  const [queryText, setQueryText] = useState("");
  const [newDocumentData, setNewDocumentData] = useState("");

  const [activeTab, setActiveTab] = useState<
    "db" | "collection" | "Belge" | "query" | "raw"
  >("db");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);

  const [newDatabaseName, setNewDatabaseName] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);

  const [search, setSearch] = useState("");
  const filteredDatabases = mockDatabases.filter((db) =>
    db.toLowerCase().includes(search.toLowerCase()),
  );

  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    "",
  );
  const [searchCollection, setSearchCollection] = useState("");
  const filteredCollections = mockCollections.filter((c) =>
    c.toLowerCase().includes(searchCollection.toLowerCase()),
  );

  const switchDatabase = (databaseId: string) => {
    setDatabases((prev) =>
      prev.map((db) => ({ ...db, active: db.id === databaseId })),
    );
    setSelectedDatabase(databaseId);
    setSelectedCollection(null);
    setDocuments([]);

    const selectedDb = databases.find((db) => db.id === databaseId);
    toast({
      title: "Database Değiştirildi",
      description: `${selectedDb?.name} aktif hale getirildi`,
    });
  };

  const handleCreateDatabase = async (dbName: string) => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);

      const adminDb = getDatabaseAdmin(app);

      const created = adminDb.database(newDatabaseName).create();

      setLoading(false);

      setResult([{ created }]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      //
    }
  };

  const handleDeleteDatabase = async (dbName: string) => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);

      const adminDb = getDatabaseAdmin(app);

      const deleted = adminDb.database(newDatabaseName).delete();

      setLoading(false);

      setResult([{ deleted }]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      //
    }
  };

  const handleCreateCollection = async (
    dbName: string,
    collectionName: string,
  ) => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);

      const adminDb = getDatabaseAdmin(app);

      const newCollectionResult = adminDb
        .collection<any>(collectionName)
        .create();

      setLoading(false);

      setResult([{ newCollectionResult }]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      //
    }
  };

  const handleDeleteCollection = async (
    dbName: string,
    collectionName: string,
  ) => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);

      const adminDb = getDatabaseAdmin(app);

      const deleted = adminDb.collection(collectionName).delete();

      setLoading(false);

      setResult([{ deleted }]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      //
    }
  };

  const handleInsertDocument = async () => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);

      const db = getDatabase(app);

      const carlistingsCollection = db.collection<any>("car_listings");
      const inserted = await carlistingsCollection.insert({
        title: "Test ilanı",
        price: { amount: 120000, currency: "USD" },
        year: 2024,
      });

      setLoading(false);

      setResult([{ inserted }]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      //
    }
  };

  const handleInsertManyDocuments = async () => {
    setLoading(true);
    try {
      const app = new AppApiClient(gpConfig);

      const db = getDatabase(app);

      const carlistingsCollection = db.collection<any>("car_listings");

      const result = await carlistingsCollection.insertMany([
        {
          title: "İlan 1",
          price: { amount: 100000, currency: "USD" },
          year: 2022,
        },
        {
          title: "İlan 2",
          price: { amount: 200000, currency: "USD" },
          year: 2023,
        },
      ]);
      setLoading(false);

      setResult([{ result }]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      //
    }
  };

  const handleUpdateDocument = async () => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);

      const db = getDatabase(app);

      const carlistingsCollection = db.collection<any>("car_listings");
      const inserted: any = await carlistingsCollection.insert({
        title: "Test ilanı",
        price: { amount: 120000, currency: "USD" },
        year: 2024,
      });

      const modifiedCount: number | any = await carlistingsCollection.update(
        inserted?.id,
        {
          price: { amount: 125000 },
          status: "active",
        },
      );

      setLoading(false);
      setResult([
        { type: "inserted", data: inserted },
        {
          type: "updated",
          data: {
            modifiedCount,
          },
        },
      ]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      //
    }
  };

  const handleDeleteDocument = async () => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);

      const db = getDatabase(app);

      const carlistingsCollection = db.collection<any>("car_listings");
      const inserted: any = await carlistingsCollection.insert({
        title: "Test ilanı",
        price: { amount: 120000, currency: "USD" },
        year: 2024,
      });

      const deletedCount: number | any = await carlistingsCollection.delete(
        inserted?.id,
      );

      setLoading(false);
      setResult([
        { type: "inserted", data: inserted },
        {
          type: "deleted",
          data: {
            deletedCount,
          },
        },
      ]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      //
    }
  };

  const handleListDocuments = async () => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);

      const db = getDatabase(app);

      const carlistingsCollection = db.collection<any>("car_listings");
      const result = await carlistingsCollection.getAll(1, 20);

      setLoading(false);

      setResult([{ result }]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    }
  };

  const handleTestQuery = async () => {
    try {
      setIsProcessing(true);

      const app = new AppApiClient(gpConfig);

      const db = getDatabase(app);

      const carlistingsCollection = db.collection<any>("car_listings");

      const pipeline = JSON.parse(queryText);

      const result = await carlistingsCollection.aggregate(pipeline);

      setIsProcessing(false);

      setResult([{ result }]);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGetDocumentById = async (id: string) => {
    try {
      setLoading(true);

      const app = new AppApiClient(gpConfig);
      const db = getDatabase(app);
      const carlistingsCollection = db.collection<any>("car_listings");

      const result = await carlistingsCollection.getById(id);

      setLoading(false);
      setResult({ result });
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
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
                  Koleksiyon ve belge yönetimi, DTO işlemleri
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <>
                <></>
              </>
            </div>
          </div>
        </div>
      </header>

      <Card className="mb-6 p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Veritabanı Kaynağı Seçimi
          </CardTitle>
          <CardDescription>
            Farklı veritabanları arasında geçiş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {databases.map((db) => (
              <div
                key={db.id}
                className={`p-4 rounded-lg border transition-all ${
                  db.disabled
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                    : db.active
                      ? "bg-primary/10 border-primary shadow-sm cursor-pointer"
                      : "hover:bg-muted border-border cursor-pointer"
                }`}
                onClick={() => !db.disabled && switchDatabase(db.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{db.name}</h4>
                  {db.active && <Badge className="bg-primary">Aktif</Badge>}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Tip:</span> {db.type}
                  </p>
                  <p className="font-mono text-xs truncate" title={db.url}>
                    {db.url}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        {(() => {
          const activeDb = databases.find((db) => db.active);
          if (!activeDb) return null;

          return (
            <div className="mt-6 p-3 rounded-lg border bg-muted/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">
                  {activeDb.name} Bağlantısı Aktif
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {activeDb.type} via {activeDb.url}
              </span>
            </div>
          );
        })()}
      </Card>

      <Card className="mb-6 p-6">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="db">Veritabanı</TabsTrigger>
            <TabsTrigger value="collection">Koleksiyon </TabsTrigger>
            <TabsTrigger value="document">Belge</TabsTrigger>
            <TabsTrigger value="query">Aggregate Sorgusu</TabsTrigger>
          </TabsList>

          {/* Database Tab */}
          <TabsContent value="db">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database /> Veritabanı İşlemleri
                </CardTitle>
                <CardDescription>
                  Veritabanı oluşturma ve silme işlemleri
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Veritabanı Seçimi / Autocomplete */}
                <div className="flex flex-col gap-1 w-full max-w-sm">
                  <Label htmlFor="databaseName">Veritabanı Adı</Label>
                  <Select
                    value={newDatabaseName}
                    onValueChange={setNewDatabaseName}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {newDatabaseName || "Veritabanı adını seçin veya yazın"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        placeholder="Ara veya yeni ekle..."
                        value={newDatabaseName}
                        onChange={(e) => setNewDatabaseName(e.target.value)}
                        className="px-2 py-1 mb-1 border rounded w-full"
                      />
                      {mockDatabases
                        .filter((db) =>
                          db
                            .toLowerCase()
                            .includes(newDatabaseName.toLowerCase()),
                        )
                        .map((db) => (
                          <SelectItem key={db} value={db}>
                            {db}
                          </SelectItem>
                        ))}
                      {newDatabaseName &&
                        !mockDatabases.includes(newDatabaseName) && (
                          <SelectItem value={newDatabaseName}>
                            Yeni ekle: {newDatabaseName}
                          </SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Butonlar */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleCreateDatabase(newDatabaseName)}
                    size="lg"
                    variant="default"
                    className="flex items-center gap-2"
                    disabled={!newDatabaseName}
                  >
                    <Database className="w-5 h-5" />
                    Veritabanı Oluştur
                  </Button>

                  <Button
                    onClick={() => handleDeleteDatabase(newDatabaseName)}
                    size="lg"
                    variant="destructive"
                    className="flex items-center gap-2"
                    disabled={!newDatabaseName}
                  >
                    <Trash2 className="w-5 h-5" />
                    Veritabanı Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collection Tab */}
          <TabsContent value="collection">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers /> Koleksiyon İşlemleri
                </CardTitle>
                <CardDescription>Koleksiyon oluşturma ve silme</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Veritabanı Seçimi */}
                <div className="flex flex-col gap-1 w-full max-w-sm">
                  <Label htmlFor="selectDatabase">Veritabanı Seç</Label>
                  <Select
                    value={selectedDatabase}
                    onValueChange={setSelectedDatabase}
                  >
                    <SelectTrigger>
                      <SelectValue>{selectedDatabase}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        placeholder="Ara veya yeni ekle..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-2 py-1 mb-1 border rounded w-full"
                      />
                      {filteredDatabases.length
                        ? filteredDatabases.map((db) => (
                            <SelectItem key={db} value={db}>
                              {db}
                            </SelectItem>
                          ))
                        : search && (
                            <SelectItem value={search}>
                              Yeni ekle: {search}
                            </SelectItem>
                          )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Koleksiyon Adı */}
                <div className="flex flex-col gap-1 w-full max-w-sm">
                  <Label htmlFor="collectionName">Koleksiyon Adı</Label>
                  <Input
                    id="collectionName"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="Koleksiyon adını girin"
                  />
                </div>

                {/* Butonlar */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() =>
                      handleCreateCollection(selectedDatabase, collectionName)
                    }
                    size="lg"
                    variant="default"
                    className="flex items-center gap-2"
                    disabled={!collectionName}
                  >
                    <Layers className="w-5 h-5" />
                    Koleksiyon Oluştur
                  </Button>

                  <Button
                    onClick={() =>
                      handleDeleteCollection(selectedDatabase, collectionName)
                    }
                    size="lg"
                    variant="destructive"
                    className="flex items-center gap-2"
                    disabled={!collectionName}
                  >
                    <Trash2 className="w-5 h-5" />
                    Koleksiyon Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Tab */}
          <TabsContent value="document">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText /> Belge İşlemleri
                </CardTitle>
                <CardDescription>
                  Belge ekleme, silme, güncelleme ve listeleme
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <div className="flex flex-col gap-1 w-full max-w-sm">
                  <div className="flex flex-col gap-1 w-full max-w-sm">
                    <Label htmlFor="databaseName">Veritabanı Adı</Label>
                    <Select
                      value={newDatabaseName}
                      onValueChange={setNewDatabaseName}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {newDatabaseName ||
                            "Veritabanı adını seçin veya yazın"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <Input
                          placeholder="Ara veya yeni ekle..."
                          value={newDatabaseName}
                          onChange={(e) => setNewDatabaseName(e.target.value)}
                          className="px-2 py-1 mb-1 border rounded w-full"
                        />
                        {mockDatabases
                          .filter((db) =>
                            db
                              .toLowerCase()
                              .includes(newDatabaseName.toLowerCase()),
                          )
                          .map((db) => (
                            <SelectItem key={db} value={db}>
                              {db}
                            </SelectItem>
                          ))}
                        {newDatabaseName &&
                          !mockDatabases.includes(newDatabaseName) && (
                            <SelectItem value={newDatabaseName}>
                              Yeni ekle: {newDatabaseName}
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1 w-full max-w-sm">
                    <Label htmlFor="databaseName">Koleksiyon Adı</Label>
                    <Select
                      value={selectedCollection}
                      onValueChange={setSelectedCollection}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {selectedCollection || "Koleksiyon seçin..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <Input
                          placeholder="Ara veya yeni ekle..."
                          value={searchCollection}
                          onChange={(e) => setSearchCollection(e.target.value)}
                          className="px-2 py-1 mb-1 border rounded w-full"
                        />
                        {filteredCollections.length
                          ? filteredCollections.map((col) => (
                              <SelectItem key={col} value={col}>
                                {col}
                              </SelectItem>
                            ))
                          : searchCollection && (
                              <SelectItem value={searchCollection}>
                                Yeni ekle: {searchCollection}
                              </SelectItem>
                            )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Textarea
                  id="documentData"
                  value={newDocumentData}
                  onChange={(e) => setNewDocumentData(e.target.value)}
                  placeholder='{"isim": "Ahmet Yılmaz", "email": "ahmet@example.com"}'
                  rows={6}
                  className="h-40 resize-none overflow-y-auto"
                />

                <div className="flex flex-wrap gap-3">
                  {/* Ekleme İşlemleri */}
                  <Button
                    onClick={handleInsertDocument}
                    size="lg"
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Belge Ekle
                  </Button>

                  <Button
                    onClick={handleInsertManyDocuments}
                    size="lg"
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <Grid className="w-5 h-5" />
                    Toplu Doküman Ekle
                  </Button>

                  {/* Güncelleme */}
                  <Button
                    onClick={handleUpdateDocument}
                    size="lg"
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Belge Güncelle
                  </Button>

                  {/* Silme */}
                  <Button
                    onClick={handleDeleteDocument}
                    size="lg"
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Belge Sil
                  </Button>

                  {/* Listeleme ve ID ile Getirme */}
                  <Button
                    onClick={handleListDocuments}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <List className="w-5 h-5" />
                    Belge Listele
                  </Button>

                  <Button
                    onClick={() =>
                      handleGetDocumentById("68da9b3c730f71e6178dfa14")
                    }
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Belge Getir (ID)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Query Tab */}
          <TabsContent value="query">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database /> Test Query
                </CardTitle>
                <CardDescription>
                  Aktif satış ilanları veya özel query
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Textarea */}
                <textarea
                  className="w-full border rounded p-2 text-sm resize-none h-32"
                  placeholder="Aggregate query yazın..."
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                />

                {/* Query Butonu */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleTestQuery}
                    size="lg"
                    disabled={isProcessing || !queryText.trim()}
                    className="flex items-center gap-2"
                  >
                    {isProcessing && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Query Çalıştır
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {Array.isArray(result) ? (
            result.map((r, i) => (
              <Card key={i} className="mb-2 p-4">
                <p>
                  <strong>{r.type ?? "result"}</strong>
                </p>
                <pre>{JSON.stringify(r.data ?? r.message ?? r, null, 2)}</pre>
              </Card>
            ))
          ) : (
            <Card className="mb-2 p-4">
              <p>
                <strong>result</strong>
              </p>
              <pre>
                {JSON.stringify(
                  result?.data ?? result?.message ?? result,
                  null,
                  2,
                )}
              </pre>
            </Card>
          )}
        </Tabs>
      </Card>
    </div>
  );
}
