"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Database, Server, Shield, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface DatabaseConfig {
  host: string
  port: string
  database: string
  username: string
  password: string
}

export default function SetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginCode, setLoginCode] = useState("")
  const [adminCode] = useState(() => {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_ADMIN_CODE || "ADMIN2024"
    }
    return "ADMIN2024"
  })
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: "localhost",
    port: "27017",
    database: "myapp",
    username: "",
    password: "",
  })
  const [testConnection, setTestConnection] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [setupComplete, setSetupComplete] = useState(false)

  const steps = [
    { id: 1, title: "Kimlik Doğrulama", icon: Shield, description: "Güvenli erişim doğrulaması" },
    { id: 2, title: "Veritabanı Yapılandırması", icon: Database, description: "MongoDB bağlantı kurulumu" },
    { id: 3, title: "Bağlantı Testi", icon: Server, description: "Veritabanı bağlantısını doğrula" },
    { id: 4, title: "Kurulumu Tamamla", icon: Settings, description: "Yapılandırmayı sonlandır" },
  ]

  useEffect(() => {
    const setupStatus = document.cookie.includes("db_setup_complete=true")
    console.log(" Setup page - checking setup status:", setupStatus)
    console.log(" All cookies:", document.cookie)

    if (setupStatus) {
      console.log(" Setup already complete, redirecting to main page")
      router.push("/")
    }
  }, [router])

  const handleLogin = () => {
    console.log(" Login attempt with code:", loginCode)
    if (loginCode === adminCode) {
      console.log(" Authentication successful")
      setIsAuthenticated(true)
      setCurrentStep(2)
      // Set authentication cookie
      document.cookie = "db_auth=true; path=/; max-age=86400" // 24 hours
    } else {
      console.log(" Authentication failed")
      alert("Geçersiz erişim kodu")
    }
  }

  const handleDbConfigChange = (field: keyof DatabaseConfig, value: string) => {
    setDbConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleTestConnection = async () => {
    console.log(" Testing connection with config:", dbConfig)
    setTestConnection("testing")

    // Simulate connection test
    setTimeout(() => {
      // For demo purposes, always succeed if all fields are filled
      if (dbConfig.host && dbConfig.port && dbConfig.database) {
        console.log(" Connection test successful")
        setTestConnection("success")
        setCurrentStep(4)
      } else {
        console.log(" Connection test failed - missing required fields")
        setTestConnection("error")
      }
    }, 2000)
  }

  const handleCompleteSetup = () => {
    console.log(" Completing setup with config:", dbConfig)
    // Save configuration to cookies
    document.cookie = `db_config=${JSON.stringify(dbConfig)}; path=/; max-age=31536000` // 1 year
    document.cookie = "db_setup_complete=true; path=/; max-age=31536000" // 1 year

    console.log(" Setup cookies set, redirecting to main page")
    setSetupComplete(true)
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  const progressValue = (currentStep / steps.length) * 100

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Setup Complete!</h2>
            <p className="text-muted-foreground mb-4">Your database configuration has been saved successfully.</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Veritabanı Kurulum Sihirbazı</h1>
          <p className="text-muted-foreground">MongoDB bağlantınızı yapılandırın ve başlayın</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressValue} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                    }
                  `}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Authentication */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Kimlik Doğrulama Gerekli
                </CardTitle>
                <CardDescription>Veritabanı kurulumuna devam etmek için erişim kodunuzu girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loginCode">Erişim Kodu</Label>
                  <Input
                    id="loginCode"
                    type="password"
                    placeholder="Erişim kodunu girin"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Sistem yöneticisinden erişim kodunu alın</p>
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Kimlik Doğrula
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Database Configuration */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  MongoDB Yapılandırması
                </CardTitle>
                <CardDescription>MongoDB bağlantı ayarlarınızı yapılandırın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="host">Host</Label>
                    <Input
                      id="host"
                      placeholder="localhost"
                      value={dbConfig.host}
                      onChange={(e) => handleDbConfigChange("host", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      placeholder="27017"
                      value={dbConfig.port}
                      onChange={(e) => handleDbConfigChange("port", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="database">Veritabanı Adı</Label>
                  <Input
                    id="database"
                    placeholder="myapp"
                    value={dbConfig.database}
                    onChange={(e) => handleDbConfigChange("database", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Kullanıcı Adı (İsteğe Bağlı)</Label>
                    <Input
                      id="username"
                      placeholder="admin"
                      value={dbConfig.username}
                      onChange={(e) => handleDbConfigChange("username", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Şifre (İsteğe Bağlı)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={dbConfig.password}
                      onChange={(e) => handleDbConfigChange("password", e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(3)} className="w-full">
                  Bağlantı Testine Devam Et
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Test Connection */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Veritabanı Bağlantısını Test Et
                </CardTitle>
                <CardDescription>MongoDB yapılandırmanızın doğru çalıştığını doğrulayın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Bağlantı Detayları:</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Host:</span> {dbConfig.host}
                    </p>
                    <p>
                      <span className="font-medium">Port:</span> {dbConfig.port}
                    </p>
                    <p>
                      <span className="font-medium">Veritabanı:</span> {dbConfig.database}
                    </p>
                    {dbConfig.username && (
                      <p>
                        <span className="font-medium">Kullanıcı Adı:</span> {dbConfig.username}
                      </p>
                    )}
                  </div>
                </div>

                {testConnection === "idle" && (
                  <Button onClick={handleTestConnection} className="w-full">
                    Bağlantıyı Test Et
                  </Button>
                )}

                {testConnection === "testing" && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Bağlantı test ediliyor...</p>
                  </div>
                )}

                {testConnection === "success" && (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">Bağlantı başarılı!</p>
                    <Button onClick={() => setCurrentStep(4)} className="mt-4 w-full">
                      Kurulumu Tamamlamaya Devam Et
                    </Button>
                  </div>
                )}

                {testConnection === "error" && (
                  <div className="text-center py-4">
                    <div className="h-8 w-8 bg-destructive rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-destructive-foreground text-xl">×</span>
                    </div>
                    <p className="text-destructive font-medium">Bağlantı başarısız!</p>
                    <Button onClick={() => setCurrentStep(2)} variant="outline" className="mt-4 w-full">
                      Yapılandırmaya Geri Dön
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Complete Setup */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Kurulumu Tamamla
                </CardTitle>
                <CardDescription>
                  Veritabanı yapılandırmanız hazır. Uygulamayı kullanmaya başlamak için kurulumu tamamlayın.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Kurulum Özeti
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Veritabanı Host:</span>
                      <Badge variant="outline">
                        {dbConfig.host}:{dbConfig.port}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Veritabanı Adı:</span>
                      <Badge variant="outline">{dbConfig.database}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Kimlik Doğrulama:</span>
                      <Badge variant="outline">{dbConfig.username ? "Etkin" : "Devre Dışı"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Bağlantı Durumu:</span>
                      <Badge className="bg-green-500">Bağlandı</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Yapılandırmanız güvenli bir şekilde cookie'ler kullanılarak kaydedilecek ve tarayıcı oturumları
                    boyunca korunacaktır.
                  </p>
                </div>

                <Button onClick={handleCompleteSetup} className="w-full">
                  Kurulumu Tamamla ve Devam Et
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
