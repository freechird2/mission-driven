'use client';

import { useEffect, useRef, useState } from 'react';
import { TextareaVariants, textareaVariants } from './TextareaVariants';

/**
 * Textarea 컴포넌트
 *
 * 텍스트 입력 영역 컴포넌트로, 글자 수 카운터와 에러 상태를 지원합니다.
 *
 * @param value - 입력값 (필수)
 * @param maxLength - 최대 글자 수 (기본값: 80)
 * @param minLength - 최소 글자 수 (기본값: 8)
 * @param errorMessage - 에러 메시지 (기본값: '설명 문구 입력')
 * @param placeholder - placeholder 텍스트 (기본값: '텍스트를 입력해주세요')
 * @param autoResize - 자동 높이 조절 활성화 여부 (기본값: false)
 *
 * @example
 * <Textarea value={text} onChange={(e) => setText(e.target.value)} />
 * <Textarea value={text} maxLength={100} minLength={10} errorMessage="최소 10자 이상 입력해주세요" autoResize />
 */
interface TextareaProps
  extends TextareaVariants,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  maxLength?: number;
  minLength?: number;
  errorMessage?: string;
  autoResize?: boolean; // 자동 높이 조절 활성화 여부
}

const Textarea = ({
  value = '',
  maxLength = 80,
  minLength = 8,
  placeholder = '텍스트를 입력해주세요',
  errorMessage = '설명 문구 입력',
  autoResize = false,
  ...props
}: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // 윈도우 크기 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // 초기값 설정
    updateWindowWidth();

    window.addEventListener('resize', updateWindowWidth);
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  // textarea 높이를 내용에 맞게 자동 조절
  useEffect(() => {
    if (!autoResize) return; // autoResize가 false면 실행하지 않음

    const textarea = textareaRef.current;
    if (!textarea) return;

    // 높이를 초기화하고 scrollHeight로 재계산
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;

    // 반응형 최대 높이 설정
    // 768px 이하: 278px, 768px 이상: 358px
    const maxHeight = windowWidth <= 768 ? 222 : 302;

    if (scrollHeight <= maxHeight) {
      // 최대 높이 이하면 내용에 맞게 높이 조절
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
      // 스크롤이 없으면 padding-top 유지
      textarea.style.paddingTop = '16px';
      setIsScrolled(false);
    } else {
      // 최대 높이 초과하면 고정 높이로 설정하고 scroll 활성화
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
      // 스크롤 위치에 따라 padding-top 조절
      if (textarea.scrollTop > 0) {
        textarea.style.paddingTop = '0px';
        setIsScrolled(true);
      } else {
        textarea.style.paddingTop = '16px';
        setIsScrolled(false);
      }
    }
  }, [value, autoResize, windowWidth]);

  // 스크롤 이벤트 핸들러
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    if (textarea.scrollTop > 10) {
      // 스크롤이 내려갔으면 padding-top 제거
      textarea.style.paddingTop = '0px';
      setIsScrolled(true);
    } else {
      // 맨 위로 올라왔으면 padding-top 복원
      textarea.style.paddingTop = '16px';
      setIsScrolled(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsError(e.target.value.length < minLength);
    props.onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-1 bg-white">
      <div
        className={textareaVariants({ isError, isFocused })}
        onClick={() => {
          textareaRef.current?.focus();
          setIsFocused(true);
        }}
      >
        <textarea
          ref={textareaRef}
          className="w-full resize-none border-none outline-none text-[#121212] text-medium text-16 md:text-18 leading-[1.3] placeholder:text-[#8F8F8F] placeholder:text-medium placeholder:text-16 md:placeholder:text-18 placeholder:leading-[1.3] hide-scrollbar"
          style={{
            paddingTop: '16px',
            transition: 'padding-top 0.2s ease-in-out',
          }}
          {...props}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsError(value.length < minLength);
          }}
        />
        <p className="text-right font-medium text-14 leading-[1.3] text-[#8F8F8F]">
          {`${value.length || 0}/${maxLength}자 (최소${minLength}자)`}
        </p>
      </div>
      {isError && <p className="text-error text-16 text-medium leading-[1.3]">{errorMessage}</p>}
    </div>
  );
};

export default Textarea;
