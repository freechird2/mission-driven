'use client';

import { useCallback } from 'react';
import Button from '../button/Button';

/**
 * Header 컴포넌트
 *
 * 고정 헤더로 페이지 상단에 표시됩니다.
 * 데스크톱에서만 "다음으로" 버튼이 보입니다.
 *
 * @param isMain - 메인 페이지 여부 (기본값: true)
 * @param isValid - 다음 버튼 활성화 여부 (기본값: false)
 * @param onNext - 다음 버튼 클릭 시 실행할 함수
 *
 * @example
 * <Header />
 * <Header isMain={false} isValid={true} />
 */

interface HeaderProps {
  title?: string;
  isMain?: boolean;
  isValid?: boolean;
  onNext?: () => void;
}

const Header = ({ title = '과제', isMain = true, isValid = false, onNext }: HeaderProps) => {
  const handleNext = useCallback(() => {
    if (isMain) {
      alert('다음으로');
    } else {
      onNext?.();
    }
  }, [isMain, onNext]);

  return (
    <div className="w-full fixed top-0 left-0 h-[48px] md:h-[64px] border-b border-solid border-[#D7D7D7] bg-white px-5 z-10">
      <div className="relative flex items-center justify-center w-full h-full max-w-[1100px] mx-auto text-[#121212] text-18 md:text-24 font-bold leading-[1.3]">
        <span>{title}</span>
        <div className="absolute w-[120px] hidden md:block right-5 top-1/2 -translate-y-1/2">
          <Button size="small" onClick={handleNext} disabled={!isValid}>
            다음으로
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
