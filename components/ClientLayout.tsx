'use client';

import { ReactNode } from 'react';
import PageTransition from './PageTransition';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}