import React from 'react';
import { InvitationData } from '../types/invitation';
import JavaneseTemplate from './templates/JavaneseTemplate';

export type TemplateType = 'javanese' | 'sundanese' | 'minang' | 'bali' | 'modern';

interface TemplateSelectorProps {
  templateId: TemplateType;
  data: Partial<InvitationData>;
  isViewOnly?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templateId, data, isViewOnly = false }) => {
  switch (templateId) {
    case 'javanese':
      return <JavaneseTemplate data={data} isViewOnly={isViewOnly} />;
    // Add more templates here
    default:
      return <JavaneseTemplate data={data} isViewOnly={isViewOnly} />;
  }
};

export default TemplateSelector;
