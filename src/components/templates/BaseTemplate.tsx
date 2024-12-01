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
  invitation: InvitationData;
}

const defaultTheme: TemplateTheme = {
  backgroundColor: '#ffffff',
  textColor: '#333333',
  accentColor: '#4F46E5',
  fontFamily: 'serif'
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return format(date, 'EEEE, d MMMM yyyy', { locale: id });
  } catch (error) {
    return dateStr;
  }
};

const BaseTemplate: React.FC<BaseTemplateProps> = ({ invitation }) => {
  return (
    <div className="w-full h-full">
      <div 
        className="relative h-full p-8 overflow-hidden"
        style={{
          backgroundColor: defaultTheme.backgroundColor,
          color: defaultTheme.textColor,
          fontFamily: defaultTheme.fontFamily
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-3xl font-semibold mb-4">
            {invitation.brideNames} & {invitation.groomNames}
          </h1>
          
          <p className="text-lg mb-6">{invitation.openingText || 'Bersama keluarga mereka'}</p>
          
          <p className="text-xl mb-8">{invitation.invitationText || 'Mengundang kehadiran Anda'}</p>

          {invitation.showAkad && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Akad Nikah</h2>
              <p>{formatDate(invitation.akadDate)}</p>
              <p>{invitation.akadTime}</p>
              <p>{invitation.akadVenue}</p>
            </div>
          )}

          {invitation.showResepsi && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Resepsi</h2>
              <p>{formatDate(invitation.resepsiDate)}</p>
              <p>{invitation.resepsiTime}</p>
              <p>{invitation.resepsiVenue}</p>
            </div>
          )}

          <div className="mt-auto">
            <p className="text-lg">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseTemplate;
