import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Comment } from '../types';

interface CommentsProps {
  invitationId: string;
}

const COMMENTS_PER_PAGE = 5;

export default function Comments({ invitationId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState({
    name: '',
    message: '',
    attendance: 'yes' as const
  });

  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem(`comments_${invitationId}`) || '[]');
    // Sort comments by date, newest first
    const sortedComments = savedComments.sort((a: Comment, b: Comment) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setComments(sortedComments);
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

    const updatedComments = [comment, ...comments];
    localStorage.setItem(`comments_${invitationId}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
    setNewComment({ name: '', message: '', attendance: 'yes' });
    setCurrentPage(1); // Return to first page after new comment
  };

  // Pagination calculations
  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  const currentComments = comments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to comments section smoothly
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6" id="comments-section">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
          
          <textarea
            value={newComment.message}
            onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
            placeholder="Write your wishes..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={3}
            required
          />

          <div className="flex items-center space-x-4">
            <select
              value={newComment.attendance}
              onChange={(e) => setNewComment({ ...newComment, attendance: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="yes">Will Attend</option>
              <option value="no">Cannot Attend</option>
              <option value="maybe">Maybe</option>
            </select>

            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {comments.length > 0 && (
          <div className="text-sm text-gray-500 text-center">
            Showing {startIndex + 1}-{Math.min(endIndex, comments.length)} of {comments.length} comments
          </div>
        )}

        {currentComments.map((comment) => (
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
                  ? 'Will Attend'
                  : comment.attendance === 'no'
                  ? 'Cannot Attend'
                  : 'Maybe'}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{comment.message}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to leave a wish!
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-pink-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}