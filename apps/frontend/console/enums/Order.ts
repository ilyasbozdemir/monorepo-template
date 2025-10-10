// Sipariş Durumu Enum
export enum OrderStatus {
    AwaitingConfirmation = "awaiting_confirmation",
    Confirmed = "confirmed",
    Delivered = "delivered",
    Cancelled = "cancelled",
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
    Paypal = "paypal",
    Stripe = "stripe",
    BankTransfer = "bank_transfer",
  }
  