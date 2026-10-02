import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wind,
  Hand,
  Scissors,
  RotateCcw,
  Pause,
  Play,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sun,
  ChevronDown,
  Check,
  Info,
  X,
  Download,
  Leaf,
  Grid2X2,
} from 'lucide-react';
import Scene from './Scene';
import './styles.css';
const colors = [
  { name: 'Sage', value: '#85896b' },
  { name: 'Oat', value: '#c4b69b' },
  { name: 'Clay', value: '#af7864' },
  { name: 'Mist', value: '#8a9a9b' },
  { name: 'Charcoal', value: '#535b53' },
];
const defaults = {
  tool: 'grab',
  wind: 25,
  stiffness: 75,
  damping: 60,
  color: colors[0].value,
  mesh: false,
  light: true,
  paused: false,
};
function Range({ label, value, onChange, left, right }) {
  return (
    <div className="range-group">
      <div className="range-heading">
        <label htmlFor={label}>{label}</label>
        <span>
          {value}
          <small>%</small>
        </span>
      </div>
      <input
        id={label}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ '--fill': `${value}%` }}
      />
      <div className="range-limits">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}
function Toggle({ label, checked, onChange, icon: Icon }) {
  return (
    <label className="toggle-row">
      <span>
        <Icon size={16} />
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="switch" />
    </label>
  );
}
function App() {
  const [settings, setSettings] = useState(() => ({
      ...defaults,
      paused: matchMedia('(prefers-reduced-motion: reduce)').matches,
    })),
    [stats, setStats] = useState({ fps: 60, particles: 1073, constraints: 4124 }),
    [help, setHelp] = useState(false),
    [notice, setNotice] = useState(''),
    [full, setFull] = useState(false),
    [sound, setSound] = useState(false),
    [preset, setPreset] = useState('Gentle morning');
  const api = useRef(),
    stage = useRef(),
    audio = useRef(),
    timer = useRef();
  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));
  const notify = useCallback((text) => {
    setNotice(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(''), 2800);
  }, []);
  const reset = useCallback(() => {
    api.current?.reset();
    notify('A fresh start. Your curtain is restored.');
  }, [notify]);
  const addGust = () => {
    set('paused', false);
    api.current?.gust();
    notify('A little breeze, coming through.');
  };
  useEffect(() => {
    const key = (e) => {
      if (['INPUT', 'SELECT', 'BUTTON'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setSettings((s) => ({ ...s, paused: !s.paused }));
      }
      if (e.key.toLowerCase() === 'g') set('tool', 'grab');
      if (e.key.toLowerCase() === 'w') set('tool', 'wind');
      if (e.key.toLowerCase() === 'c') set('tool', 'cut');
      if (e.key.toLowerCase() === 'r') reset();
      if (e.key === 'Escape') setHelp(false);
    };
    window.addEventListener('keydown', key);
    const fs = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fs);
    return () => {
      window.removeEventListener('keydown', key);
      document.removeEventListener('fullscreenchange', fs);
      audio.current?.close();
      clearTimeout(timer.current);
    };
  }, [reset]);
  const toggleSound = () => {
    if (sound) {
      audio.current?.suspend();
      setSound(false);
      return;
    }
    if (!audio.current) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) {
        notify('Ambient sound is unavailable in this browser.');
        return;
      }
      const ctx = new Audio();
      audio.current = ctx;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate),
        data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        last = (last + Math.random() * 0.04 - 0.02) / 1.015;
        data[i] = last * 3;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 450;
      const gain = ctx.createGain();
      gain.gain.value = 0.14;
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start();
    }
    audio.current.resume();
    setSound(true);
  };
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.current.requestFullscreen();
    } catch {
      notify('Fullscreen is not available in this browser.');
    }
  };
  return (
    <>
      <header className="header">
        <a className="brand" href="./" aria-label="Stillroom home">
          <span className="brand-icon">
            <i />
            <i />
            <i />
            <i />
          </span>
          stillroom<span className="brand-period">.</span>
        </a>
        <div className="header-caption">A LITTLE ROOM TO UNWIND</div>
        <button className="about-button" onClick={() => setHelp(true)}>
          About this space <ArrowUpRight size={15} />
        </button>
      </header>
      <main>
        <section className="intro">
          <div>
            <div className="eyebrow">
              <span /> AN INTERACTIVE MOMENT OF CALM
            </div>
            <h1>
              Let the outside <em>in.</em>
            </h1>
            <p>A little light. A gentle breeze. A curtain that moves with you.</p>
          </div>
          <div className="live-label">
            <span className="status-dot" /> LIVE CLOTH SIMULATION
          </div>
        </section>
        <div className="workspace">
          <section className="stage" ref={stage}>
            <Scene settings={settings} api={api} onStats={setStats} />
            <div className="scene-top">
              <span className="scene-label">
                <span /> The quiet corner <span className="label-divider" /> 01
              </span>
              <button
                className="glass icon-button"
                aria-label={sound ? 'Mute ambient sound' : 'Play ambient sound'}
                aria-pressed={sound}
                onClick={toggleSound}
              >
                {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </button>
            </div>
            <div className="scene-caption">
              <span className="tiny-sun">☼</span> SUNLIT ROOM <span>·</span>{' '}
              {settings.light ? '9:41 AM' : '6:18 PM'}
            </div>
            <div className="interaction-hint">
              <Hand size={17} />
              <span>
                {settings.tool === 'grab'
                  ? 'Reach out. Give it a gentle pull.'
                  : settings.tool === 'wind'
                    ? 'Press and hold to send a breeze.'
                    : 'Trace a line to cut the fabric.'}
              </span>
            </div>
            <div className="scene-bottom">
              <div className="scene-controls">
                <button
                  className="glass icon-button"
                  onClick={() => set('paused', !settings.paused)}
                  aria-label={settings.paused ? 'Resume simulation' : 'Pause simulation'}
                >
                  {settings.paused ? <Play size={17} /> : <Pause size={17} />}
                </button>
                <button className="glass icon-button" onClick={reset} aria-label="Reset curtain">
                  <RotateCcw size={17} />
                </button>
                <span>{settings.paused ? 'A moment of stillness' : 'Make yourself at home.'}</span>
              </div>
              <button
                className="glass icon-button"
                onClick={fullscreen}
                aria-label={full ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {full ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>
            </div>
            {notice && (
              <div className="toast" role="status">
                <Check size={15} />
                {notice}
              </div>
            )}
          </section>
          <aside className="panel">
            <div className="panel-title">
              <div>
                <h2>Make it move</h2>
                <p>Follow your curiosity.</p>
              </div>
              <span className="small-orbit">
                <Wind size={21} />
              </span>
            </div>
            <section className="control-section">
              <div className="section-label">
                INTERACTION <span>01</span>
              </div>
              <div className="tool-picker">
                {[
                  { id: 'grab', label: 'Grab', icon: Hand, key: 'G' },
                  { id: 'wind', label: 'Wind', icon: Wind, key: 'W' },
                  { id: 'cut', label: 'Cut', icon: Scissors, key: 'C' },
                ].map(({ id, label, icon: Icon, key }) => (
                  <button
                    key={id}
                    className={settings.tool === id ? 'selected' : ''}
                    onClick={() => set('tool', id)}
                    aria-pressed={settings.tool === id}
                    title={`${label} tool (${key})`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </div>
              <p className="tool-help">
                {settings.tool === 'grab'
                  ? 'Click and drag the fabric to feel it respond.'
                  : settings.tool === 'wind'
                    ? 'Hold anywhere in the room to stir the air.'
                    : 'Drag across the fabric. Reset to mend it.'}
              </p>
            </section>
            <section className="control-section">
              <div className="section-label">
                ATMOSPHERE <span>02</span>
              </div>
              <Range
                label="Wind strength"
                value={settings.wind}
                onChange={(v) => set('wind', v)}
                left="Still"
                right="Breezy"
              />
              <button className="gust-button" onClick={addGust}>
                <Wind size={17} /> A little gust <span>↗</span>
              </button>
            </section>
            <section className="control-section fabric-section">
              <div className="section-label">
                THE FABRIC <span>03</span>
              </div>
              <div className="fabric-label">
                <span>Soft linen</span>
                <span>{colors.find((c) => c.value === settings.color)?.name}</span>
              </div>
              <div className="swatches">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    style={{ '--swatch': c.value }}
                    onClick={() => set('color', c.value)}
                    className={settings.color === c.value ? 'active' : ''}
                    aria-label={`${c.name} fabric`}
                    aria-pressed={settings.color === c.value}
                  >
                    {settings.color === c.value && <Check size={15} />}
                  </button>
                ))}
              </div>
              <Range
                label="Stiffness"
                value={settings.stiffness}
                onChange={(v) => set('stiffness', v)}
                left="Fluid"
                right="Structured"
              />
              <Range
                label="Damping"
                value={settings.damping}
                onChange={(v) => set('damping', v)}
                left="Floaty"
                right="Settled"
              />
            </section>
            <section className="control-section view-section">
              <Toggle
                label="Afternoon light"
                icon={Sun}
                checked={settings.light}
                onChange={() => set('light', !settings.light)}
              />
              <Toggle
                label="Show wireframe"
                icon={Grid2X2}
                checked={settings.mesh}
                onChange={() => set('mesh', !settings.mesh)}
              />
            </section>
            <button className="reset-button" onClick={reset}>
              <RotateCcw size={14} /> Reset the curtain
            </button>
          </aside>
        </div>
        <div className="under-scene">
          <div className="preset">
            <span className="preset-icon">
              <Leaf size={17} />
            </span>
            <div>
              <label htmlFor="preset">A mood to begin with</label>
              <div className="select-wrap">
                <select
                  id="preset"
                  value={preset}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPreset(v);
                    setSettings((s) => ({
                      ...s,
                      wind: v === 'Gentle morning' ? 25 : v === 'Open windows' ? 65 : 0,
                      damping: v === 'Quiet evening' ? 85 : 60,
                      light: v !== 'Quiet evening',
                    }));
                  }}
                >
                  <option>Gentle morning</option>
                  <option>Open windows</option>
                  <option>Quiet evening</option>
                </select>
                <ChevronDown size={13} />
              </div>
            </div>
          </div>
          <div className="physics-stats">
            <span>
              <i className="status-dot" />
              {settings.paused ? 'Paused' : `${stats.fps} FPS`}
            </span>
            <span>{stats.particles.toLocaleString()} particles</span>
            <span>{stats.constraints.toLocaleString()} constraints</span>
            <span className="physics-tag">REAL-TIME PHYSICS</span>
          </div>
          <button
            className="save-button"
            onClick={() => {
              api.current?.snapshot();
              notify('Your quiet corner, saved.');
            }}
            aria-label="Save room image"
          >
            <Download size={16} />
          </button>
        </div>
        <footer>
          <p>Nothing to finish. Just something to feel.</p>
          <button onClick={() => setHelp(true)}>
            <Info size={14} /> A few little tips <ArrowUpRight size={13} />
          </button>
        </footer>
      </main>
      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button icon-button"
              autoFocus
              onClick={() => setHelp(false)}
              aria-label="Close tips"
            >
              <X size={20} />
            </button>
            <div className="eyebrow">WELCOME TO STILLROOM</div>
            <h2 id="about-title">
              Take a little <em>breather.</em>
            </h2>
            <p>
              A tiny, tactile space to slow down. The linen is made of connected particles that
              respond to gravity, wind, and your touch.
            </p>
            <div className="tip">
              <Hand />
              <p>
                <b>Give it a gentle pull</b>
                <br />
                Choose Grab, then drag any part of the curtain.
              </p>
              <kbd>G</kbd>
            </div>
            <div className="tip">
              <Wind />
              <p>
                <b>Let a breeze in</b>
                <br />
                Choose Wind and hold, or send a little gust.
              </p>
              <kbd>W</kbd>
            </div>
            <div className="tip">
              <Scissors />
              <p>
                <b>Let something go</b>
                <br />
                Cut across the cloth. Reset makes it whole again.
              </p>
              <kbd>C</kbd>
            </div>
            <p className="modal-note">Space to pause · R to reset · Escape to close</p>
            <button className="gust-button" onClick={() => setHelp(false)}>
              Make yourself at home <ArrowUpRight size={16} />
            </button>
          </section>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById('root')).render(<App />);
