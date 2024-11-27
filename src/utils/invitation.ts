import { supabase } from '../supabase';
import type { InvitationData } from '../types/invitation';
import type { Database } from '../types/database.types';

type InvitationRow = Database['public']['Tables']['invitations']['Row'];
type InvitationInsert = Database['public']['Tables']['invitations']['Insert'];

export const saveInvitation = async (data: InvitationData): Promise<InvitationRow | null> => {
  try {
    // Convert InvitationData to database format
    const dbData: InvitationInsert = {
      bride_names: data.brideNames,
      groom_names: data.groomNames,
      bride_parents: data.brideParents || null,
      groom_parents: data.groomParents || null,
      date: data.date || null,
      time: data.time || null,
      venue: data.venue || null,
      show_akad: data.showAkad ?? true,
      akad_date: data.akadDate || null,
      akad_time: data.akadTime || null,
      akad_venue: data.akadVenue || null,
      show_resepsi: data.showResepsi ?? true,
      resepsi_date: data.resepsiDate || null,
      resepsi_time: data.resepsiTime || null,
      resepsi_venue: data.resepsiVenue || null,
      opening_text: data.openingText || null,
      invitation_text: data.invitationText || null,
      // Add other fields as needed
      custom_data: {
        gallery: data.gallery,
        socialLinks: data.socialLinks,
        bankAccounts: data.bankAccounts,
        theme: data.theme,
        // Add other custom fields
      },
      is_published: false,
    };

    const { data: savedData, error } = await supabase
      .from('invitations')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return savedData;
  } catch (error) {
    console.error('Error saving invitation:', error);
    return null;
  }
};

export const updateInvitation = async (id: string, data: Partial<InvitationData>): Promise<InvitationRow | null> => {
  try {
    // Convert InvitationData to database format
    const dbData: Partial<InvitationInsert> = {
      ...(data.brideNames && { bride_names: data.brideNames }),
      ...(data.groomNames && { groom_names: data.groomNames }),
      ...(data.brideParents !== undefined && { bride_parents: data.brideParents }),
      ...(data.groomParents !== undefined && { groom_parents: data.groomParents }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.time !== undefined && { time: data.time }),
      ...(data.venue !== undefined && { venue: data.venue }),
      ...(data.showAkad !== undefined && { show_akad: data.showAkad }),
      ...(data.akadDate !== undefined && { akad_date: data.akadDate }),
      ...(data.akadTime !== undefined && { akad_time: data.akadTime }),
      ...(data.akadVenue !== undefined && { akad_venue: data.akadVenue }),
      ...(data.showResepsi !== undefined && { show_resepsi: data.showResepsi }),
      ...(data.resepsiDate !== undefined && { resepsi_date: data.resepsiDate }),
      ...(data.resepsiTime !== undefined && { resepsi_time: data.resepsiTime }),
      ...(data.resepsiVenue !== undefined && { resepsi_venue: data.resepsiVenue }),
      ...(data.openingText !== undefined && { opening_text: data.openingText }),
      ...(data.invitationText !== undefined && { invitation_text: data.invitationText }),
    };

    // Update custom_data if any of its fields are present
    if (data.gallery || data.socialLinks || data.bankAccounts || data.theme) {
      const { data: currentData } = await supabase
        .from('invitations')
        .select('custom_data')
        .eq('id', id)
        .single();

      const currentCustomData = currentData?.custom_data || {};
      dbData.custom_data = {
        ...currentCustomData,
        ...(data.gallery && { gallery: data.gallery }),
        ...(data.socialLinks && { socialLinks: data.socialLinks }),
        ...(data.bankAccounts && { bankAccounts: data.bankAccounts }),
        ...(data.theme && { theme: data.theme }),
      };
    }

    const { data: updatedData, error } = await supabase
      .from('invitations')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedData;
  } catch (error) {
    console.error('Error updating invitation:', error);
    return null;
  }
};

export const getInvitation = async (id: string): Promise<InvitationData | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Convert database format to InvitationData
    const invitationData: InvitationData = {
      id: data.id,
      brideNames: data.bride_names,
      groomNames: data.groom_names,
      brideParents: data.bride_parents || undefined,
      groomParents: data.groom_parents || undefined,
      date: data.date || undefined,
      time: data.time || undefined,
      venue: data.venue || undefined,
      showAkad: data.show_akad,
      akadDate: data.akad_date || undefined,
      akadTime: data.akad_time || undefined,
      akadVenue: data.akad_venue || undefined,
      showResepsi: data.show_resepsi,
      resepsiDate: data.resepsi_date || undefined,
      resepsiTime: data.resepsi_time || undefined,
      resepsiVenue: data.resepsi_venue || undefined,
      openingText: data.opening_text || undefined,
      invitationText: data.invitation_text || undefined,
      // Extract custom data
      ...(data.custom_data as any),
    };

    return invitationData;
  } catch (error) {
    console.error('Error getting invitation:', error);
    return null;
  }
};
