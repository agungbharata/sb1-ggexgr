import React from 'react';
import { InvitationData } from '../types/invitation';
import TemplateSelector from './TemplateSelector';
import type { TemplateType } from './TemplateSelector';

interface InvitationPreviewProps {
  data?: Partial<InvitationData>;
  selectedTheme?: TemplateType;
}

const InvitationPreview: React.FC<InvitationPreviewProps> = ({ 
  data = {}, 
  selectedTheme = 'javanese' 
}) => {
  return (
    <div className="bg-[#F9F6F0] rounded-lg shadow-lg p-6 overflow-auto w-full h-full">
      <TemplateSelector
        templateId={selectedTheme}
        data={data}
        isViewOnly={true}
      />
    </div>
  );
};

export default InvitationPreview;