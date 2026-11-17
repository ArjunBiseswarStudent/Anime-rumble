const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, 'arena-music.js'), 'utf8');
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };

function setup({ supported = true, storageBlocked = false } = {}) {
    const events = {}, timers = new Map(), contexts = [], saved = new Map();
    let sequence = 0;
    class Param {
        constructor() { this.value = 0; }
        setValueAtTime(value, time) { assert.ok(Number.isFinite(value) && time >= 0); this.value = value; }
        linearRampToValueAtTime(value, time) { this.setValueAtTime(value, time); }
        exponentialRampToValueAtTime(value, time) { assert.ok(value > 0); this.setValueAtTime(value, time); }
        setTargetAtTime(value, time) { this.setValueAtTime(value, time); }
        cancelScheduledValues() {}
    }
    class Node {
        constructor() { for (const key of ['gain', 'frequency', 'pan', 'delayTime', 'threshold', 'ratio']) this[key] = new Param(); }
        connect() {}
        disconnect() { this.disconnected = true; }
        start(time) { this.started = time; }
        stop(time) { this.stopped = time; }
    }
    class AudioContext {
        constructor() { this.currentTime = 0; this.state = 'suspended'; this.destination = new Node(); this.oscillators = []; contexts.push(this); }
        createGain() { return new Node(); }
        createBiquadFilter() { return new Node(); }
        createDelay() { return new Node(); }
        createStereoPanner() { return new Node(); }
        createDynamicsCompressor() { return new Node(); }
        createOscillator() { const osc = new Node(); this.oscillators.push(osc); return osc; }
        async resume() { this.state = 'running'; }
        async suspend() { this.state = 'suspended'; }
    }
    const controls = Array.from({ length: 2 }, () => ({ textContent: '', value: '', handlers: {}, setAttribute(key, value) { this[key] = value; }, addEventListener(key, fn) { this.handlers[key] = fn; } }));
    const labels = [{ textContent: '' }, { textContent: '' }];
    const sliders = controls.map(() => ({ ...controls[0], handlers: {} }));
    const document = { hidden: false, addEventListener(name, callback) { events[name] = callback; }, querySelectorAll(selector) { return selector.includes('toggle') ? controls : selector.includes('volume') ? sliders : labels; } };
    const scope = { document, console: { warn() {} }, window: { addEventListener(name, callback) { events[name] = callback; } },
        localStorage: { getItem(key) { if (storageBlocked) throw Error('Blocked'); return saved.get(key); }, setItem(key, value) { if (storageBlocked) throw Error('Blocked'); saved.set(key, value); } },
        setInterval(fn) { const id = ++sequence; timers.set(id, fn); return id; }, clearInterval(id) { timers.delete(id); } };
    if (supported) scope.window.AudioContext = AudioContext;
    vm.runInNewContext(source, scope);
    events.DOMContentLoaded();
    function advance(seconds) {
        const context = contexts[0]; context.currentTime += seconds;
        for (const osc of context.oscillators) if (!osc.disconnected && osc.stopped <= context.currentTime) osc.onended?.();
        for (const callback of timers.values()) callback();
    }
    return { api: scope.window.ArenaMusic, contexts, controls, labels, sliders, saved, timers, events, document, advance };
}

test('audio is lazy; all nine maps produce distinct, bounded scores', async () => {
    const signatures = new Set();
    for (const key of ['dojo', 'castle', 'island', 'neon', 'frog', 'namek', 'beerus', 'arlong', 'kurukshetra']) {
        const app = setup(); assert.equal(app.contexts.length, 0);
        app.api.start(key); await settle();
        assert.equal(app.timers.size, 1);
        const ctx = app.contexts[0];
        assert.ok(ctx.oscillators.length >= 5);
        signatures.add(ctx.oscillators.map(o => `${o.type}:${o.frequency.value}:${o.stopped}`).join('|'));
        for (let i = 0; i < 1000; i++) app.advance(0.1);
        assert.ok(ctx.oscillators.filter(o => !o.disconnected).length < 40, key + ' must release completed voices');
        const before = ctx.oscillators.length;
        app.advance(600);
        assert.ok(ctx.oscillators.length - before < 20, 'no backlog after a scheduler stall');
        app.api.stop(); assert.equal(app.timers.size, 0);
        app.advance(1);
        assert.ok(ctx.oscillators.every(o => o.disconnected));
    }
    assert.equal(signatures.size, 9);
});

