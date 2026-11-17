const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const gameSource = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
const touchSource = fs.readFileSync(path.join(__dirname, 'touch-controls.js'), 'utf8');

function setup() {
    const events = {}, documentEvents = {}, attacks = [], panels = [{ hidden: false }, { hidden: true }];
    const controlRoot = { dataset: {} };
    const buttons = ['KeyA', 'KeyF', 'KeyW', 'KeyS', 'Digit1'].map(code => {
        const panel = code.startsWith('Digit') ? panels[1] : panels[0];
        const held = new Set();
        return { dataset: { touchCode: code }, handlers: {}, attrs: {}, held,
            classList: { add(c) { held.add(c); }, remove(c) { held.delete(c); } },
            setAttribute(k, v) { this.attrs[k] = v; }, setPointerCapture() {}, closest() { return panel.hidden ? panel : null; },
            addEventListener(name, fn) { this.handlers[name] = fn; } };
    });
    const scope = { gameRunning: true, gameMode: 'cpu', pressedKeys: new Set(), inputSources: new Map(),
        jumpRequests: [false, false], GAME_KEYS: new Set(['KeyA', 'KeyF', 'KeyW', 'KeyS', 'Digit1']),
        PLAYER_CONTROLS: [{ left: 'KeyA', right: 'KeyD', jump: 'KeyW', shield: 'KeyS', attack: 'KeyF', super1: 'KeyG', super2: 'KeyC' }, { attack: 'Digit1' }],
        fighters: [{ playerIndex: 0 }, { playerIndex: 1 }],
        performAttack(owner) { attacks.push(owner.playerIndex); }, performThrow() {},
        document: { hidden: false, getElementById() { return controlRoot; }, querySelectorAll() { return buttons; }, querySelector() { return panels[1]; }, addEventListener(name, fn) { documentEvents[name] = fn; } },
        window: { addEventListener(name, fn) { events[name] = fn; } }
    };
    vm.createContext(scope);
    vm.runInContext(gameSource.slice(gameSource.indexOf('function normalizeGameKey('), gameSource.indexOf("window.addEventListener('keydown'")), scope);
    vm.runInContext(touchSource, scope);
    const api = scope.window.TouchControls;
    api.init({ press: scope.pressGameInput, release: scope.releaseGameInput, isRunning: () => scope.gameRunning });
    const down = (buttonIndex, pointerId) => buttons[buttonIndex].handlers.pointerdown({ button: 0, pointerId, preventDefault() {} });
    return { scope, api, buttons, events, documentEvents, panels, attacks, down };
}

test('a player can hold movement and attack with different fingers', () => {
    const app = setup(); app.down(0, 11); app.down(1, 12);
    assert.ok(app.scope.pressedKeys.has('KeyA')); assert.deepEqual(app.attacks, [0]);
    app.events.pointerup({ pointerId: 12 }); assert.ok(app.scope.pressedKeys.has('KeyA'));
    app.events.pointerup({ pointerId: 11 }); assert.equal(app.scope.pressedKeys.size, 0);
    assert.equal(app.buttons[0].attrs['aria-pressed'], 'false');
});

test('releasing one finger or keyboard source cannot release another held input', () => {
    const app = setup(); app.down(0, 11); app.down(0, 12);
    app.scope.pressGameInput('KeyA', 'keyboard:KeyA');
    app.events.pointercancel({ pointerId: 11 }); app.events.pointerup({ pointerId: 12 });
    assert.ok(app.scope.pressedKeys.has('KeyA'));
    app.scope.releaseGameInput('keyboard:KeyA'); assert.equal(app.scope.pressedKeys.size, 0);
});

test('jump, shield and lost pointer capture release correctly', () => {
    const app = setup(); app.down(2, 21); app.down(3, 22);
    assert.equal(app.scope.jumpRequests[0], true); assert.ok(app.scope.pressedKeys.has('KeyS'));
    app.buttons[3].handlers.lostpointercapture({ pointerId: 22 });
    assert.equal(app.scope.pressedKeys.has('KeyS'), false);
    app.scope.resetGameInput(); assert.equal(app.scope.pressedKeys.size, 0);
    assert.ok(app.scope.jumpRequests.every(value => !value));
});

test('the second touch controller is hidden for CPU mode and independent for two players', () => {
    const app = setup(); app.api.updateMode(false); app.down(4, 1); assert.equal(app.attacks.length, 0);
    app.scope.gameMode = '2p'; app.api.updateMode(true); app.down(4, 2);
    assert.equal(app.panels[1].hidden, false); assert.deepEqual(app.attacks, [1]);
    app.api.updateMode(false); assert.equal(app.scope.pressedKeys.size, 0);
});

test('hidden tabs, canceled gestures and returning to the menu cannot leave controls held', () => {
    const app = setup(); app.down(0, 11); app.events.blur(); assert.equal(app.scope.pressedKeys.size, 0);
    app.down(3, 12); app.scope.document.hidden = true; app.documentEvents.visibilitychange();
    assert.equal(app.scope.pressedKeys.size, 0);
    app.scope.gameRunning = false; app.down(1, 13); assert.equal(app.attacks.length, 0);
});
