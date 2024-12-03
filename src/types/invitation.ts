export interface InvitationData {
  id?: string;
  brideNames: string;
  groomNames: string;
  brideParents?: string;
  groomParents?: string;
  showAkad: boolean;
  akadDate?: string;
  akadTime?: string;
  akadVenue?: string;
  akadMapsUrl?: string;
  showResepsi: boolean;
  resepsiDate?: string;
  resepsiTime?: string;
  resepsiVenue?: string;
  resepsiMapsUrl?: string;
  openingText: string;
  invitationText: string;
  message?: string;
  coverPhoto?: string;
  bridePhoto?: string;
  groomPhoto?: string;
  gallery?: string[];
  socialLinks?: SocialLink[];
  bankAccounts?: BankAccount[];
  template: string;
  customSlug?: string;
  backgroundMusic?: string;
  timeZone?: TimeZone;
  createdAt?: string;
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

export interface DatabaseInvitation {
  id: string;
  user_id: string;
  slug: string;
  custom_slug?: string;
  bride_names: string;
  groom_names: string;
  bride_parents?: string;
  groom_parents?: string;
  show_akad: boolean;
  akad_date?: string;
  akad_time?: string;
  akad_venue?: string;
  akad_maps_url?: string;
  show_resepsi: boolean;
  resepsi_date?: string;
  resepsi_time?: string;
  resepsi_venue?: string;
  resepsi_maps_url?: string;
  opening_text: string;
  invitation_text: string;
  message?: string;
  cover_photo?: string;
  bride_photo?: string;
  groom_photo?: string;
  gallery?: string[];
  social_links?: SocialLink[];
  bank_accounts?: BankAccount[];
  template: string;
  background_music?: string;
  time_zone?: TimeZone;
  created_at?: string;
  updated_at?: string;
}

export type TimeZone = 'WIB' | 'WITA' | 'WIT';

export const defaultInvitationData: InvitationData = {
  brideNames: '',
  groomNames: '',
  brideParents: '',
  groomParents: '',
  showAkad: false,
  showResepsi: false,
  openingText: 'Bersama keluarga mereka',
  invitationText: 'Mengundang kehadiran Anda',
  template: 'javanese',
  timeZone: 'WIB',
  gallery: [],
  socialLinks: [],
  bankAccounts: []
};
