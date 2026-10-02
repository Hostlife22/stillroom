import type { LucideIcon } from 'lucide-react';
export function Toggle({
  label,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  icon: LucideIcon;
}) {
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
