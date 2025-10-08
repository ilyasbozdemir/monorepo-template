export interface PackageFeature {
  name: string;
  value: string | number | boolean;
  isIncluded: boolean;
}

export interface Package {
  id: string;
  name: string;
  type: "bireysel" | "kurumsal" | "boost" | "hikaye";
  inheritsLowerLevels?: boolean; // true ise alt seviyeleri kapsar, false ise kapsamaz
  level?: number; // örn: 1 = en düşük, 5 = en yüksek
  category?: string;
  period?: number;
  price: {
    amount: number;
    currency: string;
  };

  packageBehaviour?: {
    compressionState: {
      enabled: boolean;
      maxSizeMB?: number;
      maxWidthOrHeight?: number;
      initialQuality?: number;
    };
    convertState: {
      enabled: boolean;
      convertToFormat?:
        | "original"
        | "webp"
        | "jpeg"
        | "avif"
        | "png"
        | "tiff"
        | "bmp";
    };
    limits?: {
      listingLimit?: number;
      photoLimit?: number;
      urgentAdLimit?: number;
      colorAdEnabled?: boolean;
      videoUploadLimit?: number;
      fileSizeMBLimit?: number;
      boostLimit?: number;
    };
  };
  featured?: boolean; // Öne çıkan paket mi?
  features: PackageFeature[];


  badge: {
    colorScheme?: string;
    text?: string; // Rozet metni (örn: "En Popüler", "Yeni", "Sınırlı Süre")
  };
}

export interface PackageCategory {
  id: string;
  name: string;
  description: string;
  packages: Package[];
}
