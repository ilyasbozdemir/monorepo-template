import { TermsAgreement } from "./terms";
import { ICompanyProfile } from "./company-profile";
import { Address } from "./address";
import { IBusinessProfileCard } from "./business-profile-card";
import { ISupportRequest } from "./support-request";
import { IAccount, IBankAccount } from "./account";
import { UserPackage } from "./user-package";
import { UserRole } from "@/enums/user-role";
import { UserType } from "@/enums/UserType";

export type AvatarType = "upload" | "gravatar" | "initials";

export type SimpleDate = {
  day: number;
  month: number;
  year: number;
};
export interface IAppUserDTO {
  uid: string;
  email: string;
  name: string;
  surname?: string;
  company?: ICompanyProfile; //zamanla kalkıcak
  companies?: ICompanyProfile[]; //bu yerine gelicek ileriye dönük
  profileSummary?: string;
  roles: UserRole[];
  coverPhotoURL?: string;
  avatarURL?: string;
  gravatarURL?: string;
  avatarType?: AvatarType;
  listingImageURL?: string;
  createdAt: number;
  updatedAt: number;
  userType?: UserType;
  phone?: {
    countryCode: string;
    number: string;
  };
  package?: UserPackage;

  username?: string;
  requestedUsername?: string; // Kullanıcı tarafından talep edilen ancak onaylanmamış username
  usernameStatus?: "pending" | "approved" | "rejected" | "none"; // Kullanıcı adı talep durumu
  requestedUsernameDate?: number; // Kullanıcının username talep ettiği tarih (timestamp)
  rejectedUsernames?: {
    username: string;
    rejectionReason: string;
    rejectedDate: number;
  }[];
  gender?: "male" | "female" | "other";
  dateOfBirth?: SimpleDate;
  foundationDate?: SimpleDate;
  addresses?: Address[];
  plan?: any;
  country?: string;
  language?: string;
  isDevMode?: boolean;

  recovery?: {
    recoveryCodes?: {
      code: string;
      used: boolean;
      usedAt?: number;
    }[];
    email?: {
      value: string; // E-posta adresi
      verified: boolean; // E-posta doğrulama durumu
      codeSentAt?: number; // Kod gönderildiği zaman
    };
    whatsapp?: {
      value: string; // WhatsApp numarası
      verified: boolean; // WhatsApp doğrulama durumu
      codeSentAt?: number; // Kod gönderildiği zaman
    };
    sms?: {
      value: {
        countryCode: string;
        number: string;
      }; // Telefon numarası
      verified: boolean; // SMS doğrulama durumu
      codeSentAt?: number; // Kod gönderildiği zaman
    };
  };

  accountVerification?: {
    email: boolean;
    phone: boolean;
  };

  termsAccepted?: TermsAgreement[];

  // Kullanıcının eklediği sektör firmaları (örneğin, oto bayileri, elektrikçiler)
  businesses?: IBusinessProfileCard[]; // Eklenen işletmeler (sektörel firmalar)

  // Kullanıcının katıldığı chat'ler
  chats?: IChat[]; // Kullanıcının mesajlaştığı sohbetler

  // Kullanıcının destek talepleri (IAppUser ile ilişkili)
  supportRequests?: ISupportRequest[]; // Kullanıcının başvurmuş olduğu destek talepleri

  isBetaUser?: boolean;
  notificationPreferences?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    newsletter?: boolean;
    browser?: boolean;
    desktop?: boolean;
    digest?: "daily" | "weekly";
    quiet_hours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };

  // 2FA bilgileri

  security?: {
    twoFactorEnabled: boolean;
    twoFactorMethod: "sms" | "app" | null;
  };

  account?: IAccount; // Kullanıcının hesabı, bakiyesi gibi bilgileri tutacak alan
  bankAccounts?: IBankAccount[];

  // Yeni eklenen alanlar
  favorites?: {
    listings: string[]; // İlan ID'leri
  };
  savedSearches?: {
    searches: ISavedSearch[];
  };
}

// Kaydedilmiş arama modeli
export interface ISavedSearch {
  id: string;
  label: string;
  url: string;
  createdAt: string;
  lastUsedAt?: string;
}
