"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ExternalLink,
  RefreshCw,
  FileText,
  Code,
  Server,
  AlertCircle,
  Minimize,
  Maximize,
} from "lucide-react";
import { DatabaseLayout } from "@/components/database/DatabaseLayout";

export default function SwaggerDocsPage() {
  const [swaggerUrl, setSwaggerUrl] = useState(
    "http://localhost:58837/swagger/v1/swagger.json",
  );
  const [swaggerData, setSwaggerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const loadSwaggerData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Swagger JSON yükleniyor:", swaggerUrl);

      const res = await fetch(swaggerUrl);
      if (!res.ok) throw new Error("Swagger JSON yüklenemedi");
      const data = await res.json();
      setSwaggerData(data);

      setTimeout(() => {
        setLoading(false);
        console.log("Swagger JSON yüklendi");
      }, 1000);
    } catch (err) {
      setError("Swagger JSON yüklenirken hata oluştu");
      setLoading(false);
      console.log("Swagger yükleme hatası:", err);
    }
  };

  useEffect(() => {
    loadSwaggerData();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
      if (e.key === "F11") {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen]);

  const RedocComponent = ({ spec }: { spec: any }) => {
    useEffect(() => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js";
      script.onload = () => {
        // @ts-ignore
        if (window.Redoc) {
          // @ts-ignore
          window.Redoc.init(
            spec,
            {
              scrollYOffset: 50,
              hideDownloadButton: false,
              theme: {
                colors: { primary: { main: "#0ea5e9" } },
                typography: {
                  fontSize: "14px",
                  fontFamily: "Inter, system-ui, sans-serif",
                },
              },
            },
            document.getElementById("redoc-container"),
          );
        }
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }, [spec]);

    return <div id="redoc-container" className="w-full h-auto" />;
  };

  const Layout = isFullscreen
    ? ({ children }: any) => <>{children}</>
    : DatabaseLayout;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">API Dokümantasyonu</h1>
            <p className="text-muted-foreground">
              Redocly ile Swagger/OpenAPI dokümantasyonu
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Küçült
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-2" />
                  Tam Ekran
                </>
              )}
            </Button>
            <Button onClick={loadSwaggerData} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Yenile
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Swagger dokümantasyonu yükleniyor...</span>
            </CardContent>
          </Card>
        )}

        {swaggerData && !loading && (
          <Tabs defaultValue="redoc" className="space-y-4">
            <TabsList>
              <TabsTrigger value="redoc">
                <Code className="h-4 w-4 mr-2" />
                Redocly Görünümü
              </TabsTrigger>
              <TabsTrigger value="raw">
                <FileText className="h-4 w-4 mr-2" />
                Ham JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="redoc" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <RedocComponent spec={swaggerData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Ham Swagger JSON</CardTitle>
                  <CardDescription>
                    Swagger dokümantasyonunun tam JSON formatı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                    <code>{JSON.stringify(swaggerData, null, 2)}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!swaggerData && !loading && !error && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Swagger Dokümantasyonu
                </h3>
                <p className="text-muted-foreground mb-4">
                  API dokümantasyonunu görüntülemek için Swagger JSON URL'sini
                  yükleyin
                </p>
                <Button onClick={loadSwaggerData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Dokümantasyonu Yükle
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
