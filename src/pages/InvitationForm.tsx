import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import InvitationFormComponent from '../components/InvitationForm';
import { InvitationData, defaultFormData } from '../types/invitation';
import Navbar from '../components/Navbar';

export default function InvitationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invitation, setInvitation] = useState<InvitationData>(defaultFormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadInvitation(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadInvitation = async (invitationId: string) => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (error) throw error;
      if (data) setInvitation(data);
    } catch (error) {
      console.error('Error loading invitation:', error);
      alert('Error loading invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData: InvitationData) => {
    try {
      const user = supabase.auth.user();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('invitations')
        .upsert({
          ...updatedData,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving invitation:', error);
      alert('Error saving invitation. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <InvitationFormComponent
          initialData={invitation}
          onUpdate={handleUpdate}
          isEditing={!!id}
        />
      </div>
    </div>
  );
}
