import React from 'react';
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

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId, selected, onClick }) => {
  const template = templates[templateId];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
        selected 
          ? 'ring-2 ring-pink-500 scale-[1.02]' 
          : 'hover:scale-[1.01] hover:shadow-lg'
      }`}
    >
      <div className="aspect-[3/4] relative">
        <img
          src={template.preview}
          alt={template.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{template.name}</h3>
          <p className="text-sm text-gray-200">{template.description}</p>
        </div>
        {selected && (
          <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
            <div className="bg-white text-pink-500 px-4 py-2 rounded-full font-medium">
              Template Terpilih
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
