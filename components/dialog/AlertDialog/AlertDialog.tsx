import Button from '@/components/button/Button';
import useDialog from '@/hooks/useDialog';
import { DialogWithOption } from '@/stores/useDialogStore';
import { AnimatePresence, motion } from 'motion/react';
import DialogOverlay from '../DialogOverlay';
interface AlertDialogProps {
  dialog?: DialogWithOption;
  type: 'Alert' | 'Confirm';
  title?: string;
  content?: string;
  isPending?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  handleCancel?: VoidFunction;
  handleConfirm?: VoidFunction;
}

const AlertDialog = ({
  dialog,
  type,
  title,
  content = '내용을 입력해주세요.',
  isPending,
  cancelButtonText = '취소',
  confirmButtonText = '확인',
  handleCancel,
  handleConfirm,
}: AlertDialogProps) => {
  const { closeDialog, cleanup } = useDialog();
  const handler = (fn: VoidFunction | undefined) => {
    if (fn) {
      fn();
    } else {
      closeDialog();
    }
  };

  if (!type) {
    throw new Error('AlertDialog에 type은 필수로 지정해야합니다. ');
  }

  return (
    <AnimatePresence>
      {dialog?.isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onAnimationComplete={cleanup}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <DialogOverlay
            onClick={() => {
              if (dialog?.options?.enableOverlayClickClose) {
                closeDialog();
              }
            }}
          />
          <motion.div className="relative w-[min(calc(100%-var(--spacing-mobile-safe-inline-area)),17.5rem)] rounded-[0.5rem] border-[1px_solid_var(--color-gray-100)] bg-white p-[1.5rem_1rem_1rem] shadow-lg">
            <div className="pb-[1.5rem] text-center">
              {title && (
                <p className="font-600 text-20 pb-[0.5rem] leading-[1.3] text-gray-900">{title}</p>
              )}
              <p className="leading-[1.3] whitespace-pre-line text-gray-700">{content}</p>
            </div>

            <div className="flex gap-2">
              {type === 'Confirm' && (
                <Button
                  className="flex-1"
                  variant={'line'}
                  size={'medium'}
                  onClick={() => handler(handleCancel)}
                  disabled={isPending}
                >
                  {cancelButtonText}
                </Button>
              )}
              <Button
                className="flex-1"
                size={'medium'}
                // isPending={isPending}
                onClick={() => handler(handleConfirm)}
              >
                {confirmButtonText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertDialog;
