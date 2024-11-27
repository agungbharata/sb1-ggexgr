export interface InvitationData {
  id?: string;
  bride_names: string;
  groom_names: string;
  date?: string;
  time?: string;
  venue?: string;
  opening_text?: string;
  invitation_text?: string;
  message?: string;
  slug?: string;
  custom_slug?: string;
  cover_photo?: string;
  bride_photo?: string;
  groom_photo?: string;
  gallery?: string[];
  google_maps_url?: string;
  google_maps_embed?: string;
  social_links?: SocialLink[];
  bank_accounts?: BankAccount[];
  theme?: string;
  font_family?: string;
  primary_color?: string;
  secondary_color?: string;
  background_music?: string;
  background_image?: string;
  status?: 'draft' | 'published';
  is_published?: boolean;
  view_count?: number;
  max_guests?: number;
  rsvp_enabled?: boolean;
  comments_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  template?: TemplateType;
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
  bride_names: '',
  groom_names: '',
  opening_text: 'Bersama keluarga mereka',
  invitation_text: 'Mengundang kehadiran Anda',
  gallery: [],
  social_links: [],
  bank_accounts: [],
  theme: 'default',
  font_family: 'default',
  primary_color: '#000000',
  secondary_color: '#ffffff',
  status: 'draft',
  is_published: false,
  rsvp_enabled: true,
  comments_enabled: true
};

import { TemplateType } from '../components/TemplateSelector';
