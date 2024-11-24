export interface InvitationData {
  id?: string;
  brideNames: string;
  groomNames: string;
  date?: string;
  time?: string;
  venue?: string;
  coverPhoto?: string;
  bridePhoto?: string;
  groomPhoto?: string;
  gallery?: string[];
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  openingText?: string;
  invitationText?: string;
  message?: string;
  backgroundMusic?: string;
  socialLinks?: SocialLink[];
  bankAccounts?: BankAccount[];
  customSlug?: string;
  updatedAt?: string;
}

export interface SocialLink {
  platform: string;
  username: string;
  url: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export const defaultFormData: InvitationData = {
  brideNames: '',
  groomNames: '',
  openingText: 'Bersama keluarga mereka',
  invitationText: 'Mengundang kehadiran Anda',
  gallery: [],
  socialLinks: [],
  bankAccounts: []
};
