import React, { useState } from 'react';
import { TemplateType } from './TemplateSelector';

interface TemplatePreviewProps {
  templateId: TemplateType;
  selected: boolean;
  onClick: () => void;
}

const templates = {
  javanese: {
    name: 'Javanese Traditional',
    description: 'Desain elegan dengan motif batik Jawa',
    preview: '/previews/javanese.jpg'
  },
  sundanese: {
    name: 'Sundanese Classic',
    description: 'Tema tradisional dengan sentuhan Sunda',
    preview: '/previews/sundanese.jpg'
  },
  minang: {
    name: 'Minang Heritage',
    description: 'Desain khas dengan ornamen Minang',
    preview: '/previews/minang.jpg'
  },
  bali: {
    name: 'Balinese Art',
    description: 'Tema eksotis dengan seni Bali',
    preview: '/previews/bali.jpg'
  },
  modern: {
    name: 'Modern Minimalist',
    description: 'Desain minimalis kontemporer',
    preview: '/previews/modern.jpg'
  }
};

export const TemplateGrid: React.FC<{
  selectedTemplate: TemplateType | null;
  onSelect: (templateId: TemplateType) => void;
}> = ({ selectedTemplate, onSelect }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">
          Pilih Template Undangan
          {selectedTemplate && (
            <span className="ml-2 text-sm text-emerald-600">
              (Terpilih: {templates[selectedTemplate].name})
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="px-3 py-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
        >
          {showTemplates ? '↑ Sembunyikan' : '↓ Tampilkan'}
        </button>
      </div>

      {showTemplates && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(templates) as TemplateType[]).map((templateId) => (
            <TemplatePreview
              key={templateId}
              templateId={templateId}
              selected={selectedTemplate === templateId}
              onClick={() => onSelect(templateId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId, selected, onClick }) => {
  const template = templates[templateId];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
        selected 
          ? 'ring-2 ring-emerald-500 scale-[1.02]' 
          : 'hover:scale-[1.01] hover:shadow-lg'
      }`}
    >
      <div className="aspect-[3/4] relative">
        <img
          src={template.preview || `https://placehold.co/600x800?text=${template.name}`}
          alt={template.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h4 className="text-lg font-medium">{template.name}</h4>
            <p className="text-sm text-gray-200">{template.description}</p>
          </div>
        </div>
        {selected && (
          <div className="absolute top-2 right-2 px-3 py-1 text-sm font-medium text-white bg-emerald-500 rounded-full">
            Template Terpilih
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
