"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2, Database } from "lucide-react";

import { AppApiClientConfig } from "@monorepo/core";
import { AppApiClient, getDatabase } from "@monorepo/app";

import { CarListing } from "@/models/car-listing";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { isStaging, isProduction } from "@monorepo/core";

const serverBaseUrl = "http://localhost:58837"

const apiKey = isStaging
  ? process.env.MONGO_APIKEY_STAGING!
  : process.env.MONGO_APIKEY_DEVELOPMENT!;

const dbName = isStaging ? "staging-mainappdb" : "mainappdb";

const gpConfig: AppApiClientConfig = {
  apiKey,
  serverBaseUrl,
  dbName,
};

export default function MongoDbTestingPage() {
  const [activeIndex, setActiveIndex] = useState<"query" | "result" | "raw">(
    "query"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[] | { error: string }>([]);

  const handleTestQuery = async () => {
    setLoading(true);
    try {
      const app = new AppApiClient(gpConfig);

      const db = getDatabase(app);

      const carlistingsColleciton = db.collection<CarListing>("car_listings");

      const activeSaleListings = await carlistingsColleciton.aggregate([
        {
          $match: {
            status: "active",
            listingType: "sale",
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            variantTitle: 1,
            brand: 1,
            model: 1,
            year: 1,
            price: 1,
            imageUrl: 1,
            location: 1,
            mileage: 1,
          },
        },
        {
          $sort: {
            "price.amount": 1, // fiyat düşükten yükseğe
          },
        },
        {
          $limit: 2,
        },
      ]);

      setResult(activeSaleListings);
    } catch (err: any) {
      setResult({ error: err.message || err.toString() });
    } finally {
      setActiveIndex("raw");
    }
    setLoading(false);
  };

  return (
    <div className="container max-w-lg mx-auto">
      <Tabs
        value={activeIndex}
        onValueChange={(val) =>
          setActiveIndex(val as "query" | "result" | "raw")
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="query">Sorguyu Çalıştır</TabsTrigger>
          <TabsTrigger value="card">Sonucu Card</TabsTrigger>
          <TabsTrigger value="raw">Sonucu Raw</TabsTrigger>
        </TabsList>

        {/* Query Tab */}
        <TabsContent value="query">
          <Card className="flex-2 max-w-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Database className="h-6 w-6" />
                MongoDB Testing
              </CardTitle>
              <CardDescription>
                Aktif satış ilanları ve JSON çıktısı
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                onClick={handleTestQuery}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Query Çalışıyor...
                  </>
                ) : (
                  "🚀 Test Query Çalıştır"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Card Görünüm Tab */}
        <TabsContent value="card">
          <div className="flex flex-col gap-6">
            {Array.isArray(result) && result.length > 0 ? (
              result.map((listing) =>
                // Eğer CarListing objesi varsa kart olarak göster
                "_id" in listing ? (
                  <Card key={listing._id} className="shadow-md">
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-t-md"
                    />
                    <CardContent>
                      <CardHeader>
                        <CardTitle>{listing.title}</CardTitle>
                        <CardDescription>
                          {listing.brand} {listing.model} • {listing.year}
                        </CardDescription>
                      </CardHeader>
                      <p className="mt-2 font-semibold">
                        {listing.price.amount.toLocaleString()}{" "}
                        {listing.price.currency}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {listing.location.city}, {listing.location.district},{" "}
                        {listing.location.country}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {listing.mileage.value.toLocaleString()}{" "}
                        {listing.mileage.unit}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  // CarListing değilse JSON olarak göster
                  <pre className="p-4 bg-gray-100 rounded-md overflow-auto text-sm">
                    {JSON.stringify(listing, null, 2)}
                  </pre>
                )
              )
            ) : (
              <p className="text-gray-500 col-span-full">
                Gösterilecek liste yok
              </p>
            )}
          </div>
        </TabsContent>

        {/* Raw Görünüm Tab */}
        <TabsContent value="raw">
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
