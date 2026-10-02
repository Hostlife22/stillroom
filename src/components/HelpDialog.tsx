import { Hand, Wind, Scissors, X, ArrowUpRight } from 'lucide-react';
import { useDialogFocus } from '../hooks/useDialogFocus.ts';

interface HelpDialogProps {
  onClose: () => void;
}

export function HelpDialog({ onClose }: HelpDialogProps) {
  const dialogRef = useDialogFocus(onClose);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-button icon-button"
          autoFocus
          onClick={onClose}
          aria-label="Close tips"
        >
          <X size={20} />
        </button>
        <div className="eyebrow">WELCOME TO STILLROOM</div>
        <h2 id="about-title">
          Take a little <em>breather.</em>
        </h2>
        <p>
          A tiny, tactile space to slow down. The linen is made of connected particles that respond
          to gravity, wind, and your touch.
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
        <button className="gust-button" onClick={onClose}>
          Make yourself at home <ArrowUpRight size={16} />
        </button>
      </section>
    </div>
  );
}