test('the anime and battlefield themes layer instruments and develop a second musical phrase', async () => {
    for (const [key, bpm, lead] of [['frog', 112, 'sine'], ['namek', 132, 'sawtooth'], ['beerus', 86, 'sine'], ['arlong', 120, 'sawtooth'], ['kurukshetra', 108, 'sawtooth']]) {
        const app = setup(); app.api.start(key); await settle();
        const half = 8 * 4 * 60 / bpm;
        for (let time = 0; time < half * 2; time += 0.05) app.advance(0.05);
        const voices = app.contexts[0].oscillators;
        assert.ok(voices.some(voice => voice.type === lead), key + ': expected lead timbre');
        assert.ok(voices.some(voice => voice.type === 'triangle'), key + ': expected string/bass layer');
        const signature = start => voices.filter(v => v.started >= start + 0.04 && v.started < start + half)
            .map(v => `${v.type}:${v.frequency.value.toFixed(2)}`).join('|');
        assert.notEqual(signature(0), signature(half), key + ': second half should develop the melody');
        app.api.stop(); app.advance(1);
        assert.ok(voices.every(voice => voice.disconnected), key + ': all instrument layers must stop');
    }
});

test('switching and stopping during async resume cannot leave an old score running', async () => {
    const app = setup();
    app.api.start('dojo'); app.api.start('neon'); await settle();
    assert.equal(app.timers.size, 1);
    assert.equal(app.labels[0].textContent, 'Nachtverkeer');
    app.api.start('castle'); app.api.stop(); await settle();
    assert.equal(app.timers.size, 0);
    assert.equal(app.labels[0].textContent, 'Start bij het gevecht');
});

test('mute and volume synchronize both controls, persist and clamp input', async () => {
    const app = setup(); app.api.start('dojo'); await settle();
    app.controls[0].handlers.click();
    assert.equal(app.timers.size, 0);
    assert.ok(app.controls.every(b => b['aria-pressed'] === 'false'));
    app.api.setVolume(2); assert.ok(app.sliders.every(s => s.value === 100));
    app.api.setVolume(-1); assert.ok(app.sliders.every(s => s.value === 0));
    app.api.setVolume(NaN); assert.ok(app.sliders.every(s => s.value === 0));
    app.sliders[1].value = '43'; app.sliders[1].handlers.input();
    assert.ok(app.sliders.every(s => s.value === 43));
    assert.deepEqual(JSON.parse(app.saved.get('anime-rumble-music')), { volume: 0.43, muted: true });
    app.controls[1].handlers.click(); await settle(); assert.equal(app.timers.size, 1);
});

test('hidden tabs suspend music; returning resumes only an active match', async () => {
    const app = setup(); app.api.start('island'); await settle();
    app.document.hidden = true; app.events.visibilitychange(); await settle();
    assert.equal(app.timers.size, 0); assert.equal(app.contexts[0].state, 'suspended');
    app.document.hidden = false; app.events.visibilitychange(); await settle();
    assert.equal(app.timers.size, 1);
    app.events.pagehide(); app.events.visibilitychange(); await settle();
    assert.equal(app.timers.size, 0);
});

test('unsupported audio and blocked storage do not interrupt the game', async () => {
    const app = setup({ supported: false }); app.api.start('dojo'); await settle();
    assert.equal(app.timers.size, 0); assert.ok(app.controls.every(b => b.disabled));
    assert.equal(app.labels[0].textContent, 'Muziek niet beschikbaar in deze browser');
    const blocked = setup({ storageBlocked: true });
    blocked.api.setVolume(0.4); blocked.api.start('arlong'); await settle();
    assert.equal(blocked.timers.size, 1);
});
