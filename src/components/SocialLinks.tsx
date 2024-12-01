import React from 'react';
import { Plus, Minus, Link as LinkIcon } from 'lucide-react';
import { SocialLink } from '../types/invitation';
import SocialMediaPreview, { detectSocialMediaType } from './SocialMediaPreview';

interface SocialLinksProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  isViewOnly?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  onChange,
  isViewOnly = false,
}) => {
  const handleAddLink = () => {
    onChange([...links, { title: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    onChange(newLinks);
  };

  const handleLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      {!isViewOnly && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Media Sosial</h3>
          <button
            type="button"
            onClick={handleAddLink}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Link
          </button>
        </div>
      )}

      <div className="space-y-6">
        {links.map((link, index) => (
          <div key={index} className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
            {!isViewOnly ? (
              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <div className="space-y-4 p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 ">
                        Judul
                      </label>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm focus:ring-primary-500 focus:border-primary-500 border border-gray-300 rounded-md "
                        placeholder="Contoh: Instagram Kami"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        URL
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm border border-gray-300">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          <LinkIcon className="h-4 w-4" />
                        </span>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                          className="flex-1 p-2 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="mt-6 inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-600">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  {link.title || link.url}
                </a>
              </div>
            )}

            {/* Social Media Preview */}
            {link.url && detectSocialMediaType(link.url) && (
              <div className="mt-4">
                <SocialMediaPreview
                  url={link.url}
                  width={isViewOnly ? 328 : 400}
                  className="bg-gray-50"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;