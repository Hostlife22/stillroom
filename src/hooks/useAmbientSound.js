import { useCallback, useEffect, useRef, useState } from 'react';

function createAmbientAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error('Web Audio is unavailable.');
  const context = new AudioContext();
  const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;
  for (let i = 0; i < data.length; i++) {
    previous = (previous + Math.random() * 0.04 - 0.02) / 1.015;
    data[i] = previous * 3;
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 450;
  const gain = context.createGain();
  gain.gain.value = 0.14;
  source.connect(filter).connect(gain).connect(context.destination);
  source.start();
  return context;
}

export function useAmbientSound(notify) {
  const [sound, setSound] = useState(false);
  const context = useRef(null);
  const pending = useRef(false);
  useEffect(() => () => {
    context.current?.close().catch(() => {});
    context.current = null;
  }, []);
  const toggleSound = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    try {
      context.current ??= createAmbientAudio();
      const audio = context.current;
      if (sound) await audio.suspend();
      else await audio.resume();
      if (context.current === audio) setSound(audio.state === 'running');
    } catch {
      notify('Ambient sound is unavailable in this browser.');
    } finally {
      pending.current = false;
    }
  }, [notify, sound]);
  return { sound, toggleSound };
}
