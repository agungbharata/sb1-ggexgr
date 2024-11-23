import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyLinkButtonProps {
  url: string;
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow p-3">
      <input
        type="text"
        value={url}
        readOnly
        className="flex-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200"
      />
      <button
        onClick={handleCopy}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-pink-500 text-white hover:bg-pink-600'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}