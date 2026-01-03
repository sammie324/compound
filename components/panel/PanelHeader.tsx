'use client';

import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

export function PanelHeader({ title, onClose }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <IconButton onClick={onClose} size="sm">
        <X className="w-4 h-4" />
      </IconButton>
    </div>
  );
}