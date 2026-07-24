'use client';

import { useState } from 'react';

export function CopyrightYear() {
  const [year] = useState(() => new Date().getFullYear());

  return <>{year}</>;
}