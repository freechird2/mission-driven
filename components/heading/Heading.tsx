import { HeadingVariants, headingVariants } from './HeadingVariants';

interface HeadingProps extends HeadingVariants {
  variant?: HeadingVariants['variant'];
  isDescription?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Heading = ({ variant = 'h1', isDescription = false, children, className }: HeadingProps) => {
  return <div className={headingVariants({ variant, isDescription, className })}>{children}</div>;
};

export default Heading;
