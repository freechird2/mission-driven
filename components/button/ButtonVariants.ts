import { cva, VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'flex items-center justify-center font-semibold cursor-pointer disabled:cursor-not-allowed outline-none',
  {
    variants: {
      variant: {
        gray: 'bg-gray text-white hover:bg-gray-hover active:bg-gray-active disabled:bg-disabled',
        primary:
          'bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:bg-disabled',
        line: 'border disabled:bg-[#E5E5E5] disabled:border-[#D7D7D7] disabled:text-[#8F8F8F]',
      },
      size: {
        small: 'rounded-sm h-[38px] text-16 leading-[1.4]',
        medium: 'rounded-md h-[48px] text-18 leading-[1.3]',
        large: 'rounded-lg h-[58px] text-20 leading-[1.3]',
      },
      isActive: {
        true: '',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'gray',
        isActive: true,
        className: 'bg-gray-active',
      },
      {
        variant: 'primary',
        isActive: true,
        className: 'bg-primary-active',
      },
      {
        variant: 'line',
        isActive: true,
        className:
          'bg-ghost-active text-primary border-primary hover:bg-ghost-active hover:border-primary',
      },
      {
        variant: 'line',
        isActive: false,
        className:
          'bg-ghost text-gray border-border hover:bg-ghost-hover hover:border-border-hover',
      },
    ],
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
