/* eslint-disable @next/next/no-img-element */
import { NodeViewWrapper, ReactNodeViewRenderer, NodeViewProps } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import { useCallback, useEffect, useRef, useState } from 'react';

const ResizableImageComponent = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const [width, setWidth] = useState(node.attrs.width || '100%');
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setWidth(node.attrs.width || '100%');
  }, [node.attrs.width]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = imageRef.current ? imageRef.current.offsetWidth : 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!imageRef.current) return;
      const currentX = moveEvent.clientX;
      const diffX = currentX - startX;
      const newWidth = Math.max(100, startWidth + diffX);
      setWidth(`${newWidth}px`);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      if (imageRef.current) {
        updateAttributes({ width: `${imageRef.current.offsetWidth}px` });
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [updateAttributes]);

  const textAlign = node.attrs.textAlign || 'left';
  const justifyContent = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

  return (
    <NodeViewWrapper 
      className="max-w-full relative group flex my-2" 
      style={{ justifyContent }}
    >
      <div className="relative" style={{ width: width === '100%' ? '100%' : 'auto' }}>
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt}
          title={node.attrs.title}
          style={{ width: width, height: 'auto', display: 'block', maxWidth: '100%' }}
          className={`transition-shadow ${selected || isResizing ? 'ring-2 ring-violet-500 rounded-sm' : ''}`}
        />
        
        {selected && (
          <div
            className="absolute bottom-1 right-1 w-4 h-4 bg-violet-600 border-2 border-white rounded-full cursor-nwse-resize z-10 shadow-md"
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: attributes => {
            if (!attributes.width) return {};
            return {
                width: attributes.width,
                style: `width: ${attributes.width}`,
            };
        },
      },
      height: {
        default: null,
      },
      textAlign: {
        default: 'left',
        renderHTML: attributes => {
          if (!attributes.textAlign || attributes.textAlign === 'left') {
            return {
              style: 'display: block; margin-right: auto; margin-left: 0;', // Left align
            };
          }
          if (attributes.textAlign === 'center') {
            return {
              style: 'display: block; margin-left: auto; margin-right: auto;', // Center align
            };
          }
          if (attributes.textAlign === 'right') {
            return {
              style: 'display: block; margin-left: auto; margin-right: 0;', // Right align
            };
          }
          return {};
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

export default ResizableImage;
