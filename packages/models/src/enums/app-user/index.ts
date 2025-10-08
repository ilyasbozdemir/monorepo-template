export enum UserRole {
  Admin = "admin",
  SuperAdmin = "super_admin",
  Editor = "editor",
  Advertiser = "advertiser",
  User = "user",
  BetaUser = "beta_user", 
  FakeUser = "fake_user", 
}

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: "Yönetici",
  [UserRole.SuperAdmin]: "Süper Yönetici",
  [UserRole.Editor]: "Editör",
  [UserRole.Advertiser]: "Reklam Veren",
  [UserRole.User]: "Kullanıcı",
  [UserRole.BetaUser]: "Beta Kullanıcı",
  [UserRole.FakeUser]: "Sahte Kullanıcı", 
};


export enum UserType {
  Individual = "Individual",
  Corporate = "Corporate",
}

