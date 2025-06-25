import CryptoJS from "crypto-js";

// 암호화 키 (환경변수에서 가져오거나 안전한 방법으로 관리)
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-secret-key-change-this";

// 토큰 암호화 함수
export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
}

// 토큰 복호화 함수
export function decryptToken(encryptedToken: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
