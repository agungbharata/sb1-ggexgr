import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Calendar, Link, Edit2 } from 'lucide-react';
import type { InvitationData } from '../types';
import InvitationPreview from './InvitationPreview';
import CopyLinkButton from './CopyLinkButton';
import { generateSlug } from '../utils/slug';

interface AdminPanelProps {
  onEdit: (invitation: InvitationData) => void;
}

export default function AdminPanel({ onEdit }: AdminPanelProps) {
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationData | null>(null);

  useEffect(() => {
    const savedInvitations = JSON.parse(localStorage.getItem('invitations') || '[]');
    setInvitations(savedInvitations);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invitation?')) {
      const updatedInvitations = invitations.filter(inv => inv.id !== id);
      localStorage.setItem('invitations', JSON.stringify(updatedInvitations));
      setInvitations(updatedInvitations);
      if (selectedInvitation?.id === id) {
        setSelectedInvitation(null);
      }
    }
  };

  const getInvitationUrl = (invitation: InvitationData): string => {
    const slug = invitation.customSlug || generateSlug(invitation.brideNames, invitation.groomNames);
    return `${window.location.origin}/${slug}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Invitations</h2>
        <div className="space-y-4">
          {invitations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No invitations saved yet.</p>
          ) : (
            invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900">
                        {invitation.brideNames} & {invitation.groomNames}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(invitation.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Link className="w-4 h-4 mr-1" />
                        {invitation.customSlug ? (
                          <span className="text-pink-600">{invitation.customSlug}</span>
                        ) : (
                          <span>{generateSlug(invitation.brideNames, invitation.groomNames)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`/${invitation.customSlug || generateSlug(invitation.brideNames, invitation.groomNames)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                      <Link
                        to={`/dashboard/edit/${invitation.id}`}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(invitation.id!)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {invitation.venue}
                    </div>
                    <CopyLinkButton url={getInvitationUrl(invitation)} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {selectedInvitation && (
        <div className="lg:sticky lg:top-6">
          <InvitationPreview invitation={selectedInvitation} />
        </div>
      )}
    </div>
  );
}