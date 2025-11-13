'use client';

import useDialog from '@/hooks/useDialog';
import { DialogWithOption } from '@/stores/useDialogStore';
import { animate, AnimatePresence, motion, useMotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import DialogOverlay from '../DialogOverlay';

interface BottomSheetProps {
  dialog?: DialogWithOption;
  children?: React.ReactNode;
  useHandle?: boolean;
  handleDimClick?: VoidFunction;
}

export default function BottomSheet({
  dialog,
  children,
  useHandle,
  handleDimClick,
}: BottomSheetProps) {
  const { closeDialog: onClose, cleanup } = useDialog();
  const y = useMotionValue(0);
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const [startY, setStartY] = useState(0); // ✅ 핸들을 잡았을 때의 Y 시작 위치
  const ref = useRef<HTMLDivElement>(null);
  const closeThreshold = ref.current ? ref.current?.offsetHeight * 0.5 : 150;

  const isOpen = dialog?.isVisible;

  // ✅ 핸들을 잡은 상태에서 바텀시트를 벗어나면 자동 복귀 or 닫기
  useEffect(() => {
    const handleEndDrag = () => {
      if (!isDraggingHandle) return;
      setIsDraggingHandle(false);
      if (y.get() > closeThreshold) {
        onClose(); // ✅ 임계점을 넘었을 때 닫기
      } else {
        animate(y, 0, { stiffness: 300, damping: 30 }); // ✅ 임계점을 넘지 못했을 때 복귀
      }
    };

    window.addEventListener('touchend', handleEndDrag);
    return () => {
      window.removeEventListener('touchend', handleEndDrag);
    };
  }, [y, isDraggingHandle, onClose]);

  // ✅  마우스 드래그 핸들러
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDraggingHandle(true);
    setStartY('touches' in e ? e.touches[0].clientY : e.clientY); // ✅  마우스 대응
  };

  const handleMove = (e: React.PointerEvent | React.TouchEvent) => {
    if (!isDraggingHandle) return;
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = currentY - startY; // ✅ 이동한 거리 계산
    if (deltaY > 0) {
      y.set(deltaY); // ✅ 바텀시트가 마우스 이동량만큼 이동
    } else {
      // ✅ 위로 이동하면 자동 복귀
      animate(y, 0, { stiffness: 300, damping: 30 });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-end"
          data-enable-background-scroll={dialog?.options?.enableBackgroundScroll}
        >
          {/* ✅ Overlay (딤) */}

          <DialogOverlay
            initial={{ opacity: 0 }} // ✅ 초기 애니메이션 시작
            animate={{ opacity: 1 }} // ✅ 열릴 때 애니메이션 적용
            exit={{ opacity: 0 }} // ✅ 닫힐 때 애니메이션 적용
            transition={{ duration: 0.2 }} // ✅ 부드러운 애니메이션 적용
            onClick={() => {
              if (handleDimClick) {
                handleDimClick();
              } else {
                onClose();
              }
            }}
          />

          {/* ✅ Bottom sheet container */}
          <motion.div
            ref={ref}
            key={dialog?.id}
            className="relative z-50 w-full overflow-hidden rounded-t-3xl bg-white shadow-lg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ stiffness: 300, damping: 30, duration: 0.2 }}
            style={{ y }}
            onAnimationComplete={cleanup}
          >
            {/* ✅ Handle (드래그 가능, 바텀시트 이동 트리거) */}
            {useHandle && (
              <motion.div
                className="flex w-full cursor-grab items-center justify-center p-4 active:cursor-grabbing"
                onTouchStart={handleStart}
                onTouchMove={handleMove}
              >
                <div className="h-1.5 w-12 rounded-full bg-gray-400" />
              </motion.div>
            )}

            {/* ✅ Content area */}
            <div
              className="px-mobile-safe-area pb-mobile-safe-area pt-6 select-text"
              style={{ pointerEvents: isDraggingHandle ? 'none' : 'auto' }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
