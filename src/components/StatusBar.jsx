import React from 'react';
import { ChevronDown, Download, Leaf } from 'lucide-react';
import { PRESETS } from '../app/settings.js';
export function StatusBar({ settings, preset, selectPreset, stats, saveImage }) { return (        <div className="under-scene">
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
                  onChange={(event) => selectPreset(event.target.value)}
                >
                  {Object.keys(PRESETS).map(name => <option key={name}>{name}</option>)}
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
            onClick={saveImage}
            aria-label="Save room image"
          >
            <Download size={16} />
          </button>
        </div>
); }
