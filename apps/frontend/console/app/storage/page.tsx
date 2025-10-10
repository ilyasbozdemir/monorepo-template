"use client"

import { DatabaseLayout } from "@/components/database/DatabaseLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  HardDrive,
  Upload,
  Download,
  Trash2,
  FolderOpen,
  File,
  ImageIcon,
  FileText,
  Settings,
  Cloud,
} from "lucide-react"
import { useState } from "react"

export default function StoragePage() {
  const [storageProvider, setStorageProvider] = useState("aws-s3")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const storageStats = {
    totalSpace: "100 GB",
    usedSpace: "45.2 GB",
    availableSpace: "54.8 GB",
    fileCount: 1247,
    collections: 8,
  }

  const recentFiles = [
    { name: "product-image-001.jpg", size: "2.4 MB", type: "image", collection: "urunler", date: "2 saat önce" },
    { name: "user-avatar-123.png", size: "856 KB", type: "image", collection: "kullanicilar", date: "5 saat önce" },
    { name: "invoice-2024-001.pdf", size: "1.2 MB", type: "document", collection: "faturalar", date: "1 gün önce" },
    { name: "backup-data.json", size: "15.8 MB", type: "data", collection: "yedekler", date: "2 gün önce" },
    { name: "report-q1-2024.xlsx", size: "3.5 MB", type: "document", collection: "raporlar", date: "3 gün önce" },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Depolama Yönetimi</h1>
            <p className="text-muted-foreground mt-1">Dosya yükleme, depolama ve yönetim sistemi</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Dosya Yükle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Alan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageStats.totalSpace}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Kullanılan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{storageStats.usedSpace}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Kullanılabilir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{storageStats.availableSpace}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dosya Sayısı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageStats.fileCount}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="files" className="w-full">
          <TabsList>
            <TabsTrigger value="files">Dosyalar</TabsTrigger>
            <TabsTrigger value="config">Yapılandırma</TabsTrigger>
            <TabsTrigger value="integration">Entegrasyon</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Son Yüklenen Dosyalar</CardTitle>
                <CardDescription>Sisteme yüklenen en son dosyalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">{getFileIcon(file.type)}</div>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>{file.collection}</span>
                            <span>•</span>
                            <span>{file.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Koleksiyonlara Göre Depolama</CardTitle>
                <CardDescription>Her koleksiyonun kullandığı depolama alanı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">urunler</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "65%" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">18.5 GB</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">kullanicilar</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "35%" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">8.2 GB</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">yedekler</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "45%" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">12.1 GB</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">raporlar</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "20%" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">6.4 GB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Depolama Sağlayıcısı
                </CardTitle>
                <CardDescription>Varsayılan depolama sağlayıcısını yapılandırın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Sağlayıcı Seçin</Label>
                  <Select value={storageProvider} onValueChange={setStorageProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws-s3">
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4" />
                          AWS S3 (Varsayılan)
                        </div>
                      </SelectItem>
                      <SelectItem value="azure-blob">
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4" />
                          Azure Blob Storage
                        </div>
                      </SelectItem>
                      <SelectItem value="google-cloud">
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4" />
                          Google Cloud Storage
                        </div>
                      </SelectItem>
                      <SelectItem value="local">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          Yerel Depolama
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {storageProvider === "aws-s3" && (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold text-sm">AWS S3 Yapılandırması</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="bucket-name">Bucket Adı</Label>
                        <Input id="bucket-name" placeholder="my-app-storage" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Select defaultValue="us-east-1">
                          <SelectTrigger id="region">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                            <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                            <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="access-key">Access Key ID</Label>
                        <Input id="access-key" type="password" placeholder="••••••••••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secret-key">Secret Access Key</Label>
                        <Input id="secret-key" type="password" placeholder="••••••••••••••••" />
                      </div>
                    </div>
                  </div>
                )}

                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Yapılandırmayı Kaydet
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Depolama Limitleri</CardTitle>
                <CardDescription>Dosya boyutu ve depolama limitlerini ayarlayın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-file-size">Maksimum Dosya Boyutu (MB)</Label>
                  <Input id="max-file-size" type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-storage">Maksimum Depolama Alanı (GB)</Label>
                  <Input id="max-storage" type="number" defaultValue="100" />
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Limitleri Güncelle
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Entegrasyonu</CardTitle>
                <CardDescription>Depolama API'si ile entegrasyon örnekleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dosya Yükleme Endpoint</Label>
                  <div className="flex gap-2">
                    <Input value="https://localhost:7149/api/storage/upload" readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dosya İndirme Endpoint</Label>
                  <div className="flex gap-2">
                    <Input
                      value="https://localhost:7149/api/storage/download/{fileId}"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dosya Silme Endpoint</Label>
                  <div className="flex gap-2">
                    <Input
                      value="https://localhost:7149/api/storage/delete/{fileId}"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Örnek Kod</CardTitle>
                <CardDescription>C# ile dosya yükleme örneği</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`using System.Net.Http;
using System.Net.Http.Headers;

var client = new HttpClient();
var form = new MultipartFormDataContent();

using var fileStream = File.OpenRead("dosya.jpg");
var fileContent = new StreamContent(fileStream);
fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

form.Add(fileContent, "file", "dosya.jpg");
form.Add(new StringContent("urunler"), "collection");

var response = await client.PostAsync(
    "https://localhost:7149/api/storage/upload",
    form
);

if (response.IsSuccessStatusCode)
{
    var result = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Dosya yüklendi: " + result);
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DatabaseLayout>
  )
}
