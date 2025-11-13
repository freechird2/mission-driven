import useDialog from '@/hooks/useDialog';
import { DialogWithOption } from '@/stores/useDialogStore';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import DialogOverlay from '../DialogOverlay';
interface AlertDialogProps {
  dialog?: DialogWithOption;
  children?: React.ReactNode;
  handleDimClick?: VoidFunction;
}

const Modal = ({ dialog, children, handleDimClick }: AlertDialogProps) => {
  const { closeDialog, cleanup } = useDialog();
  const _enableOverlayClickClose = dialog?.options?.enableOverlayClickClose ?? true;

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
          data-enable-background-scroll={dialog?.options?.enableBackgroundScroll}
        >
          <DialogOverlay
            onClick={() => {
              if (handleDimClick) {
                handleDimClick();
              } else {
                if (_enableOverlayClickClose) {
                  closeDialog();
                } else {
                  return null;
                }
              }
            }}
          />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
