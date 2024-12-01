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
  width = 328,
  className = ''
}) => {
  if (!url) return null;

  const type = detectSocialMediaType(url);
  if (!type) return null;

  const renderEmbed = () => {
    switch (type) {
      case 'instagram':
        return <InstagramEmbed url={url} width={width} />;
      case 'youtube':
        return <YouTubeEmbed url={url} width={width} />;
      case 'twitter':
        return <TwitterEmbed url={url} width={width} />;
      case 'facebook':
        return <FacebookEmbed url={url} width={width} />;
      case 'tiktok':
        return <TikTokEmbed url={url} width={width} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`my-4 rounded-lg overflow-hidden shadow-sm ${className}`}
      style={{ maxWidth: width }}
    >
      {renderEmbed()}
    </div>
  );
};

export { detectSocialMediaType };
export type { SocialMediaType };
export default SocialMediaPreview;
