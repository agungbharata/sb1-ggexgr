import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Calendar, Link } from 'lucide-react';
import type { InvitationData } from '../types';
import InvitationPreview from './InvitationPreview';
import CopyLinkButton from './CopyLinkButton';
import { generateSlug } from '../utils/slug';

export default function AdminPanel() {
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
    const slug = generateSlug(invitation.brideNames, invitation.groomNames);
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
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedInvitation(invitation)}
                        className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(invitation.id!)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm">
                      <Link className="w-4 h-4 text-pink-500" />
                      <span className="text-gray-600">Invitation Link:</span>
                    </div>
                    <CopyLinkButton url={getInvitationUrl(invitation)} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="sticky top-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
          {selectedInvitation ? (
            <InvitationPreview {...selectedInvitation} />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
              Select an invitation to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}