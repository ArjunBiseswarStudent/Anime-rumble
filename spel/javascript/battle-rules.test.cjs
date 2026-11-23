const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rules = require('./battle-rules.js');
const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

function setup(stockValues = [3, 5]) {
    const makeModel = () => ({ visible: true, position: { set() {} } });
    const app = {
        window: { BattleRules: rules, SpecialMoves: { clearFighter() {}, update() {} }, AnimeMaps: { updateScenery() {} } },
        document: { getElementById(id) { return { value: String(stockValues[id.startsWith('p1') ? 0 : 1]) }; } },
        createCharacterModel: makeModel, fighters: [], gameMode: 'cpu', gameRunning: true, lastFrameTime: 0,
        matchStartedAt: 0, matchElapsed: 0, jumpRequests: [false, false], battleScene: {}, animationFrame: 0,
        updateFighter() {}, updateBattleHud() {}, drawBattle() {}, requestAnimationFrame() { return 1; },
        finishMatch(winner, reason = 'time') { app.result = { winner, reason }; app.gameRunning = false; }
    };
    vm.createContext(app);
    for (const [name, next] of [['makeFighter', 'startMatch'], ['performAttack', 'loseStock'], ['loseStock', 'finishMatch'], ['battleLoop', 'updateBattleHud']])
        vm.runInContext(source.slice(source.indexOf(`function ${name}(`), source.indexOf(`function ${next}(`)), app);
    app.fighters = [0, 1].map(index => app.makeFighter({ id: String(index), name: `Vechter ${index}` }, index));
    return app;
}

test('each player independently chooses 3 or 5 lives and begins at 100% health', () => {
    const app = setup();
    assert.deepEqual(app.fighters.map(f => f.stocks), [3, 5]);
    assert.deepEqual(app.fighters.map(f => f.health), [100, 100]);
    assert.deepEqual(setup([5, 3]).fighters.map(f => f.maxStocks), [5, 3]);
    assert.deepEqual(setup([1, 999]).fighters.map(f => f.stocks), [3, 3]);
});

test('existing damage and healing sources all affect the same bounded health', () => {
    const fighter = setup().fighters[0];
    fighter.damage += 8; assert.equal(fighter.health, 92);
    fighter.damage += 30; assert.equal(fighter.health, 62);
    fighter.damage = Math.max(0, fighter.damage - 24); assert.equal(fighter.health, 86);
    fighter.damage = 150; assert.equal(fighter.health, 0); assert.ok(rules.isDefeated(fighter));
    fighter.damage = -20; assert.equal(fighter.health, 100);
});

test('only the CPU receives the 20% outgoing damage reduction', () => {
    const app = setup();
    assert.equal(app.fighters[0].damageMultiplier, 1);
    assert.equal(app.fighters[1].damageMultiplier, 0.8);
    app.gameMode = '2p';
    assert.equal(app.makeFighter({}, 0).damageMultiplier, 1);
    assert.equal(app.makeFighter({}, 1).damageMultiplier, 1);
});

test('unarmed CPU attacks deal 6.4 damage while player attacks still deal 8', () => {
    for (const index of [0, 1]) {
        const app = setup();
        app.PLAYER_CONTROLS = [{ left: 'a', right: 'd' }, { left: 'left', right: 'right' }];
        app.pressedKeys = new Set(); app.isFighterShielded = () => false;
        app.window.SpecialMoves.prepare = () => ({ stun: 0, buff: 0, armor: 0 });
        app.window.CharacterMotion = { attack() {} };
        app.fighters.forEach(f => { f.x = 300; f.invulnerable = 0; });
        const attacker = app.fighters[index], target = app.fighters[1 - index];
        app.performAttack(attacker, target, false);
        app.updatePunch(attacker, target, .05);
        assert.equal(target.damage, 0);
        app.updatePunch(attacker, target, .05);
        assert.equal(target.damage, index === 0 ? 8 : 6.4);
    }
});

