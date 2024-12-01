import React from 'react';
import {
  InstagramEmbed,
  TwitterEmbed,
  YouTubeEmbed,
  FacebookEmbed,
  TikTokEmbed
} from 'react-social-media-embed';

type SocialMediaType = 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'tiktok';

interface SocialMediaPreviewProps {
  url: string;
  width?: number;
  className?: string;
}

const detectSocialMediaType = (url: string): SocialMediaType | null => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    if (domain.includes('instagram.com')) return 'instagram';
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) return 'youtube';
    if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';
    if (domain.includes('facebook.com') || domain.includes('fb.com')) return 'facebook';
    if (domain.includes('tiktok.com')) return 'tiktok';

    return null;
  } catch {
    return null;
  }
};

export const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({ 
  url, 
  width = '100%',
  className = ''
}) => {
  if (!url) return null;

  const type = detectSocialMediaType(url);
  if (!type) return null;

  const renderEmbed = () => {
    const commonProps = {
      url,
      width: '100%',
      style: { width: '100%', maxWidth: '550px', margin: '0 auto' }
    };

    switch (type) {
      case 'instagram':
        return <InstagramEmbed {...commonProps} />;
      case 'youtube':
        return <YouTubeEmbed {...commonProps} />;
      case 'twitter':
        return <TwitterEmbed {...commonProps} />;
      case 'facebook':
        return <FacebookEmbed {...commonProps} />;
      case 'tiktok':
        return <TikTokEmbed {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`w-full my-4 rounded-lg overflow-hidden shadow-sm flex justify-center ${className}`}
    >
      <div className="w-full">
        {renderEmbed()}
      </div>
    </div>
  );
};

export { detectSocialMediaType };
export type { SocialMediaType };
export default SocialMediaPreview;
