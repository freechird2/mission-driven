import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

export type DialogOptions = {
  /**
   * 오버레이 사용 여부
   */
  enableOverlay?: boolean;
  /**
   * 오버레이 클릭으로 닫기 허용 여부
   */
  enableOverlayClickClose?: boolean;
  /**
   * 배경 스크롤 허용 여부
   */
  enableBackgroundScroll?: boolean;
};

export type Dialog = {
  id: string;
  isVisible: boolean;
  children: React.ReactElement;
  options?: DialogOptions;
};

export type DialogWithOption = Dialog & DialogOptions;

interface DialogStore {
  dialogs: DialogWithOption[];
  open: (children: React.ReactElement, options?: DialogOptions) => void;
  closeDialog: () => void;
  closeAll: () => void;
  cleanup: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  dialogs: [],

  // ✅ Dialog 추가 (id 자동 생성)
  open: (children, options) =>
    set((state) => ({
      dialogs: [
        ...state.dialogs,
        {
          id: uuidv4(),
          isVisible: true,
          children,
          options,
        },
      ],
    })),

  // 배열의 마지막 모달 닫기
  closeDialog: () =>
    set((state) => {
      if (state.dialogs.length === 0) return state;
      const updatedModals = [...state.dialogs];
      updatedModals[updatedModals.length - 1].isVisible = false;
      return { dialogs: updatedModals };
    }),

  // 모든 모달 닫기
  closeAll: () =>
    set((state) => {
      const updatedModals = state.dialogs.map((dialog) => ({
        ...dialog,
        isVisible: false,
      }));
      return { dialogs: updatedModals };
    }),

  cleanup: () =>
    set((state) => {
      const updatedDialogs = state.dialogs.filter((dialog) => dialog.isVisible);
      if (state.dialogs.length === updatedDialogs.length) return state; // ✅ 상태가 변경되지 않으면 업데이트 방지
      return { dialogs: updatedDialogs };
    }),
}));
