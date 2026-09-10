export interface Membership {
  companyId: string;
  companyName: string;
  companySlug: string;
  isPrimary: boolean;
  roles: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  isPlatformAdmin: boolean;
  companies: Membership[];
}

export interface AuthResult {
  token: string;
  expiresAtUtc: string;
  user: UserProfile;
}
