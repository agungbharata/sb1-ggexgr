import React from 'react';
import { ISLAMIC_TEMPLATES } from '../../data/islamic-templates';
import { OptimizedImage } from '../OptimizedImage';

interface TemplateShowcaseProps {
  onSelect: (templateId: string) => void;
  selectedTemplate?: string;
}

export const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({
  onSelect,
  selectedTemplate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {ISLAMIC_TEMPLATES.map((template) => (
        <div
          key={template.id}
          className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer
            ${selectedTemplate === template.id ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onSelect(template.id)}
        >
          <div className="aspect-w-16 aspect-h-9">
            <OptimizedImage
              src={template.previewImage}
              alt={template.name}
              className="object-cover"
            />
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
            <p className="text-gray-600 text-sm">{template.description}</p>
            <div className="mt-4 flex gap-2">
              {template.style.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          {selectedTemplate === template.id && (
            <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm">
              Selected
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
