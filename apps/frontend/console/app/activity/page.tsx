"use client"

import { useState } from "react"
import { DatabaseLayout } from "@/components/database/DatabaseLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Activity,
  Search,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Terminal,
  Bug,
} from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "debug" | "success"
  source: string
  message: string
  details?: string
  stackTrace?: string
  metadata?: Record<string, any>
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "2025-01-10 14:32:15",
      level: "info",
      source: "CollectionService",
      message: "Collection 'products' başarıyla oluşturuldu",
      metadata: { collectionName: "products", documentCount: 0 },
    },
    {
      id: "2",
      timestamp: "2025-01-10 14:31:50",
      level: "success",
      source: "DatabaseConnection",
      message: "MongoDB bağlantısı başarılı",
      details: "mongodb://localhost:27017/mydb",
      metadata: { connectionTime: "45ms", poolSize: 10 },
    },
    {
      id: "3",
      timestamp: "2025-01-10 14:30:22",
      level: "warning",
      source: "QueryOptimizer",
      message: "Yavaş sorgu tespit edildi",
      details: "Query execution time: 1250ms",
      metadata: { query: "db.users.find({})", executionTime: 1250 },
    },
    {
      id: "4",
      timestamp: "2025-01-10 14:29:45",
      level: "error",
      source: "ValidationService",
      message: "Geçersiz veri formatı",
      details: "Email alanı geçerli bir email adresi değil",
      stackTrace:
        "ValidationError: Invalid email format\n  at validateEmail (validator.js:45)\n  at processUser (user-service.js:120)",
      metadata: { field: "email", value: "invalid-email" },
    },
    {
      id: "5",
      timestamp: "2025-01-10 14:28:10",
      level: "debug",
      source: "CacheManager",
      message: "Cache temizlendi",
      details: "Redis cache cleared for key: user_sessions_*",
      metadata: { keysCleared: 156, duration: "23ms" },
    },
    {
      id: "6",
      timestamp: "2025-01-10 14:27:33",
      level: "error",
      source: "AuthService",
      message: "Kimlik doğrulama başarısız",
      details: "Invalid token signature",
      stackTrace: "JsonWebTokenError: invalid signature\n  at verify (jwt.js:89)\n  at authenticate (auth.js:34)",
      metadata: { userId: "user_123", ip: "192.168.1.100" },
    },
    {
      id: "7",
      timestamp: "2025-01-10 14:26:18",
      level: "info",
      source: "BackupService",
      message: "Otomatik yedekleme tamamlandı",
      details: "Backup saved to: /backups/db_2025-01-10.tar.gz",
      metadata: { size: "2.4GB", duration: "5m 32s" },
    },
    {
      id: "8",
      timestamp: "2025-01-10 14:25:05",
      level: "warning",
      source: "MemoryMonitor",
      message: "Yüksek bellek kullanımı",
      details: "Memory usage: 85% (3.4GB / 4GB)",
      metadata: { memoryUsage: 85, threshold: 80 },
    },
    {
      id: "9",
      timestamp: "2025-01-10 14:24:12",
      level: "debug",
      source: "IndexManager",
      message: "Index oluşturuldu",
      details: "Created index on collection 'users' for field 'email'",
      metadata: { collection: "users", field: "email", type: "unique" },
    },
    {
      id: "10",
      timestamp: "2025-01-10 14:23:45",
      level: "success",
      source: "MigrationService",
      message: "Veritabanı migrasyonu başarılı",
      details: "Applied 3 migrations successfully",
      metadata: { migrationsApplied: 3, duration: "1.2s" },
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesSource = sourceFilter === "all" || log.source === sourceFilter
    return matchesSearch && matchesLevel && matchesSource
  })

  const sources = Array.from(new Set(logs.map((log) => log.source)))

  const stats = {
    total: logs.length,
    info: logs.filter((l) => l.level === "info").length,
    success: logs.filter((l) => l.level === "success").length,
    warning: logs.filter((l) => l.level === "warning").length,
    error: logs.filter((l) => l.level === "error").length,
    debug: logs.filter((l) => l.level === "debug").length,
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <XCircle className="h-4 w-4" />
      case "debug":
        return <Bug className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getLevelBadge = (level: string) => {
    const configs = {
      info: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      success: "bg-green-100 text-green-800 hover:bg-green-100",
      warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      error: "bg-red-100 text-red-800 hover:bg-red-100",
      debug: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    }
    return (
      <Badge className={configs[level as keyof typeof configs] || ""}>
        {getLevelIcon(level)}
        <span className="ml-1 uppercase text-xs">{level}</span>
      </Badge>
    )
  }

  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log)
    setShowDetails(true)
  }

  const handleRefresh = () => {
    console.log("Loglar yenileniyor...")
  }

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Activity Log</h2>
            <p className="text-muted-foreground mt-1">Sunucu logları ve sistem olayları</p>
          </div>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Log</CardTitle>
              <Terminal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Son 24 saat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarılı</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.success}</div>
              <p className="text-xs text-muted-foreground mt-1">Success logs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bilgi</CardTitle>
              <Info className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
              <p className="text-xs text-muted-foreground mt-1">Info logs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uyarı</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
              <p className="text-xs text-muted-foreground mt-1">Warning logs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hata</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.error}</div>
              <p className="text-xs text-muted-foreground mt-1">Error logs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Debug</CardTitle>
              <Bug className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.debug}</div>
              <p className="text-xs text-muted-foreground mt-1">Debug logs</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Sistem Logları</CardTitle>
                <CardDescription>Gerçek zamanlı sunucu logları ve uygulama olayları</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Log ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Seviye" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Kaynak" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kaynaklar</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(log)}
                >
                  <div className="mt-0.5">{getLevelBadge(log.level)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{log.message}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Terminal className="h-3 w-3" />
                        {log.source}
                      </span>
                    </div>
                    {log.details && (
                      <div className="mt-2 text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded">
                        {log.details}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Filtre kriterlerine uygun log bulunamadı</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Log Detayları
            </DialogTitle>
            <DialogDescription>Sistem logu hakkında detaylı bilgiler</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seviye</label>
                  <div className="mt-1">{getLevelBadge(selectedLog.level)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kaynak</label>
                  <div className="mt-1 font-mono text-sm">{selectedLog.source}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Zaman</label>
                  <div className="mt-1 text-sm">{selectedLog.timestamp}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Mesaj</label>
                <div className="mt-1 p-3 bg-muted rounded text-sm">{selectedLog.message}</div>
              </div>

              {selectedLog.details && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Detaylar</label>
                  <div className="mt-1 p-3 bg-muted rounded text-sm font-mono">{selectedLog.details}</div>
                </div>
              )}

              {selectedLog.stackTrace && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stack Trace</label>
                  <pre className="mt-1 bg-muted p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              )}

              {selectedLog.metadata && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Metadata</label>
                  <pre className="mt-1 bg-muted p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DatabaseLayout>
  )
}
