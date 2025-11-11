'use client';

import { useCallback } from 'react';
import Button from '../button/Button';

interface HeaderProps {
  isMain?: boolean;
  isValid?: boolean;
}

const Header = ({ isMain = true, isValid = false }: HeaderProps) => {
  const handleNext = useCallback(() => {
    if (isMain) {
      alert('다음으로');
    }
  }, [isMain]);

  return (
    <div className="w-full fixed top-0 left-0 h-[48px] md:h-[64px] border-b border-solid border-[#D7D7D7] bg-white px-5">
      <div className="relative flex items-center justify-center w-full h-full max-w-[1100px] mx-auto text-[#121212] text-18 md:text-24 font-bold leading-[1.3]">
        <span>과제</span>
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
