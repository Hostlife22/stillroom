import type { LucideIcon } from 'lucide-react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  icon: LucideIcon;
}

export function Toggle({ label, checked, onChange, icon: Icon }: ToggleProps) {
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
