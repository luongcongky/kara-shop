import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  FiBold, FiItalic, FiUnderline, FiList, FiLink, FiImage, 
  FiYoutube, FiTable, FiPlusSquare, FiMinusSquare, FiTrash2,
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify,
  FiDroplet, FiEdit3
} from 'react-icons/fi';
import { Editor as TiptapEditor, Extension } from '@tiptap/react';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import ResizableImage from './extensions/ResizableImage';
import LineHeight from './extensions/LineHeight';
import { useCallback, useRef, useState, useEffect } from 'react';
import { api } from '@/utils/api';

// Custom Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, string | null>) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    }
  }
}

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  productId?: string | number;
}

const MenuBar = ({ editor, productId }: { editor: TiptapEditor | null; productId?: string | number }) => {
  if (!editor) return null;

  const addImage = () => {
    if (window.cloudinary) {
      window.cloudinary.openUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: 'kara-shop',
          sources: ['local', 'url'],
          multiple: false,
          clientAllowedFormats: ["png", "gif", "jpeg", "webp"],
          maxFileSize: 2000000,
          folder: productId ? `kara-shop/products/${productId}` : 'kara-shop/editor',
        },
        (error: Error | null, result: { event: string; info: { secure_url: string } }) => {
          if (!error && result && result.event === 'success') {
            editor.chain().focus().setImage({ src: result.info.secure_url }).run();
          }
        }
      );
    } else {
      const url = window.prompt('Nhập URL hình ảnh:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Nhập URL video YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Nhập URL liên kết:', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];
  const FONT_FAMILIES = ['Roboto', 'Arial', 'Times New Roman', 'Courier New'];
  const COLORS = [
    '#000000', '#4B5563', '#9CA3AF', '#EF4444', '#F59E0B', 
    '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
    '#FFFFFF', '#D1D5DB', '#6B7280', '#1F2937', '#DC2626',
    '#D97706', '#059669', '#2563EB', '#4F46E5', '#7C3AED'
  ];
  const LINE_HEIGHTS = [
    { label: 'Mặc định', value: 'normal' },
    { label: '1.0', value: '1.0' },
    { label: '1.15', value: '1.15' },
    { label: '1.5', value: '1.5' },
    { label: '2.0', value: '2.0' },
    { label: '2.5', value: '2.5' },
    { label: '3.0', value: '3.0' },
  ];

  const Button = ({ onClick, isActive, children, title, className = '' }: { 
    onClick: () => void, 
    isActive?: boolean, 
    children: React.ReactNode, 
    title: string,
    className?: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 hover:bg-violet-50 hover:text-violet-600'
      } border border-transparent ${className}`}
    >
      {children}
    </button>
  );

  // Derived state from editor
  const currentFont = editor.getAttributes('textStyle').fontFamily || 'Roboto';
  const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
  const currentLineHeight = editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight || 'normal';

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
      {/* Group 1: Fonts */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300 mr-2">
        <select
          value={currentFont}
          onChange={(e) => {
            editor.chain().focus().setFontFamily(e.target.value).run();
          }}
          className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-violet-500"
          title="Phông chữ"
        >
          {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
        </select>

        <select
          value={currentSize}
          onChange={(e) => {
            editor.chain().focus().setFontSize(e.target.value).run();
          }}
          className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-violet-500"
          title="Kích thước chữ"
        >
          {FONT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
        </select>
      </div>

      {/* Group 2: Basic Formatting */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300 mr-2">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="In đậm"
        >
          <FiBold size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="In nghiêng"
        >
          <FiItalic size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Gạch chân"
        >
          <FiUnderline size={18} />
        </Button>
        
        {/* Color Picker with expanded area */}
        <div className="relative group/color">
          <Button onClick={() => {}} title="Màu chữ">
            <FiDroplet size={18} style={{ color: editor.getAttributes('textStyle').color || '#000000' }} />
          </Button>
          <div className="absolute top-full left-0 pt-2 hidden group-hover/color:block z-20">
            <div className="grid grid-cols-5 gap-2 p-3 bg-white border border-gray-200 rounded-xl shadow-2xl min-w-[180px]">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className="w-7 h-7 rounded-md border border-gray-100 hover:scale-110 transition-transform shadow-sm"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Tô sáng"
        >
          <FiEdit3 size={18} />
        </Button>
      </div>

      {/* Group 3: Alignment */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300 mr-2">
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Căn trái"
        >
          <FiAlignLeft size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Căn giữa"
        >
          <FiAlignCenter size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Căn phải"
        >
          <FiAlignRight size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Căn đều"
        >
          <FiAlignJustify size={18} />
        </Button>

        {/* Line Height Dropdown */}
        <div className="relative group/lineheight ml-1">
          <select
            value={currentLineHeight}
            onChange={(e) => {
              const height = e.target.value;
              if (height === 'normal') {
                editor.chain().focus().unsetLineHeight().run();
              } else {
                editor.chain().focus().setLineHeight(height).run();
              }
            }}
            className="h-9 bg-white border border-gray-200 rounded-lg px-2 text-sm outline-none focus:border-violet-500 cursor-pointer"
            title="Giãn dòng"
          >
            {LINE_HEIGHTS.map(lh => (
              <option key={lh.value} value={lh.value}>
                ↕ {lh.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Group 4: Lists & Headings */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300 mr-2">
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Danh sách dấu chấm"
        >
          <FiList size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Tiêu đề H2"
        >
          <span className="font-bold text-sm">H2</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Tiêu đề H3"
        >
          <span className="font-bold text-sm">H3</span>
        </Button>
      </div>

      {/* Group 5: Media & Links */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300 mr-2">
        <Button onClick={setLink} isActive={editor.isActive('link')} title="Chèn liên kết">
          <FiLink size={18} />
        </Button>
        <Button onClick={addImage} title="Chèn hình ảnh">
          <FiImage size={18} />
        </Button>
        <Button onClick={addYoutubeVideo} title="Chèn video YouTube">
          <FiYoutube size={18} />
        </Button>
      </div>

      {/* Group 6: Table Tools */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Chèn bảng"
        >
          <FiTable size={18} />
        </Button>
        {editor.isActive('table') && (
          <div className="flex items-center gap-1 ml-1 pl-2 border-l border-gray-200">
            <Button onClick={() => editor.chain().focus().addColumnBefore().run()} title="Thêm cột trước">
              <FiPlusSquare size={16} />
            </Button>
            <Button onClick={() => editor.chain().focus().deleteColumn().run()} title="Xoá cột">
              <FiMinusSquare size={16} />
            </Button>
            <Button onClick={() => editor.chain().focus().addRowBefore().run()} title="Thêm dòng trước">
              <FiPlusSquare size={16} className="rotate-90" />
            </Button>
            <Button onClick={() => editor.chain().focus().deleteRow().run()} title="Xoá dòng">
              <FiMinusSquare size={16} className="rotate-90" />
            </Button>
            <Button onClick={() => editor.chain().focus().deleteTable().run()} title="Xoá bảng" className="text-red-500">
              <FiTrash2 size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Editor = ({ content, onChange, productId }: EditorProps) => {
  const deleteImageMutation = api.cloudinary.deleteImage.useMutation();
  const lastImagesRef = useRef<Set<string>>(new Set());
  const [, forceUpdate] = useState(0);

  const getImagesFromHTML = (html: string) => {
    const urls = new Set<string>();
    const regExp = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = regExp.exec(html)) !== null) {
      if (match[1]) urls.add(match[1]);
    }
    return urls;
  };

  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'kara-shop');
    if (productId) {
      formData.append('folder', `kara-shop/products/${productId}`);
    } else {
      formData.append('folder', 'kara-shop/editor');
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }, [productId]);

  const editor = useEditor({
    immediatelyRender: false,
    onTransaction: () => {
      forceUpdate(prev => prev + 1);
    },
    onSelectionUpdate: () => {
      forceUpdate(prev => prev + 1);
    },
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      ResizableImage.configure({
        allowBase64: true,
      }),
      LineHeight,
      Youtube.configure({
        width: 480,
        height: 320,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Highlight.configure({ multicolor: true }),
      FontSize,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const newHTML = editor.getHTML();
      onChange(newHTML);

      // Auto-delete logic
      const currentImages = getImagesFromHTML(newHTML);
      const deletedImages = Array.from(lastImagesRef.current).filter(url => !currentImages.has(url));
      
      deletedImages.forEach(url => {
        if (url.includes('cloudinary.com')) {
          console.log('[Editor] Auto-deleting image:', url);
          deleteImageMutation.mutate({ imageUrl: url });
        }
      });

      lastImagesRef.current = currentImages;
    },
    onCreate: ({ editor }) => {
      lastImagesRef.current = getImagesFromHTML(editor.getHTML());
    },
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            uploadImage(file).then(url => {
              if (url) {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              }
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            if (file) {
              uploadImage(file).then(url => {
                if (url) {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: url });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                }
              });
              return true;
            }
          }
        }
        return false;
      },
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px] max-w-none',
      },
    },
  });

  // Sync content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content, { emitUpdate: false });
      // Update the reference to current images so we don't accidentally delete generic ones
      // or miss deletions if we switch steps
      lastImagesRef.current = getImagesFromHTML(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full border border-gray-200 rounded-2xl bg-white focus-within:border-violet-500 transition-colors shadow-inner">
      <MenuBar editor={editor} productId={productId} />
      <div className="bg-white p-4 rounded-b-2xl">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #ddd;
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: #f9f9f9;
        }
        .ProseMirror table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }
        .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px; top: 0; bottom: 0;
          width: 4px;
          z-index: 20;
          background-color: #adf;
          pointer-events: none;
        }
        .ProseMirror.resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }
        .ProseMirror > * + * {
          margin-top: 0.5em; /* Reduced spacing between blocks */
        }
        .ProseMirror p {
          margin-bottom: 0.5em; /* Specific paragraph spacing */
          line-height: normal; /* Default line height */
        }
        .ProseMirror img {
          display: block;
          max-width: 100%;
          height: auto;
          cursor: pointer;
          margin-bottom: 0.5em; /* Image spacing */
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #7c3aed;
        }
      `}</style>
    </div>
  );
};

export default Editor;
