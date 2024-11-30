import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { Plus, Edit2, Trash2, Eye, Calendar, Globe, EyeOff } from 'react-feather';
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
  published_at: string | null;
  venue: string;
}

export default function AdminInvitations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

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

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'published') => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null 
        })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success(`Invitation ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      setInvitations(invitations.map(inv => 
        inv.id === id ? { 
          ...inv, 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        } : inv
      ));
    } catch (error: any) {
      toast.error('Error updating invitation status: ' + error.message);
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

  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = (
      invitation.bride_names.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invitation.groom_names.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invitation.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || invitation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by names or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredInvitations.length > 0 ? (
          <div className="min-w-full divide-y divide-gray-200">
            {filteredInvitations.map((invitation) => (
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
                        {invitation.date ? format(new Date(invitation.date), 'MMMM d, yyyy') : '-'}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          invitation.status
                        )}`}
                      >
                        {invitation.status}
                      </span>
                      {invitation.published_at && (
                        <span className="text-gray-500">
                          Published: {format(new Date(invitation.published_at), 'MMM d, yyyy HH:mm')}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {invitation.venue}
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
                      onClick={() => handleStatusChange(invitation.id, invitation.status === 'published' ? 'draft' : 'published')}
                      className={`p-2 ${invitation.status === 'published' ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-400 hover:text-emerald-600'}`}
                      title={invitation.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {invitation.status === 'published' ? (
                        <Globe className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
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
            <p className="text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'No invitations found matching your search criteria'
                : 'No invitations created yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
