"use client"

import { useState } from "react"
import { X, Database, Key, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [connectionString, setConnectionString] = useState("mongodb://localhost:27017")
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:3000/api/mongo")
  const [apiKey, setApiKey] = useState("")

  const handleSave = () => {
    console.log("Settings saved:", { connectionString, apiEndpoint, apiKey })
    // Here you would save to localStorage or state management
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-card border border-border shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">MongoDB Bağlantı Ayarları</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="connection" className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connection">Bağlantı</TabsTrigger>
            <TabsTrigger value="api">API Ayarları</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="connection-string" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                MongoDB Bağlantı Dizesi
              </Label>
              <Input
                id="connection-string"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                placeholder="mongodb://localhost:27017"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                MongoDB bağlantı dizenizi girin. Bu dize, API aracılığıyla veritabanınıza bağlanmak için kullanılacaktır.
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-md border border-border">
              <h4 className="text-sm font-medium mb-2">Bağlantı Örnekleri</h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-muted-foreground">Local: mongodb://localhost:27017</div>
                <div className="text-muted-foreground">Atlas: mongodb+srv://user:pass@cluster.mongodb.net</div>
                <div className="text-muted-foreground">With Auth: mongodb://user:pass@localhost:27017/dbname</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="api-endpoint" className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                API Uç Noktası
              </Label>
              <Input
                id="api-endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="http://localhost:3000/api/mongo"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">MongoDB işlemlerini gerçekleştirecek Backend API Uç Noktası.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Anahtarı (İsteğe bağlı)
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key if required"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Optional API key for authentication.</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md">
              <p className="text-xs text-amber-600 dark:text-amber-400">
                <strong>Not:</strong> Currently running in demo mode with state-based storage. Configure these settings to connect to a real MongoDB instance via API.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            İptal Et
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Ayarları Kaydet
          </Button>
        </div>
      </Card>
    </div>
  )
}
