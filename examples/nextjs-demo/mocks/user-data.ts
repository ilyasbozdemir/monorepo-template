import { UserRole } from "@/enums/user-role";
import { UserType } from "@/enums/UserType";
import { IAppUser } from "@/models/app-user";

export const mockUser: IAppUser = {
  uid: "user-123",
  email: "ilyas.bozdemir@example.com",
  name: "İlyas",
  surname: "Bozdemir",
  roles: [UserRole.Admin],
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 gün önce
  updatedAt: Date.now(),
  userType: UserType.Individual,
  username: "ilyasb",
  requestedUsername: "ilyasb2",
  usernameStatus: "pending",
  requestedUsernameDate: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 gün önce
  rejectedUsernames: [
    {
      username: "ilyas123",
      rejectionReason: "Uygun değil",
      rejectedDate: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 gün önce
    },
  ],
  gender: "male",
  dateOfBirth: { day: 15, month: 3, year: 1990 },

  plan: { name: "Premium", expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30 },
  country: "TRNC",
  language: "tr",
  isDevMode: true,
  recovery: {
    email: { value: "ilyas.bozdemir@example.com", verified: true },
    sms: {
      value: { countryCode: "+90", number: "5321234567" },
      verified: false,
    },
  },
  accountVerification: { email: true, phone: false },
  termsAccepted: [],
  chats: [],
  supportRequests: [],
  isBetaUser: true,
  notificationPreferences: {
    email: true,
    sms: false,
    push: true,
    newsletter: true,
    digest: "daily",
    quiet_hours: { enabled: true, start: "22:00", end: "07:00" },
  },
  security: { twoFactorEnabled: true, twoFactorMethod: "sms" },
  avatarType: "initials",
  avatarURL: undefined,
  gravatarURL: undefined,
  coverPhotoURL: undefined,
  listingImageURL: undefined,
};
