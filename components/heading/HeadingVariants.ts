import { cva, VariantProps } from 'class-variance-authority';

export const headingVariants = cva('leading-[1.3]', {
  variants: {
    variant: {
      h1: 'text-22 md:text-28',
      h2: 'text-20 md:text-24',
      h3: 'text-18 md:text-20',
      h4: 'text-16 md:text-18',
    },
    isDescription: {
      true: 'font-medium text-[#767676]',
      false: 'font-bold text-[#121212]',
    },
  },
});

export type HeadingVariants = VariantProps<typeof headingVariants>;
