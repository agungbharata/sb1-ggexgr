import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import type { InvitationData, TimeZone } from '../../types/invitation';
import { supabase } from '../../lib/supabase';

const generateSlug = (brideName: string, groomName: string): string => {
  const cleanName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Hapus karakter non-alphanumeric
      .trim();
  };

  const brideSlug = cleanName(brideName);
  const groomSlug = cleanName(groomName);
  
  return `${brideSlug}-${groomSlug}`;
};

const defaultFormData: InvitationData = {
  brideNames: '',
  groomNames: '',
  brideParents: '',
  groomParents: '',
  showAkad: true,
  akadDate: '',
  akadTime: '',
  akadVenue: '',
  showResepsi: true,
  resepsiDate: '',
  resepsiTime: '',
  resepsiVenue: '',
  openingText: 'Bersama keluarga mereka',
  invitationText: 'Mengundang kehadiran Anda',
  gallery: [],
  socialLinks: [],
  bankAccounts: [],
  template: 'javanese',
  timeZone: 'WIB' as TimeZone
};

const NewInvitation: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUserId(user.id);
    };

    checkUser();
  }, [navigate]);

  const handleSubmit = async (data: InvitationData) => {
    try {
      if (!userId) {
        throw new Error('Silakan login terlebih dahulu');
      }

      setIsSubmitting(true);

      // Generate slug dari nama pengantin
      const baseSlug = generateSlug(data.brideNames, data.groomNames);
      
      // Cek apakah slug sudah ada
      const { data: existingInvitation } = await supabase
        .from('invitations')
        .select('id')
        .eq('slug', baseSlug)
        .single();

      // Jika slug sudah ada, tambahkan random string
      const slug = existingInvitation 
        ? `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`
        : baseSlug;
      
      // Transform camelCase to snake_case for database
      const transformedData: Record<string, any> = {
        user_id: userId,
        slug,
        bride_names: data.brideNames,
        groom_names: data.groomNames,
        bride_parents: data.brideParents || null,
        groom_parents: data.groomParents || null,
        show_akad: data.showAkad,
        akad_venue: data.akadVenue || null,
        akad_maps_url: data.akadMapsUrl || null,
        show_resepsi: data.showResepsi,
        resepsi_venue: data.resepsiVenue || null,
        resepsi_maps_url: data.resepsiMapsUrl || null,
        opening_text: data.openingText || '',
        invitation_text: data.invitationText || '',
        message: data.message || null,
        cover_photo: data.coverPhoto || null,
        bride_photo: data.bridePhoto || null,
        groom_photo: data.groomPhoto || null,
        gallery: data.gallery || [],
        social_links: data.socialLinks || [],
        bank_accounts: data.bankAccounts || [],
        template: data.template || 'javanese',
        custom_slug: data.customSlug || null,
        background_music: data.backgroundMusic || null,
        time_zone: data.timeZone || 'WIB'
      };

      // Hanya tambahkan field tanggal dan waktu jika ada nilainya
      if (data.akadDate) transformedData.akad_date = data.akadDate;
      if (data.akadTime) transformedData.akad_time = data.akadTime;
      if (data.resepsiDate) transformedData.resepsi_date = data.resepsiDate;
      if (data.resepsiTime) transformedData.resepsi_time = data.resepsiTime;

      console.log('Saving invitation with data:', transformedData);

      // Insert new invitation
      const { data: newInvitation, error } = await supabase
        .from('invitations')
        .insert(transformedData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Navigate to edit page
      navigate(`/admin/invitation/${newInvitation.id}`);
      
    } catch (error) {
      console.error('Error creating invitation:', error);
      alert('Terjadi kesalahan saat membuat undangan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return null; // atau tampilkan loading spinner
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-center">Create New Invitation</h1>
      <InvitationForm 
        onSubmit={handleSubmit}
        initialData={defaultFormData}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default NewInvitation;
