'use client';

import Button from '@/components/button/Button';
import Heading from '@/components/heading/Heading';
import useDialog from '@/hooks/useDialog';
import { useState } from 'react';

import XIcon from '@/components/icons/XIcon';
import { categories } from '@/data/categories';
import useToast from '@/hooks/useToast';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { Category } from '@/models/category';

interface CategoryModalProps {
  initialSelectedCategoriesIds: number[];
  onSelectCategories: (categoryIds: number[]) => void;
}

const CategoryModal = ({
  initialSelectedCategoriesIds,
  onSelectCategories,
}: CategoryModalProps) => {
  const { closeDialog } = useDialog();
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>(
    initialSelectedCategoriesIds,
  );
  const { width } = useWindowWidth();
  const { toast } = useToast();

  const handleSelectCategory = (category: Category) => {
    if (selectedCategoriesIds.includes(category.id)) {
      setSelectedCategoriesIds((prev) => prev.filter((id) => id !== category.id));
    } else {
      if (selectedCategoriesIds.length >= 2) {
        toast('최대 2개까지 선택 가능해요');
        return;
      }

      setSelectedCategoriesIds((prev) => [...prev, category.id]);
    }
  };

  const handleSelectCategories = () => {
    onSelectCategories(selectedCategoriesIds);
    setSelectedCategoriesIds([]);
    closeDialog();
  };

  return (
    <div className="relative w-dvw h-dvh md:w-[80%] md:h-[80%] bg-white z-10 md:rounded-lg shadow-lg">
      {/* pc */}
      <div className="hidden md:block px-5 w-full h-16 border-b border-solid border-border z-20">
        <div className="w-full max-w-[1100px] mx-auto h-full flex items-center justify-between">
          <Button variant={'line'} size="small" className="w-30" onClick={closeDialog}>
            나가기
          </Button>
          <span className="text-[#121212] text-24 font-bold leading-[1.3]">카테고리</span>
          <Button
            variant={'primary'}
            size="small"
            className="w-30"
            disabled={selectedCategoriesIds.length === 0}
            onClick={handleSelectCategories}
          >
            선택하기
          </Button>
        </div>
      </div>
      {/* mobile */}
      <div className="relative grid md:hidden text-center h-12 place-items-center text-18 font-bold leading-[1.3] border-b border-solid border-border">
        <div className="absolute top-1/2 -translate-y-1/2 left-4" onClick={closeDialog}>
          <XIcon className="w-7 h-7" />
        </div>
        카테고리
      </div>
      <div className="max-w-[1100px] mx-auto h-full px-4 md:px-5 flex flex-col gap-4 md:gap-6">
        <div className="pt-10 flex flex-col gap-2">
          <Heading variant="h1">
            어떤 카테고리의
            <br />
            콘텐츠를 만드시나요?
          </Heading>
          <Heading variant="h3" isDescription>
            최대 2개까지 선택 가능합니다.
          </Heading>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant={'line'}
              size={width < 768 ? 'medium' : 'large'}
              onClick={() => handleSelectCategory(category)}
              isActive={selectedCategoriesIds.includes(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="fixed md:hidden bottom-0 left-0 px-4 w-full h-[73px] bg-white border-t border-solid border-border z-20 flex justify-center py-2">
        <Button
          variant={'primary'}
          size="medium"
          disabled={selectedCategoriesIds.length === 0}
          onClick={handleSelectCategories}
        >
          선택하기
        </Button>
      </div>
    </div>
  );
};

export default CategoryModal;
