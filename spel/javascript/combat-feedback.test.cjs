const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('arena input distinguishes clicks, charged releases and canceled gestures', () => {
    const listeners = new Map();
    const attacks = [];
    let captured, ready = true, now = 100;
    const node = () => ({
        hidden: true, style: { setProperty() {} }, dataset: {}, firstElementChild: {},
        classList: { toggle() {} }
    });
    const markers = [node(), node()];
    const numbers = [node(), node()];
    const impacts = [node(), node()];
    const groups = numbers.map((number, index) => ({
        querySelector: selector => selector === '.damage-number' ? number : impacts[index]
    }));
    const overlay = {
        clientWidth: 960, clientHeight: 540, parentElement: { querySelector: () => null },
        querySelectorAll: selector => ({
            '.fighter-indicator': markers, '.hit-feedback': groups, '.fist-swipe': [node(), node()]
        })[selector]
    };
    const canvas = {
        addEventListener: (type, callback) => listeners.set(type, callback),
        setPointerCapture: id => { captured = id; },
        hasPointerCapture: id => captured === id,
        releasePointerCapture: () => { captured = undefined; }
    };
    const scope = {
        window: {}, document: { getElementById: () => overlay }, performance: { now: () => now },
        ResizeObserver: class {
            constructor(callback) { this.callback = callback; }
            observe() { this.callback(); }
        }
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'combat-feedback.js'), 'utf8'), scope);
    const feedback = scope.window.CombatFeedback;
    feedback.attach(canvas, { running: () => true, canCharge: () => ready, attack: charged => attacks.push(charged) });
    const dispatch = (type, timeStamp) => listeners.get(type)({
        pointerType: 'mouse', isPrimary: true, pointerId: 1, button: 0, timeStamp, preventDefault() {}
    });
    dispatch('pointerdown', 100);
    dispatch('pointerup', 180);
    dispatch('pointerdown', 200);
    dispatch('pointercancel', 250);
    dispatch('pointerup', 600);
    dispatch('pointerdown', 700);
    dispatch('pointerup', 1050);
    ready = false;
    dispatch('pointerdown', 1100);
    dispatch('pointerup', 1500);
    assert.deepEqual(attacks, [false, true]);
    assert.equal(captured, undefined);

    const fighters = [0, 1].map(playerIndex => ({
        playerIndex, stocks: 3, x: 400 + playerIndex * 40, y: 300, width: 34, height: 48,
        model: { position: { x: playerIndex, y: 0 }, scale: { y: 1 } }
    }));
    const THREE = { Vector3: class {
        set(x, y) { this.x = x; this.y = y; return this; }
        project() { return this; }
    } };
    feedback.hit(fighters[1], 6.4);
    feedback.draw(THREE, {}, fighters, true);
    assert.equal(markers[0].firstElementChild.textContent, 'P1');
    assert.equal(markers[1].firstElementChild.textContent, 'CPU');
    assert.equal(numbers[1].textContent, '−6,4');
    assert.equal(impacts[1].hidden, false);
    now += 900;
    feedback.draw(THREE, {}, fighters, false);
    assert.equal(markers[1].firstElementChild.textContent, 'P2');
    assert.equal(numbers[1].hidden, true);
    assert.equal(impacts[1].hidden, true);
    feedback.hit(fighters[1], 5, false, 'Jatayu');
    feedback.draw(THREE, {}, fighters, false);
    assert.equal(numbers[1].dataset.source, 'Jatayu');
    assert.equal(numbers[1].textContent, '−5');
    now += 1000;
    feedback.draw(THREE, {}, fighters, false);
    assert.equal(numbers[1].hidden, false);
    feedback.hit(fighters[1], 8);
    assert.equal(numbers[1].dataset.source, '');
    assert.equal(numbers[1].textContent, '−8');
});
