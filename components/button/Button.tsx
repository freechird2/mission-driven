import { ButtonVariants, buttonVariants } from './ButtonVariants';

/**
 * Button 컴포넌트
 *
 * @param variant - 버튼 스타일: 'gray' | 'primary' | 'line' (기본값: 'primary')
 * @param size - 버튼 크기: 'small' | 'medium' | 'large' (기본값: 'medium')
 * @param isActive - 활성 상태 여부 (기본값: false)
 * @param children - 버튼 내부 텍스트 또는 요소
 *
 * @example
 * <Button variant="primary" size="medium">버튼</Button>
 * <Button variant="line" size="small" isActive={true}>활성 버튼</Button>
 * <Button disabled>비활성 버튼</Button>
 */

interface ButtonProps extends ButtonVariants, React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  isActive?: ButtonVariants['isActive'];
  className?: string;
}

const Button = ({
  variant = 'primary',
  size = 'medium',
  isActive = false,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={buttonVariants({
        variant,
        size,
        isActive,
        fullWidth: className ? false : true,
        className,
      })}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
