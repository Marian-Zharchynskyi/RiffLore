'use client';

import * as React from 'react';
import { Play } from 'lucide-react';
import { synthEngine } from '@/shared/lib/audio/synth-engine';
import { Button } from '@/shared/ui/button';

interface RiffAuditionButtonProps {
  notes: string[];
  label?: string;
}

export function RiffAuditionButton({
  notes,
  label = 'Прослухати мотив',
}: RiffAuditionButtonProps) {
  const [playing, setPlaying] = React.useState(false);

  const handlePlay = async () => {
    setPlaying(true);
    await synthEngine.playChordOrInterval(notes, 220);
    setTimeout(() => setPlaying(false), notes.length * 220 + 400);
  };

  return (
    <Button
      size="sm"
      variant={playing ? 'default' : 'studio'}
      onClick={handlePlay}
    >
      <Play className="h-3.5 w-3.5 fill-current" />
      <span>{playing ? 'Відтворення...' : label}</span>
    </Button>
  );
}
