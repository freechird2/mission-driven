'use client';
import useDialog from '@/hooks/useDialog';
import clsx from 'clsx';
import React, { useRef } from 'react';

/**
 * placeholder는 undefined
 * 전체는 ""
 */
export type SelectValueType = string | undefined;
export type SelectOptionType = {
  label: string;
  value: SelectValueType;
};

interface SelectProps {
  options: SelectOptionType[];
  name?: string;
  id?: string;
  value?: string; // ✅ Controlled Component 방식
  onChange?: (value: SelectValueType) => void;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  name,
  id,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const { open, closeDialog } = useDialog();
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleSelectChange = (newValue: SelectValueType) => {
    onChange?.(newValue);
  };

  const handleLabelClick = () => {
    selectRef.current?.focus();
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleSelectChange(event.target.value);
  };

  // ✅ 현재 선택된 값 찾기
  const selectedOption = options.find((option) => option.value === value);

  // ✅ value가 `""`일 경우 `"전체"` 옵션을 선택하는 경우로 처리
  const displayText =
    value === '' ? options.find((opt) => opt.value === '')?.label : selectedOption?.label;

  // ✅ placeholder가 적용되면 `text-form-placeholder` 클래스를 추가
  const isPlaceholder = value === undefined;
  const labelClassName = clsx(isPlaceholder ? 'text-form-placeholder' : 'text-gray-700');

  return (
    <label
      htmlFor={id}
      className={clsx('relative inline-flex h-8 items-center stroke-gray-600', className)}
      onClick={handleLabelClick}
    >
      <select
        ref={selectRef}
        name={name}
        id={id}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        onChange={handleChange}
        value={value ?? ''}
      >
        {/* ✅ PC에서도 placeholder를 value가 `undefined`일 때만 표시 */}
        {placeholder && value === undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span
        className={clsx(
          labelClassName,
          'text-18 md:text-20 font-medium text-inherit w-full text-center leading-[1.3]',
        )}
      >
        {isPlaceholder ? placeholder : displayText}
      </span>
    </label>
  );
};

export default Select;
