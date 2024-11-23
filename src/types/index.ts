export interface InvitationData {
  id?: string;
  brideNames: string;
  groomNames: string;
  date: string;
  time: string;
  venue: string;
  message: string; // Can contain HTML content
  openingText?: string;
  invitationText?: string;
  bridePhoto?: string;
  groomPhoto?: string;
  coverPhoto?: string;
  gallery?: string[];
  bankAccounts?: BankAccount[];
  socialLinks?: SocialLink[];
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  customSlug?: string;
  createdAt?: string;
}

export interface BankAccount {
  bank: string;
  accountName: string;
  accountNumber: string;
}

export interface SocialLink {
  platform: string;
  title: string;
  url: string;
  embedCode?: string;
}

export interface Comment {
  id: string;
  invitationId: string;
  name: string;
  message: string;
  createdAt: string;
  attendance: 'yes' | 'no' | 'maybe';
}

export interface Gift {
  id: string;
  invitationId: string;
  senderName: string;
  amount: number;
  message: string;
  bankAccount: string;
  createdAt: string;
  confirmed: boolean;
}