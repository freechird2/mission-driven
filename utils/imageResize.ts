export const resizeImage = (
  file: File,
  maxWidth: number = 600, // 800 -> 600으로 줄임
  maxHeight: number = 600,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 비율 유지하면서 리사이즈
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            // 메모리 정리
            img.src = '';
            canvas.width = 0;
            canvas.height = 0;

            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          file.type,
          0.7, // 품질을 0.8 -> 0.7로 낮춤
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
