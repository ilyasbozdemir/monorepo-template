"use client";

import Link from "next/link";
import { Beaker, Cloud, Database, Settings, Shield } from "lucide-react";

export default function PageClient() {
  const cards = [
    {
      title: "MongoDB Testler",
      description: "UI üzerinden butonlarla kullanıcı testlerini çalıştırın.",
      href: "/mongodb-console-testler",
      icon: <Beaker className="text-3xl text-blue-500" />,
    },
    {
      title: "MongoDB Console",
      description: "DB arayüzü, Firebase Console benzeri deneyim.",
      href: "/mongodb-console",
      icon: <Database className="text-3xl text-green-500" />,
    },
    {
      title: "App Service CRUD Test",
      description: "xService / yService testleri için özel test sayfası.",
      href: "/app-service-crud-test",
      icon: <Settings className="text-3xl text-purple-500" />,
    },
    {
      title: "Auth Service CRUD Test",
      description: "xService / yService testleri için özel test sayfası.",
      href: "/auth-test-page",
      icon: <Shield className="text-3xl text-red-500" />,
    },
    {
      title: "Storage Service CRUD Test",
      description: "xService / yService testleri için özel test sayfası.",
      href: "/storage-test-page",
      icon: <Cloud className="text-3xl text-yellow-500" />,
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test ve Console Sayfaları</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="flex flex-col items-start p-6 bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-transform duration-200"
          >
            {card.icon}
            <h2 className="mt-4 text-xl font-semibold">{card.title}</h2>
            <p className="mt-2 text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
