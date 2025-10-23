import {
  Activity,
  Database,
  HardDrive,
  Layers,
  Server,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";


/*
bu sayfa, veritabanı yönetim konsolunun ana giriş noktasıdır.
Nosql için iki tanedir yeni olan  için backende tamamen baglanıcaktır ,


*/

export default function DBPage() {

  const statusData = [
    {
      label: "API Sunucusu",
      value: "Çalışıyor",
      status: "online",
      icon: Activity,
      detail: "Response: 45ms",
      trend: "+2.3%",
      trendUp: true,
    },
    {
      label: "Veritabanı",
      value: "3 Aktif",
      status: "online",
      icon: HardDrive,
      detail: "Uptime: 99.9%",
      trend: "Stabil",
      trendUp: true,
    },
  ];

  const services = [
    {
      title: "NoSQL Veritabanı Yönetimi",
      description: "MongoDB koleksiyonlarınızı yönetin",
      icon: Layers,
      href: "/database/nosql",
      iconColor: "text-blue-500",
    },
      {
      title: "NoSQL Veritabanı Yönetimi 2",
      description: "MongoDB koleksiyonlarınızı yönetin",
      icon: Layers,
      href: "/database/nosql-2",
      iconColor: "text-blue-500",
    },
    {
      title: "SQL Veritabanı Yönetimi",
      description: "İlişkisel veritabanlarınızı yönetin",
      icon: Database,
      href: "/database/sql",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div
            className="grid  gap-4"
            style={{
              gridTemplateColumns:
                `repeat(${statusData.length}, minmax(0, 1fr))`,
            }}
          >
            {statusData.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.label}
                  className="p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    {item.status === "online" && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold mb-2">{item.value}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {item.detail}
                      </span>
                      <span
                        className={`flex items-center gap-0.5 font-medium ${
                          item.trendUp
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.trendUp && <TrendingUp className="size-3" />}
                        {item.trend}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.href} href={service.href}>
                  <Card className="p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-secondary group-hover:bg-secondary/80 transition-colors">
                        <Icon className={`size-5 ${service.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
