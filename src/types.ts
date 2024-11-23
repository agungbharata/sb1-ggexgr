export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface Gift {
  id: string;
  invitationId: string;
  senderName: string;
  amount: number;
  message?: string;
  bankAccount: string;
  createdAt: string;
  confirmed: boolean;
}

export interface InvitationData {
  id: string;
  brideNames?: string;
  groomNames?: string;
  date?: string;
  time?: string;
  venue?: string;
  message?: string;
  openingText?: string;
  invitationText?: string;
  bridePhoto?: string;
  groomPhoto?: string;
  coverPhoto?: string;
  gallery?: string[];
  bankAccounts?: BankAccount[];
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  socialLinks?: {
    platform: string;
    url: string;
    title: string;
    embedCode?: string;
  }[];
}
