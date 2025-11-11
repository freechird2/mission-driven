import { HeadingVariants, headingVariants } from './HeadingVariants';

/**
 * Heading 컴포넌트
 *
 * 제목 및 설명 텍스트를 표시하는 컴포넌트입니다.
 *
 * @param variant - 제목 레벨: 'h1' | 'h2' | 'h3' | 'h4' (기본값: 'h1')
 * @param isDescription - 설명 텍스트 스타일 적용 여부 (기본값: false)
 * @param children - 표시할 텍스트
 * @param className - 추가 스타일 클래스
 *
 * @example
 * <Heading variant="h1">제목</Heading>
 * <Heading variant="h2" isDescription>설명 텍스트</Heading>
 */

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
