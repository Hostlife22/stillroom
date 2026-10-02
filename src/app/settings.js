export const FABRIC_COLORS = Object.freeze([
  { name: 'Sage', value: '#85896b' },
  { name: 'Oat', value: '#c4b69b' },
  { name: 'Clay', value: '#af7864' },
  { name: 'Mist', value: '#8a9a9b' },
  { name: 'Charcoal', value: '#535b53' },
]);

export const PRESETS = Object.freeze({
  'Gentle morning': { wind: 25, damping: 60, light: true },
  'Open windows': { wind: 65, damping: 60, light: true },
  'Quiet evening': { wind: 0, damping: 85, light: false },
});

export const DEFAULT_SETTINGS = Object.freeze({
  tool: 'grab', wind: 25, stiffness: 75, damping: 60,
  color: FABRIC_COLORS[0].value, mesh: false, light: true, paused: false,
});

export function createInitialState(reducedMotion = false) {
  return { settings: { ...DEFAULT_SETTINGS, paused: reducedMotion }, preset: 'Gentle morning' };
}

export function settingsReducer(state, action) {
  switch (action.type) {
    case 'set': return { ...state, settings: { ...state.settings, [action.key]: action.value } };
    case 'toggle-pause': return { ...state, settings: { ...state.settings, paused: !state.settings.paused } };
    case 'preset': {
      const preset = PRESETS[action.name];
      return preset ? { preset: action.name, settings: { ...state.settings, ...preset } } : state;
    }
    default: return state;
  }
}
