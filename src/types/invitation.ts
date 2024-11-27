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
  akadMapsUrl?: string;
  akadMapsEmbed?: string;
  showResepsi: boolean;
  resepsiDate: string;
  resepsiTime: string;
  resepsiVenue: string;
  resepsiMapsUrl?: string;
  resepsiMapsEmbed?: string;
  openingText: string;
  invitationText: string;
  coverPhoto?: string;
  bridePhoto?: string;
  groomPhoto?: string;
  gallery: string[];
  socialLinks: any[];
  bankAccounts: any[];
  customSlug?: string;
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  template?: string;
  theme?: string;
  fontFamily?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status?: string;
  isPublished?: boolean;
  rsvpEnabled?: boolean;
  commentsEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export interface SocialLink {
  platform: string;
  username: string;
  url: string;
}

export interface BankAccount {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export const defaultFormData: InvitationData = {
  brideNames: '',
  groomNames: '',
  brideParents: '',
  groomParents: '',
  openingText: 'Bersama keluarga mereka',
  invitationText: 'Mengundang kehadiran Anda',
  gallery: [],
  socialLinks: [],
  bankAccounts: [],
  theme: 'default',
  fontFamily: 'default',
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  status: 'draft',
  isPublished: false,
  rsvpEnabled: true,
  commentsEnabled: true
};

import { TemplateType } from '../components/TemplateSelector';
