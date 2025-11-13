import { cva, VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
  'flex flex-col justify-between gap-1 w-full h-full min-h-[118px] md:min-h-[138px] border rounded-lg pb-4 px-4',
  {
    variants: {
      isFocused: {
        true: '',
        false: '',
      },
      isError: {
        true: 'border-error',
        false: '',
      },
    },
    compoundVariants: [
      {
        isFocused: true,
        isError: false,
        className: 'border-primary',
      },
      {
        isFocused: false,
        isError: false,
        className: 'border-border',
      },
    ],
  },
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
