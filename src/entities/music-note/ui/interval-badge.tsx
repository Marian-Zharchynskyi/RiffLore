import * as React from 'react';
import { INTERVAL_META, type IntervalDegree } from '@/shared/config/intervals';
import { cn } from '@/shared/lib/utils';

interface IntervalBadgeProps {
  degree: IntervalDegree;
  showName?: boolean;
  className?: string;
}

export function IntervalBadge({ degree, showName = false, className }: IntervalBadgeProps) {
  const meta = INTERVAL_META[degree];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold transition-all',
        meta.badgeClass,
        className
      )}
      title={`${meta.nameUk}: ${meta.roleDescription}`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: meta.colorHex }}
      />
      <span>{meta.shortLabel}</span>
      {showName && <span className="font-sans font-normal opacity-90">· {meta.nameUk}</span>}
    </span>
  );
}