test('a lethal hit costs one life, resets health, cooldowns and position, then the final life ends the round', () => {
    const app = setup(), victim = app.fighters[0], attacker = app.fighters[1];
    for (let i = 1; i <= 3; i++) {
        victim.damage = 105; victim.specialCooldowns = [5, 7];
        app.battleLoop(i * 10000);
        assert.equal(victim.stocks, 3 - i);
        assert.equal(attacker.knockouts, i);
        if (i < 3) {
            assert.equal(victim.health, 100); assert.equal(victim.invulnerable, 2);
            assert.equal(victim.specialCooldowns[0], 0); assert.equal(victim.x, 330);
            assert.equal(app.gameRunning, true);
        }
    }
    assert.equal(victim.health, 0); assert.equal(victim.model.visible, false);
    assert.equal(app.result.winner, attacker); assert.equal(app.result.reason, 'elimination');
    assert.equal(app.matchElapsed, 30);
});

test('falling out of the arena also costs exactly one life', () => {
    const app = setup(); app.fighters[1].y = 700; app.battleLoop(1000);
    assert.equal(app.fighters[1].stocks, 4); assert.equal(app.fighters[1].health, 100);
    app.battleLoop(1016); assert.equal(app.fighters[1].stocks, 4);
});

test('the round expires at three minutes and ranks lives before health', () => {
    const app = setup([3, 3]);
    app.fighters[0].damage = 20; app.fighters[1].damage = 40;
    app.battleLoop(179999); assert.equal(app.gameRunning, true);
    app.battleLoop(180000); assert.equal(app.gameRunning, false);
    assert.equal(app.result.reason, 'time'); assert.equal(app.result.winner, app.fighters[0]);
    const [a, b] = setup([3, 5]).fighters;
    a.damage = 0; b.damage = 99; assert.equal(rules.chooseWinner([a, b]), b);
    b.stocks = 3; assert.equal(rules.chooseWinner([a, b]), a);
    b.damage = 0; assert.equal(rules.chooseWinner([a, b]), null);
});

test('simultaneous last-life knockouts resolve to a draw without respawning', () => {
    const app = setup([3, 3]);
    app.fighters.forEach(f => { f.defeats = 2; f.stocks = 1; f.damage = 100; });
    app.battleLoop(1000);
    assert.deepEqual(app.fighters.map(f => f.stocks), [0, 0]);
    assert.ok(app.fighters.every(f => f.health === 0));
    assert.equal(app.result.reason, 'elimination'); assert.equal(app.result.winner, null);
});

test('HUD counts down and displays health independently from remaining lives', () => {
    const app = setup(), nodes = new Map();
    app.document.getElementById = id => {
        if (!nodes.has(id)) nodes.set(id, { textContent: '', attrs: {}, style: { setProperty() {} },
            setAttribute(key, value) { this.attrs[key] = value; }, classList: { toggle() {} } });
        return nodes.get(id);
    };
    app.fighters.forEach(f => { f.character.moves = { neutral: { cooldown: 5 }, side: { cooldown: 10 } }; });
    app.window.SpecialMoves.cooldownLabel = () => 'klaar';
    vm.runInContext(source.slice(source.indexOf('function updateBattleHud('), source.indexOf("window.addEventListener('resize', resizeBattleRenderer)")), app);
    app.updateBattleHud(); assert.equal(nodes.get('battle-clock').textContent, '03:00');
    assert.equal(nodes.get('p1-stock-fill').style.width, '100%');
    app.fighters[0].damage = 62; app.matchElapsed = 65;
    app.updateBattleHud(); assert.equal(nodes.get('battle-clock').textContent, '01:55');
    assert.equal(nodes.get('p1-stock-fill').style.width, '38%');
    assert.equal(nodes.get('p1-stock-meter').attrs['aria-valuenow'], '38');
    assert.equal(nodes.get('p1-stock-meter').attrs['aria-valuemax'], '100');
    assert.match(nodes.get('p1-hud-stats').textContent, /3 levens.*38% leven/);
    app.matchElapsed = 180; app.updateBattleHud(); assert.equal(nodes.get('battle-clock').textContent, '00:00');
});
