import { ButtonVariants, buttonVariants } from './ButtonVariants';

interface ButtonProps extends ButtonVariants, React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  isActive?: ButtonVariants['isActive'];
}

const Button = ({
  variant = 'primary',
  size = 'medium',
  isActive = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={buttonVariants({ variant, size, isActive })} {...props}>
      {children}
    </button>
  );
};

export default Button;
