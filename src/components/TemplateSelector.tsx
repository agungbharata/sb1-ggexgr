import React from 'react';
import { InvitationData } from '../types/invitation';
import JavaneseTemplate from './templates/JavaneseTemplate';
import SundaneseTemplate from './templates/SundaneseTemplate';
import MinangTemplate from './templates/MinangTemplate';
import BaliTemplate from './templates/BaliTemplate';
import ModernTemplate from './templates/ModernTemplate';

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
    case 'sundanese':
      return <SundaneseTemplate data={data} isViewOnly={isViewOnly} />;
    case 'minang':
      return <MinangTemplate data={data} isViewOnly={isViewOnly} />;
    case 'bali':
      return <BaliTemplate data={data} isViewOnly={isViewOnly} />;
    case 'modern':
      return <ModernTemplate data={data} isViewOnly={isViewOnly} />;
    default:
      return <JavaneseTemplate data={data} isViewOnly={isViewOnly} />;
  }
};

export default TemplateSelector;
