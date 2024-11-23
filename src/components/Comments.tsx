import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { Comment } from '../types';

interface CommentsProps {
  invitationId: string;
}

export default function Comments({ invitationId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    name: '',
    message: '',
    attendance: 'yes' as const
  });

  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem(`comments_${invitationId}`) || '[]');
    setComments(savedComments);
  }, [invitationId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const comment: Comment = {
      id: crypto.randomUUID(),
      invitationId,
      name: newComment.name,
      message: newComment.message,
      attendance: newComment.attendance,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...comments, comment];
    localStorage.setItem(`comments_${invitationId}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
    setNewComment({ name: '', message: '', attendance: 'yes' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Wishes & RSVP
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          
          <textarea
            value={newComment.message}
            onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
            placeholder="Write your wishes..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            rows={3}
            required
          />

          <div className="flex items-center space-x-4">
            <select
              value={newComment.attendance}
              onChange={(e) => setNewComment({ ...newComment, attendance: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="yes">Will Attend</option>
              <option value="no">Cannot Attend</option>
              <option value="maybe">Maybe</option>
            </select>

            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{comment.name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                comment.attendance === 'yes'
                  ? 'bg-green-100 text-green-800'
                  : comment.attendance === 'no'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {comment.attendance === 'yes'
                  ? 'Attending'
                  : comment.attendance === 'no'
                  ? 'Not Attending'
                  : 'Maybe'}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{comment.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}