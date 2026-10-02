import { useEffect } from 'react';
import type { SetSetting, Tool } from '../simulation/types.ts';

export function useKeyboardShortcuts({
  setSetting,
  togglePause,
  reset,
  closeHelp,
  helpOpen,
}: {
  setSetting: SetSetting;
  togglePause: () => void;
  reset: () => void;
  closeHelp: () => void;
  helpOpen: boolean;
}) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeHelp();
        return;
      }
      if (helpOpen || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      if (
        event.target instanceof Element &&
        event.target.closest('input, select, button, textarea, [contenteditable="true"]')
      )
        return;
      const tools: Record<string, Tool> = { g: 'grab', w: 'wind', c: 'cut' };
      const tool = tools[event.key.toLowerCase()];
      if (tool) setSetting('tool', tool);
      if (event.code === 'Space') {
        event.preventDefault();
        togglePause();
      }
      if (event.key.toLowerCase() === 'r') reset();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setSetting, togglePause, reset, closeHelp, helpOpen]);
}
