import clsx from "clsx";

type ModalWidth = "sm" | "md";

interface ModalWrapperProps {
  children: React.ReactNode;
  className?: string;
  _width?: ModalWidth;
}

const ModalWrapper = ({
  children,
  className,
  _width = "sm",
}: ModalWrapperProps) => {
  return (
    <div
      className={clsx(
        "relative rounded-[0.5rem] border-[1px_solid_var(--color-gray-100)] bg-white shadow-lg",
        _width === "sm" &&
          "w-[min(calc(100%-var(--spacing-mobile-safe-inline-area)),20rem)] p-[1.5rem_1rem_1rem]",
        _width === "md" &&
          "w-[min(calc(100%-var(--spacing-mobile-safe-inline-area)),34rem)] p-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ModalWrapper;
