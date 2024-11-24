import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Eye } from 'lucide-react';
import { supabase } from '../../../config/supabase';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  is_premium: boolean;
  created_at: string;
}

const TemplateList = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Template Undangan</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          <PlusCircle className="h-5 w-5 mr-2" />
          Tambah Template
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Template Thumbnail */}
            <div className="relative aspect-[3/4] bg-gray-100">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              {template.is_premium && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Premium
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{template.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100"
                    title="Preview"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(template.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="col-span-full min-h-[300px] flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 mb-4 text-gray-400">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Belum ada template</h3>
            <p className="mt-1 text-sm">Mulai dengan menambahkan template baru</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateList;
