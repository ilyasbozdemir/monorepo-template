"use client"

import { useState, useEffect } from "react"
import { DatabaseLayout } from "@/components/database/DatabaseLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  HardDrive,
  Download,
  ServerIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Plus,
  Settings,
  Shield,
  Database,
  Code,
  Copy,
  Terminal,
} from "lucide-react"

interface SourceConfig {
  id: string
  name: string
  type: "mongodb" | "postgresql" | "mysql"
  url: string
  enabled: boolean
}

interface DatabaseConfig {
  id: string
  name: string
  collections: string[]
  enabled: boolean
}

interface BackupItem {
  id: string
  name: string
  collection: string
  size: string
  status: "completed" | "running" | "failed" | "scheduled"
  createdAt: string
  duration: string
  server: string
  source: string
  type: string
  fullPath: string
}

interface BackupServer {
  id: string
  name: string
  url: string
  status: "online" | "offline" | "maintenance"
  lastSync: string
}

interface SwaggerEndpoint {
  method: string
  path: string
  summary: string
  parameters?: any[]
}

const API_BASE = "https://localhost:7149/api/MongoDbBackup"

const fetchDatabases = async () => {
  try {
    const response = await fetch(`${API_BASE}/databases`)
    if (!response.ok) throw new Error("Failed to fetch databases")
    return await response.json()
  } catch (error) {
    console.error("Database fetch error:", error)
    return ["myapp", "testdb", "analytics"] // fallback
  }
}

const fetchCollections = async (databaseName: string) => {
  try {
    const response = await fetch(`${API_BASE}/databases/${databaseName}/collections`)
    if (!response.ok) throw new Error("Failed to fetch collections")
    return await response.json()
  } catch (error) {
    console.error("Collections fetch error:", error)
    return ["users", "products", "orders"] // fallback
  }
}

const createDatabaseBackup = async (databaseName: string, compress = true) => {
  try {
    const response = await fetch(`${API_BASE}/backup/database/${databaseName}?compress=${compress}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Backup failed")
    return await response.json()
  } catch (error) {
    console.error("Backup error:", error)
    throw error
  }
}

const createCollectionBackup = async (databaseName: string, collections: string[], compress = true) => {
  try {
    const response = await fetch(`${API_BASE}/backup/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        DatabaseName: databaseName,
        Collections: collections,
        Compress: compress,
      }),
    })
    if (!response.ok) throw new Error("Collection backup failed")
    return await response.json()
  } catch (error) {
    console.error("Collection backup error:", error)
    throw error
  }
}

const fetchBackupList = async () => {
  try {
    const response = await fetch(`${API_BASE}/backups`)
    if (!response.ok) throw new Error("Failed to fetch backups")
    const backups = await response.json()
    return backups.map((backup: any) => ({
      id: backup.Name,
      name: backup.Name,
      collection: backup.Name.includes("_selected_") ? "Multiple" : "Full Database",
      size: backup.Size,
      status: "completed",
      createdAt: new Date(backup.CreatedDate).toLocaleString("tr-TR"),
      duration: "N/A",
      server: "MongoDB Server",
      source: "Production MongoDB",
      type: backup.Type,
      fullPath: backup.FullPath,
    }))
  } catch (error) {
    console.error("Backup list fetch error:", error)
    return []
  }
}

