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

interface RegistContentProps {
  setIsValidate: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * RegistContent - 콘텐츠 등록 폼 메인 컴포넌트
 *
 * 콘텐츠 등록에 필요한 모든 입력 필드를 관리하고 실시간으로 검증합니다.
 * 2단 레이아웃(좌: 이미지, 우: 텍스트 입력)으로 구성되어 있으며,
 * 반응형 디자인으로 모바일과 데스크탑에서 다른 UI를 제공합니다.
 *
 * @features
 * - 이미지 업로드 및 리사이징 (성능 최적화)
 * - 실시간 폼 검증 및 부모 컴포넌트에 상태 전달
 * - 메모리 관리 (blob URL 자동 해제)
 * - 다중 회차 관리
 * - 반응형 레이아웃 (모바일/데스크탑)
 *
 * @state-management
 * - contents: 모든 폼 데이터를 중앙에서 관리
 * - setIsValidate: 부모 컴포넌트(RegistTemplate)에 검증 상태 전달
 *   → Header와 하단 버튼의 활성화 상태 제어
 */
const RegistContent = ({ setIsValidate }: RegistContentProps) => {
  // 파일 입력 refs
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalReplaceImagesInputRef = useRef<HTMLInputElement>(null);
  const { width, isMounted } = useWindowWidth();
  const [replaceImageIndex, setReplaceImageIndex] = useState<number>(0);

  const { toast } = useToast();

  /**
   * 폼 전체 상태 관리
   * - mainImage/mainImagePreview: 대표 이미지와 프리뷰 URL 분리 관리
   *   (blob URL은 메모리 누수 방지를 위해 별도 관리 필요)
   * - additionalImages/additionalImagesPreviews: 추가 이미지 배열
   * - sessions: 회차별 정보 배열 (다중 회차 지원)
   */
  const [contents, setContents] = useState<Contents>({
    title: '',
    categoryIds: [],
    sessions: [
      {
        activityContent: '',
        date: null,
        startTimeHour: '10',
        startTimeMinute: '00',
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

  /**
   * 대표 이미지 업로드 핸들러
   *
   * @optimization
   * - 파일 크기 제한: 15MB
   * - 이미지 리사이징: 800x800px로 리사이즈하여 메모리 및 네트워크 부담 감소
   * - 기존 preview URL 해제: 메모리 누수 방지
   * - 에러 처리: 리사이징 실패 시 원본 파일 사용
   */
  const handleMainImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 15 * 1024 * 1024) {
          toast('이미지 파일 용량이 너무 큽니다. (최대 15MB)');
          return;
        }

        // 기존 preview URL 메모리 해제
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

  /**
   * 추가 이미지 업로드 핸들러 (다중 파일)
   *
   * @optimization
   * - 최대 4장 제한
   * - 순차 처리: 동시에 여러 파일을 처리하지 않아 메모리 부담 감소
   * - 배치 업데이트: 모든 파일 처리 완료 후 한 번에 상태 업데이트
   *   → 불필요한 리렌더링 방지
   * - 리사이징: 600x600px (추가 이미지는 대표 이미지보다 작게)
   */
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

  /**
   * 추가 이미지 교체 핸들러
   *
   * 특정 인덱스의 이미지를 새로운 이미지로 교체합니다.
   * 기존 preview URL을 해제하여 메모리 누수를 방지합니다.
   */
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

  /**
   * 회차 추가 핸들러
   *
   * 새로운 회차를 sessions 배열에 추가합니다.
   * 기본값으로 시작 시간 10:00, 종료 시간 11:00을 설정합니다.
   */
  const handleAddSession = useCallback(() => {
    setContents((prev) => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        {
          activityContent: '',
          date: null,
          startTimeHour: '10',
          startTimeMinute: '00',
          endTimeHour: '11',
          endTimeMinute: '00',
        },
      ],
    }));
  }, [setContents]);

  const handleSelectCategories = (categoryIds: number[]) => {
    setContents((prev) => ({ ...prev, categoryIds }));
  };

  /**
   * 카테고리 선택 모달 열기
   *
   * CategoryModal을 Modal 컴포넌트로 감싸서 표시합니다.
   * 현재 선택된 카테고리 ID를 초기값으로 전달합니다.
   */
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

  /**
   * 추가 이미지 삭제 핸들러
   *
   * @memory-management
   * 삭제 시 해당 preview URL을 즉시 해제하여 메모리 누수를 방지합니다.
   */
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

  /**
   * 실시간 폼 검증
   *
   * contents 상태가 변경될 때마다 모든 필수 필드를 검증하고,
   * 부모 컴포넌트에 검증 결과를 전달합니다.
   *
   * @validation-rules
   * - title: 8자 이상
   * - mainImage: 필수
   * - categoryIds: 1개 이상 선택
   * - activityType: 필수 (online 또는 offline)
   * - sessions: 모든 회차에 대해
   *   - activityContent: 8자 이상
   *   - date: 필수
   *   - 시간 정보: 모두 필수
   *
   * @note
   * - every() 메서드로 모든 회차가 조건을 만족하는지 확인
   * - 실시간 검증으로 사용자 경험 향상
   */
  useEffect(() => {
    if (
      contents.title.length >= 8 &&
      contents.mainImage &&
      contents.categoryIds.length > 0 &&
      contents.activityType &&
      contents.sessions.every((session) => session.activityContent.length >= 8) &&
      contents.sessions.every(
        (session) =>
          session.date &&
          session.startTimeHour &&
          session.startTimeMinute &&
          session.endTimeHour &&
          session.endTimeMinute,
      )
    ) {
      setIsValidate(true);
    } else {
      setIsValidate(false);
    }
  }, [contents]);

  /**
   * 컴포넌트 언마운트 시 메모리 정리
   *
   * @memory-management
   * 생성한 모든 blob URL을 해제하여 메모리 누수를 방지합니다.
   * cleanup 함수는 컴포넌트가 언마운트될 때만 실행됩니다.
   *
   * @note
   * - mainImagePreview는 handleMainImageChange에서 이미 해제됨
   * - additionalImagesPreviews만 여기서 정리
   */
  useEffect(() => {
    return () => {
      contents.additionalImagesPreviews.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []); // 빈 배열 - 컴포넌트 언마운트 시에만 실행

  // 반응형 레이아웃을 위한 마운트 상태 확인
  // SSR과 CSR 간의 불일치 방지
  if (!isMounted) return <Loading />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 max-w-[1100px] mx-auto h-full w-full px-4 md:px-5 pt-10 pb-40">
      {/* 
        좌측 컬럼: 이미지 업로드 영역
        - 대표 이미지 (필수)
        - 추가 이미지 (선택, 최대 4장)
        - 모바일: 세로 배치
        - 데스크탑: 좌측 고정
      */}
      <div className="flex flex-col gap-10">
        {/* 대표 이미지 섹션 */}
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

        {/* 추가 이미지 섹션 */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col gap-2">
            <Heading variant="h1">추가 이미지 (선택)</Heading>
            <p className="text-16 text-[#8F8F8F] font-medium leading-[1.3]">
              최대 4장까지 등록할 수 있어요
            </p>
          </div>

          {/* 
            데스크탑 뷰: 2x2 그리드 레이아웃
            - hover 시 삭제 버튼 표시
            - 이미지 클릭 시 교체 모드
          */}
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

          {/* 
            모바일 뷰: 가로 스크롤 가능한 리스트
            - 고정 크기: 120x120px
            - 항상 삭제 버튼 표시 (hover 불가)
          */}
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

      {/* 
        우측 컬럼: 텍스트 입력 영역
        - 카테고리 선택
        - 콘텐츠 제목
        - 활동 방식 선택
        - 상세 정보 (회차별)
        - 회차 추가 버튼
      */}
      <div className="flex flex-col gap-6 md:gap-10 pt-10 md:pt-0">
        <div className="flex flex-col gap-10">
          {/* 카테고리 선택 */}
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

          {/* 콘텐츠 제목 */}
          <div className="flex flex-col gap-3 md:gap-4">
            <Heading variant="h1">콘텐츠 제목</Heading>
            <Textarea
              placeholder="제목을 입력해주세요"
              value={contents.title}
              errorMessage="8자 이상 입력해주세요"
              onChange={(e) => {
                // 연속된 공백과 탭만 하나로 치환 (줄바꿈은 유지)
                const value = e.target.value.replace(/[ \t]{2,}/g, ' ');
                setContents((prev) => ({ ...prev, title: value }));
              }}
            />
          </div>

          {/* 활동 방식 선택 */}
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

          {/* 상세 정보 (회차별) */}
          <div className="flex flex-col gap-3 md:gap-4">
            <Heading variant="h1">상세 정보</Heading>

            {contents.sessions.map((session, index) => (
              <SessionComponent
                key={index}
                contents={contents}
                setContents={setContents}
                index={index}
                isMultiple={contents.sessions.length > 1}
              />
            ))}
          </div>
        </div>

        {/* 회차 추가 버튼 */}
        <Button
          variant={'gray'}
          size={isMounted && width < 1024 ? 'medium' : 'large'}
          onClick={handleAddSession}
        >
          회차 추가하기
        </Button>
      </div>
    </div>
  );
};

export default RegistContent;
