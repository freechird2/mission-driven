'use client';

import Button from '@/components/button/Button';
import Heading from '@/components/heading/Heading';
import XIcon from '@/components/icons/XIcon';
import ImageButton from '@/components/imageButton/ImageButton';
import Loading from '@/components/loading/Loading';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

const RegistContent = () => {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalReplaceImagesInputRef = useRef<HTMLInputElement>(null);
  const { width, isMounted } = useWindowWidth();
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [replaceImageIndex, setReplaceImageIndex] = useState<number>(0);

  const handleMainImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 15 * 1024 * 1024) {
          alert('이미지 파일 용량이 너무 큽니다. (최대 15MB)');
          return;
        }
        setMainImage(file);
      }
    },
    [setMainImage],
  );

  const handleAdditionalImagesChange = useCallback(
    (files: File[]) => {
      // 최대 4장 제한을 고려하여 추가 가능한 개수만큼만 처리
      const remainingSlots = 4 - additionalImages.length;
      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach((file: File) => {
        if (file.size > 15 * 1024 * 1024) {
          alert('이미지 파일 용량이 너무 큽니다. (최대 15MB)');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImages((prev) => {
            // 최대 4장 제한 체크
            if (prev.length < 4) {
              return [file, ...prev];
            }
            return prev;
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [setAdditionalImages],
  );

  const handleAdditionalReplaceImagesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 15 * 1024 * 1024) {
          alert('이미지 파일 용량이 너무 큽니다. (최대 15MB)');
          return;
        }

        setAdditionalImages((prev) => {
          return prev.map((image, index) => {
            if (index === replaceImageIndex) {
              return file;
            }
            return image;
          });
        });
      }
    },
    [handleAdditionalImagesChange, replaceImageIndex],
  );

  if (!isMounted) return <Loading />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 max-w-[1100px] mx-auto h-full w-full px-4 md:px-5 pt-10 pb-40">
      {/* left conent */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Heading variant="h1">대표이미지</Heading>
          <div className="relative w-full flex flex-col items-center justify-center gap-3 lg:gap-4 aspect-square bg-[#F7F7F8] rounded-lg border border-solid border-border overflow-hidden">
            {mainImage ? (
              <Image
                src={URL.createObjectURL(mainImage)}
                alt="대표이미지"
                fill
                className="object-cover cursor-pointer"
                onClick={() => {
                  mainImageInputRef.current?.click();
                }}
              />
            ) : (
              <>
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-20 lg:text-28 font-bold leading-[1.3] text-[#121212] text-center">
                    콘텐츠 대표 이미지를
                    <br />
                    등록해 주세요!
                  </p>
                  <p className="text-16 lg:text-22 font-medium leading-[1.3] text-[#8F8F8F] text-center">
                    1:1 비율의 정사각형 이미지를 추천합니다
                  </p>
                </div>
                <Button
                  className="w-[160px]"
                  variant="gray"
                  size={isMounted && width < 1024 ? 'medium' : 'large'}
                  onClick={() => {
                    mainImageInputRef.current?.click();
                  }}
                >
                  이미지 업로드
                </Button>
              </>
            )}
            <input
              ref={mainImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Heading variant="h1">추가 이미지 (선택)</Heading>
            <p className="text-16 text-[#8F8F8F] font-medium leading-[1.3]">
              최대 4장까지 등록할 수 있어요
            </p>
          </div>

          {/* 데스크탑 뷰 */}
          <div className="grid-cols-2 gap-2 hidden md:grid">
            {/* 등록된 이미지들 */}
            {additionalImages.map((imageUrl, index) => (
              <div key={index} className="relative w-full aspect-square group">
                <Image
                  src={URL.createObjectURL(imageUrl)}
                  alt={`추가 이미지 ${index + 1}`}
                  fill
                  className="object-cover rounded-lg border border-solid border-border cursor-pointer"
                  onClick={() => {
                    setReplaceImageIndex(index);
                    additionalReplaceImagesInputRef.current?.click();
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F7F7F8] cursor-pointer"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
            {/* 이미지 추가 버튼 (최대 4장까지) */}
            {additionalImages.length < 4 && (
              <ImageButton onImageSelect={handleAdditionalImagesChange} />
            )}
            <input
              ref={additionalReplaceImagesInputRef}
              type="file"
              accept="image/*"
              onChange={handleAdditionalReplaceImagesChange}
              className="hidden"
            />
          </div>
          {/* 모바일 뷰 */}
          <div className="overflow-x-auto -ml-4 -mr-4 hide-scrollbar">
            <div className="flex gap-2 md:hidden px-4">
              {additionalImages.map((imageUrl, index) => (
                <div key={index} className="relative aspect-square group h-[120px] w-[120px]">
                  <Image
                    src={URL.createObjectURL(imageUrl)}
                    alt={`추가 이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg border border-solid border-border cursor-pointer"
                    onClick={() => {
                      setReplaceImageIndex(index);
                      additionalReplaceImagesInputRef.current?.click();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-2 right-2 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
              {additionalImages.length < 4 && (
                <ImageButton onImageSelect={handleAdditionalImagesChange} />
              )}
              <div className="min-w-2 min-h-full bg-transparent"></div>
              {/* <input
                ref={additionalReplaceImagesInputRef}
                type="file"
                accept="image/*"
                onChange={handleAdditionalReplaceImagesChange}
                className="hidden"
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* right conent */}
      <div>right</div>
    </div>
  );
};

export default RegistContent;
