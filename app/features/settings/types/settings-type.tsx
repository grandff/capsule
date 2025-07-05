export interface SnsPlatform {
  id: string;
  name: string;
  logo: React.ReactNode;
  description: string;
  callbackUrl: string;
  features: string[];
  status: string;
}
