/**
 * Loading 컴포넌트
 *
 * primary 컬러를 활용한 로딩 스피너
 *
 * @example
 * <Loading />
 */
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100dvh-48px)] md:h-[calc(100dvh-64px)] w-full">
      <div className="relative w-12 h-12">
        {/* 외부 회전 링 */}
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        {/* 회전하는 primary 컬러 링 */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
