import { cva, VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
  'flex flex-col gap-1 w-full h-[118px] md:h-[138px] border rounded-lg py-4 px-4',
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
