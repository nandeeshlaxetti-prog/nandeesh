'use client';

import { Role, roleColors } from '../types';

interface RoleBadgeProps {
  role: Role;
  showPrimary?: boolean;
}

export function RoleBadge({ role, showPrimary = false }: RoleBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[role]}`}
        aria-label={`Role: ${role}`}
      >
        {role}
      </span>
      {showPrimary && (
        <span 
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"
          title="Primary functions with Partners"
          aria-label="Primary functions with Partners"
        >
          Primary
        </span>
      )}
    </div>
  );
}
