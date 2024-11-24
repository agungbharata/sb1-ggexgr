import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { TemplateShowcase } from '../../components/templates/TemplateShowcase';
import { ISLAMIC_TEMPLATES } from '../../data/islamic-templates';

const TemplatesPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [previewMode, setPreviewMode] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleApplyTemplate = () => {
    // TODO: Implement template application logic
    console.log('Applying template:', selectedTemplate);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Template Undangan</h1>
            <p className="text-gray-600">
              Pilih template yang sesuai dengan tema pernikahan Anda
            </p>
          </div>
          {selectedTemplate && (
            <button
              onClick={handleApplyTemplate}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Gunakan Template
            </button>
          )}
        </div>

        {/* Filter & Search */}
        <div className="mb-8 flex gap-4">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8"
              defaultValue="all"
            >
              <option value="all">Semua Template</option>
              <option value="islamic">Islamic</option>
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <input
            type="text"
            placeholder="Cari template..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Template Showcase */}
        <TemplateShowcase
          onSelect={handleTemplateSelect}
          selectedTemplate={selectedTemplate}
        />

        {/* Preview Modal */}
        {previewMode && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] overflow-auto">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Preview Template</h2>
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                {/* Template Preview Content */}
                {/* TODO: Add template preview component */}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TemplatesPage;
