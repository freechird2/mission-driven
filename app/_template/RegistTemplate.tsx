'use client';

import Button from '@/components/button/Button';
import AlertDialog from '@/components/dialog/AlertDialog/AlertDialog';
import Header from '@/components/header/Header';
import useDialog from '@/hooks/useDialog';
import { useState } from 'react';
import RegistContent from '../_components/RegistContent';

/**
 * RegistTemplate - 콘텐츠 등록 페이지 템플릿
 *
 * 콘텐츠 등록 폼의 전체 레이아웃을 관리하는 템플릿 컴포넌트입니다.
 * 반응형 디자인으로 모바일과 데스크탑에서 다른 UI를 제공합니다.
 *
 * @layout
 * - Header: 상단 고정 헤더 (데스크탑에서만 "다음으로" 버튼 포함)
 * - RegistContent: 메인 폼 컨텐츠 영역
 * - 하단 고정 버튼: 모바일 전용 (md:hidden)
 *
 * @state
 * - isValidate: 폼 검증 상태로, RegistContent에서 모든 필수 필드가 채워졌는지 확인
 *   → Header와 하단 버튼의 활성화 상태를 제어
 *
 * @note
 * - 데스크탑: Header의 "다음으로" 버튼 사용
 * - 모바일: 하단 고정된 "다음으로" 버튼 사용
 */
const RegistTemplate = () => {
  // 폼 검증 상태: RegistContent에서 모든 필수 필드가 올바르게 입력되었는지 추적
  // 이 상태는 Header와 하단 버튼의 활성화 여부를 결정합니다.
  const [isValidate, setIsValidate] = useState<boolean>(false);
  const { open } = useDialog();

  return (
    <div className="h-full w-full">
      {/* 
        상단 고정 헤더
        - 데스크탑(md 이상): "다음으로" 버튼이 헤더 우측에 표시됨
        - 모바일: 버튼 없음 (하단 고정 버튼 사용)
        - isValid prop으로 버튼 활성화 상태 제어
      */}
      <Header isMain isValid={isValidate} />

      {/* 메인 컨텐츠 영역 */}
      <div className="h-full w-full mt-[48px] md:mt-[64px] bg-white">
        {/* 
          RegistContent 컴포넌트
          - 폼의 모든 입력 필드를 관리
          - 필수 필드 검증 후 setIsValidate를 통해 상태 업데이트
          - useEffect로 실시간 검증 수행 (title, image, category, sessions 등)
        */}
        <RegistContent setIsValidate={setIsValidate} />
      </div>

      {/* 
        모바일 전용 하단 고정 버튼
        - 데스크탑에서는 숨김 처리 (md:hidden)
        - fixed positioning으로 화면 하단에 고정
        - isValidate 상태에 따라 버튼 활성/비활성화
        
        @click-handler
        - 실제 프로덕션에서는 여기에 API 호출 또는 다음 페이지 이동 로직이 들어감
      */}
      <div className="fixed md:hidden bottom-0 left-0 w-full h-[72px] bg-white border-t border-solid border-border pt-3 px-5">
        <Button
          size="medium"
          onClick={() => {
            open(
              <AlertDialog
                type="Alert"
                title="✅ 검증 완료!"
                content={`시간 입력은 UX 개선을 위해
            24시간 형식 셀렉트로 구현했습니다.
            자세한 내용은 SessionComponent.tsx
            주석을 참고해주세요.
            감사합니다!`}
              />,
            );
          }}
          disabled={!isValidate}
        >
          다음으로
        </Button>
      </div>
    </div>
  );
};

export default RegistTemplate;
