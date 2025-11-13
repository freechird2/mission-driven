'use client';

import Button from '@/components/button/Button';
import Modal from '@/components/dialog/Modal/Modal';
import Heading from '@/components/heading/Heading';
import ChevronRight from '@/components/icons/ChevronRight';
import XIcon from '@/components/icons/XIcon';
import ImageButton from '@/components/imageButton/ImageButton';
import Loading from '@/components/loading/Loading';
import Textarea from '@/components/textarea/Textarea';
import { categories } from '@/data/categories';
import useDialog from '@/hooks/useDialog';
import useToast from '@/hooks/useToast';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import CategoryModal from '@/modals/CategoryModal';
import { Contents } from '@/models/contents';
import { resizeImage } from '@/utils/imageResize';
import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import SessionComponent from './SessionComponent';

const RegistContent = () => {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalReplaceImagesInputRef = useRef<HTMLInputElement>(null);
  const { width, isMounted } = useWindowWidth();
  const [replaceImageIndex, setReplaceImageIndex] = useState<number>(0);
  const { toast } = useToast();

  const [contents, setContents] = useState<Contents>({
    title: '',
    categoryIds: [],
    sessions: [
      {
        activityContent: '',
        date: '',
        startMeridiem: 'am',
        startTimeHour: '10',
        startTimeMinute: '00',
        endMeridiem: 'am',
        endTimeHour: '11',
        endTimeMinute: '00',
      },
    ],
    activityType: null,
    mainImage: null,
    mainImagePreview: null,
    additionalImages: [],
    additionalImagesPreviews: [],
  });

  const { open } = useDialog();

  const handleMainImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 15 * 1024 * 1024) {
          toast('이미지 파일 용량이 너무 큽니다. (최대 15MB)');
          return;
        }

        if (contents.mainImagePreview) {
          URL.revokeObjectURL(contents.mainImagePreview);
        }

        try {
          const resizedBlob = await resizeImage(file, 800, 800); // 크기 더 줄이기
          const previewUrl = URL.createObjectURL(resizedBlob);
          setContents((prev) => ({ ...prev, mainImage: file, mainImagePreview: previewUrl }));
        } catch (error) {
          console.error('Image resize error:', error);
          const previewUrl = URL.createObjectURL(file);
          setContents((prev) => ({ ...prev, mainImage: file, mainImagePreview: previewUrl }));
        }
      }
    },
    [setContents],
  );

  const handleAdditionalImagesChange = useCallback(
    async (files: File[]) => {
      const remainingSlots = 4 - contents.additionalImages.length;
      if (remainingSlots - files.length < 0) {
        toast('최대 4장까지 등록할 수 있어요');
        return;
      }

      const filesToProcess = files.slice(0, remainingSlots);

      const processedFiles: { file: File; previewUrl: string }[] = [];

      // 순차적으로 처리하여 메모리 부담 감소
      for (const file of filesToProcess) {
        if (file.size > 15 * 1024 * 1024) {
          toast('이미지 파일 용량이 너무 큽니다. (최대 15MB)');
          continue;
        }

        try {
          const resizedBlob = await resizeImage(file, 600, 600); // 크기 더 줄이기
          const previewUrl = URL.createObjectURL(resizedBlob);
          processedFiles.push({ file, previewUrl });
        } catch (error) {
          console.error('Image resize error:', error);
          const previewUrl = URL.createObjectURL(file);
          processedFiles.push({ file, previewUrl });
        }
      }

      if (processedFiles.length === 0) return;

      // 한 번에 상태 업데이트
      setContents((prev) => ({
        ...prev,
        additionalImages: [...processedFiles.map((item) => item.file), ...prev.additionalImages],
        additionalImagesPreviews: [
          ...processedFiles.map((item) => item.previewUrl),
          ...prev.additionalImagesPreviews,
        ],
      }));
    },
    [contents.additionalImages.length],
  );

  const handleAdditionalReplaceImagesChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 15 * 1024 * 1024) {
          toast('이미지 파일 용량이 너무 큽니다. (최대 15MB)');
          return;
        }

        let previewUrl = '';

        try {
          const resizedBlob = await resizeImage(file, 800, 800);
          previewUrl = URL.createObjectURL(resizedBlob);
        } catch (error) {
          console.error('Image resize error:', error);
          previewUrl = URL.createObjectURL(file);
        }

        setContents((prev) => {
          // 기존 preview URL 해제
          if (prev.additionalImagesPreviews[replaceImageIndex]) {
            URL.revokeObjectURL(prev.additionalImagesPreviews[replaceImageIndex]);
          }

          return {
            ...prev,
            additionalImages: prev.additionalImages.map((image, index) =>
              index === replaceImageIndex ? file : image,
            ),
            additionalImagesPreviews: prev.additionalImagesPreviews.map((preview, index) =>
              index === replaceImageIndex ? previewUrl : preview,
            ),
          };
        });
      }
    },
    [replaceImageIndex],
  );

  const handleAddSession = useCallback(() => {
    setContents((prev) => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        {
          activityContent: '',
          date: '',
          startMeridiem: 'am',
          startTimeHour: '10',
          startTimeMinute: '00',
          endMeridiem: 'am',
          endTimeHour: '11',
          endTimeMinute: '00',
        },
      ],
    }));
  }, [setContents]);

  const handleSelectCategories = (categoryIds: number[]) => {
    setContents((prev) => ({ ...prev, categoryIds }));
  };

  const handleOpenCategoryDialog = useCallback(() => {
    open(
      <Modal>
        <CategoryModal
          initialSelectedCategoriesIds={contents.categoryIds}
          onSelectCategories={handleSelectCategories}
        />
      </Modal>,
    );
  }, [contents.categoryIds, open]);

  // 삭제 함수를 별도로 분리
  const handleDeleteImage = useCallback((index: number) => {
    setContents((prev) => {
      // 기존 preview URL 해제
      if (prev.additionalImagesPreviews[index]) {
        URL.revokeObjectURL(prev.additionalImagesPreviews[index]);
      }

      return {
        ...prev,
        additionalImagesPreviews: prev.additionalImagesPreviews.filter((_, i) => i !== index),
        additionalImages: prev.additionalImages.filter((_, i) => i !== index),
      };
    });
  }, []);

  // 컴포넌트 언마운트 시 모든 blob URL 해제
  useEffect(() => {
    return () => {
      contents.additionalImagesPreviews.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []); // 빈 배열 - 컴포넌트 언마운트 시에만 실행

  if (!isMounted) return <Loading />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 max-w-[1100px] mx-auto h-full w-full px-4 md:px-5 pt-10 pb-40">
      {/* left conent */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3 md:gap-4">
          <Heading variant="h1">대표이미지</Heading>
          <div className="relative w-full flex flex-col items-center justify-center gap-3 lg:gap-4 aspect-square bg-[#F7F7F8] rounded-lg border border-solid border-border overflow-hidden">
            {contents.mainImage ? (
              <Image
                src={contents.mainImagePreview || URL.createObjectURL(contents.mainImage)}
                alt="대표이미지"
                fill
                unoptimized
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
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col gap-2">
            <Heading variant="h1">추가 이미지 (선택)</Heading>
            <p className="text-16 text-[#8F8F8F] font-medium leading-[1.3]">
              최대 4장까지 등록할 수 있어요
            </p>
          </div>

          {/* 데스크탑 뷰 */}
          <div className="grid-cols-2 gap-2 hidden md:grid">
            {/* 등록된 이미지들 */}
            {contents.additionalImages.map((imageFile, index) => {
              const previewUrl = contents.additionalImagesPreviews[index];
              if (!previewUrl) return null; // preview가 없으면 렌더링하지 않음

              return (
                <div key={`image-${index}`} className="relative w-full aspect-square group">
                  <Image
                    src={previewUrl}
                    alt={`추가 이미지 ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover rounded-lg border border-solid border-border cursor-pointer"
                    onClick={() => {
                      setReplaceImageIndex(index);
                      additionalReplaceImagesInputRef.current?.click();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <XIcon className="w-5 h-5 text-black" />
                  </button>
                </div>
              );
            })}
            {/* 이미지 추가 버튼 (최대 4장까지) */}
            {contents.additionalImages.length < 4 && (
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
              {contents.additionalImages.map((imageFile, index) => (
                <div
                  key={`mobile-image-${index}`}
                  className="relative aspect-square group h-[120px] w-[120px]"
                >
                  <Image
                    src={contents.additionalImagesPreviews[index] || URL.createObjectURL(imageFile)}
                    alt={`추가 이미지 ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover rounded-lg border border-solid border-border cursor-pointer"
                    onClick={() => {
                      setReplaceImageIndex(index);
                      additionalReplaceImagesInputRef.current?.click();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 w-5 h-5 bg-white/50 rounded-full flex items-center justify-center hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    <XIcon className="w-6 h-6 text-black" />
                  </button>
                </div>
              ))}
              {contents.additionalImages.length < 4 && (
                <ImageButton onImageSelect={handleAdditionalImagesChange} />
              )}
              <div className="min-w-2 min-h-full bg-transparent"></div>
              <input
                ref={additionalReplaceImagesInputRef}
                type="file"
                accept="image/*"
                onChange={handleAdditionalReplaceImagesChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* right conent */}
      <div className="flex flex-col gap-10 pt-10 md:pt-0">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 md:gap-4">
            <Heading variant="h1">카테고리</Heading>
            <div
              className="box-style flex items-center justify-between cursor-pointer h-12 md:h-15 p-4"
              onClick={handleOpenCategoryDialog}
            >
              <span
                className={clsx(
                  'text-16 md:text-18 font-medium leading-[1.3]',
                  contents.categoryIds.length > 0 ? 'text-[#121212]' : 'text-[#8f8f8f]',
                )}
              >
                {contents.categoryIds.length > 0
                  ? contents.categoryIds
                      .map(
                        (categoryId) =>
                          categories.find((category) => category.id === categoryId)?.name,
                      )
                      .join(', ')
                  : '주제를 선택해주세요'}
              </span>
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </div>
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            <Heading variant="h1">콘텐츠 제목</Heading>
            <Textarea
              placeholder="제목을 입력해주세요"
              value={contents.title}
              errorMessage="8자 이상 입력해주세요"
              onChange={(e) => {
                const value = e.target.value.replace(/\s{2,}/g, ' ');
                setContents((prev) => ({ ...prev, title: value }));
              }}
            />
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col gap-2">
              <Heading variant="h1">활동 방식 선택</Heading>
              <Heading variant="h3" isDescription>
                만남을 어떤 방식으로 진행하시겠어요?
              </Heading>
            </div>
            <div className="flex gap-2">
              <Button
                variant={'line'}
                onClick={() => setContents((prev) => ({ ...prev, activityType: 'online' }))}
                isActive={contents.activityType === 'online'}
              >
                온라인
              </Button>
              <Button
                variant={'line'}
                onClick={() => setContents((prev) => ({ ...prev, activityType: 'offline' }))}
                isActive={contents.activityType === 'offline'}
              >
                직접 만나기
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <Heading variant="h1">상세 정보</Heading>

            {contents.sessions.map((session, index) => (
              <SessionComponent
                key={index}
                session={session}
                setContents={setContents}
                index={index}
                isMultiple={contents.sessions.length > 1}
              />
            ))}
          </div>
        </div>
        <Button variant={'gray'} size={'large'} onClick={handleAddSession}>
          회차 추가하기
        </Button>
      </div>
    </div>
  );
};

export default RegistContent;