const deleteBackup = async (fileName: string) => {
  try {
    const response = await fetch(`${API_BASE}/delete/${fileName}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Delete failed")
    return await response.json()
  } catch (error) {
    console.error("Delete error:", error)
    throw error
  }
}

const downloadBackup = async (fileName: string) => {
  try {
    const response = await fetch(`${API_BASE}/download/${fileName}`)
    if (!response.ok) throw new Error("Download failed")

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error("Download error:", error)
    throw error
  }
}

export default function BackupManagementPage() {
  const [sources, setSources] = useState<SourceConfig[]>([
    {
      id: "1",
      name: "Production MongoDB",
      type: "mongodb",
      url: "mongodb://localhost:27017",
      enabled: true,
    },
    {
      id: "2",
      name: "Staging MongoDB",
      type: "mongodb",
      url: "mongodb://staging.example.com:27017",
      enabled: false,
    },
    {
      id: "3",
      name: "Test PostgreSQL",
      type: "postgresql",
      url: "postgresql://localhost:5432",
      enabled: false,
    },
  ])

  const [databases, setDatabases] = useState<DatabaseConfig[]>([
    {
      id: "1",
      name: "ecommerce_db",
      collections: ["users", "products", "orders", "reviews"],
      enabled: true,
    },
    {
      id: "2",
      name: "analytics_db",
      collections: ["events", "sessions", "conversions"],
      enabled: false,
    },
    {
      id: "3",
      name: "logs_db",
      collections: ["error_logs", "access_logs", "audit_logs"],
      enabled: false,
    },
  ])

  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [apiConsoleUrl, setApiConsoleUrl] = useState<string>("")

  const [backups, setBackups] = useState<BackupItem[]>([])
  const [servers, setServers] = useState<BackupServer[]>([
    {
      id: "1",
      name: "Primary Backup Server",
      url: "https://backup1.example.com",
      status: "online",
      lastSync: "2024-12-16 15:20",
    },
    {
      id: "2",
      name: "Secondary Backup Server",
      url: "https://backup2.example.com",
      status: "online",
      lastSync: "2024-12-16 15:18",
    },
  ])

  const [swaggerData, setSwaggerData] = useState<SwaggerEndpoint[]>([])
  const [swaggerUrl, setSwaggerUrl] = useState("https://localhost:7149/swagger/v1/swagger.json")
  const [loadingSwagger, setLoadingSwagger] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState<SwaggerEndpoint | null>(null)

  const [showCreateBackup, setShowCreateBackup] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showServerDialog, setShowServerDialog] = useState(false)
  const [showAddDatabaseDialog, setShowAddDatabaseDialog] = useState(false)
  const [showAddServerDialog, setShowAddServerDialog] = useState(false)
  const [newDatabase, setNewDatabase] = useState({ name: "", collections: "", type: "mongodb" })
  const [newServer, setNewServer] = useState({ name: "", url: "", type: "backup" })
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [authCode, setAuthCode] = useState("")
  const [progress, setProgress] = useState(0)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [backupType, setBackupType] = useState<"full" | "partial">("full")

  useEffect(() => {
    const loadBackupData = async () => {
      const backupList = await fetchBackupList()
      setBackups(backupList)
    }
    loadBackupData()
  }, [])

  const getStatusIcon = (status: BackupItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "running":
        return <Clock className="h-4 w-4 text-orange-500 animate-spin" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: BackupItem["status"]) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      running: "bg-orange-100 text-orange-800",
      failed: "bg-red-100 text-red-800",
      scheduled: "bg-yellow-100 text-yellow-800",
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  const getServerStatusBadge = (status: BackupServer["status"]) => {
    const variants = {
      online: "bg-green-100 text-green-800",
      offline: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800",
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-orange-100 text-orange-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteBackup = async (backupId: string) => {
    try {
      await deleteBackup(backupId)
      const updatedBackups = await fetchBackupList()
      setBackups(updatedBackups)
    } catch (error) {
      console.error("Failed to delete backup:", error)
    }
  }

  const handleCreateBackup = async () => {
    try {
      setIsCreatingBackup(true)
      const selectedSource = sources.find((s) => s.enabled)
      if (!selectedSource) {
        throw new Error("Lütfen bir veritabanı kaynağı seçin")
      }

      let result
      if (backupType === "full") {
        result = await createDatabaseBackup(selectedSource.name, true)
      } else {
        // For collection backup, we'll use demo collections for now
        const collections = await fetchCollections(selectedSource.name)
        result = await createCollectionBackup(selectedSource.name, collections.slice(0, 2), true)
      }

      // Refresh backup list
      const updatedBackups = await fetchBackupList()
      setBackups(updatedBackups)

      setShowCreateBackup(false)
      // Show success message
      console.log("Backup created successfully:", result)
    } catch (error) {
      console.error("Backup creation failed:", error)
      // Show error message to user
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleAddDatabase = () => {
    const collectionsArray = newDatabase.collections
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c)
    const database: DatabaseConfig = {
      id: Date.now().toString(),
      name: newDatabase.name,
      collections: collectionsArray,
      enabled: false,
    }
    setDatabases([...databases, database])
    setNewDatabase({ name: "", collections: "", type: "mongodb" })
    setShowAddDatabaseDialog(false)
  }

  const handleAddServer = () => {
    const server: BackupServer = {
      id: Date.now().toString(),
      name: newServer.name,
      url: newServer.url,
      status: "offline",
      lastSync: "Never",
    }
    setServers([...servers, server])
    setNewServer({ name: "", url: "", type: "backup" })
    setShowAddServerDialog(false)
  }

  const handleAddSource = () => {
    const source: SourceConfig = {
      id: Date.now().toString(),
      name: newServer.name,
      type: newServer.type as "mongodb" | "postgresql" | "mysql",
      url: newServer.url,
      enabled: false,
    }
    setSources([...sources, source])
    setNewServer({ name: "", url: "", type: "mongodb" })
    setShowAddServerDialog(false)
  }

  const handleTableClick = (collection: string, source: string, database: string) => {
    setSelectedTable(collection)
    const activeSource = sources.find((s) => s.enabled)
    const activeDatabase = databases.find((d) => d.enabled)

    if (activeSource && activeDatabase) {
      const url = `${activeSource.url}/api/v1/collections/${activeDatabase.name}/${collection}`
      setApiConsoleUrl(url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleSource = (sourceId: string) => {
    setSources(
      sources.map((s) => ({
        ...s,
        enabled: s.id === sourceId ? !s.enabled : false,
      })),
    )
  }

  const toggleDatabase = (databaseId: string) => {
    setDatabases(
      databases.map((d) => ({
        ...d,
        enabled: d.id === databaseId ? !d.enabled : false,
      })),
    )
  }

  const loadSwaggerData = async () => {
    setLoadingSwagger(true)
    try {
      // Simulate loading Swagger JSON
      const mockSwaggerData: SwaggerEndpoint[] = [
        {
          method: "GET",
          path: "/api/CollectionManagement/list",
          summary: "Get all collections",
          parameters: [],
        },
        {
          method: "POST",
          path: "/api/CollectionManagement/create",
          summary: "Create new collection",
          parameters: [{ name: "name", type: "string", required: true }],
        },
        {
          method: "DELETE",
          path: "/api/CollectionManagement/delete",
          summary: "Delete collection",
          parameters: [{ name: "name", type: "string", required: true }],
        },
        {
          method: "GET",
          path: "/api/CollectionManagement/{collectionName}",
          summary: "Get all documents in collection",
          parameters: [{ name: "collectionName", type: "string", required: true }],
        },
        {
          method: "PUT",
          path: "/api/CollectionManagement/{collectionName}/update/{id}",
          summary: "Update document",
          parameters: [
            { name: "collectionName", type: "string", required: true },
            { name: "id", type: "string", required: true },
          ],
        },
      ]

      setTimeout(() => {
        setSwaggerData(mockSwaggerData)
        setLoadingSwagger(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to load Swagger data:", error)
      setLoadingSwagger(false)
    }
  }

  const handleDownloadBackup = async (backupId: string) => {
    try {
      await downloadBackup(backupId)
    } catch (error) {
      console.error("Failed to download backup:", error)
    }
  }

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Yedekleme Yönetimi</h1>
            <p className="text-muted-foreground">Kaynak ve veritabanı seçimi ile veritabanı yedeklerini yönetin</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateBackup(true)} className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Yedek Oluştur
            </Button>
            <Button variant="outline" onClick={() => setShowAddDatabaseDialog(true)}>
              <Database className="h-4 w-4 mr-2" />
              Veritabanı Ekle
            </Button>
            <Button variant="outline" onClick={() => setShowAddServerDialog(true)}>
              <ServerIcon className="h-4 w-4 mr-2" />
              Sunucu Ekle
            </Button>
          </div>
        </div>

        {/* Source and Database Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Kaynak Seçimi
              </CardTitle>
              <CardDescription>Veritabanı kaynağınızı seçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${source.type === "mongodb" ? "bg-green-500" : source.type === "postgresql" ? "bg-orange-500" : "bg-orange-500"}`}
                    />
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted-foreground">{source.url}</p>
                    </div>
                  </div>
                  <Switch checked={source.enabled} onCheckedChange={() => toggleSource(source.id)} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Database Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Veritabanı Seçimi
              </CardTitle>
              <CardDescription>Hedef veritabanınızı seçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {databases.map((database) => (
                <div key={database.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{database.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {database.collections.length} koleksiyon: {database.collections.slice(0, 3).join(", ")}
                      {database.collections.length > 3 && "..."}
                    </p>
                  </div>
                  <Switch checked={database.enabled} onCheckedChange={() => toggleDatabase(database.id)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Collections Table for API Console */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Collections & API Console
            </CardTitle>
            <CardDescription>Click on collections to generate API requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="collections" className="space-y-4">
              <TabsList>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="swagger">Swagger API</TabsTrigger>
              </TabsList>

              <TabsContent value="collections" className="space-y-4">
                {/* Collections Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {databases
                    .filter((db) => db.enabled)
                    .flatMap((db) =>
                      db.collections.map((collection) => (
                        <Button
                          key={`${db.id}-${collection}`}
                          variant={selectedTable === collection ? "default" : "outline"}
                          className="h-auto p-3 flex flex-col items-start"
                          onClick={() =>
                            handleTableClick(collection, sources.find((s) => s.enabled)?.name || "", db.name)
                          }
                        >
                          <span className="font-medium">{collection}</span>
                          <span className="text-xs text-muted-foreground">{db.name}</span>
                        </Button>
                      )),
                    )}
                </div>

                {/* API Console */}
                {apiConsoleUrl && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        <span className="font-medium">API Request URL</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiConsoleUrl)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="bg-black text-green-400 p-3 rounded font-mono text-sm">
                      <span className="text-orange-400">GET</span> {apiConsoleUrl}
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Selected: <strong>{selectedTable}</strong> from {databases.find((d) => d.enabled)?.name}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="swagger" className="space-y-4">
                {/* Swagger API documentation section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Input
                        value={swaggerUrl}
                        onChange={(e) => setSwaggerUrl(e.target.value)}
                        placeholder="Swagger JSON URL"
                        className="w-96"
                      />
                      <Button onClick={loadSwaggerData} disabled={loadingSwagger}>
                        {loadingSwagger ? "Loading..." : "Load API"}
                      </Button>
                    </div>
                  </div>

                  {swaggerData.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium">API Endpoints</h3>
                      {swaggerData.map((endpoint, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedEndpoint === endpoint ? "bg-orange-50 border-orange-200" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedEndpoint(endpoint)}
                        >
                          <div className="flex items-center gap-3">
                            <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                            <code className="text-sm font-mono">{endpoint.path}</code>
                            <span className="text-sm text-muted-foreground">{endpoint.summary}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedEndpoint && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4" />
                          <span className="font-medium">API Endpoint Details</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `${swaggerUrl.replace("/swagger/v1/swagger.json", "")}${selectedEndpoint.path}`,
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="bg-black text-green-400 p-3 rounded font-mono text-sm">
                        <span
                          className={`${
                            selectedEndpoint.method === "GET"
                              ? "text-green-400"
                              : selectedEndpoint.method === "POST"
                                ? "text-orange-400"
                                : selectedEndpoint.method === "PUT"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                          }`}
                        >
                          {selectedEndpoint.method}
                        </span>{" "}
                        {swaggerUrl.replace("/swagger/v1/swagger.json", "")}
                        {selectedEndpoint.path}
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="text-sm">
                          <strong>Summary:</strong> {selectedEndpoint.summary}
                        </div>
                        {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                          <div className="text-sm">
                            <strong>Parameters:</strong>
                            <ul className="ml-4 mt-1 space-y-1">
                              {selectedEndpoint.parameters.map((param, idx) => (
                                <li key={idx} className="text-muted-foreground">
                                  • {param.name} ({param.type}){" "}
                                  {param.required && <span className="text-red-500">*</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Yedekler</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{backups.length}</div>
              <p className="text-xs text-muted-foreground">
                Aktif kaynak: {sources.find((s) => s.enabled)?.name || "Hiçbiri"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Çalışıyor</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{backups.filter((b) => b.status === "running").length}</div>
              <p className="text-xs text-muted-foreground">Aktif işlemler</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {backups.length > 0
                  ? Math.round((backups.filter((b) => b.status === "completed").length / backups.length) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Genel başarı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Sunucular</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{servers.filter((s) => s.status === "online").length}</div>
              <p className="text-xs text-muted-foreground">Çevrimiçi sunucular</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="backups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="backups">Yedek Geçmişi</TabsTrigger>
            <TabsTrigger value="servers">Sunucu Yönetimi</TabsTrigger>
            <TabsTrigger value="schedule">Zamanlanmış Yedekler</TabsTrigger>
          </TabsList>

          <TabsContent value="backups" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yedek Geçmişi</CardTitle>
                <CardDescription>Veritabanı yedeklerinizi görüntüleyin ve yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backups.length === 0 ? (
                    <div className="text-center py-8">
                      <HardDrive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Yedek Bulunamadı</h3>
                      <p className="text-muted-foreground mb-4">İlk yedek oluşturun başlamak için</p>
                      <Button onClick={() => setShowCreateBackup(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        İlk Yedek Oluştur
                      </Button>
                    </div>
                  ) : (
                    backups.map((backup) => (
                      <div
                        key={backup.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(backup.status)}
                          <div>
                            <h3 className="font-medium">{backup.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Koleksiyon: {backup.collection} • Boyut: {backup.size} • Sunucu: {backup.server}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Oluşturuldu: {backup.createdAt} • Süre: {backup.duration} • Kaynak: {backup.source}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(backup.status)}
                          {backup.status === "running" && (
                            <div className="w-24">
                              <Progress value={progress} className="h-2" />
                            </div>
                          )}
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadBackup(backup.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setShowRestoreDialog(true)}>
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedBackup(backup)
                                setShowDeleteConfirm(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sunucu Yönetimi</CardTitle>
                    <CardDescription>Yedekleme hedef sunucularını yönetin</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddDatabaseDialog(true)}>
                      <Database className="h-4 w-4 mr-2" />
                      Veritabanı Ekle
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddServerDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Sunucu Ekle
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servers.map((server) => (
                    <div
                      key={server.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <ServerIcon className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{server.name}</h3>
                          <p className="text-sm text-muted-foreground">{server.url}</p>
                          <p className="text-xs text-muted-foreground">Son senkronizasyon: {server.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getServerStatusBadge(server.status)}
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Zamanlanmış Yedekler</CardTitle>
                <CardDescription>Topluluklar için otomatik yedekleme zamanlamaları yapılandırın</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Zamanlanmış Yedek Yok</h3>
                  <p className="text-muted-foreground mb-4">
                    Koleksiyonlarınız için otomatik yedekleme zamanlamaları oluşturun
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Zamanlanmış Yedek Oluştur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Backup Dialog */}
        <Dialog open={showCreateBackup} onOpenChange={setShowCreateBackup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Yedek Oluştur</DialogTitle>
              <DialogDescription>Veritabanı koleksiyonunuzdan bir yedek oluşturun</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="collection">Koleksiyon</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Koleksiyon seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {databases
                      .filter((db) => db.enabled)
                      .flatMap((db) =>
                        db.collections.map((collection) => (
                          <SelectItem key={collection} value={collection}>
                            {collection} ({db.name})
                          </SelectItem>
                        )),
                      )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="server">Hedef Sunucu</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sunucu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {servers
                      .filter((s) => s.status === "online")
                      .map((server) => (
                        <SelectItem key={server.id} value={server.id}>
                          {server.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="backupType">Yedek Türü</Label>
                <Select value={backupType} onValueChange={(value) => setBackupType(value as "full" | "partial")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Tam Veritabanı</SelectItem>
                    <SelectItem value="partial">Parçalı Koleksiyonlar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateBackup(false)}>
                İptal
              </Button>
              <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
                {isCreatingBackup ? "Yedek Oluşturuluyor..." : "Yedek Oluştur"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Yedek Sil
              </DialogTitle>
              <DialogDescription>Bu eylem geri alınamaz. Bu, yedeği kalıcı olarak silecektir.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Yedeği adını yazarak onaylayın:</Label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={selectedBackup?.name}
                />
              </div>
              <div>
                <Label>Yetkilendirme kodunu girin:</Label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="ADMIN2024"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteBackup(selectedBackup?.id || "")}
                disabled={deleteConfirmText !== selectedBackup?.name || authCode !== "ADMIN2024"}
              >
                Yedek Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Restore Dialog */}
        <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yedeği Geri Yükle</DialogTitle>
              <DialogDescription>Veritabanınıza bu yedeği geri yükleyin</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Uyarı</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Bu, hedef koleksiyonda mevcut verileri üzerine yazacaktır.
                </p>
              </div>
              <div>
                <Label>Hedef Sunucu</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Hedef sunucu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {servers
                      .filter((s) => s.status === "online")
                      .map((server) => (
                        <SelectItem key={server.id} value={server.id}>
                          {server.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
                İptal
              </Button>
              <Button variant="destructive">Yedeği Geri Yükle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddDatabaseDialog} onOpenChange={setShowAddDatabaseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Veritabanı Ekle</DialogTitle>
              <DialogDescription>Yedekleme için yeni bir veritabanı yapılandırması ekleyin</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dbName">Veritabanı Adı</Label>
                <Input
                  id="dbName"
                  value={newDatabase.name}
                  onChange={(e) => setNewDatabase({ ...newDatabase, name: e.target.value })}
                  placeholder="örn: my_database"
                />
              </div>
              <div>
                <Label htmlFor="collections">Koleksiyonlar (virgülle ayırın)</Label>
                <Input
                  id="collections"
                  value={newDatabase.collections}
                  onChange={(e) => setNewDatabase({ ...newDatabase, collections: e.target.value })}
                  placeholder="örn: users, products, orders"
                />
              </div>
              <div>
                <Label htmlFor="dbType">Veritabanı Türü</Label>
                <Select
                  value={newDatabase.type}
                  onValueChange={(value) => setNewDatabase({ ...newDatabase, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Basit Yapılandırma:</strong> Bağlantı URL'lerini doğrudan arayüzden düzenleyebilir ve test
                  edebilirsiniz.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDatabaseDialog(false)}>
                İptal
              </Button>
              <Button onClick={handleAddDatabase} disabled={!newDatabase.name || !newDatabase.collections}>
                Veritabanı Ekle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddServerDialog} onOpenChange={setShowAddServerDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Sunucu/Kaynak Ekle</DialogTitle>
              <DialogDescription>Yedekleme sunucusu veya veritabanı kaynağı ekleyin</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="serverName">Sunucu Adı</Label>
                <Input
                  id="serverName"
                  value={newServer.name}
                  onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                  placeholder="örn: Production MongoDB Server"
                />
              </div>
              <div>
                <Label htmlFor="serverUrl">Sunucu URL</Label>
                <Input
                  id="serverUrl"
                  value={newServer.url}
                  onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                  placeholder="örn: mongodb://localhost:27017 veya https://backup.example.com"
                />
              </div>
              <div>
                <Label htmlFor="serverType">Tür</Label>
                <Select value={newServer.type} onValueChange={(value) => setNewServer({ ...newServer, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mongodb">MongoDB Kaynağı</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL Kaynağı</SelectItem>
                    <SelectItem value="mysql">MySQL Kaynağı</SelectItem>
                    <SelectItem value="backup">Yedekleme Sunucusu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Güvenlik:</strong> Üretim ortamında bağlantı bilgilerini environment variable'lar ile
                  saklayın.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddServerDialog(false)}>
                İptal
              </Button>
              {newServer.type === "backup" ? (
                <Button onClick={handleAddServer} disabled={!newServer.name || !newServer.url}>
                  Sunucu Ekle
                </Button>
              ) : (
                <Button onClick={handleAddSource} disabled={!newServer.name || !newServer.url}>
                  Kaynak Ekle
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DatabaseLayout>
  )
}
