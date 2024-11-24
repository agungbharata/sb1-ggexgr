import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import { Bold, Italic, Underline as UnderlineIcon, List, AlignJustify, AlignLeft, AlignCenter, AlignRight, Heading as HeadingIcon } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  height?: number;
}

export default function RichTextEditor({ value, onChange, label, height = 200 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2],
      }),
      BulletList,
      ListItem,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        heading: false,
        bulletList: false,
        listItem: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const alignmentButtons = [
    { alignment: 'left', icon: AlignLeft },
    { alignment: 'center', icon: AlignCenter },
    { alignment: 'right', icon: AlignRight },
    { alignment: 'justify', icon: AlignJustify },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div style={{ height: `${height}px` }} className="rounded-lg border">
        <div className="flex gap-2 p-2 border-b">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
            title="Heading"
          >
            <HeadingIcon size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <Bold size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <Italic size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
            title="Underline"
          >
            <UnderlineIcon size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <List size={20} />
          </button>
          <div className="mx-1 w-px h-6 bg-gray-300" /> {/* Separator */}
          <div className="flex gap-1">
            {alignmentButtons.map(({ alignment, icon: Icon }) => (
              <button
                key={alignment}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setTextAlign(alignment).run();
                }}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive({ textAlign: alignment }) ? 'bg-gray-200' : ''
                }`}
                title={`Align ${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
        </div>
        <EditorContent 
          editor={editor} 
          className="p-4 max-w-none prose prose-sm" 
          style={{ height: `${height - 52}px`, overflowY: 'auto' }}
        />
      </div>
    </div>
  );
}