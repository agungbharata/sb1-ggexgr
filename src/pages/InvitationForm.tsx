import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import InvitationFormComponent from '../components/InvitationForm';
import InvitationPreview from '../components/InvitationPreview';
import ThemeSelector, { themes } from '../components/ThemeSelector';
import { InvitationData, defaultFormData } from '../types/invitation';
import Navbar from '../components/Navbar';

export default function InvitationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invitation, setInvitation] = useState<InvitationData>(defaultFormData);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
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
      if (data) {
        setInvitation(data);
        // Load saved theme if exists
        if (data.theme) {
          const savedTheme = themes.find(t => t.id === data.theme);
          if (savedTheme) setSelectedTheme(savedTheme);
        }
      }
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

      const dataWithTheme = {
        ...updatedData,
        theme: selectedTheme.id,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('invitations')
        .upsert(dataWithTheme)
        .select()
        .single();

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving invitation:', error);
      alert('Error saving invitation. Please try again.');
    }
  };

  const handleFormChange = (newData: InvitationData) => {
    setInvitation(newData);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Panel - Left Side */}
          <div className="space-y-6">
            <div className="sticky top-8">
              <ThemeSelector
                selectedTheme={selectedTheme.id}
                onThemeChange={setSelectedTheme}
              />
              <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
                <InvitationPreview
                  invitation={invitation}
                  theme={selectedTheme}
                />
              </div>
            </div>
          </div>

          {/* Form Panel - Right Side */}
          <div>
            <InvitationFormComponent
              initialData={invitation}
              onUpdate={handleUpdate}
              onChange={handleFormChange}
              isEditing={!!id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
