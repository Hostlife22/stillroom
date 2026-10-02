import { useStillroom } from './useStillroom.ts';
import { PageHeader, PageIntro, PageFooter } from '../components/PageLayout.tsx';
import { SimulationStage } from '../components/SimulationStage.tsx';
import { ControlPanel } from '../components/ControlPanel.tsx';
import { StatusBar } from '../components/StatusBar.tsx';
import { HelpDialog } from '../components/HelpDialog.tsx';

export function App() {
  const room = useStillroom();
  return (
    <>
      <PageHeader onHelp={room.openHelp} />
      <main>
        <PageIntro />
        <div className="workspace">
          <SimulationStage
            settings={room.settings}
            stageRef={room.stageRef}
            engineRef={room.engineRef}
            onStats={room.setStats}
            sound={room.sound}
            toggleSound={room.toggleSound}
            fullscreen={room.fullscreen}
            toggleFullscreen={room.toggleFullscreen}
            togglePause={room.togglePause}
            reset={room.reset}
            notice={room.notice}
          />
          <ControlPanel
            settings={room.settings}
            setSetting={room.setSetting}
            addGust={room.addGust}
            reset={room.reset}
          />
        </div>
        <StatusBar
          settings={room.settings}
          preset={room.preset}
          selectPreset={room.selectPreset}
          stats={room.stats}
          saveImage={room.saveImage}
        />
        <PageFooter onHelp={room.openHelp} />
      </main>
      {room.helpOpen && <HelpDialog onClose={room.closeHelp} />}
    </>
  );
}
