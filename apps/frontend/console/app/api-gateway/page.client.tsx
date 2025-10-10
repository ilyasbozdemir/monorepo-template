"use client"

import { useState } from "react"
import { DatabaseLayout } from "@/components/database/DatabaseLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Activity, Search, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye } from "lucide-react"

interface ApiRequest {
  id: string
  timestamp: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  statusCode: number
  duration: number
  ip: string
  userAgent: string
  requestBody?: string
  responseBody?: string
  headers?: Record<string, string>
}

export default function ApiGatewayPage() {
  const [requests, setRequests] = useState<ApiRequest[]>([
    {
      id: "1",
      timestamp: "2025-01-10 14:32:15",
      method: "GET",
      path: "/api/CollectionManagement/list",
      statusCode: 200,
      duration: 45,
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0",
      responseBody: '{"collections": ["users", "products"]}',
    },
    {
      id: "2",
      timestamp: "2025-01-10 14:31:50",
      method: "POST",
      path: "/api/CollectionManagement/create",
      statusCode: 201,
      duration: 120,
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0",
      requestBody: '{"name": "orders", "schema": {...}}',
      responseBody: '{"success": true, "id": "abc123"}',
    },
    {
      id: "3",
      timestamp: "2025-01-10 14:30:22",
      method: "PUT",
      path: "/api/CollectionManagement/users/123",
      statusCode: 200,
      duration: 85,
      ip: "192.168.1.101",
      userAgent: "PostmanRuntime/7.32.0",
      requestBody: '{"name": "John Doe", "email": "john@example.com"}',
      responseBody: '{"success": true}',
    },
    {
      id: "4",
      timestamp: "2025-01-10 14:29:45",
      method: "DELETE",
      path: "/api/CollectionManagement/temp",
      statusCode: 200,
      duration: 55,
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0",
      responseBody: '{"success": true, "deleted": 1}',
    },
    {
      id: "5",
      timestamp: "2025-01-10 14:28:10",
      method: "GET",
      path: "/api/CollectionManagement/products",
      statusCode: 404,
      duration: 25,
      ip: "192.168.1.102",
      userAgent: "curl/7.68.0",
      responseBody: '{"error": "Collection not found"}',
    },
    {
      id: "6",
      timestamp: "2025-01-10 14:27:33",
      method: "POST",
      path: "/api/CollectionManagement/users",
      statusCode: 500,
      duration: 1200,
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0",
      requestBody: '{"name": "Jane", "email": "invalid"}',
      responseBody: '{"error": "Internal server error"}',
    },
    {
      id: "7",
      timestamp: "2025-01-10 14:26:18",
      method: "GET",
      path: "/api/CollectionManagement/analytics",
      statusCode: 200,
      duration: 340,
      ip: "192.168.1.103",
      userAgent: "Mozilla/5.0",
      responseBody: '{"totalRequests": 1234, "avgDuration": 120}',
    },
    {
      id: "8",
      timestamp: "2025-01-10 14:25:05",
      method: "PATCH",
      path: "/api/CollectionManagement/settings",
      statusCode: 200,
      duration: 95,
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0",
      requestBody: '{"theme": "dark"}',
      responseBody: '{"success": true}',
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<ApiRequest | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.path.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMethod = methodFilter === "all" || req.method === methodFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "2xx" && req.statusCode >= 200 && req.statusCode < 300) ||
      (statusFilter === "4xx" && req.statusCode >= 400 && req.statusCode < 500) ||
      (statusFilter === "5xx" && req.statusCode >= 500)
    return matchesSearch && matchesMethod && matchesStatus
  })

  const stats = {
    total: requests.length,
    success: requests.filter((r) => r.statusCode >= 200 && r.statusCode < 300).length,
    clientError: requests.filter((r) => r.statusCode >= 400 && r.statusCode < 500).length,
    serverError: requests.filter((r) => r.statusCode >= 500).length,
    avgDuration: Math.round(requests.reduce((sum, r) => sum + r.duration, 0) / requests.length),
  }

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      POST: "bg-green-100 text-green-800 hover:bg-green-100",
      PUT: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      DELETE: "bg-red-100 text-red-800 hover:bg-red-100",
      PATCH: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    }
    return <Badge className={colors[method as keyof typeof colors] || ""}>{method}</Badge>
  }

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      )
    } else if (status >= 400 && status < 500) {
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      )
    } else if (status >= 500) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      )
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const getDurationColor = (duration: number) => {
    if (duration < 100) return "text-green-600"
    if (duration < 500) return "text-yellow-600"
    return "text-red-600"
  }

  const handleViewDetails = (request: ApiRequest) => {
    setSelectedRequest(request)
    setShowDetails(true)
  }

  const handleRefresh = () => {
    console.log("[v0] API istekleri yenileniyor...")
  }

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">API Gateway</h2>
            <p className="text-muted-foreground mt-1">Tüm API isteklerini izleyin ve yönetin</p>
          </div>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam İstek</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
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
              <p className="text-xs text-muted-foreground mt-1">2xx durum kodu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">İstemci Hatası</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.clientError}</div>
              <p className="text-xs text-muted-foreground mt-1">4xx durum kodu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sunucu Hatası</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.serverError}</div>
              <p className="text-xs text-muted-foreground mt-1">5xx durum kodu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ort. Süre</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDuration}ms</div>
              <p className="text-xs text-muted-foreground mt-1">Yanıt süresi</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>API İstekleri</CardTitle>
                <CardDescription>Gerçek zamanlı istek izleme ve filtreleme</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Endpoint ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Metod" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Durum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="2xx">2xx</SelectItem>
                    <SelectItem value="4xx">4xx</SelectItem>
                    <SelectItem value="5xx">5xx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Zaman</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Metod</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Endpoint</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Süre</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">IP</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{request.timestamp}</td>
                      <td className="px-4 py-3">{getMethodBadge(request.method)}</td>
                      <td className="px-4 py-3 font-mono text-xs max-w-xs truncate" title={request.path}>
                        {request.path}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(request.statusCode)}</td>
                      <td className={`px-4 py-3 font-medium ${getDurationColor(request.duration)}`}>
                        {request.duration}ms
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{request.ip}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(request)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Filtre kriterlerine uygun istek bulunamadı</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              İstek Detayları
            </DialogTitle>
            <DialogDescription>API isteği hakkında detaylı bilgiler</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Metod</label>
                  <div className="mt-1">{getMethodBadge(selectedRequest.method)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Durum Kodu</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.statusCode)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Süre</label>
                  <div className={`mt-1 font-medium ${getDurationColor(selectedRequest.duration)}`}>
                    {selectedRequest.duration}ms
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Zaman</label>
                  <div className="mt-1 text-sm">{selectedRequest.timestamp}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Endpoint</label>
                <div className="mt-1 font-mono text-sm bg-muted p-3 rounded break-all">{selectedRequest.path}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP Adresi</label>
                  <div className="mt-1 font-mono text-sm">{selectedRequest.ip}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                  <div className="mt-1 text-sm truncate" title={selectedRequest.userAgent}>
                    {selectedRequest.userAgent}
                  </div>
                </div>
              </div>

              {selectedRequest.requestBody && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Request Body</label>
                  <pre className="mt-1 bg-muted p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedRequest.requestBody), null, 2)}
                  </pre>
                </div>
              )}

              {selectedRequest.responseBody && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Response Body</label>
                  <pre className="mt-1 bg-muted p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedRequest.responseBody), null, 2)}
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
