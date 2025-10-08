"use client"

import React, { useState } from "react"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trash2,
  Download,
  Upload,
  File,
  ImageIcon,
  Video,
  Music,
  FileText,
  HardDrive,
  FolderOpen,
  RefreshCw,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  Cloud,
  Settings,
  Activity,
} from "lucide-react"

// Storage Provider Types
type StorageProvider = "s3" | "cloudflare-r2" | "backblaze-b2" | "wasabi"

interface ProviderConfig {
  id: StorageProvider
  name: string
  icon: React.ReactNode
  description: string
}

// File metadata interface
interface FileMetadata {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  bucket: string
  mimeType: string
  key: string
  etag?: string
  lastModified?: string
  contentType?: string
  metadata?: Record<string, string>
}

interface Bucket {
  id: string
  name: string
  fileCount: number
  totalSize: number
  createdAt: string
  region: string
}

interface ConnectionStatus {
  connected: boolean
  testing: boolean
  message: string
  lastChecked?: string
}

export default function StorageTestPage() {
  // Provider configuration
  const providers: ProviderConfig[] = [
    {
      id: "s3",
      name: "Amazon S3",
      icon: <Cloud className="h-5 w-5" />,
      description: "AWS S3 Compatible Storage",
    },
    {
      id: "cloudflare-r2",
      name: "Cloudflare R2",
      icon: <Cloud className="h-5 w-5" />,
      description: "Zero egress fees",
    },
    {
      id: "backblaze-b2",
      name: "Backblaze B2",
      icon: <Cloud className="h-5 w-5" />,
      description: "Cost-effective storage",
    },
    {
      id: "wasabi",
      name: "Wasabi",
      icon: <Cloud className="h-5 w-5" />,
      description: "Hot cloud storage",
    },
  ]

  // State management
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider>("s3")
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    testing: false,
    message: "Not connected",
  })

  const [files, setFiles] = useState<FileMetadata[]>([
    {
      id: "file_1",
      name: "profile-photo.jpg",
      size: 245760,
      type: "image",
      url: "/professional-headshot.png",
      uploadedAt: "2024-03-20 10:30:00",
      bucket: "user-uploads",
      mimeType: "image/jpeg",
      key: "uploads/profile-photo.jpg",
      etag: '"abc123def456"',
      lastModified: "2024-03-20T10:30:00Z",
      contentType: "image/jpeg",
      metadata: {
        uploadedBy: "user_123",
        originalName: "profile-photo.jpg",
      },
    },
    {
      id: "file_2",
      name: "document.pdf",
      size: 1048576,
      type: "document",
      url: "#",
      uploadedAt: "2024-03-19 15:20:00",
      bucket: "documents",
      mimeType: "application/pdf",
      key: "docs/document.pdf",
      etag: '"xyz789abc123"',
      lastModified: "2024-03-19T15:20:00Z",
      contentType: "application/pdf",
      metadata: {
        uploadedBy: "user_456",
        category: "reports",
      },
    },
  ])

  const [buckets, setBuckets] = useState<Bucket[]>([
    {
      id: "bucket_1",
      name: "user-uploads",
      fileCount: 1,
      totalSize: 245760,
      createdAt: "2024-01-15",
      region: "us-east-1",
    },
    {
      id: "bucket_2",
      name: "documents",
      fileCount: 1,
      totalSize: 1048576,
      createdAt: "2024-01-20",
      region: "us-west-2",
    },
    {
      id: "bucket_3",
      name: "media-assets",
      fileCount: 0,
      totalSize: 0,
      createdAt: "2024-02-01",
      region: "eu-west-1",
    },
  ])

  const [activeTab, setActiveTab] = useState("connection")
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBucket, setFilterBucket] = useState<string>("all")

  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadBucket, setUploadBucket] = useState("user-uploads")
  const [uploading, setUploading] = useState(false)

  // Connection config states
  const [accessKeyId, setAccessKeyId] = useState("")
  const [secretAccessKey, setSecretAccessKey] = useState("")
  const [region, setRegion] = useState("us-east-1")
  const [endpoint, setEndpoint] = useState("")

  // Auto-hide messages
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />
      case "audio":
        return <Music className="h-5 w-5 text-green-500" />
      case "document":
        return <FileText className="h-5 w-5 text-orange-500" />
      default:
        return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  // Connection test handler
  const handleTestConnection = async () => {
    setConnectionStatus({ connected: false, testing: true, message: "Testing connection..." })
    setError(null)

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (!accessKeyId || !secretAccessKey) {
      setConnectionStatus({
        connected: false,
        testing: false,
        message: "Missing credentials",
      })
      setError("Please provide Access Key ID and Secret Access Key")
      return
    }

    // Simulate successful connection
    setConnectionStatus({
      connected: true,
      testing: false,
      message: "Connected successfully",
      lastChecked: new Date().toLocaleString(),
    })
    setSuccess(`Successfully connected to ${providers.find((p) => p.id === selectedProvider)?.name}`)
  }

  // Upload handler
  const handleUploadFile = async () => {
    if (!uploadFile) {
      setError("Please select a file to upload")
      return
    }

    if (!connectionStatus.connected) {
      setError("Please connect to storage provider first")
      return
    }

    setUploading(true)
    setError(null)

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const fileType = uploadFile.type.startsWith("image/")
      ? "image"
      : uploadFile.type.startsWith("video/")
        ? "video"
        : uploadFile.type.startsWith("audio/")
          ? "audio"
          : "document"

    const newFile: FileMetadata = {
      id: `file_${Date.now()}`,
      name: uploadFile.name,
      size: uploadFile.size,
      type: fileType,
      url: URL.createObjectURL(uploadFile),
      uploadedAt: new Date().toLocaleString(),
      bucket: uploadBucket,
      mimeType: uploadFile.type,
      key: `uploads/${uploadFile.name}`,
      etag: `"${Math.random().toString(36).substring(7)}"`,
      lastModified: new Date().toISOString(),
      contentType: uploadFile.type,
      metadata: {
        uploadedBy: "test_user",
        originalName: uploadFile.name,
        provider: selectedProvider,
      },
    }

    setFiles([newFile, ...files])

    // Update bucket stats
    setBuckets(
      buckets.map((b) =>
        b.name === uploadBucket
          ? {
              ...b,
              fileCount: b.fileCount + 1,
              totalSize: b.totalSize + uploadFile.size,
            }
          : b,
      ),
    )

    setSuccess(`File '${uploadFile.name}' uploaded successfully with metadata`)
    setUploadFile(null)
    setUploading(false)
  }

  // Delete file handler
  const handleDeleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (!file) return

    setFiles(files.filter((f) => f.id !== fileId))

    // Update bucket stats
    setBuckets(
      buckets.map((b) =>
        b.name === file.bucket
          ? {
              ...b,
              fileCount: b.fileCount - 1,
              totalSize: b.totalSize - file.size,
            }
          : b,
      ),
    )

    setSuccess(`File '${file.name}' deleted from storage and database`)
  }

  // Refresh buckets
  const handleRefreshBuckets = async () => {
    if (!connectionStatus.connected) {
      setError("Please connect to storage provider first")
      return
    }

    setSuccess("Refreshing bucket list...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSuccess("Bucket list refreshed successfully")
  }

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBucket = filterBucket === "all" || file.bucket === filterBucket
    return matchesSearch && matchesBucket
  })

  const totalFiles = files.length
  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const totalBuckets = buckets.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <HardDrive className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-balance">Storage Provider Test Panel</h1>
                <p className="text-muted-foreground mt-1">
                  Test S3-compatible storage connections, uploads, and metadata management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {connectionStatus.connected ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Disconnected
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Files</CardDescription>
              <CardTitle className="text-2xl font-bold">{totalFiles}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Database className="h-3 w-3" />
                <span>Stored in database</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Size</CardDescription>
              <CardTitle className="text-2xl font-bold">{formatFileSize(totalSize)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HardDrive className="h-3 w-3" />
                <span>Across all buckets</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Buckets</CardDescription>
              <CardTitle className="text-2xl font-bold">{totalBuckets}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FolderOpen className="h-3 w-3" />
                <span>Active containers</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Provider</CardDescription>
              <CardTitle className="text-2xl font-bold">
                {providers.find((p) => p.id === selectedProvider)?.name.split(" ")[0]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Cloud className="h-3 w-3" />
                <span>Current storage</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-4 border-destructive/50 bg-destructive/10" variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="connection" className="gap-2">
              <Settings className="h-4 w-4" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Test
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-2">
              <File className="h-4 w-4" />
              Files
            </TabsTrigger>
            <TabsTrigger value="buckets" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Buckets
            </TabsTrigger>
          </TabsList>

          {/* Connection Tab */}
          <TabsContent value="connection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Storage Provider Configuration
                </CardTitle>
                <CardDescription>Select and configure your S3-compatible storage provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Provider Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Select Provider</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedProvider === provider.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">{provider.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{provider.name}</h3>
                            <p className="text-sm text-muted-foreground">{provider.description}</p>
                          </div>
                          {selectedProvider === provider.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Connection Configuration */}
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-base font-semibold">Connection Credentials</Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accessKeyId">Access Key ID</Label>
                      <Input
                        id="accessKeyId"
                        type="text"
                        placeholder="AKIAIOSFODNN7EXAMPLE"
                        value={accessKeyId}
                        onChange={(e) => setAccessKeyId(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="secretAccessKey">Secret Access Key</Label>
                      <Input
                        id="secretAccessKey"
                        type="password"
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                        value={secretAccessKey}
                        onChange={(e) => setSecretAccessKey(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="endpoint">Custom Endpoint (Optional)</Label>
                      <Input
                        id="endpoint"
                        type="text"
                        placeholder="https://s3.example.com"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-semibold">Connection Status</Label>
                      <p className="text-sm text-muted-foreground mt-1">{connectionStatus.message}</p>
                      {connectionStatus.lastChecked && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last checked: {connectionStatus.lastChecked}
                        </p>
                      )}
                    </div>
                    <Button onClick={handleTestConnection} disabled={connectionStatus.testing} size="lg">
                      {connectionStatus.testing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Activity className="h-4 w-4 mr-2" />
                          Test Connection
                        </>
                      )}
                    </Button>
                  </div>

                  {connectionStatus.connected && (
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="text-green-600 dark:text-green-400">
                        Successfully connected to {providers.find((p) => p.id === selectedProvider)?.name}. You can now
                        upload files and manage buckets.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Test Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  File Upload Test
                </CardTitle>
                <CardDescription>Upload files to test storage integration and metadata storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!connectionStatus.connected && (
                  <Alert className="border-orange-500/50 bg-orange-500/10">
                    <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <AlertDescription className="text-orange-600 dark:text-orange-400">
                      Please connect to a storage provider first in the Connection tab
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="uploadBucket">Target Bucket</Label>
                    <Select value={uploadBucket} onValueChange={setUploadBucket} disabled={!connectionStatus.connected}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {buckets.map((bucket) => (
                          <SelectItem key={bucket.id} value={bucket.name}>
                            {bucket.name} ({bucket.region})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fileUpload">Select File</Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setUploadFile(file)
                        }
                      }}
                      disabled={!connectionStatus.connected}
                      className="cursor-pointer"
                    />
                    {uploadFile && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          {getFileIcon(
                            uploadFile.type.startsWith("image/")
                              ? "image"
                              : uploadFile.type.startsWith("video/")
                                ? "video"
                                : uploadFile.type.startsWith("audio/")
                                  ? "audio"
                                  : "document",
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{uploadFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(uploadFile.size)} • {uploadFile.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleUploadFile}
                    disabled={!uploadFile || uploading || !connectionStatus.connected}
                    className="w-full"
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File & Save Metadata
                      </>
                    )}
                  </Button>
                </div>

                {/* Upload Info */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">What happens on upload:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>File is uploaded to the selected S3 bucket</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Metadata is extracted (name, size, type, MIME type, ETag)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>File information is stored in your database with full metadata</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Custom metadata tags can be added (uploadedBy, category, etc.)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>Files ({filteredFiles.length})</CardTitle>
                    <CardDescription>Browse and manage uploaded files with metadata</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={filterBucket} onValueChange={setFilterBucket}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Buckets</SelectItem>
                        {buckets.map((bucket) => (
                          <SelectItem key={bucket.id} value={bucket.name}>
                            {bucket.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors bg-card"
                    >
                      <div className="flex items-start gap-4">
                        {file.type === "image" ? (
                          <img
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            className="h-16 w-16 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded bg-muted flex items-center justify-center flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{file.name}</h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{file.bucket}</span>
                            <span>•</span>
                            <span>{file.mimeType}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                            <span>Key: {file.key}</span>
                          </div>
                          {file.metadata && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(file.metadata).map(([key, value]) => (
                                <span key={key} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFile(file)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSuccess(`Downloading ${file.name}...`)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete File</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{file.name}"? This will remove the file from storage
                                  and delete its metadata from the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDeleteFile(file.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredFiles.length === 0 && (
                    <div className="py-12 text-center">
                      <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No files found</p>
                      <p className="text-sm text-muted-foreground mt-1">Upload files in the Upload Test tab</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buckets Tab */}
          <TabsContent value="buckets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Buckets ({buckets.length})</CardTitle>
                    <CardDescription>Manage your S3 storage buckets</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshBuckets}
                    disabled={!connectionStatus.connected}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {buckets.map((bucket) => (
                    <Card key={bucket.id} className="border-border/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FolderOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{bucket.name}</CardTitle>
                              <CardDescription className="text-xs">{bucket.region}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Files:</span>
                            <span className="font-medium">{bucket.fileCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span className="font-medium">{formatFileSize(bucket.totalSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span className="font-medium">{bucket.createdAt}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* File Details Dialog */}
        {selectedFile && (
          <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>File Details & Metadata</DialogTitle>
                <DialogDescription>Complete information about the stored file</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {selectedFile.type === "image" && (
                  <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={selectedFile.url || "/placeholder.svg"}
                      alt={selectedFile.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">File Name:</span>
                        <p className="font-medium mt-1">{selectedFile.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <p className="font-medium mt-1">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium mt-1">{selectedFile.type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">MIME Type:</span>
                        <p className="font-medium mt-1">{selectedFile.mimeType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Storage Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Bucket:</span>
                        <p className="font-medium mt-1">{selectedFile.bucket}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Key:</span>
                        <p className="font-medium mt-1 font-mono text-xs">{selectedFile.key}</p>
                      </div>
                      {selectedFile.etag && (
                        <div>
                          <span className="text-muted-foreground">ETag:</span>
                          <p className="font-medium mt-1 font-mono text-xs">{selectedFile.etag}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Uploaded:</span>
                        <p className="font-medium mt-1">{selectedFile.uploadedAt}</p>
                      </div>
                    </div>
                  </div>

                  {selectedFile.metadata && Object.keys(selectedFile.metadata).length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Custom Metadata</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(selectedFile.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <p className="font-medium mt-1">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">URL</h3>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-mono text-xs break-all">{selectedFile.url}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
