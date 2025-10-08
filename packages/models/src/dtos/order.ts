// src/interfaces/Order.ts

import { Address } from "./address";

// Sipariş Durumu Enum
export enum OrderStatus {
  AwaitingConfirmation = "awaiting_confirmation",
  Confirmed = "confirmed",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Refunded = "refunded",
}

// Ödeme Durumu Enum
export enum PaymentStatus {
  AwaitingPayment = "awaiting_payment",
  UnderReview = "under_review",
  PartiallyPaid = "partially_paid",
  FullyPaid = "fully_paid",
  Refunded = "refunded",
  PaymentFailed = "payment_failed",
}

// Kargo Durumu Enum
export enum ShippingStatus {
  AwaitingShipment = "awaiting_shipment",
  Shipped = "shipped",
  Delivered = "delivered",
  DeliveryFailed = "delivery_failed",
}

// Ödeme Yöntemi Enum
export enum PaymentMethod {
  Iyzico = "iyzico",
  PayTR = "paytr",
  Paypal = "paypal",
  Stripe = "stripe",
  BankTransfer = "bank_transfer",
  CashOnDelivery = "cash_on_delivery", // Kapıda Nakit Ödeme
}

// İade Ödeme Durumu Enum
export enum RefundPaymentStatus {
  AwaitingRefund = "awaiting_refund",
  Refunded = "refunded",
  RefundFailed = "refund_failed",
}

// Sipariş Türü Enum
export enum OrderType {
  Physical = "physical",
  Digital = "digital",
}

// Temel Sipariş (BaseOrder) Interface'i
export interface BaseOrder {
  id: string;
  orderNumber: string; // Sipariş numarası (Örn: "ORD-20230921-12345")
  userId: string; // Kullanıcı ID'si
  userEmail: string; // Kullanıcı e-posta adresi
  items: OrderItem[]; // Sipariş içindeki ürünler
  totalAmount: number; // Ürünlerin toplam tutarı
  subTotal: number; // Ara toplam
  currency: string; // Para birimi (örn: "TRY", "USD", "EUR")
  orderStatus: OrderStatus; // Sipariş durumu
  paymentStatus: PaymentStatus; // Ödeme durumu
  paymentMethod: PaymentMethod; // Ödeme yöntemi
  customerName: string; // Müşteri adı
  customerSurname: string; // Müşteri soyadı
  customerPhone: string; // Müşteri telefon numarası
  customerEmail: string; // Müşteri e-posta adresi
  orderDate: number; // Sipariş tarihi
  createdAt: number; // Sipariş oluşturulma tarihi
  updatedAt: number; // Sipariş güncellenme tarihi
  note?: string; // Müşteri notu (opsiyonel)
  adminNote?: string; // Admin notu (müşteri görmez)
}

// Fiziksel Ürün Siparişi (PhysicalOrder) Interface'i
export interface PhysicalOrder extends BaseOrder {
  orderType: OrderType.Physical; // Sipariş türü: fiziksel
  shippingCost: number; // Kargo ücreti
  shippingStatus: ShippingStatus; // Kargo durumu
  shippingAddress: Address; // Gönderim adresi
  billingAddress?: Address; // Fatura adresi (opsiyonel)
  shippingCompany?: string; // Kargo firması
  trackingNumber?: string; // Kargo takip numarası
  deliveryDate?: number; // Tahmini teslimat tarihi
}

// Dijital Ürün Siparişi (DigitalOrder) Interface'i
export interface DigitalOrder extends BaseOrder {
  orderType: OrderType.Digital; // Sipariş türü: dijital
  accessDetails: string; // Dijital içerik erişim bilgileri (örneğin: indirme linki)
}

// Fiziksel ve Dijital Order Union Tipi

// Sipariş Ürünü (OrderItem) Interface'i
export interface OrderItem {
  orderItemId: string; // Sipariş içindeki benzersiz ürün ID'si
  productId: string; // Ürün ID'si
  orderId: string; // Sipariş ID'si
  productName: string; // Ürün adı
  productVariantCode?: string; // Varyant kodu (örneğin: renk, boyut)
  quantity: number; // Ürün miktarı
  unitPrice: number; // Birim fiyat
  totalPrice: number; // Toplam fiyat (miktar x birim fiyat)
  imageUrl?: string; // Ürün resmi URL'si
  size?: string; // Ürün bedeni (opsiyonel)
  color?: string; // Ürün rengi (opsiyonel)
  productSlug: string; // Ürün slug'ı (URL dostu adı)
}

export type Order = PhysicalOrder | DigitalOrder;

/**
 * Bir siparişin özetini temsil eder, yalnızca kullanıcı arayüzünde gösterim amacıyla kullanılır.
 * Bu veri yapısı, sipariş kimliği, toplam tutar, müşteri bilgileri ve geçerli vergiler veya ek ücretler gibi
 * sipariş hakkında anahtar bilgileri sağlar.
 *
 * Bu özet, tam sipariş detaylarını içermez; hızlı referans ve görüntüleme amacıyla siparişin
 * kısa bir anlık görüntüsünü sunar.
 */
export interface OrderSummary {
  orderId: string; // Siparişin benzersiz ID'si
  orderNumber: string; // Sipariş numarası (örn: "ORD-20230921-12345")
  userId: string; // Kullanıcı ID'si
  orderDate: number; // Sipariş tarihi (Unix timestamp)
  totalAmount: number; // Ürünlerin toplam tutarı (vergi ve ek ücretler hariç)
  currency: string; // Para birimi (örn: "USD", "EUR")
  itemCount: number; // Sipariş içindeki toplam ürün sayısı
  orderType: OrderType; // Sipariş türü ("physical" veya "digital")

  // Ödeme ve Durum Bilgileri
  status: OrderStatus; // Sipariş durumu (örn: "awaiting_confirmation")
  paymentStatus: PaymentStatus; // Ödeme durumu (örn: "fully_paid")
  paymentMethod: PaymentMethod; // Ödeme yöntemi (örn: "stripe", "cash_on_delivery")

  // Ek Maliyetler
  taxAmount?: number; // Vergi tutarı (opsiyonel)
  shippingCost?: number; // Kargo maliyeti (fiziksel siparişler için geçerli)
  cashOnDeliveryFee?: number; // Kapıda ödeme ek ücreti (fiziksel siparişlerde geçerli)
  discountAmount?: number; // Uygulanan indirim tutarı (opsiyonel)

  // Toplam Tutarlar
  subTotal: number; // Ara toplam (ürünlerin vergisiz toplam tutarı)
  totalAmountWithExtras: number; // Ek maliyetlerle toplam tutar (vergi, kargo, kapıda ödeme ücreti vb. dahil)

  // Müşteri Bilgileri
  customerName: string; // Müşteri adı
  customerSurname: string; // Müşteri soyadı
  customerPhone: string; // Müşteri telefon numarası
  customerEmail: string; // Müşteri e-posta adresi
}
