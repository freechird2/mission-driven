'use client';
import { useDialogStore } from '@/stores/useDialogStore';

const useDialog = () => {
  const dialog = useDialogStore();

  return dialog;
};

export default useDialog;
