'use client';

import Header from '@/components/header/Header';
import RegistContent from '../_components/RegistContent';

const RegistTemplate = () => {
  return (
    <div className="h-full w-full">
      <Header isMain />
      <div className="h-full w-full mt-[48px] md:mt-[64px] bg-white">
        <RegistContent />
      </div>
    </div>
  );
};

export default RegistTemplate;
