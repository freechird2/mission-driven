'use client';

import { useEffect, useState } from 'react';

/**
 * 브라우저 화면의 width를 실시간으로 추적하는 hook
 * @returns 현재 화면 width (픽셀 단위)와 마운트 상태
 */
export function useWindowWidth(): { width: number; isMounted: boolean } {
  const [width, setWidth] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    // SSR 환경에서 window 객체가 없을 수 있으므로 체크
    if (typeof window === 'undefined') {
      return;
    }

    // 클라이언트에서 마운트되었음을 표시하고 초기 width 설정
    setIsMounted(true);
    setWidth(window.innerWidth);

    // 초기 width 설정
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };

    // resize 이벤트 리스너 추가
    window.addEventListener('resize', updateWidth);

    // cleanup: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return { width, isMounted };
}
