// Adapted from React Bits StarBorder, commit 448c03d. See THIRD_PARTY_NOTICES.md.
import type { ReactNode } from 'react';

export default function StarBorder({ children }: { children: ReactNode }) {
  return <span className="star-border-container">
    <span className="border-gradient-bottom" aria-hidden="true" />
    <span className="border-gradient-top" aria-hidden="true" />
    {children}
  </span>;
}
