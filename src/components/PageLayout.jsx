import React from 'react';
import { ArrowUpRight, Info } from 'lucide-react';
export function PageHeader({ onHelp }) { return (      <header className="header">
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
        <button className="about-button" onClick={onHelp}>
          About this space <ArrowUpRight size={15} />
        </button>
      </header>
); }
export function PageIntro() { return (        <section className="intro">
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
); }
export function PageFooter({ onHelp }) { return (        <footer>
          <p>Nothing to finish. Just something to feel.</p>
          <button onClick={onHelp}>
            <Info size={14} /> A few little tips <ArrowUpRight size={13} />
          </button>
        </footer>
); }
