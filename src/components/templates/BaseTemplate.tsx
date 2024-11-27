import React from 'react';
import { InvitationData } from '../../types/invitation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export interface TemplateTheme {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  pattern?: string;
}

export interface BaseTemplateProps {
  data: Partial<InvitationData>;
  theme: TemplateTheme;
}

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return format(date, 'EEEE, d MMMM yyyy', { locale: id });
  } catch (error) {
    return dateStr;
  }
};

const BaseTemplate: React.FC<BaseTemplateProps> = ({ data, theme }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className="relative p-8 rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily
        }}
      >
        {theme.pattern && (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: theme.pattern,
              backgroundRepeat: 'repeat',
              zIndex: 0
            }}
          />
        )}
        <div className="relative z-10">
          {/* Template content will be rendered here by child components */}
        </div>
      </div>
    </div>
  );
};

export default BaseTemplate;
