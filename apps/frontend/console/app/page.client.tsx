import { DatabaseLayout } from "@/components/database/DatabaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Server,
  HardDrive,
  Cpu,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plug,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const systemMetrics = [
    {
      title: "Toplam Veritabanı",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Database,
      color: "text-blue-600",
    },
    {
      title: "API İstekleri",
      value: "45.2K",
      change: "+12.5%",
      trend: "up",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Ortalama Yanıt Süresi",
      value: "45ms",
      change: "-8ms",
      trend: "down",
      icon: Clock,
      color: "text-purple-600",
    },
    {
      title: "Aktif Entegrasyonlar",
      value: "12/19",
      change: "+2",
      trend: "up",
      icon: Plug,
      color: "text-orange-600",
    },
  ];

  const recentActivity = [
    {
      type: "success",
      message: "Yeni koleksiyon oluşturuldu: products",
      time: "2 dakika önce",
    },
    {
      type: "info",
      message: "MongoDB bağlantısı yenilendi",
      time: "15 dakika önce",
    },
    {
      type: "warning",
      message: "Yedekleme işlemi başlatıldı",
      time: "1 saat önce",
    },
    {
      type: "success",
      message: "Stripe entegrasyonu aktif edildi",
      time: "2 saat önce",
    },
    {
      type: "error",
      message: "Redis bağlantı hatası düzeltildi",
      time: "3 saat önce",
    },
  ];

  const integrationStatus = [
    { name: "MongoDB", status: "active", uptime: "99.9%" },
    { name: "Redis", status: "active", uptime: "99.8%" },
    { name: "Stripe", status: "active", uptime: "100%" },
    { name: "SendGrid", status: "inactive", uptime: "0%" },
    { name: "AWS S3", status: "active", uptime: "99.7%" },
    { name: "Elasticsearch", status: "warning", uptime: "95.2%" },
  ];

  const systemHealth = {
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 28,
  };

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Sistem genel bakış ve performans metrikleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-green-600 mr-1" />
                  )}
                  <span className="text-green-600">{metric.change}</span>
                  <span className="ml-1">son 30 gün</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Hızlı Erişim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/api-gateway">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  >
                    <Activity className="h-5 w-5" />
                    <span className="text-sm">API Gateway</span>
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm">Analitik</span>
                  </Button>
                </Link>
                <Link href="/database-management">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  >
                    <Database className="h-5 w-5" />
                    <span className="text-sm">Veritabanı</span>
                  </Button>
                </Link>
                <Link href="/backup">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  >
                    <HardDrive className="h-5 w-5" />
                    <span className="text-sm">Yedekleme</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Sistem Sağlığı BETA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">CPU Kullanımı</span>
                    </div>
                    <span className="text-sm font-medium">
                      {systemHealth.cpu}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${systemHealth.cpu}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Bellek Kullanımı BETA</span>
                    </div>
                    <span className="text-sm font-medium">
                      {systemHealth.memory}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${systemHealth.memory}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Disk Kullanımı</span>
                    </div>
                    <span className="text-sm font-medium">
                      {systemHealth.disk}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${systemHealth.disk}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Ağ Kullanımı</span>
                    </div>
                    <span className="text-sm font-medium">
                      {systemHealth.network}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${systemHealth.network}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Entegrasyon Durumu BETA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {integrationStatus.map((integration, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          integration.status === "active"
                            ? "bg-green-500"
                            : integration.status === "warning"
                              ? "bg-orange-500"
                              : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {integration.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {integration.uptime}
                      </span>
                      <Badge
                        variant={
                          integration.status === "active"
                            ? "default"
                            : integration.status === "warning"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          integration.status === "active"
                            ? "bg-green-100 text-green-800"
                            : integration.status === "warning"
                              ? "bg-orange-100 text-orange-800"
                              : ""
                        }
                      >
                        {integration.status === "active"
                          ? "Aktif"
                          : integration.status === "warning"
                            ? "Uyarı"
                            : "Pasif"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/integrations">
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  Entegrasyonları Yönet
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Son Aktiviteler BETA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      {activity.type === "success" && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === "info" && (
                        <Activity className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.type === "warning" && (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                      {activity.type === "error" && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/activity">
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  Tüm Aktiviteleri Görüntüle
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DatabaseLayout>
  );
}
