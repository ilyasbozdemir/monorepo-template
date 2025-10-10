"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Radio, Webhook, Users, Activity, Clock, Trash2, Plus, Copy, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { DatabaseLayout } from "@/components/database/DatabaseLayout"

interface Subscriber {
  id: string
  connectionId: string
  collection: string
  events: string[]
  connectedAt: string
  lastActivity: string
  status: "active" | "idle" | "disconnected"
}

interface WebhookConfig {
  id: string
  name: string
  url: string
  collection: string
  events: string[]
  secret: string
  active: boolean
  createdAt: string
  lastTriggered?: string
}

interface RealtimeEvent {
  id: string
  type: "insert" | "update" | "delete"
  collection: string
  timestamp: string
  data: any
  subscribers: number
}

export default function RealtimePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"subscribers" | "webhooks" | "events">("subscribers")
  const [showWebhookDialog, setShowWebhookDialog] = useState(false)
  const [showSecretDialog, setShowSecretDialog] = useState(false)
  const [selectedSecret, setSelectedSecret] = useState("")
  const [showSecret, setShowSecret] = useState(false)

  // Webhook form state
  const [webhookName, setWebhookName] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [webhookCollection, setWebhookCollection] = useState("")
  const [webhookEvents, setWebhookEvents] = useState<string[]>(["insert"])

  // Mock data
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: "1",
      connectionId: "conn_8a7f9b2c",
      collection: "car_listings",
      events: ["insert", "update"],
      connectedAt: "2025-01-10 14:30:00",
      lastActivity: "2025-01-10 14:35:22",
      status: "active",
    },
    {
      id: "2",
      connectionId: "conn_3d4e5f6g",
      collection: "users",
      events: ["insert", "update", "delete"],
      connectedAt: "2025-01-10 14:25:00",
      lastActivity: "2025-01-10 14:34:10",
      status: "active",
    },
    {
      id: "3",
      connectionId: "conn_1h2i3j4k",
      collection: "car_listings",
      events: ["delete"],
      connectedAt: "2025-01-10 14:20:00",
      lastActivity: "2025-01-10 14:28:45",
      status: "idle",
    },
  ])

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "1",
      name: "Slack Bildirimleri",
      url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX",
      collection: "car_listings",
      events: ["insert", "update"],
      secret: "whsec_8a7f9b2c3d4e5f6g7h8i9j0k",
      active: true,
      createdAt: "2025-01-08 10:00:00",
      lastTriggered: "2025-01-10 14:35:00",
    },
    {
      id: "2",
      name: "Discord Webhook",
      url: "https://discord.com/api/webhooks/123456789/abcdefghijklmnop",
      collection: "users",
      events: ["insert"],
      secret: "whsec_1a2b3c4d5e6f7g8h9i0j",
      active: true,
      createdAt: "2025-01-09 15:30:00",
      lastTriggered: "2025-01-10 14:30:00",
    },
    {
      id: "3",
      name: "Analytics Webhook",
      url: "https://api.analytics.com/webhook",
      collection: "car_listings",
      events: ["insert", "update", "delete"],
      secret: "whsec_9z8y7x6w5v4u3t2s1r0q",
      active: false,
      createdAt: "2025-01-07 12:00:00",
    },
  ])

  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([
    {
      id: "1",
      type: "insert",
      collection: "car_listings",
      timestamp: "2025-01-10 14:35:22",
      data: { title: "Yeni İlan", price: 120000 },
      subscribers: 2,
    },
    {
      id: "2",
      type: "update",
      collection: "users",
      timestamp: "2025-01-10 14:34:10",
      data: { userId: "user_123", field: "email" },
      subscribers: 1,
    },
    {
      id: "3",
      type: "delete",
      collection: "car_listings",
      timestamp: "2025-01-10 14:28:45",
      data: { _id: "68da9b3c730f71e6178dfa14" },
      subscribers: 1,
    },
  ])

  const handleCreateWebhook = () => {
    const newWebhook: WebhookConfig = {
      id: Date.now().toString(),
      name: webhookName,
      url: webhookUrl,
      collection: webhookCollection,
      events: webhookEvents,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      active: true,
      createdAt: new Date().toISOString(),
    }

    setWebhooks([...webhooks, newWebhook])
    setShowWebhookDialog(false)
    setWebhookName("")
    setWebhookUrl("")
    setWebhookCollection("")
    setWebhookEvents(["insert"])

    toast({
      title: "Webhook Oluşturuldu",
      description: "Yeni webhook başarıyla eklendi",
    })
  }

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id))
    toast({
      title: "Webhook Silindi",
      description: "Webhook başarıyla kaldırıldı",
    })
  }

  const handleToggleWebhook = (id: string) => {
    setWebhooks(webhooks.map((w) => (w.id === id ? { ...w, active: !w.active } : w)))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Kopyalandı",
      description: "Panoya kopyalandı",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "disconnected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "insert":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
      case "update":
        return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (

    <DatabaseLayout>
   <div className="container max-w-7xl mx-auto py-6">
      <header className="border-b bg-card my-2 rounded-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Realtime & Webhooks</h1>
                <p className="text-sm text-muted-foreground">
                  Gerçek zamanlı veri değişikliklerini izleyin ve webhook'ları yönetin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Aktif
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktif Aboneler</p>
                <p className="text-3xl font-bold">{subscribers.filter((s) => s.status === "active").length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktif Webhook'lar</p>
                <p className="text-3xl font-bold">{webhooks.filter((w) => w.active).length}</p>
              </div>
              <Webhook className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Son 1 Saat</p>
                <p className="text-3xl font-bold">{realtimeEvents.length}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="subscribers">Aboneler</TabsTrigger>
            <TabsTrigger value="webhooks">Webhook'lar</TabsTrigger>
            <TabsTrigger value="events">Olaylar</TabsTrigger>
          </TabsList>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Realtime Aboneler
              </CardTitle>
              <CardDescription>Gerçek zamanlı veri değişikliklerini dinleyen aktif bağlantılar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(subscriber.status)}`}></div>
                          <span className="font-mono text-sm font-semibold">{subscriber.connectionId}</span>
                          <Badge variant="outline" className="text-xs">
                            {subscriber.collection}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Dinlenen Olaylar</p>
                            <div className="flex gap-1 mt-1">
                              {subscriber.events.map((event) => (
                                <Badge key={event} variant="secondary" className="text-xs">
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Bağlantı Zamanı</p>
                            <p className="font-mono text-xs mt-1">{subscriber.connectedAt}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Son Aktivite</p>
                            <p className="font-mono text-xs mt-1">{subscriber.lastActivity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Durum</p>
                            <p className="text-xs mt-1 capitalize">{subscriber.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {subscribers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz aktif abone yok</p>
                </div>
              )}
            </CardContent>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    Webhook Konfigürasyonları
                  </CardTitle>
                  <CardDescription>Veri değişikliklerinde tetiklenecek webhook'ları yönetin</CardDescription>
                </div>
                <Button onClick={() => setShowWebhookDialog(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Yeni Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{webhook.name}</h4>
                          <Badge variant={webhook.active ? "default" : "secondary"}>
                            {webhook.active ? "Aktif" : "Pasif"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {webhook.collection}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">URL:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{webhook.url}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(webhook.url)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Olaylar:</span>
                            <div className="flex gap-1">
                              {webhook.events.map((event) => (
                                <Badge key={event} variant="secondary" className="text-xs">
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Secret:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {showSecret && selectedSecret === webhook.id ? webhook.secret : "••••••••••••••••"}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (selectedSecret === webhook.id && showSecret) {
                                  setShowSecret(false)
                                  setSelectedSecret("")
                                } else {
                                  setSelectedSecret(webhook.id)
                                  setShowSecret(true)
                                }
                              }}
                              className="h-6 w-6 p-0"
                            >
                              {showSecret && selectedSecret === webhook.id ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(webhook.secret)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Oluşturulma: {webhook.createdAt}</span>
                            {webhook.lastTriggered && <span>Son Tetikleme: {webhook.lastTriggered}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleWebhook(webhook.id)}
                          className="flex items-center gap-1"
                        >
                          {webhook.active ? "Devre Dışı" : "Etkinleştir"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {webhooks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz webhook tanımlanmamış</p>
                  <Button onClick={() => setShowWebhookDialog(true)} className="mt-4">
                    İlk Webhook'u Oluştur
                  </Button>
                </div>
              )}
            </CardContent>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Realtime Olaylar
              </CardTitle>
              <CardDescription>Son gerçek zamanlı veri değişiklikleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realtimeEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getEventTypeColor(event.type)}>{event.type.toUpperCase()}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.collection}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.timestamp}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {event.subscribers} abone
                      </Badge>
                    </div>
                    <div className="bg-muted/50 rounded p-3 mt-2">
                      <pre className="text-xs overflow-x-auto">{JSON.stringify(event.data, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>

              {realtimeEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz olay kaydı yok</p>
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Create Webhook Dialog */}
      <Dialog open={showWebhookDialog} onOpenChange={setShowWebhookDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Yeni Webhook Oluştur</DialogTitle>
            <DialogDescription>Veri değişikliklerinde tetiklenecek webhook'u yapılandırın</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-name">Webhook Adı</Label>
              <Input
                id="webhook-name"
                placeholder="Örn: Slack Bildirimleri"
                value={webhookName}
                onChange={(e) => setWebhookName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="webhook-collection">Koleksiyon</Label>
              <Select value={webhookCollection} onValueChange={setWebhookCollection}>
                <SelectTrigger id="webhook-collection">
                  <SelectValue placeholder="Koleksiyon seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car_listings">car_listings</SelectItem>
                  <SelectItem value="users">users</SelectItem>
                  <SelectItem value="orders">orders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Dinlenecek Olaylar</Label>
              <div className="flex gap-2 mt-2">
                {["insert", "update", "delete"].map((event) => (
                  <Button
                    key={event}
                    variant={webhookEvents.includes(event) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (webhookEvents.includes(event)) {
                        setWebhookEvents(webhookEvents.filter((e) => e !== event))
                      } else {
                        setWebhookEvents([...webhookEvents, event])
                      }
                    }}
                  >
                    {event}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWebhookDialog(false)}>
              İptal
            </Button>
            <Button
              onClick={handleCreateWebhook}
              disabled={!webhookName || !webhookUrl || !webhookCollection || webhookEvents.length === 0}
            >
              Oluştur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DatabaseLayout>
 
  )
}
