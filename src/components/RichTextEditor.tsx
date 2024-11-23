import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  height?: number;
}

export default function RichTextEditor({ value, onChange, label, height = 200 }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Editor
        id={`editor-${label.toLowerCase().replace(/\s+/g, '-')}`}
        apiKey="no-api-key"
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={value}
        init={{
          height,
          menubar: false,
          inline: false,
          skin: 'oxide',
          content_css: 'default',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'table', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist | ' +
            'removeformat',
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 14px;
              line-height: 1.5;
              color: #374151;
              margin: 1rem;
            }
          `,
          branding: false,
          promotion: false,
          statusbar: false,
          resize: false,
          elementpath: false
        }}
        onEditorChange={onChange}
      />
    </div>
  );
}