import axios from "axios";
import PubSub from "pubsub-js";

//Tested alanı

/**
 * Kullanıcı bilgilerini temsil eder.
 */
export interface AuthUser {
  /** Kullanıcının benzersiz ID'si */
  id: string;
  /** Kullanıcının e-posta adresi (opsiyonel) */
  email?: string;
  /** Kullanıcının rolleri (opsiyonel) */
  roles?: string[];
  [key: string]: any;
}

/**
 * Auth işlemleri için opsiyonlar
 */
export interface AuthOptions {
  /** Kullanıcı token'ı */
  token: string;
  /** API base URL (opsiyonel) */
  apiUrl?: string;
}

/**
 * JWT token'dan kullanıcı bilgilerini alır.
 * @param token JWT token string
 * @returns AuthUser objesi veya null
 * @example
 * const user = getUserFromToken("eyJhbGciOiJIUzI1NiIsInR...");
 * console.log(user?.id);
 */
export const getUserFromToken = (token: string): AuthUser | null => {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const decoded = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    return JSON.parse(decoded) as AuthUser;
  } catch (e) {
    return null;
  }
};

/**
 * Axios tabanlı hazır auth client oluşturur.
 * @param token Kullanıcı token'ı
 * @param apiUrl API base URL (opsiyonel)
 * @returns Axios instance
 * @example
 * const client = createAuthClient("myToken", "https://api.example.com");
 * const res = await client.get("/users/me");
 */
export const createAuthClient = (token: string, apiUrl = "") => {
  return axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Auth ile ilgili bir event dinler.
 * @param event Event adı
 * @param callback Event tetiklendiğinde çağrılacak callback
 * @returns PubSub token
 * @example
 * const token = onAuthEvent("login", (data) => {
 *   console.log("Kullanıcı giriş yaptı:", data);
 * });
 */
export const onAuthEvent = (event: string, callback: (data: any) => void) => {
  return PubSub.subscribe(event, (_, data) => callback(data));
};

/**
 * Auth ile ilgili bir event yayınlar.
 * @param event Event adı
 * @param data Event ile gönderilecek veri
 * @example
 * publishAuthEvent("logout", { userId: "123" });
 */
export const publishAuthEvent = (event: string, data: any) => {
  PubSub.publish(event, data);
};

/**
 * Varsayılan export
 */
export default {
  getUserFromToken,
  createAuthClient,
  onAuthEvent,
  publishAuthEvent,
};
