import { useCallback, useEffect, useRef, useState } from 'react';

export function useNotice() {
  const [notice, setNotice] = useState('');
  const timer = useRef(null);
  const notify = useCallback((message) => {
    clearTimeout(timer.current);
    setNotice(message);
    timer.current = setTimeout(() => setNotice(''), 2800);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return { notice, notify };
}
