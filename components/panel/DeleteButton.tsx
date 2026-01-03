'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface DeleteButtonProps {
  onDelete: () => void;
}

export function DeleteButton({ onDelete }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (confirming) {
      onDelete();
      setConfirming(false);
    } else {
      setConfirming(true);
      // Reset after 3 seconds
      setTimeout(() => setConfirming(false), 3000);
    }
  };

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleClick}
      className="w-full"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {confirming ? 'Click again to confirm' : 'Delete Play'}
    </Button>
  );
}