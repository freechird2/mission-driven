'use client';

import React, { useRef } from 'react';
import ImagePlus from '../icons/ImagePlus';

interface ImageButtonProps {
  onImageSelect: (files: File[]) => void;
  disabled?: boolean;
}

/**
 * ImageButton 컴포넌트
 *
 * 이미지 선택을 위한 버튼 컴포넌트 (multiple 지원)
 *
 * @param onImageSelect - 이미지 선택 시 호출되는 콜백 함수 (File 배열)
 * @param disabled - 버튼 비활성화 여부
 *
 * @example
 * <ImageButton onImageSelect={(files) => handleImageSelect(files)} />
 */
const ImageButton = ({ onImageSelect, disabled = false }: ImageButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // FileList를 배열로 변환하고 이미지 파일만 필터링
      const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        onImageSelect(imageFiles);
      }
      // 같은 파일을 다시 선택할 수 있도록 value 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="aspect-square w-[120px] h-[120px] md:w-full md:h-full bg-[#F7F7F8] rounded-lg border border-solid border-border flex items-center justify-center cursor-pointer hover:bg-[#E5E5E5] transition-colors disabled:cursor-not-allowed disabled:opacity-50 outline-none"
      >
        <ImagePlus className="w-8 h-8 md:w-12.5 md:h-12.5" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        multiple
        disabled={disabled}
      />
    </>
  );
};

export default ImageButton;
