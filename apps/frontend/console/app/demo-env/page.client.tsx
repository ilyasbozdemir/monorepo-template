// app/demo-env/page.tsx
"use client"

import { env } from "@monorepo/config"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

//tested ve basarıyla ekranda gosterdi
export default function PageClient() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Environment Config Demo</CardTitle>
          <CardDescription>Bu sayfa config paketinden env değerlerini okur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(env).map(([envName, cfg]: any) => (
            <div key={envName} className="p-3 border rounded-lg">
              <h3 className="font-medium mb-2">{envName}</h3>
              <p><strong>DB Host:</strong> {cfg.DB_HOST}</p>
              <p><strong>DB Port:</strong> {cfg.DB_PORT}</p>l.
              <p><strong>DB Name:</strong> {cfg.DB_NAME}</p>
              <p><strong>DB User:</strong> {cfg.DB_USER}</p>
              <p><strong>Mongo API Key:</strong> {cfg.MONGO.apiKey}</p>
              <p><strong>Mongo Base URL:</strong> {cfg.MONGO.baseUrl}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
