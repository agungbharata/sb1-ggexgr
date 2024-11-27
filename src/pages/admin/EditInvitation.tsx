import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import type { InvitationData } from '../../types/invitation';
import { supabase } from '../../lib/supabase';

const EditInvitation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!id) {
        setError('No invitation ID provided');
        setLoading(false);
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
          setError('Invitation not found');
        } else {
          setInvitation(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [id]);

  const handleUpdate = async (data: InvitationData) => {
    // This will be handled by the InvitationForm component internally
  };

  const handleChange = (data: InvitationData) => {
    // This will be handled by the InvitationForm component internally
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Invitation not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Invitation</h1>
      <InvitationForm
        onUpdate={handleUpdate}
        onChange={handleChange}
        initialData={invitation}
        isEditing={true}
      />
    </div>
  );
};

export default EditInvitation;
