import clsx from 'clsx';
import { toast as sonnerToast } from 'sonner';

const useToast = () => {
  const toast = (message: string, type?: 'success' | 'error') => {
    sonnerToast.custom(() => <Toast type={type} message={message} />);
  };

  return { toast };
};

interface ToastProps {
  type?: 'success' | 'error';
  message: string;
}

const Toast = ({ type = 'success', message }: ToastProps) => {
  return (
    <div className="w-[calc(100dvw-32px)] grid place-items-center pt-10 md:pt-5 pointer-events-none">
      <div className="text-white bg-[#323232] flex w-full max-w-[calc(100dvw-32px)] md:max-w-[520px] items-center gap-2 rounded-lg p-3 shadow-lg">
        {/* {type === "success" && (
        <Icon
          className="text-function-success"
          variant="check_circle"
          size={device !== "PC" ? "20px" : "16px"}
        />
      )}
      {type === "error" && (
        <Icon
          className="text-function-error"
          variant="warning"
          size={device !== "PC" ? "20px" : "16px"}
        />
      )} */}
        <p className={clsx('text-16 md:text-18 leading-[1.3] font-medium text-center w-full')}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default useToast;
