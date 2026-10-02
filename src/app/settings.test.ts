import assert from 'node:assert/strict';
import test from 'node:test';
import { createInitialState, settingsReducer } from './settings.ts';

test('reduced motion is respected without sharing mutable settings', () => {
  const first = createInitialState(true);
  const second = createInitialState(false);
  assert.equal(first.settings.paused, true);
  assert.equal(second.settings.paused, false);
  first.settings.wind = 100;
  assert.equal(second.settings.wind, 25);
});

test('presets change atmosphere while preserving fabric and playback', () => {
  const state = createInitialState(true);
  state.settings.tool = 'cut';
  state.settings.color = '#af7864';
  state.settings.stiffness = 40;
  const next = settingsReducer(state, { type: 'preset', name: 'Quiet evening' });
  assert.deepEqual(next.settings, { ...state.settings, wind: 0, damping: 85, light: false });
  assert.equal(next.preset, 'Quiet evening');
  assert.equal(settingsReducer(state, { type: 'preset', name: 'missing' }), state);
});

test('settings actions leave the previous state intact', () => {
  const state = createInitialState();
  const next = settingsReducer(state, { type: 'set', key: 'wind', value: 90 });
  assert.equal(state.settings.wind, 25);
  assert.equal(next.settings.wind, 90);
  assert.equal(settingsReducer(next, { type: 'toggle-pause' }).settings.paused, true);
});
