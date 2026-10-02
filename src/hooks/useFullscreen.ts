import type { RefObject } from 'react';
import type { Notify } from '../simulation/types.ts';
import { useCallback, useEffect, useState } from 'react';

export function useFullscreen(elementRef: RefObject<HTMLElement | null>, notify: Notify) {
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === elementRef.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, [elementRef]);
  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await elementRef.current?.requestFullscreen();
    } catch {
      notify('Fullscreen is not available in this browser.');
    }
  }, [elementRef, notify]);
  return { fullscreen, toggleFullscreen };
}
