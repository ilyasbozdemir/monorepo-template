"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatabaseLayout } from "@/components/database/DatabaseLayout";
import {
  Search,
  RefreshCw,
  Code,
  Database,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiParameter {
  name: string;
  source: string;
  type: string;
  isRequired: boolean;
}

interface RequestExample {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
}

interface ApiController {
  controller: string;
  action: string;
  httpMethod: string;
  route: string;
  parameters: ApiParameter[];
  requestExample: RequestExample;
}

interface ApiMetadata {
  baseUrl: string;
  headers: {
    authorization: string;
  };
  versions: string[];
  controllers: ApiController[];
}

export default function ApiMetadataPage() {
  const [metadata, setMetadata] = useState<ApiMetadata>({
    baseUrl: "",
    headers: { authorization: "" },
    versions: [],
    controllers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [expandedControllers, setExpandedControllers] = useState<Set<string>>(
    new Set(),
  );
  const [apiUrl, setApiUrl] = useState(
    "http://localhost:58837/api/ApiMetadata?api-version=v1",
  );

  const fetchMetadata = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const normalized: ApiMetadata = {
        baseUrl: data.BaseUrl || data.baseUrl || "",
        headers: data.Headers || data.headers || {},
        versions: data.Versions || data.versions || [],
        controllers: data.Controllers || data.controllers || [],
      };

      setMetadata(normalized);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    console.log("Fetched Metadata:", metadata);
  }, [metadata]);


const filteredControllers =
  metadata?.controllers?.filter(
    (controller) =>
      controller.controller !== "ApiMetadata" && 
      (controller.controller?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        controller.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        controller.route?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        controller.httpMethod?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const groupedControllers = filteredControllers.reduce(
    (acc, controller) => {
      const name = controller.controller || "Unknown";
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(controller);
      return acc;
    },
    {} as Record<string, ApiController[]>,
  );

  const getMethodColor = (method: string) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "POST":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "PUT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "PATCH":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "FromQuery":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case "FromRoute":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "FromBody":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200";
      case "FromHeader":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "FromForm":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };
  const getSourceLabel = (source: string) => {
    switch (source) {
      case "FromQuery":
        return "Sorgu Parametresi";
      case "FromRoute":
        return "URL Parametresi";
      case "FromBody":
        return "İstek Gövdesi";
      case "FromHeader":
        return "Header Bilgisi";
      case "FromForm":
        return "Form Verisi";
      default:
        return source;
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const toggleController = (controllerName: string) => {
    const newExpanded = new Set(expandedControllers);
    if (newExpanded.has(controllerName)) {
      newExpanded.delete(controllerName);
    } else {
      newExpanded.add(controllerName);
    }
    setExpandedControllers(newExpanded);
  };

  const formatRequestExample = (example: RequestExample) => {
    let result = `${example.method} ${example.url}\n`;

    if (example.headers && Object.keys(example.headers).length > 0) {
      result += "\nHeaders:\n";
      Object.entries(example.headers).forEach(([key, value]) => {
        result += `  ${key}: ${value}\n`;
      });
    }

    if (example.body && Object.keys(example.body).length > 0) {
      result += "\nBody:\n";
      result += JSON.stringify(example.body, null, 2);
    }

    return result;
  };

  if (loading) {
    return (
      <DatabaseLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">API metadata yükleniyor...</p>
          </div>
        </div>
      </DatabaseLayout>
    );
  }

  if (error) {
    return (
      <DatabaseLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle>Bağlantı Hatası</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              <div className="space-y-2">
                <label className="text-sm font-medium">API URL:</label>
                <Input
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:58837/api/ApiMetadata"
                />
              </div>
              <Button onClick={fetchMetadata} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </Button>
            </CardContent>
          </Card>
        </div>
      </DatabaseLayout>
    );
  }

  if (!metadata) return null;

  return (
    <DatabaseLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">API Metadata</h1>
            <p className="text-muted-foreground">
              Otomatik API keşfi ve dokümantasyonu
            </p>
          </div>
          <Button onClick={fetchMetadata} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>

        {metadata && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Base URL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {metadata.baseUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(metadata.baseUrl, "baseUrl")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedItem === "baseUrl" ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  API Versiyonları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {metadata?.versions?.length ? (
                    metadata.versions.map((version) => (
                      <Badge key={version} variant="outline">
                        {version}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Versiyon bulunamadı
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Toplam Endpoint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metadata?.controllers?.length ?? 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Controller, action, route veya method ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredControllers.length} endpoint
          </Badge>
        </div>

        <div className="space-y-4">
          {Object.entries(groupedControllers).map(
            ([controllerName, endpoints]) => {
              const isExpanded = expandedControllers.has(controllerName);
              return (
                <Card key={controllerName}>
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleController(controllerName)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <Database className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">
                            {controllerName}
                          </CardTitle>
                          <CardDescription>
                            {endpoints.length} endpoint
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">{endpoints.length}</Badge>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-4">
                      {endpoints.map((endpoint, index) => (
                        <Card key={index} className="border-muted">
                          <CardContent className="pt-6">
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">
                                  Genel
                                </TabsTrigger>
                                <TabsTrigger value="parameters">
                                  Parametreler
                                </TabsTrigger>
                                <TabsTrigger value="example">
                                  Örnek İstek
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent
                                value="overview"
                                className="space-y-3"
                              >
                                <div className="flex items-center gap-3">
                                  <Badge
                                    className={getMethodColor(
                                      endpoint.httpMethod,
                                    )}
                                  >
                                    {endpoint.httpMethod}
                                  </Badge>
                                  <code className="text-sm font-mono bg-muted px-3 py-1 rounded flex-1">
                                    {endpoint.route}
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      copyToClipboard(
                                        endpoint.route,
                                        `route-${index}`,
                                      )
                                    }
                                    className="h-8 w-8 p-0"
                                  >
                                    {copiedItem === `route-${index}` ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Action:
                                  </span>
                                  <Badge variant="outline">
                                    {endpoint.action}
                                  </Badge>
                                </div>
                              </TabsContent>

                              <TabsContent
                                value="parameters"
                                className="space-y-3"
                              >
                                {endpoint.parameters &&
                                endpoint.parameters.length > 0 ? (
                                  <div className="space-y-2">
                                    {endpoint.parameters.map(
                                      (param, pIndex) => (
                                        <div
                                          key={pIndex}
                                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                        >
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                              <code className="text-sm font-mono font-semibold">
                                                {param.name}
                                              </code>
                                              {param.isRequired && (
                                                <Badge
                                                  variant="destructive"
                                                  className="text-xs"
                                                >
                                                  Zorunlu
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                className={getSourceColor(
                                                  param.source,
                                                )}
                                                variant="outline"
                                              >
                                                {getSourceLabel(param.source)}
                                              </Badge>

                                              <span className="text-xs text-muted-foreground">
                                                Type: <code>{param.type}</code>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground text-center py-4">
                                    Bu endpoint parametre gerektirmiyor
                                  </p>
                                )}
                              </TabsContent>

                              <TabsContent
                                value="example"
                                className="space-y-3"
                              >
                                <div className="relative">
                                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                                    <code>
                                      {formatRequestExample(
                                        endpoint.requestExample,
                                      )}
                                    </code>
                                  </pre>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      copyToClipboard(
                                        formatRequestExample(
                                          endpoint.requestExample,
                                        ),
                                        `example-${index}`,
                                      )
                                    }
                                    className="absolute top-2 right-2 h-8 w-8 p-0"
                                  >
                                    {copiedItem === `example-${index}` ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  )}
                </Card>
              );
            },
          )}
        </div>

        {filteredControllers.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Endpoint bulunamadı
            </h3>
            <p className="text-muted-foreground">
              Arama kriterlerinizi değiştirip tekrar deneyin.
            </p>
          </div>
        )}
      </div>
    </DatabaseLayout>
  );
}
