"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, LogIn, UserPlus, KeyRound, LogOut, CheckCircle2, AlertCircle, Settings } from "lucide-react"

interface AuthUser {
  email: string
  name: string
  role: string
}

export default function PageClient() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState("")

  // Keycloak settings
  const [keycloakUrl, setKeycloakUrl] = useState("")
  const [keycloakRealm, setKeycloakRealm] = useState("")
  const [keycloakClientId, setKeycloakClientId] = useState("")
  const [keycloakEnabled, setKeycloakEnabled] = useState(false)

  // Auto-hide messages
  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!loginEmail || !loginPassword) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    // Mock login
    const mockUser: AuthUser = {
      email: loginEmail,
      name: loginEmail.split("@")[0],
      role: "user",
    }

    setCurrentUser(mockUser)
    setSuccess(`Hoş geldiniz, ${mockUser.name}!`)
    setLoginEmail("")
    setLoginPassword("")
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("Şifreler eşleşmiyor")
      return
    }

    if (registerPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır")
      return
    }

    // Mock register
    const newUser: AuthUser = {
      email: registerEmail,
      name: registerName,
      role: "user",
    }

    setCurrentUser(newUser)
    setSuccess(`Hesabınız oluşturuldu! Hoş geldiniz, ${newUser.name}!`)
    setRegisterName("")
    setRegisterEmail("")
    setRegisterPassword("")
    setRegisterConfirmPassword("")
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!forgotEmail) {
      setError("Lütfen email adresinizi girin")
      return
    }

    setSuccess(`Şifre sıfırlama bağlantısı ${forgotEmail} adresine gönderildi`)
    setForgotEmail("")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setSuccess("Başarıyla çıkış yaptınız")
  }

  const handleKeycloakSave = () => {
    if (!keycloakUrl || !keycloakRealm || !keycloakClientId) {
      setError("Lütfen tüm Keycloak ayarlarını doldurun")
      return
    }
    setKeycloakEnabled(true)
    setSuccess("Keycloak bağlantısı kaydedildi")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* User Status Card - Top Bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Auth Sistemi</h1>
                <p className="text-xs text-muted-foreground">Kimlik doğrulama test arayüzü</p>
              </div>
            </div>

            {currentUser ? (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Çıkış
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-muted/50 border-muted">
                <CardContent className="p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Giriş yapılmadı</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Auth Forms */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Kimlik Doğrulama
              </CardTitle>
              <CardDescription>Giriş yapın veya yeni hesap oluşturun</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="login">Giriş</TabsTrigger>
                  <TabsTrigger value="register">Kayıt</TabsTrigger>
                  <TabsTrigger value="forgot">Şifremi Unuttum</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Şifre
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <Button type="submit" className="w-full h-11" size="lg">
                      <LogIn className="h-4 w-4 mr-2" />
                      Giriş Yap
                    </Button>
                  </form>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Test için örnek kullanıcılar:</p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        onClick={() => {
                          setLoginEmail("admin@test.com")
                          setLoginPassword("test123")
                        }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        admin@test.com
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        onClick={() => {
                          setLoginEmail("user@test.com")
                          setLoginPassword("test123")
                        }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        user@test.com
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Ad Soyad
                      </Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Ahmet Yılmaz"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Şifre
                      </Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Şifre Tekrar
                      </Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <Button type="submit" className="w-full h-11" size="lg">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Hesap Oluştur
                    </Button>
                  </form>
                </TabsContent>

                {/* Forgot Password Tab */}
                <TabsContent value="forgot" className="space-y-4 mt-6">
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">
                        Şifre sıfırlama bağlantısı email adresinize gönderilecektir.
                      </p>
                    </div>

                    <Button type="submit" className="w-full h-11" size="lg">
                      <KeyRound className="h-4 w-4 mr-2" />
                      Şifre Sıfırlama Bağlantısı Gönder
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Keycloak Integration */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                Keycloak Entegrasyonu
              </CardTitle>
              <CardDescription>Harici kimlik doğrulama sağlayıcısına bağlanın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keycloak-url">Keycloak URL</Label>
                  <Input
                    id="keycloak-url"
                    type="url"
                    placeholder="https://keycloak.example.com"
                    value={keycloakUrl}
                    onChange={(e) => setKeycloakUrl(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keycloak-realm">Realm</Label>
                  <Input
                    id="keycloak-realm"
                    type="text"
                    placeholder="my-realm"
                    value={keycloakRealm}
                    onChange={(e) => setKeycloakRealm(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keycloak-client">Client ID</Label>
                  <Input
                    id="keycloak-client"
                    type="text"
                    placeholder="my-client-id"
                    value={keycloakClientId}
                    onChange={(e) => setKeycloakClientId(e.target.value)}
                    className="h-11"
                  />
                </div>

                <Button onClick={handleKeycloakSave} className="w-full h-11" size="lg">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Keycloak Ayarlarını Kaydet
                </Button>
              </div>

              {/* Keycloak Status */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${keycloakEnabled ? "bg-green-500" : "bg-gray-400"}`} />
                    <div>
                      <p className="text-sm font-medium">Keycloak Durumu</p>
                      <p className="text-xs text-muted-foreground">
                        {keycloakEnabled ? "Bağlı ve aktif" : "Bağlı değil"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keycloak Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Keycloak Nedir?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Keycloak, açık kaynaklı bir kimlik ve erişim yönetimi çözümüdür. Single Sign-On (SSO), sosyal medya
                  girişi, çok faktörlü kimlik doğrulama ve daha fazlasını destekler.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-primary">SSO Desteği</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-primary">OAuth 2.0</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-primary">SAML 2.0</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-primary">OpenID Connect</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
