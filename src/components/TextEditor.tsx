import React, { useState } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const [selectedText, setSelectedText] = useState('');

  const handleHeadingClick = (level: number) => {
    const textArea = document.querySelector('textarea');
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = textArea.value;

    const selectedText = text.substring(start, end);
    const headingText = `<h${level}>${selectedText}</h${level}>`;
    
    const newText = text.substring(0, start) + headingText + text.substring(end);
    onChange(newText);
  };

  return (
    <div className="text-editor">
      <div className="flex gap-2 mb-2 toolbar">
        <button
          onClick={() => handleHeadingClick(1)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          H1
        </button>
        <button
          onClick={() => handleHeadingClick(2)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          H2
        </button>
        <button
          onClick={() => handleHeadingClick(3)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          H3
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setSelectedText(target.value.substring(target.selectionStart, target.selectionEnd));
        }}
        className="w-full min-h-[200px] p-2 border rounded"
      />
      <div className="mt-4 preview">
        <div
          dangerouslySetInnerHTML={{
            __html: value
          }}
          className="prose"
        />
      </div>
    </div>
  );
};

export default TextEditor;
