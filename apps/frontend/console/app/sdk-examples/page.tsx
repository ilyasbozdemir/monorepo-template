"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Database, FileText, Code2, Play, CheckCircle2, XCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { DatabaseLayout } from "@/components/database/DatabaseLayout"

export default function SDKPage() {
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<"insert" | "update" | "delete" | "query" | "aggregate">("insert")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [customCode, setCustomCode] = useState("")

  const executeExample = async (exampleFn: () => Promise<any>) => {
    try {
      setLoading(true)
      setResult(null)
      const data = await exampleFn()
      setResult({ success: true, data })
      toast({
        title: "İşlem Başarılı",
        description: "SDK işlemi başarıyla tamamlandı",
      })
    } catch (error: any) {
      setResult({ success: false, error: error.message || error.toString() })
      toast({
        title: "Hata",
        description: error.message || "İşlem sırasında bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Example functions
  const insertExample = async () => {
    // Simulated SDK call
    return {
      insertedId: "68da9b3c730f71e6178dfa14",
      document: {
        title: "Test İlanı",
        price: { amount: 120000, currency: "USD" },
        year: 2024,
      },
    }
  }

  const insertManyExample = async () => {
    return {
      insertedIds: ["68da9b3c730f71e6178dfa15", "68da9b3c730f71e6178dfa16"],
      insertedCount: 2,
    }
  }

  const updateExample = async () => {
    return {
      modifiedCount: 1,
      matchedCount: 1,
    }
  }

  const deleteExample = async () => {
    return {
      deletedCount: 1,
    }
  }

  const queryExample = async () => {
    return {
      documents: [
        {
          _id: "68da9b3c730f71e6178dfa14",
          title: "Test İlanı",
          price: { amount: 120000, currency: "USD" },
          year: 2024,
        },
      ],
      total: 1,
    }
  }

  const aggregateExample = async () => {
    return {
      results: [
        {
          _id: "USD",
          totalListings: 150,
          avgPrice: 125000,
        },
      ],
    }
  }

  const codeExamples = {
    insert: `import { AppApiClient, getDatabase } from "@monorepo/app";

const gpConfig = {
  apiKey: process.env.MONGO_APIKEY!,
  serverBaseUrl: "http://localhost:58837",
  dbName: "mainappdb",
};

const app = new AppApiClient(gpConfig);
const db = getDatabase(app);

const carlistingsCollection = db.collection<any>("car_listings");

const inserted = await carlistingsCollection.insert({
  title: "Test İlanı",
  price: { amount: 120000, currency: "USD" },
  year: 2024,
});

console.log("Inserted ID:", inserted.id);`,

    insertMany: `import { AppApiClient, getDatabase } from "@monorepo/app";

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

console.log("Inserted Count:", result.insertedCount);`,

    update: `import { AppApiClient, getDatabase } from "@monorepo/app";

const app = new AppApiClient(gpConfig);
const db = getDatabase(app);

const carlistingsCollection = db.collection<any>("car_listings");

const modifiedCount = await carlistingsCollection.update(
  "68da9b3c730f71e6178dfa14",
  {
    price: { amount: 125000 },
    status: "active",
  }
);

console.log("Modified Count:", modifiedCount);`,

    delete: `import { AppApiClient, getDatabase } from "@monorepo/app";

const app = new AppApiClient(gpConfig);
const db = getDatabase(app);

const carlistingsCollection = db.collection<any>("car_listings");

const deletedCount = await carlistingsCollection.delete(
  "68da9b3c730f71e6178dfa14"
);

console.log("Deleted Count:", deletedCount);`,

    query: `import { AppApiClient, getDatabase } from "@monorepo/app";

const app = new AppApiClient(gpConfig);
const db = getDatabase(app);

const carlistingsCollection = db.collection<any>("car_listings");

// Sayfalama ile tüm belgeleri getir
const result = await carlistingsCollection.getAll(1, 20);

console.log("Documents:", result.documents);
console.log("Total:", result.total);

// ID ile belge getir
const document = await carlistingsCollection.getById(
  "68da9b3c730f71e6178dfa14"
);

console.log("Document:", document);`,

    aggregate: `import { AppApiClient, getDatabase } from "@monorepo/app";

const app = new AppApiClient(gpConfig);
const db = getDatabase(app);

const carlistingsCollection = db.collection<any>("car_listings");

const pipeline = [
  {
    $match: { status: "active" }
  },
  {
    $group: {
      _id: "$price.currency",
      totalListings: { $sum: 1 },
      avgPrice: { $avg: "$price.amount" }
    }
  },
  {
    $sort: { totalListings: -1 }
  }
];

const result = await carlistingsCollection.aggregate(pipeline);

console.log("Aggregate Results:", result);`,
  }


  return (

    <DatabaseLayout>
      <div className="container max-w-6xl mx-auto py-6">
      <header className="border-b bg-card my-2 rounded-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">SDK Kullanım Örnekleri</h1>
                <p className="text-sm text-muted-foreground">
                  MongoDB işlemleri için SDK kullanım örnekleri ve kod parçacıkları
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              @monorepo/app
            </Badge>
          </div>
        </div>
      </header>

      <Card className="my-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Temel Konfigürasyon
          </CardTitle>
          <CardDescription>SDK'yı kullanmaya başlamak için gerekli konfigürasyon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
            <pre className="overflow-x-auto">
              {`import { AppApiClient, getDatabase, getDatabaseAdmin } from "@monorepo/app";
import { AppApiClientConfig } from "@monorepo/core";

const gpConfig: AppApiClientConfig = {
  apiKey: process.env.MONGO_APIKEY!,
  serverBaseUrl: "http://localhost:58837",
  dbName: "mainappdb",
};

const app = new AppApiClient(gpConfig);
const db = getDatabase(app);
const adminDb = getDatabaseAdmin(app);`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            <TabsTrigger value="insert">Insert</TabsTrigger>
            <TabsTrigger value="update">Update</TabsTrigger>
            <TabsTrigger value="delete">Delete</TabsTrigger>
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="aggregate">Aggregate</TabsTrigger>
          </TabsList>

          {/* Insert Tab */}
          <TabsContent value="insert">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Belge Ekleme İşlemleri
                </CardTitle>
                <CardDescription>Tek veya çoklu belge ekleme örnekleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Single Insert */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Tek Belge Ekleme (insert)</h4>
                    <Button
                      onClick={() => executeExample(insertExample)}
                      disabled={loading}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Çalıştır
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{codeExamples.insert}</pre>
                  </div>
                </div>

                {/* Insert Many */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Çoklu Belge Ekleme (insertMany)</h4>
                    <Button
                      onClick={() => executeExample(insertManyExample)}
                      disabled={loading}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Çalıştır
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{codeExamples.insertMany}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Update Tab */}
          <TabsContent value="update">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Belge Güncelleme İşlemleri
                </CardTitle>
                <CardDescription>Mevcut belgeleri güncelleme örnekleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Belge Güncelleme (update)</h4>
                    <Button
                      onClick={() => executeExample(updateExample)}
                      disabled={loading}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Çalıştır
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{codeExamples.update}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delete Tab */}
          <TabsContent value="delete">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Belge Silme İşlemleri
                </CardTitle>
                <CardDescription>Belge silme örnekleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Belge Silme (delete)</h4>
                    <Button
                      onClick={() => executeExample(deleteExample)}
                      disabled={loading}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Çalıştır
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{codeExamples.delete}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Query Tab */}
          <TabsContent value="query">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Belge Sorgulama İşlemleri
                </CardTitle>
                <CardDescription>Belge getirme ve listeleme örnekleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Belge Sorgulama (getAll, getById)</h4>
                    <Button
                      onClick={() => executeExample(queryExample)}
                      disabled={loading}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Çalıştır
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{codeExamples.query}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aggregate Tab */}
          <TabsContent value="aggregate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Aggregate İşlemleri
                </CardTitle>
                <CardDescription>Gelişmiş veri analizi ve toplama örnekleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Aggregate Pipeline (aggregate)</h4>
                    <Button
                      onClick={() => executeExample(aggregateExample)}
                      disabled={loading}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Çalıştır
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre>{codeExamples.aggregate}</pre>
                  </div>
                </div>

                {/* Custom Aggregate */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm">Özel Aggregate Pipeline Dene</h4>
                  <Textarea
                    placeholder='[{"$match": {"status": "active"}}, {"$group": {"_id": "$category", "count": {"$sum": 1}}}]'
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    rows={6}
                    className="font-mono text-xs"
                  />
                  <Button
                    onClick={() =>
                      executeExample(async () => {
                        const pipeline = JSON.parse(customCode)
                        return { pipeline, note: "Simulated execution" }
                      })
                    }
                    disabled={loading || !customCode.trim()}
                    className="flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Pipeline Çalıştır
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Result Display */}
      {result && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              {result.success ? "İşlem Sonucu" : "Hata"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`rounded-lg p-4 font-mono text-xs overflow-x-auto ${
                result.success ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"
              }`}
            >
              <pre>{JSON.stringify(result.success ? result.data : result.error, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </DatabaseLayout>
  
  )
}
