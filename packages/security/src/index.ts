/**
 * @module Security
 *
 * Kullanıcı doğrulama, yetkilendirme ve güvenlik işlemlerini sağlar.
 * Örnek kullanım: JWT token doğrulama, kullanıcı rolleri, erişim kontrolleri.
 */

export interface User {
  id: string;
  username: string;
  roles: string[];
}

export interface AuthResult {
  token: string;
  user: User;
}

export class SecurityManager {
  private users: User[] = [];

  /**
   * Yeni kullanıcı ekler
   * @param user Kullanıcı objesi
   */
  addUser(user: User) {
    this.users.push(user);
  }

  /**
   * Kullanıcıyı doğrular
   * @param username Kullanıcı adı
   * @returns Kullanıcı objesi veya null
   */
  authenticate(username: string): User | null {
    const user = this.users.find(u => u.username === username);
    return user ?? null;
  }

  /**
   * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
   * @param user Kullanıcı objesi
   * @param role Kontrol edilecek rol
   * @returns boolean
   */
  hasRole(user: User, role: string): boolean {
    return user.roles.includes(role);
  }

  /**
   * Örnek JWT token oluşturma (demo amaçlı)
   * @param user Kullanıcı
   */
  generateToken(user: User): AuthResult {
    const token = Buffer.from(`${user.id}:${user.username}`).toString("base64");
    return { token, user };
  }
}
