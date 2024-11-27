import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { Plus, Edit2, Trash2, Eye, Calendar } from 'react-feather';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Invitation {
  id: string;
  bride_names: string;
  groom_names: string;
  date: string;
  slug: string;
  created_at: string;
  status: string;
}

export default function AdminInvitations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error: any) {
      toast.error('Error loading invitations: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this invitation?');
      if (!confirmed) return;

      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Invitation deleted successfully');
      setInvitations(invitations.filter(inv => inv.id !== id));
    } catch (error: any) {
      toast.error('Error deleting invitation: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Invitations</h1>
        <button
          onClick={() => navigate('/dashboard/invitations/new')}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Invitation
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {invitations.length > 0 ? (
          <div className="min-w-full divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {invitation.bride_names} & {invitation.groom_names}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(invitation.date), 'MMMM d, yyyy')}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          invitation.status
                        )}`}
                      >
                        {invitation.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(`/${invitation.slug}`, '_blank')}
                      className="p-2 text-gray-400 hover:text-emerald-600"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/invitations/edit/${invitation.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(invitation.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invitations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new invitation.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/invitations/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Invitation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
