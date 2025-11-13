'use client';
import useDialog from '@/hooks/useDialog';
import { DialogWithOption } from '@/stores/useDialogStore';
import { Attributes, cloneElement, Fragment, useEffect } from 'react';

const DialogContainer = () => {
  const { dialogs } = useDialog();

  // 모달이 열려있으면 body 스크롤 막기
  useEffect(() => {
    const hasVisibleDialog = dialogs.some(
      (dialog) => dialog.isVisible && !dialog.options?.enableBackgroundScroll,
    );

    if (hasVisibleDialog) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // 스크롤 복원
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [dialogs]);

  return dialogs.map((dialog) => (
    <Fragment key={dialog.id}>
      {cloneElement(dialog.children, { dialog } as Partial<DialogWithOption> & Attributes)}
    </Fragment>
  ));
};

export default DialogContainer;
