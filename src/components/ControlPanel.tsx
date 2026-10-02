import { Wind, Hand, Scissors, RotateCcw, Sun, Check, Grid2X2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { FABRIC_COLORS } from '../app/settings.ts';
import type { SimulationSettings, SetSetting } from '../simulation/types.ts';
import { Range } from './ui/Range.tsx';
import { Toggle } from './ui/Toggle.tsx';

interface ControlPanelProps {
  settings: SimulationSettings;
  setSetting: SetSetting;
  addGust: () => void;
  reset: () => void;
}

export function ControlPanel({ settings, setSetting, addGust, reset }: ControlPanelProps) {
  return (
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
            { id: 'grab' as const, label: 'Grab', icon: Hand, key: 'G' },
            { id: 'wind' as const, label: 'Wind', icon: Wind, key: 'W' },
            { id: 'cut' as const, label: 'Cut', icon: Scissors, key: 'C' },
          ].map(({ id, label, icon: Icon, key }) => (
            <button
              key={id}
              className={settings.tool === id ? 'selected' : ''}
              onClick={() => setSetting('tool', id)}
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
          onChange={(v) => setSetting('wind', v)}
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
          <span>{FABRIC_COLORS.find((c) => c.value === settings.color)?.name}</span>
        </div>
        <div className="swatches">
          {FABRIC_COLORS.map((c) => (
            <button
              key={c.name}
              style={{ '--swatch': c.value } as CSSProperties}
              onClick={() => setSetting('color', c.value)}
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
          onChange={(v) => setSetting('stiffness', v)}
          left="Fluid"
          right="Structured"
        />
        <Range
          label="Damping"
          value={settings.damping}
          onChange={(v) => setSetting('damping', v)}
          left="Floaty"
          right="Settled"
        />
      </section>
      <section className="control-section view-section">
        <Toggle
          label="Afternoon light"
          icon={Sun}
          checked={settings.light}
          onChange={() => setSetting('light', !settings.light)}
        />
        <Toggle
          label="Show wireframe"
          icon={Grid2X2}
          checked={settings.mesh}
          onChange={() => setSetting('mesh', !settings.mesh)}
        />
      </section>
      <button className="reset-button" onClick={reset}>
        <RotateCcw size={14} /> Reset the curtain
      </button>
    </aside>
  );
}
