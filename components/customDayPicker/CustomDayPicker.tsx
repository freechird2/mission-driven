'use client';
import useToast from '@/hooks/useToast';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import Button from '../button/Button';
import ChevronLeft from '../icons/ChevronLeft';
import ChevronRight from '../icons/ChevronRight';

interface CustomDayPickerProps {
  onClose?: () => void;
  dayPickerRef?: React.RefObject<HTMLDivElement | null>;
  onSelectDate: (date: Date | null) => void;
  minDate?: Date; // 선택 가능한 시작 날짜
  maxDate?: Date; // 선택 가능한 마지막 날짜
}

const CustomDayPicker = ({
  onClose,
  dayPickerRef,
  onSelectDate,
  minDate,
  maxDate,
}: CustomDayPickerProps) => {
  // 오늘 이전 날짜를 비활성화 (minDate가 없으면 오늘 기준)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = minDate ? new Date(minDate) : today;
  startDate.setHours(0, 0, 0, 0);

  const endDate = maxDate ? new Date(maxDate) : undefined;
  if (endDate) {
    endDate.setHours(0, 0, 0, 0);
  }

  const [selected, setSelected] = useState<Date>(startDate);

  const { toast } = useToast();

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);

    if (dateToCheck < startDate) {
      toast('선택 가능한 시작 날짜 이전은 선택할 수 없습니다.');
      return;
    }

    if (endDate && dateToCheck > endDate) {
      toast('선택 가능한 마지막 날짜 이후는 선택할 수 없습니다.');
      return;
    }

    setSelected(date);
  };

  return (
    <div
      ref={dayPickerRef}
      className="absolute top-full right-0 md:left-0 mt-2 z-50 bg-white rounded-md p-4 w-[330px]"
      style={{
        boxShadow: '0px 4px 15px -1px #0000001A, 0px 2px 8px -2px #0000001A',
      }}
    >
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        locale={ko}
        showOutsideDays
        defaultMonth={startDate} // minDate가 있으면 그 월을, 없으면 오늘 날짜의 월을 표시
        disabled={(date) => {
          const dateToCheck = new Date(date);
          dateToCheck.setHours(0, 0, 0, 0);

          // minDate 이전 날짜 비활성화
          if (dateToCheck < startDate) {
            return true;
          }

          // maxDate 이후 날짜 비활성화
          if (endDate && dateToCheck > endDate) {
            return true;
          }

          return false;
        }}
        classNames={{
          month_caption: 'h-7.5 flex items-center',
          caption_label: 'text-16 font-semibold leading-[1.3] text-[#121212]',
          nav: 'absolute top-0 right-0',
          button_previous: 'w-fit h-fit mr-0.5',
          button_next: 'w-fit h-fit',
          month_grid: 'mt-4',
          weekdays: 'h-7 grid grid-cols-7 w-full',
          weekday: 'text-16 font-semibold leading-[1.3] text-[#323232]',
          week: 'grid grid-cols-7 w-full',
          day: 'grid items-center justify-center text-18 font-medium leading-[1.3] text-[#121212]',
          outside: '!text-[#8F8F8F] font-medium text-18 leading-[1.3]',
          day_button: 'w-10.5 h-10 cursor-pointer',
          selected: 'bg-primary rounded-md !text-white font-bold',
          today: '',
          disabled: '!text-[#E5E5E5] font-medium text-18 leading-[1.3]',
        }}
        components={{
          Chevron: ({ orientation }) => {
            if (orientation === 'left') {
              return (
                <span className="w-7.5 h-7.5 border border-border bg-white rounded-md flex items-center justify-center cursor-pointer">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              );
            }
            return (
              <span className="w-7.5 h-7.5 border border-border bg-white rounded-md flex items-center justify-center cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </span>
            );
          },
        }}
      />
      {onClose && (
        <Button
          variant="primary"
          size="medium"
          className="w-full mt-4"
          onClick={() => {
            if (selected) {
              onSelectDate(selected);
              onClose();
            }
          }}
          disabled={!selected}
        >
          선택 완료
        </Button>
      )}
    </div>
  );
};

export default CustomDayPicker;
