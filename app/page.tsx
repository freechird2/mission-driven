'use client';

import Textarea from '@/components/textarea/Textarea';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');

  return (
    <div className="p-10 flex flex-col gap-4">
      <Textarea
        maxLength={80}
        minLength={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
