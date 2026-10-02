import { useEffect, useRef } from 'react';

export function useDialogFocus(onClose) {
  const ref = useRef(null);
  useEffect(() => {
    // React autofocus has already focused the close button; the dialog owns tab navigation.
    const dialog = ref.current;
    const handleKey = event => {
      if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
      if (event.key !== 'Tab') return;
      const buttons = [...dialog.querySelectorAll('button, a[href], input, select, [tabindex="0"]')];
      const first = buttons[0];
      const last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    dialog.addEventListener('keydown', handleKey);
    return () => dialog.removeEventListener('keydown', handleKey);
  }, [onClose]);
  return ref;
}
