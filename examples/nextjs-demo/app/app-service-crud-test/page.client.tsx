"use client";

import * as React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";

// ---------------------------------------------------
// MODELS & CONTRACTS
// ---------------------------------------------------

export enum ListingType {
  Sale = "sale",
  Rent = "rent",
  Auction = "auction",
  Lease = "lease",
  Exchange = "exchange",
  Service = "service",
  DailyRent = "daily_rent",
  Other = "other",
}

export type ListingStatus =
  | "active"
  | "inactive"
  | "draft"
  | "pending"
  | "awaiting_approval"
  | "sold"
  | "expired"
  | "rejected"
  | "removed";

export interface CarListing {
  id: string;
  listingNo: string;
  listingType: ListingType;
  status: ListingStatus;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: { amount: number; currency: string };
  imageUrl: string;
  location: { country: string; city: string; district: string };
  listingDate: number;
  viewCount: number;
  favoriteCount: number;
}

// Request Contracts
export interface CreateCarListingRequest {
  listingType: ListingType;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: { amount: number; currency: string };
  location: { country: string; city: string; district: string };
}

export interface UpdateCarListingRequest {
  id: string;
  data: Partial<Omit<CarListing, "id" | "listingNo">>;
}

export interface DeleteCarListingRequest {
  id: string;
}

export interface GetCarListingByIdRequest {
  id: string;
}

export interface ListCarListingsRequest {
  filter?: {
    brand?: string;
    model?: string;
    year?: number;
    status?: ListingStatus;
  };
  sort?: {
    field: "price" | "listingDate" | "viewCount";
    order: "asc" | "desc";
  };
  page?: number;
  pageSize?: number;
}

// Response Contracts
export interface BaseResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: { page?: number; pageSize?: number; total?: number };
}

export interface CarListingSummaryResponse {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: { amount: number; currency: string };
  imageUrl: string;
  status: ListingStatus;
  location: { city: string; country: string };
  favoriteCount: number;
  viewCount: number;
}

export type CarListingDetailResponse = CarListing;

// ---------------------------------------------------
// MOCK CRUD TEST PAGE
// ---------------------------------------------------

export default function CarListingTestPage() {
  const [listings, setListings] = React.useState<CarListing[]>([
    {
      id: "1",
      listingNo: "GP-1001",
      listingType: ListingType.Sale,
      status: "active",
      title: "2020 BMW 320i",
      brand: "BMW",
      model: "3 Series",
      year: 2020,
      price: { amount: 850000, currency: "TRY" },
      imageUrl: "https://via.placeholder.com/150",
      location: { country: "TR", city: "İstanbul", district: "Kadıköy" },
      listingDate: Date.now(),
      viewCount: 120,
      favoriteCount: 5,
    },
  ]);

  const [open, setOpen] = React.useState(false);
  const [newCar, setNewCar] = React.useState<CreateCarListingRequest>({
    listingType: ListingType.Sale,
    title: "",
    brand: "",
    model: "",
    year: 2023,
    price: { amount: 0, currency: "TRY" },
    location: { country: "TR", city: "İstanbul", district: "" },
  });

  const handleAdd = () => {
    const newListing: CarListing = {
      ...newCar,
      id: Math.random().toString(),
      listingNo: "GP-" + Math.floor(Math.random() * 10000),
      imageUrl: "https://via.placeholder.com/150",
      status: "active",
      listingDate: Date.now(),
      viewCount: 0,
      favoriteCount: 0,
    };
    setListings([...listings, newListing]);
    setOpen(false);
  };


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Car Listings (Contracts + CRUD Test)
      </h1>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Add Car
          </button>
        </DialogTrigger>
        <DialogContent className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Yeni Araç Ekle</h2>
          <div className="space-y-3">
            <input
              className="border p-2 w-full"
              placeholder="Başlık"
              value={newCar.title}
              onChange={(e) => setNewCar({ ...newCar, title: e.target.value })}
            />
            <input
              className="border p-2 w-full"
              placeholder="Marka"
              value={newCar.brand}
              onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
            />
            <input
              className="border p-2 w-full"
              placeholder="Model"
              value={newCar.model}
              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            />
            <input
              className="border p-2 w-full"
              placeholder="Yıl"
              type="number"
              value={newCar.year}
              onChange={(e) =>
                setNewCar({ ...newCar, year: Number(e.target.value) })
              }
            />
            <input
              className="border p-2 w-full"
              placeholder="Fiyat"
              type="number"
              value={newCar.price.amount}
              onChange={(e) =>
                setNewCar({
                  ...newCar,
                  price: { ...newCar.price, amount: Number(e.target.value) },
                })
              }
            />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
              onClick={handleAdd}
            >
              Kaydet
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Listing No</th>
            <th className="p-2 border">Başlık</th>
            <th className="p-2 border">Marka</th>
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Fiyat</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((car) => (
            <tr key={car.id} className="border">
              <td className="p-2">{car.listingNo}</td>
              <td className="p-2">{car.title}</td>
              <td className="p-2">{car.brand}</td>
              <td className="p-2">{car.model}</td>
              <td className="p-2">
                {car.price.amount} {car.price.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
