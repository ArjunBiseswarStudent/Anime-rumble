const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function setup() {
    class Element {
        constructor() { this.children = []; this.events = {}; this.style = {}; this.attrs = {}; this.dataset = {}; this.classes = new Set(); this.classList = { toggle: (c, on) => on ? this.classes.add(c) : this.classes.delete(c) }; }
        append(...nodes) { nodes.forEach(n => { if (n.parentNode) n.parentNode.children.splice(n.parentNode.children.indexOf(n), 1); this.children.push(n); n.parentNode = this; }); }
        insertBefore(n, ref) { this.append(n); this.children.pop(); this.children.splice(ref ? this.children.indexOf(ref) : this.children.length, 0, n); }
        get nextSibling() { return this.parentNode.children[this.parentNode.children.indexOf(this) + 1]; }
        addEventListener(name, fn) { this.events[name] = fn; }
        setAttribute(k, v) { this.attrs[k] = v; }
        replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
        setPointerCapture() {}
        getBoundingClientRect() { return { left: 0, top: 0, width: 100, height: 100 }; }
    }
    const parent = new Element(), viewport = new Element(), controls = new Element(), stick = new Element(), knob = new Element(), panel = new Element(), movement = new Element(), actions = new Element();
    parent.append(viewport, controls); controls.append(panel, stick); panel.append(movement, actions); stick.append(knob);
    const buttons = Object.fromEntries(['KeyW','KeyA','KeyS','KeyD','KeyF','KeyG','KeyC','KeyH','KeyX','KeyR','KeyT'].map(code => { const n = new Element(); n.dataset.touchCode = code; n.textContent = code; return [code,n]; }));
    movement.append(...Object.values(buttons).slice(0,4)); actions.append(...Object.values(buttons).slice(4));
    controls.querySelector = () => panel;
    panel.querySelector = selector => selector === '.touch-movement' ? movement : selector === '.touch-actions' ? actions : buttons[selector.match(/"(.*?)"/)[1]];
    actions.querySelectorAll = () => actions.children;
    stick.querySelector = () => knob;
    const events = {}, documentEvents = {}, held = new Map(), presses = [];
    const media = { matches: true, addEventListener(name, fn) { this.change = fn; } };
    const window = { matchMedia: () => media, addEventListener: (name, fn) => { events[name] = fn; }, TouchControls: { reset() { held.clear(); window.MobileGamepad.reset(); } } };
    const document = { getElementById: id => id === 'touch-controls' ? controls : stick, querySelector: () => viewport, createComment: () => new Element(), createElement: () => new Element(), addEventListener: (name, fn) => { documentEvents[name] = fn; } };
    vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, 'mobile-gamepad.js'), 'utf8'), { window, document });
    let running = true;
    window.MobileGamepad.init({ press: (code, source) => { held.set(source,code); presses.push(code); }, release: source => held.delete(source), isRunning: () => running });
    const pointer = (name, x, y, id = 1) => stick.events[name]({ pointerId: id, button: 0, clientX: x, clientY: y, preventDefault() {} });
    return { api: window.MobileGamepad, held, presses, pointer, stick, knob, controls, viewport, parent, movement, actions, buttons, events, documentEvents, document, media, stop() { running = false; } };
}

test('joystick changes direction, has a dead zone and triggers jump only on threshold crossings', () => {
    const a = setup(); a.pointer('pointerdown',20,50);
    assert.equal(a.held.get('joystick:move'),'KeyA');
    a.pointer('pointermove',80,50); assert.equal(a.held.get('joystick:move'),'KeyD');
    a.pointer('pointermove',50,50); assert.equal(a.held.size,0);
    a.pointer('pointermove',50,10); a.pointer('pointermove',50,5);
    assert.equal(a.presses.filter(k => k === 'KeyW').length,1);
    a.pointer('pointermove',50,50); assert.equal(a.held.size,0);
});

test('independent fingers, canceled gestures and hidden tabs release only their owned controls', () => {
    const a = setup(); a.pointer('pointerdown',20,50); a.held.set('touch:9','KeyF');
    a.pointer('pointermove',80,50,2); assert.equal(a.held.get('joystick:move'),'KeyA');
    a.events.pointercancel({pointerId:1}); assert.deepEqual([...a.held.values()],['KeyF']);
    a.pointer('pointerdown',80,10); a.events.blur(); assert.equal(a.held.has('joystick:move'),false);
    a.pointer('pointerdown',20,50); a.document.hidden = true; a.documentEvents.visibilitychange();
    assert.equal(a.stick.attrs['aria-valuenow'],'0'); assert.equal(a.knob.style.transform,'translate(0px, 0px)');
    a.stop(); a.pointer('pointerdown',20,50); assert.equal(a.held.has('joystick:move'),false);
});

test('responsive and two-player transitions restore existing buttons in their original order', () => {
    const a = setup(); assert.equal(a.controls.parentNode,a.viewport); assert.equal(a.actions.children.length,9);
    a.api.updateMode(true); assert.equal(a.controls.parentNode,a.parent); assert.equal(a.stick.hidden,true);
    assert.deepEqual(a.movement.children.map(b => b.dataset.touchCode),['KeyW','KeyA','KeyS','KeyD']);
    assert.equal(a.buttons.KeyF.textContent,'KeyF');
    a.api.updateMode(false); assert.equal(a.actions.children.length,9);
    a.media.matches = false; a.media.change(); assert.equal(a.controls.parentNode,a.parent);
    a.media.matches = true; a.media.change(); assert.equal(a.actions.children.length,9); assert.equal(a.stick.hidden,false);
});
