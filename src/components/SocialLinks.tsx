import React from 'react';
import { Link, Plus, Trash2 } from 'lucide-react';
import type { SocialLink } from '../types';

interface SocialLinksProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export default function SocialLinks({ links, onChange }: SocialLinksProps) {
  const addLink = () => {
    onChange([...links, { platform: '', title: '', url: '', embedCode: '' }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = links.map((link, i) => {
      if (i === index) {
        let updatedLink = { ...link, [field]: value };
        
        // If platform or URL changes, try to generate embed code
        if (field === 'platform' || field === 'url') {
          updatedLink.embedCode = generateEmbedCode(updatedLink.url, updatedLink.platform);
        }
        
        return updatedLink;
      }
      return link;
    });
    onChange(newLinks);
  };

  const generateEmbedCode = (url: string, platform: string): string => {
    if (!url) return '';

    // Convert platform to lowercase for case-insensitive matching
    const platformLower = platform.toLowerCase();

    // Common video platforms
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const youtubeId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
      return youtubeId ? `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${youtubeId[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : '';
    }

    if (url.includes('vimeo.com')) {
      const vimeoId = url.match(/vimeo\.com\/([0-9]+)/);
      return vimeoId ? `<iframe src="https://player.vimeo.com/video/${vimeoId[1]}" width="100%" height="315" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>` : '';
    }

    // Social media platforms
    if (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/')) {
      const instagramId = url.match(/instagram\.com\/(?:p|reel)\/([^\/]+)/);
      return instagramId ? `<iframe width="100%" height="600" src="https://www.instagram.com/p/${instagramId[1]}/embed" frameborder="0" scrolling="no" allowtransparency="true"></iframe>` : '';
    }

    if (url.includes('facebook.com')) {
      return `<iframe src="https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500" width="100%" height="600" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
    }

    if (url.includes('tiktok.com')) {
      const tiktokId = url.match(/tiktok\.com\/(?:@[^\/]+\/video\/|v\/)(\d+)/);
      return tiktokId ? `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${tiktokId[1]}" style="max-width: 605px;min-width: 325px;"><section></section></blockquote><script async src="https://www.tiktok.com/embed.js"></script>` : '';
    }

    if (url.includes('twitter.com') || url.includes('x.com')) {
      return `<div style="min-height: 500px;"><a href="${url}"></a></div><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
    }

    // For other platforms, return empty string as they might not support embedding
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
        <button
          type="button"
          onClick={addLink}
          className="flex items-center text-sm text-pink-600 hover:text-pink-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Link
        </button>
      </div>
      
      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => updateLink(index, 'platform', e.target.value)}
                placeholder="Platform (e.g., YouTube, Instagram, Facebook, TikTok)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />

              <input
                type="text"
                value={link.title}
                onChange={(e) => updateLink(index, 'title', e.target.value)}
                placeholder="Title (e.g., Our Pre-Wedding Video)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />

              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />

              {link.embedCode && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-2">Preview:</div>
                  <div dangerouslySetInnerHTML={{ __html: link.embedCode }} />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="p-2 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}