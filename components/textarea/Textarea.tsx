'use client';

import { useRef, useState } from 'react';
import { TextareaVariants, textareaVariants } from './TextareaVariants';

interface TextareaProps
  extends TextareaVariants,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  maxLength?: number;
  minLength?: number;
  errorMessage?: string;
}

const Textarea = ({
  value = '',
  maxLength = 80,
  minLength = 8,
  placeholder = '텍스트를 입력해주세요',
  errorMessage = '설명 문구 입력',
  ...props
}: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsError(e.target.value.length < minLength);
    props.onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={textareaVariants({ isError, isFocused })}
        onClick={() => {
          textareaRef.current?.focus();
          setIsFocused(true);
        }}
      >
        <textarea
          ref={textareaRef}
          className="w-full h-full resize-none border-none outline-none text-[#121212] text-medium text-16 md:text-18 leading-[1.3] placeholder:text-[#8F8F8F] placeholder:text-medium placeholder:text-16 md:placeholder:text-18 placeholder:leading-[1.3]"
          {...props}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
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
