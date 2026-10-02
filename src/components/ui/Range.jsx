import React from 'react';
import { useId } from 'react';
export function Range({ label, value, onChange, left, right }) {
  const id = useId();
  return (
    <div className="range-group">
      <div className="range-heading">
        <label htmlFor={id}>{label}</label>
        <span>
          {value}
          <small>%</small>
        </span>
      </div>
      <input
        id={id}
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

