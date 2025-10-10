"use client"

import { useState } from "react"
import { DatabaseLayout } from "@/components/database/DatabaseLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plug,
  CheckCircle,
  XCircle,
  Settings,
  ExternalLink,
  Key,
  Database,
  Cloud,
  Mail,
  MessageSquare,
  CreditCard,
  FileText,
  Zap,
  RefreshCw,
  Bell,
  Lock,
  BarChart,
  Webhook,
  Github,
  Slack,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  status: "active" | "inactive" | "error"
  category: string
  apiKey?: string
  endpoint?: string
  lastSync?: string
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "mongodb",
      name: "MongoDB",
      description: "Ana veritabanı bağlantısı",
      icon: Database,
      status: "active",
      category: "Veritabanı",
      endpoint: "mongodb://localhost:27017",
      lastSync: "2 dakika önce",
    },
    {
      id: "redis",
      name: "Redis Cache",
      description: "Önbellek ve oturum yönetimi",
      icon: Zap,
      status: "active",
      category: "Önbellek",
      endpoint: "redis://localhost:6379",
      lastSync: "5 dakika önce",
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      description: "İlişkisel veritabanı",
      icon: Database,
      status: "active",
      category: "Veritabanı",
      endpoint: "postgresql://localhost:5432",
      lastSync: "10 dakika önce",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Ödeme işlemleri entegrasyonu",
      icon: CreditCard,
      status: "inactive",
      category: "Ödeme",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Online ödeme platformu",
      icon: CreditCard,
      status: "inactive",
      category: "Ödeme",
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "E-posta gönderim servisi",
      icon: Mail,
      status: "active",
      category: "İletişim",
      endpoint: "api.sendgrid.com",
      lastSync: "15 dakika önce",
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS ve mesajlaşma servisi",
      icon: MessageSquare,
      status: "inactive",
      category: "İletişim",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Takım iletişim platformu",
      icon: Slack,
      status: "active",
      category: "İletişim",
      endpoint: "hooks.slack.com",
      lastSync: "5 dakika önce",
    },
    {
      id: "aws-s3",
      name: "AWS S3",
      description: "Dosya depolama servisi",
      icon: Cloud,
      status: "error",
      category: "Depolama",
      endpoint: "s3.amazonaws.com",
      lastSync: "1 saat önce",
    },
    {
      id: "cloudinary",
      name: "Cloudinary",
      description: "Medya yönetimi ve CDN",
      icon: Cloud,
      status: "active",
      category: "Depolama",
      endpoint: "api.cloudinary.com",
      lastSync: "20 dakika önce",
    },
    {
      id: "google-cloud",
      name: "Google Cloud Storage",
      description: "Bulut depolama çözümü",
      icon: Cloud,
      status: "inactive",
      category: "Depolama",
    },
    {
      id: "elasticsearch",
      name: "Elasticsearch",
      description: "Arama ve analitik motoru",
      icon: FileText,
      status: "active",
      category: "Arama",
      endpoint: "localhost:9200",
      lastSync: "8 dakika önce",
    },
    {
      id: "algolia",
      name: "Algolia",
      description: "Hızlı arama API'si",
      icon: FileText,
      status: "inactive",
      category: "Arama",
    },
    {
      id: "sentry",
      name: "Sentry",
      description: "Hata izleme ve monitoring",
      icon: Bell,
      status: "active",
      category: "Monitoring",
      endpoint: "sentry.io",
      lastSync: "3 dakika önce",
    },
    {
      id: "datadog",
      name: "Datadog",
      description: "Uygulama performans izleme",
      icon: BarChart,
      status: "inactive",
      category: "Monitoring",
    },
    {
      id: "auth0",
      name: "Auth0",
      description: "Kimlik doğrulama servisi",
      icon: Lock,
      status: "active",
      category: "Güvenlik",
      endpoint: "auth0.com",
      lastSync: "12 dakika önce",
    },
    {
      id: "firebase-auth",
      name: "Firebase Auth",
      description: "Google kimlik doğrulama",
      icon: Lock,
      status: "inactive",
      category: "Güvenlik",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Kod repository entegrasyonu",
      icon: Github,
      status: "active",
      category: "Geliştirme",
      endpoint: "api.github.com",
      lastSync: "25 dakika önce",
    },
    {
      id: "webhooks",
      name: "Webhook Manager",
      description: "Özel webhook yönetimi",
      icon: Webhook,
      status: "active",
      category: "Geliştirme",
      lastSync: "7 dakika önce",
    },
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [configData, setConfigData] = useState({
    apiKey: "",
    endpoint: "",
  })

  const categories = Array.from(new Set(integrations.map((i) => i.category)))

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration)
    setConfigData({
      apiKey: integration.apiKey || "",
      endpoint: integration.endpoint || "",
    })
    setShowConfigDialog(true)
  }

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations(
        integrations.map((i) =>
          i.id === selectedIntegration.id
            ? {
                ...i,
                apiKey: configData.apiKey,
                endpoint: configData.endpoint,
                status: "active" as const,
                lastSync: "Az önce",
              }
            : i,
        ),
      )
      setShowConfigDialog(false)
      console.log("[v0] Entegrasyon yapılandırıldı:", selectedIntegration.id)
    }
  }

  const handleTestConnection = (integration: Integration) => {
    console.log("[v0] Bağlantı test ediliyor:", integration.id)
    setIntegrations(
      integrations.map((i) =>
        i.id === integration.id
          ? {
              ...i,
              status: "active" as const,
              lastSync: "Az önce",
            }
          : i,
      ),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Hata</Badge>
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            Pasif
          </Badge>
        )
    }
  }

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Entegrasyonlar</h2>
            <p className="text-muted-foreground mt-1">Üçüncü parti servisleri yönetin ve yapılandırın</p>
          </div>
          <Button>
            <Plug className="h-4 w-4 mr-2" />
            Yeni Entegrasyon
          </Button>
        </div>

        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-foreground mb-3">{category}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {integrations
                  .filter((i) => i.category === category)
                  .map((integration) => (
                    <Card key={integration.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <integration.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{integration.name}</CardTitle>
                              <CardDescription className="text-sm mt-1">{integration.description}</CardDescription>
                            </div>
                          </div>
                          {getStatusIcon(integration.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Durum:</span>
                            {getStatusBadge(integration.status)}
                          </div>

                          {integration.endpoint && (
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Endpoint:</span>
                              <div className="mt-1 font-mono bg-muted p-2 rounded truncate">{integration.endpoint}</div>
                            </div>
                          )}

                          {integration.lastSync && (
                            <div className="text-xs text-muted-foreground">
                              Son senkronizasyon: {integration.lastSync}
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => handleConfigure(integration)}
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Yapılandır
                            </Button>
                            {integration.status === "active" && (
                              <Button variant="outline" size="sm" onClick={() => handleTestConnection(integration)}>
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIntegration && (
                <>
                  <selectedIntegration.icon className="h-5 w-5" />
                  {selectedIntegration.name} Yapılandırması
                </>
              )}
            </DialogTitle>
            <DialogDescription>Entegrasyon ayarlarını yapılandırın ve bağlantıyı test edin</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Anahtarı
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="API anahtarınızı girin"
                value={configData.apiKey}
                onChange={(e) => setConfigData({ ...configData, apiKey: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="endpoint" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Endpoint URL
              </Label>
              <Input
                id="endpoint"
                type="text"
                placeholder="https://api.example.com"
                value={configData.endpoint}
                onChange={(e) => setConfigData({ ...configData, endpoint: e.target.value })}
                className="mt-2"
              />
            </div>

            {selectedIntegration?.status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Bağlantı Hatası</p>
                    <p className="text-xs text-red-600 mt-1">
                      Entegrasyon bağlantısı kurulamadı. Lütfen ayarları kontrol edin.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveConfig}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Kaydet ve Bağlan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DatabaseLayout>
  )
}
