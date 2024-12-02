import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import type { InvitationData } from '../../types/invitation';
import { supabase } from '../../lib/supabase';

const EditInvitation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          throw new Error('Invitation not found');
        }

        setFormData(data);
      } catch (error) {
        console.error('Error loading invitation:', error);
        alert('Error loading invitation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [id, navigate]);

  const handleUpdate = async (updatedData: InvitationData) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('invitations')
        .update(updatedData)
        .eq('id', id);

      if (error) throw error;
      alert('Invitation updated successfully');
    } catch (error: any) {
      console.error('Error updating invitation:', error.message);
      alert('Error updating invitation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = useCallback((data: InvitationData) => {
    setFormData(data);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Invitation not found
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Edit Invitation</h1>
        <button
          onClick={() => handleUpdate(formData)}
          disabled={saving}
          className={`px-4 py-2 rounded-lg bg-primary text-white ${
            saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
          }`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      
      <InvitationForm 
        initialData={formData}
        onUpdate={handleUpdate}
        onChange={handleChange}
        isEditing={true}
      />
    </div>
  );
};

export default EditInvitation;
