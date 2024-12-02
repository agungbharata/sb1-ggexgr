export interface InvitationData {
  id?: string;
  brideNames: string;
  groomNames: string;
  brideParents: string;
  groomParents: string;
  showAkad: boolean;
  akadDate: string;
  akadTime: string;
  akadVenue: string;
  akadMapsUrl: string;
  showResepsi: boolean;
  resepsiDate: string;
  resepsiTime: string;
  resepsiVenue: string;
  resepsiMapsUrl: string;
  openingText: string;
  invitationText: string;
  message: string;
  coverPhoto: string;
  bridePhoto: string;
  groomPhoto: string;
  gallery: string[];
  socialLinks: SocialLink[];
  bankAccounts: BankAccount[];
  template: string;
  customSlug: string;
  backgroundMusic: string;
  timezone: string;
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
  date?: string;
  time?: string;
  venue?: string;
  opening_text?: string;
  invitation_text?: string;
  cover_photo?: string;
  bride_photo?: string;
  groom_photo?: string;
  gallery?: string[];
  social_links?: SocialLink[];
  bank_accounts?: BankAccount[];
  message?: string;
  google_maps_url?: string;
  google_maps_embed?: string;
  template?: TemplateType;
  created_at?: string;
  updated_at?: string;
  status?: 'draft' | 'published';
  is_published?: boolean;
  max_guests?: number;
  rsvp_enabled?: boolean;
  comments_enabled?: boolean;
}

export interface MusicLibrary {
  id: string;
  title: string;
  artist: string;
  url: string;
  created_at?: string;
}

export const defaultInvitationData: InvitationData = {
  brideNames: '',
  groomNames: '',
  brideParents: '',
  groomParents: '',
  showAkad: false,
  akadDate: '',
  akadTime: '',
  akadVenue: '',
  akadMapsUrl: '',
  showResepsi: false,
  resepsiDate: '',
  resepsiTime: '',
  resepsiVenue: '',
  resepsiMapsUrl: '',
  openingText: '',
  invitationText: '',
  message: '',
  coverPhoto: '',
  bridePhoto: '',
  groomPhoto: '',
  gallery: [],
  socialLinks: [],
  bankAccounts: [],
  template: 'javanese',
  customSlug: '',
  backgroundMusic: '',
  timezone: 'WIB'
};

import { TemplateType } from '../components/TemplateSelector';

export type TimeZone = 'WIB' | 'WITA' | 'WIT';
