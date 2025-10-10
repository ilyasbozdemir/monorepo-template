"use client"

import { useEffect, useState } from "react"
import { DatabaseLayout } from "@/components/database/DatabaseLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, FileText, Activity, Zap, Clock, Server } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(true)
  const [stats, setStats] = useState({
    totalDatabases: 12,
    totalCollections: 48,
    totalDocuments: 15420,
    apiCalls24h: 8934,
    activeUsers: 156,
    uptime: "99.9%",
  })
  const router = useRouter()

  useEffect(() => {
    const setupComplete =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("db_setup_complete="))
        ?.split("=")[1] === "true"

    console.log(" Setup status:", setupComplete)

    if (!setupComplete) {
      console.log(" Redirecting to setup page")
      router.push("/setup")
    } else {
      setIsSetupComplete(true)
    }
  }, [router])

  if (isSetupComplete === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking setup status...</p>
        </div>
      </div>
    )
  }

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform durumunuzu ve metriklerinizi görüntüleyin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Veritabanı</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDatabases}</div>
              <p className="text-xs text-muted-foreground mt-1">Aktif veritabanları</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Koleksiyonlar</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCollections}</div>
              <p className="text-xs text-muted-foreground mt-1">Toplam koleksiyon sayısı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dökümanlar</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Toplam kayıt</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Çağrıları</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.apiCalls24h.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Son 24 saat</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & System Status */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
              <CardDescription>Sık kullanılan işlemlere hızlı erişim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/database-management">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Database className="mr-2 h-4 w-4" />
                  Veritabanı Yönetimi
                </Button>
              </Link>
              <Link href="/api-mapping">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Zap className="mr-2 h-4 w-4" />
                  API Mapping
                </Button>
              </Link>
              <Link href="/queries">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Sorgu Çalıştır
                </Button>
              </Link>
              <Link href="/backup">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Server className="mr-2 h-4 w-4" />
                  Yedekleme
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>Sistem Durumu</CardTitle>
              <CardDescription>Platform sağlık metrikleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Veritabanı</span>
                </div>
                <span className="text-sm font-medium text-green-600">Çalışıyor</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">API Gateway</span>
                </div>
                <span className="text-sm font-medium text-green-600">Çalışıyor</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Redis Cache</span>
                </div>
                <span className="text-sm font-medium text-green-600">Çalışıyor</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm font-bold">{stats.uptime}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Performance */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>Platform üzerindeki son işlemler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Yeni koleksiyon oluşturuldu", collection: "users", time: "2 dakika önce" },
                  { action: "API endpoint güncellendi", collection: "products", time: "15 dakika önce" },
                  { action: "Yedekleme tamamlandı", collection: "orders", time: "1 saat önce" },
                  { action: "Sorgu çalıştırıldı", collection: "analytics", time: "2 saat önce" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.collection} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performans Metrikleri</CardTitle>
              <CardDescription>Son 24 saat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Ortalama Yanıt Süresi</span>
                  <span className="font-medium">45ms</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Başarılı İstekler</span>
                  <span className="font-medium">99.2%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[99%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Cache Hit Rate</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[87%]" />
                </div>
              </div>

              <div className="pt-2 border-t">
                <Link href="/analytics">
                  <Button variant="link" className="p-0 h-auto">
                    Detaylı analitikleri görüntüle →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DatabaseLayout>
  )
}
