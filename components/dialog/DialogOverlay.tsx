import { HTMLMotionProps, motion } from "motion/react";

interface DialogOverlayProps extends Omit<HTMLMotionProps<"div">, "className"> {
  className?: string;
}
const DialogOverlay = ({ className, ...rest }: DialogOverlayProps) => {
  return (
    <motion.div
      className={`bg-base-dimmed absolute inset-0 ${className}`}
      {...rest}
    />
  );
};

export default DialogOverlay;
