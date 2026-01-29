/* eslint-disable @typescript-eslint/no-explicit-any */
import { Extension } from '@tiptap/core';

export interface LineHeightOptions {
  types: string[];
  defaultHeight: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (height: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultHeight: 'normal',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultHeight,
            parseHTML: (element: HTMLElement) => element.style.lineHeight || this.options.defaultHeight,
            renderHTML: (attributes: Record<string, unknown>) => {
              if (attributes.lineHeight === this.options.defaultHeight) {
                return {};
              }
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (height: string) =>
        ({ commands }: { commands: Record<string, any> }) => {
          return this.options.types.every((type: string) => commands.updateAttributes(type, { lineHeight: height }));
        },
      unsetLineHeight:
        () =>
        ({ commands }: { commands: Record<string, any> }) => {
          return this.options.types.every((type: string) => commands.resetAttributes(type, 'lineHeight'));
        },
    };
  },
});

export default LineHeight;
