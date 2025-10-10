"use client";

import type React from "react";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Database,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Bell,
  Activity,
  BarChart3,
  HardDrive,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  Code,
  Cloud,
  Shield,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DatabaseLayoutProps {
  children: React.ReactNode;
}

export function DatabaseLayout({ children }: DatabaseLayoutProps) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [showApiConsole, setShowApiConsole] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [exportCollection, setExportCollection] = useState("");
  const [exportType, setExportType] = useState("collection");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [importData, setImportData] = useState("");
  const [importType, setImportType] = useState("new");
  const [targetCollection, setTargetCollection] = useState("");
  const [importMode, setImportMode] = useState("replace");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userProfile = {
    name: "Admin",
    email: "admin@myorg.com",
    role: "Veritabanı Yöneticisi",
    avatar: "/admin-user-avatar.png",
    initials: "AK",
  };

  const availableCollections = [
    "kullanicilar",
    "urunler",
    "siparisler",
    "kategoriler",
    "yorumlar",
  ];

  const apiRequests = [
    {
      url: "/api/CollectionManagement/list",
      method: "GET",
      status: 200,
      time: "2 dakika önce",
      duration: "45ms",
    },
    {
      url: "/api/CollectionManagement/create?name=products",
      method: "POST",
      status: 201,
      time: "5 dakika önce",
      duration: "62ms",
    },
    {
      url: "/api/CollectionManagement/users",
      method: "GET",
      status: 200,
      time: "8 dakika önce",
      duration: "38ms",
    },
    {
      url: "/api/CollectionManagement/orders/123/update",
      method: "PUT",
      status: 200,
      time: "15 dakika önce",
      duration: "120ms",
    },
    {
      url: "/api/CollectionManagement/delete?name=temp",
      method: "DELETE",
      status: 200,
      time: "25 dakika önce",
      duration: "55ms",
    },
  ];

  const navItems = [
    { title: "Dashboard", icon: Database, path: "/" },
    {
      title: "Veritabanı Yönetimi",
      icon: HardDrive,
      path: "/database-management",
    },
    { title: "Yedekleme Yönetimi", icon: HardDrive, path: "/backup" },
    { title: "API Metadata", icon: FileText, path: "/api-metadata" },
    { title: "Geliştirici", icon: null, path: null, isHeader: true },
    { title: "SDK & Kod Örnekleri", icon: Code, path: "/sdk-examples" },
    { title: "Realtime & Webhooks", icon: Activity, path: "/realtime" },
    { title: "Kimlik Yönetimi", icon: Shield, path: "/auth" },
    { title: "Depolama Yönetimi", icon: Cloud, path: "/storage" },
    { title: "Araçlar", icon: null, path: null, isHeader: true },
    { title: "Analitik", icon: BarChart3, path: "/analytics" },
    { title: "Aktivite Günlüğü", icon: Activity, path: "/activity" },
    { title: "Ayarlar", icon: Settings, path: "/settings" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Koleksiyon arama:", searchTerm);
  };

  const handleLogout = () => {
    document.cookie =
      "setup_completed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/setup";
  };

  const handleExport = () => {
    const exportConfig = {
      type: exportType,
      collections:
        exportType === "bulk" ? selectedCollections : [exportCollection],
      format: exportFormat,
      timestamp: new Date().toISOString(),
    };

    console.log("Dışa aktarma başlatıldı:", exportConfig);

    const exportData = {
      ...exportConfig,
      recordCount: Math.floor(Math.random() * 1000) + 100,
      data: "Simulated export data...",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename =
      exportType === "bulk"
        ? `bulk_export_${Date.now()}.${exportFormat}`
        : `${exportCollection}_export_${Date.now()}.${exportFormat}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportModal(false);
    console.log("Dışa aktarma tamamlandı");
  };

  const handleImport = () => {
    const importConfig = {
      type: importType,
      targetCollection:
        importType === "existing" ? targetCollection : "yeni_koleksiyon",
      mode: importMode,
      dataPreview: importData.substring(0, 100) + "...",
    };

    console.log("İçe aktarma başlatıldı:", importConfig);

    try {
      JSON.parse(importData);
      console.log("JSON verisi geçerli, içe aktarma simüle ediliyor");

      setTimeout(() => {
        const recordCount = Math.floor(Math.random() * 50) + 10;
        const message =
          importType === "new"
            ? `Yeni koleksiyon oluşturuldu ve ${recordCount} kayıt eklendi!`
            : `Mevcut koleksiyona ${recordCount} kayıt ${importMode === "replace" ? "değiştirilerek" : "eklenerek"} aktarıldı!`;

        alert(message);
        setShowImportModal(false);
        setImportData("");
      }, 1000);
    } catch (error) {
      console.log("JSON verisi geçersiz:", error);
      alert("Geçersiz JSON formatı! Lütfen doğru JSON verisi girin.");
    }
  };

  const handleCollectionToggle = (collection: string, checked: boolean) => {
    if (checked) {
      setSelectedCollections([...selectedCollections, collection]);
    } else {
      setSelectedCollections(
        selectedCollections.filter((c) => c !== collection),
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex w-64 bg-card border-r border-gray-200 flex-col h-screen fixed left-0 top-0 z-10">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <div className="flex items-center mr-2 justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs">
            Logo
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">My Org</h1>
            <p className="text-xs text-muted-foreground">
              Veritabanı Yöneticisi
            </p>
          </div>
        </div>

        <div className="p-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Koleksiyonlarda ara..."
                className="pl-8 bg-muted border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {navItems.map((item, index) =>
              item.isHeader ? (
                <li
                  key={index}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase"
                >
                  {item.title}
                </li>
              ) : (
                <li key={index}>
                  <Link
                    href={item.path || "#"}
                    className={`flex items-center px-4 py-2 text-sm transition-colors ${
                      pathname === item.path
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4 mr-3" />}
                    {item.title}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={userProfile.avatar || "/placeholder.svg"}
                      alt={userProfile.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {userProfile.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {userProfile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile.role}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userProfile.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil Ayarları
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Sistem Ayarları
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mt-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Bağlantı Aktif</span>
            </div>
            <div className="mt-1">MongoDB via .NET API</div>
          </div>
        </div>
      </div>

      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden fixed z-30 w-64 bg-card border-r border-gray-200 flex flex-col h-screen transition-transform duration-200 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center">
          <div className="flex items-center mr-2 justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs">
            Logo
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">My Org</h1>
            <p className="text-xs text-muted-foreground">
              Veritabanı Yöneticisi
            </p>
          </div>
        </div>

        <div className="p-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Koleksiyonlarda ara..."
                className="pl-8 bg-muted border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {navItems.map((item, index) =>
              item.isHeader ? (
                <li
                  key={index}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase"
                >
                  {item.title}
                </li>
              ) : (
                <li key={index}>
                  <Link
                    href={item.path || "#"}
                    className={`flex items-center px-4 py-2 text-sm transition-colors ${
                      pathname === item.path
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4 mr-3" />}
                    {item.title}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={userProfile.avatar || "/placeholder.svg"}
                      alt={userProfile.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {userProfile.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {userProfile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile.role}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userProfile.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil Ayarları
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Sistem Ayarları
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mt-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Bağlantı Aktif</span>
            </div>
            <div className="mt-1">MongoDB via .NET API</div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-card border-b border-gray-200 h-14 flex items-center px-4 md:px-6 justify-between">
          <button
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-foreground">
            {navItems.find((item) => item.path === pathname)?.title ||
              "Dashboard"}
          </h1>
          <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiConsole(true)}
              className="whitespace-nowrap"
            >
              <Activity className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">API Konsolu</span>
            </Button>
            <Link href="/swagger-docs">
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Swagger API</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Yenile</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap bg-transparent"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Dışa Aktar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap bg-transparent"
              onClick={() => setShowImportModal(true)}
            >
              <Upload className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">İçe Aktar</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center space-x-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={userProfile.avatar || "/placeholder.svg"}
                      alt={userProfile.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {userProfile.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{userProfile.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hesap Menüsü</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Ayarlar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>

      <Dialog open={showApiConsole} onOpenChange={setShowApiConsole}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>API Konsolu</DialogTitle>
            <DialogDescription>
              Son .NET API istekleri ve yanıtları
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh]">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="px-4 py-2 text-left font-medium">
                      Endpoint
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Metod</th>
                    <th className="px-4 py-2 text-left font-medium">Durum</th>
                    <th className="px-4 py-2 text-left font-medium">Zaman</th>
                    <th className="px-4 py-2 text-left font-medium">Süre</th>
                  </tr>
                </thead>
                <tbody>
                  {apiRequests.map((request, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td
                        className="px-4 py-2 font-mono text-xs cursor-pointer hover:bg-muted/50 transition-colors select-all"
                        onClick={() => {
                          navigator.clipboard.writeText(request.url);
                          console.log("URL panoya kopyalandı:", request.url);
                        }}
                        title="URL'yi kopyalamak için tıklayın"
                      >
                        {request.url}
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            request.method === "GET" ? "outline" : "default"
                          }
                        >
                          {request.method}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          className={
                            request.status >= 200 && request.status < 300
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {request.time}
                      </td>
                      <td className="px-4 py-2">{request.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Input placeholder="API istek URL'si girin" className="flex-1" />
            <Button>İstek Gönder</Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  "https://localhost:7149/swagger/v1/swagger.json",
                  "_blank",
                )
              }
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Swagger
            </Button>
          </div>

          <DialogFooter className="sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Son {apiRequests.length} istek gösteriliyor
            </div>
            <Button variant="outline" onClick={() => setShowApiConsole(false)}>
              Kapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Veri Dışa Aktarma
            </DialogTitle>
            <DialogDescription>
              Dışa aktarma türünü ve seçeneklerini belirleyin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Dışa Aktarma Türü
              </label>
              <RadioGroup value={exportType} onValueChange={setExportType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="collection" id="collection" />
                  <Label htmlFor="collection">Tek Koleksiyon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bulk" id="bulk" />
                  <Label htmlFor="bulk">Toplu Dışa Aktarma</Label>
                </div>
              </RadioGroup>
            </div>

            {exportType === "collection" ? (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Koleksiyon Seçin
                </label>
                <Select
                  value={exportCollection}
                  onValueChange={setExportCollection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Dışa aktarılacak koleksiyonu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCollections.map((collection) => (
                      <SelectItem key={collection} value={collection}>
                        {collection}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Koleksiyonları Seçin
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {availableCollections.map((collection) => (
                    <div
                      key={collection}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={collection}
                        checked={selectedCollections.includes(collection)}
                        onCheckedChange={(checked) =>
                          handleCollectionToggle(collection, checked as boolean)
                        }
                      />
                      <Label htmlFor={collection} className="text-sm">
                        {collection}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCollections.length} koleksiyon seçildi
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                Dışa Aktarma Formatı
              </label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              İptal
            </Button>
            <Button
              onClick={handleExport}
              disabled={
                exportType === "collection"
                  ? !exportCollection
                  : selectedCollections.length === 0
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Dışa Aktar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Veri İçe Aktarma
            </DialogTitle>
            <DialogDescription>
              İçe aktarma seçeneklerini belirleyin ve JSON verisi girin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">
                İçe Aktarma Türü
              </label>
              <RadioGroup value={importType} onValueChange={setImportType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Koleksiyon Oluştur
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Mevcut Koleksiyona Ekle
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {importType === "existing" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Hedef Koleksiyon
                  </label>
                  <Select
                    value={targetCollection}
                    onValueChange={setTargetCollection}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Veri eklenecek koleksiyonu seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCollections.map((collection) => (
                        <SelectItem key={collection} value={collection}>
                          {collection}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">
                    İçe Aktarma Modu
                  </label>
                  <RadioGroup value={importMode} onValueChange={setImportMode}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="append" id="append" />
                      <Label
                        htmlFor="append"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4 text-green-600" />
                        Mevcut Verilere Ekle
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="replace" id="replace" />
                      <Label
                        htmlFor="replace"
                        className="flex items-center gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Mevcut Verileri Değiştir
                      </Label>
                    </div>
                  </RadioGroup>
                  {importMode === "replace" && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Dikkat: Bu işlem mevcut tüm verileri silecektir!
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                JSON Verisi
              </label>
              <Textarea
                placeholder={
                  importType === "new"
                    ? '{"name": "örnek", "value": "veri"}'
                    : '{"name": "yeni_kayit", "value": "eklenecek_veri"}'
                }
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Desteklenen format: JSON</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportModal(false)}>
              İptal
            </Button>
            <Button
              onClick={handleImport}
              disabled={
                !importData.trim() ||
                (importType === "existing" && !targetCollection)
              }
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              İçe Aktar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
