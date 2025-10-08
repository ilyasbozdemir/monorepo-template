import { BaseDocument } from "../_base/document.base";

type AvatarType = "upload" | "gravatar" | "initials";

enum UserRole {
  Admin = "admin",
  SuperAdmin = "super_admin",
  Editor = "editor",
  Advertiser = "advertiser",
  User = "user",
  BetaUser = "beta_user",
  FakeUser = "fake_user",
}

enum UserType {
  Individual = "Individual",
  Corporate = "Corporate",
}

export interface IAppUserDetailsModel extends BaseDocument {
  baseId: string;

  coverPhotoURL?: string;
  avatarURL?: string;
  gravatarURL?: string;
  avatarType?: AvatarType;

  userType?: UserType;
  phone?: {
    countryCode: string;
    number: string;
  };

  username?: string;
  roles: UserRole[];

  gender?: "male" | "female" | "other";
  country?: string;
  language?: string;

  createdAt: number;
  updatedAt: number;
}
