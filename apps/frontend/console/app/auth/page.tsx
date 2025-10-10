"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  Key,
  Settings,
  Activity,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Globe,
  Lock,
  UserPlus,
  Layers,
} from "lucide-react";
import { DatabaseLayout } from "@/components/database/DatabaseLayout";

export default function AuthPage() {
  const [authentikUrl, setAuthentikUrl] = useState("https://authentik.company");
  const [apiToken, setApiToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Mock data
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Admin Dashboard",
      slug: "admin-dashboard",
      provider: "OAuth2",
      status: "active",
      users: 45,
    },
    {
      id: 2,
      name: "API Gateway",
      slug: "api-gateway",
      provider: "OAuth2",
      status: "active",
      users: 120,
    },
    {
      id: 3,
      name: "Legacy System",
      slug: "legacy-system",
      provider: "LDAP",
      status: "inactive",
      users: 12,
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      username: "admin@company.com",
      name: "Admin User",
      groups: ["Administrators", "Developers"],
      status: "active",
      lastLogin: "2 dakika önce",
    },
    {
      id: 2,
      username: "john@company.com",
      name: "John Doe",
      groups: ["Developers"],
      status: "active",
      lastLogin: "1 saat önce",
    },
    {
      id: 3,
      username: "jane@company.com",
      name: "Jane Smith",
      groups: ["Users"],
      status: "inactive",
      lastLogin: "3 gün önce",
    },
  ]);

  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "OAuth2 Provider",
      type: "OAuth2",
      applications: 5,
      status: "configured",
    },
    {
      id: 2,
      name: "SAML Provider",
      type: "SAML",
      applications: 2,
      status: "configured",
    },
    {
      id: 3,
      name: "LDAP Provider",
      type: "LDAP",
      applications: 1,
      status: "pending",
    },
  ]);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      user: "admin@company.com",
      application: "Admin Dashboard",
      ip: "192.168.1.100",
      started: "2 dakika önce",
      status: "active",
    },
    {
      id: 2,
      user: "john@company.com",
      application: "API Gateway",
      ip: "192.168.1.101",
      started: "15 dakika önce",
      status: "active",
    },
    {
      id: 3,
      user: "jane@company.com",
      application: "Admin Dashboard",
      ip: "192.168.1.102",
      started: "1 saat önce",
      status: "expired",
    },
  ]);

  const handleConnect = () => {
    if (authentikUrl && apiToken) {
      setIsConnected(true);
    }
  };

  return (
    <DatabaseLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Authentik Kimlik Yönetimi
            </h1>
            <p className="text-muted-foreground mt-1">
              OAuth2, SAML ve LDAP ile merkezi kimlik doğrulama
            </p>
          </div>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" /> Bağlı
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-1" /> Bağlı Değil
              </>
            )}
          </Badge>
        </div>

        {/* Connection Configuration */}
        {!isConnected && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Authentik Bağlantısı
              </CardTitle>
              <CardDescription>
                Authentik sunucunuza bağlanmak için API bilgilerini girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authentik-url">Authentik URL</Label>
                  <Input
                    id="authentik-url"
                    placeholder="https://authentik.company"
                    value={authentikUrl}
                    onChange={(e) => setAuthentikUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-token">API Token</Label>
                  <Input
                    id="api-token"
                    type="password"
                    placeholder="API token'ınızı girin"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleConnect} className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Bağlan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Only show when connected */}
        {isConnected && (
          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="applications">
                <Layers className="h-4 w-4 mr-2" />
                Uygulamalar
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Kullanıcılar
              </TabsTrigger>
              <TabsTrigger value="providers">
                <Globe className="h-4 w-4 mr-2" />
                Sağlayıcılar
              </TabsTrigger>
              <TabsTrigger value="sessions">
                <Activity className="h-4 w-4 mr-2" />
                Oturumlar
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Ayarlar
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Uygulamalar</CardTitle>
                      <CardDescription>
                        Authentik ile entegre uygulamalarınızı yönetin
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Uygulama
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{app.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {app.slug} • {app.provider}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {app.users} kullanıcı
                            </div>
                            <Badge
                              variant={
                                app.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {app.status === "active" ? "Aktif" : "Pasif"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Kullanıcılar ve Gruplar</CardTitle>
                      <CardDescription>
                        Kullanıcı hesaplarını ve grup üyeliklerini yönetin
                      </CardDescription>
                    </div>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Yeni Kullanıcı
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.username}
                            </div>
                            <div className="flex gap-1 mt-1">
                              {user.groups.map((group, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              Son giriş
                            </div>
                            <div className="text-sm font-medium">
                              {user.lastLogin}
                            </div>
                          </div>
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }
                          >
                            {user.status === "active" ? "Aktif" : "Pasif"}
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Providers Tab */}
            <TabsContent value="providers" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Kimlik Sağlayıcıları</CardTitle>
                      <CardDescription>
                        OAuth2, SAML ve LDAP sağlayıcılarını yapılandırın
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Sağlayıcı
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {providers.map((provider) => (
                      <Card key={provider.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Globe className="h-8 w-8 text-green-600" />
                            <Badge
                              variant={
                                provider.status === "configured"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {provider.status === "configured"
                                ? "Yapılandırıldı"
                                : "Beklemede"}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">
                            {provider.name}
                          </CardTitle>
                          <CardDescription>{provider.type}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Uygulamalar
                              </span>
                              <span className="font-medium">
                                {provider.applications}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-transparent"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Düzenle
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Aktif Oturumlar</CardTitle>
                  <CardDescription>
                    Kullanıcı oturumlarını izleyin ve yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              session.status === "active"
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Activity
                              className={`h-5 w-5 ${session.status === "active" ? "text-green-600" : "text-gray-600"}`}
                            />
                          </div>
                          <div>
                            <div className="font-semibold">{session.user}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.application} • {session.ip}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              Başlangıç
                            </div>
                            <div className="text-sm font-medium">
                              {session.started}
                            </div>
                          </div>
                          <Badge
                            variant={
                              session.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {session.status === "active"
                              ? "Aktif"
                              : "Süresi Doldu"}
                          </Badge>
                          {session.status === "active" && (
                            <Button variant="outline" size="sm">
                              <Lock className="h-4 w-4 mr-1" />
                              Sonlandır
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Authentik Ayarları</CardTitle>
                  <CardDescription>
                    Bağlantı ve güvenlik ayarlarını yapılandırın
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Authentik URL</Label>
                    <Input
                      id="url"
                      value={authentikUrl}
                      onChange={(e) => setAuthentikUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="token">API Token</Label>
                    <Input
                      id="token"
                      type="password"
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Kaydet
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsConnected(false)}
                    >
                      Bağlantıyı Kes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DatabaseLayout>
  );
}
