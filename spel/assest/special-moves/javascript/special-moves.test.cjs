const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Minimal scene graph: test simulation and resource lifecycle without a browser/WebGL context.
class Vector {
    constructor() { this.set(0, 0, 0); }
    set(x, y, z) { Object.assign(this, { x, y, z }); }
    setScalar(value) { this.set(value, value, value); }
}
class Group {
    constructor() { this.children = []; this.position = new Vector(); this.rotation = new Vector(); this.scale = new Vector(); this.userData = {}; }
    add(child) { this.children.push(child); }
    remove(child) { this.children = this.children.filter(item => item !== child); }
    traverse(callback) { callback(this); this.children.forEach(child => child.traverse(callback)); }
}
class Geometry { dispose() { this.disposed = true; } }
class Material { constructor(options) { Object.assign(this, options); } dispose() { this.disposed = true; } }
class Mesh extends Group { constructor(geometry, material) { super(); this.geometry = geometry; this.material = material; } }
class Shape { moveTo() {} lineTo() {} closePath() {} }
class PointLight extends Group {
    constructor(color, intensity) {
        super();
        this.intensity = intensity;
        this.color = { value: color, set(value) { this.value = value; } };
    }
}
const THREE = { Group, Mesh, Shape, ShapeGeometry: Geometry, MeshBasicMaterial: Material,
    ShaderMaterial: Material, Color: class {}, PointLight, PlaneGeometry: Geometry,
    SphereGeometry: Geometry, TorusGeometry: Geometry, CylinderGeometry: Geometry, ConeGeometry: Geometry };
function setup() {
    const context = { window: { CharacterMotion: { attack() {} } } };
    vm.createContext(context);
    for (const file of ['moves-data.js', 'special-moves.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context);
    const api = context.window.SpecialMoves, data = context.window.SpecialMoveData, scene = new Group();
    function fighter(id, x) {
        return { character: { id, aura: '#ffcc55', weight: 1 }, x, y: 300, width: 34, height: 48,
            facing: 1, damage: 40, stocks: 3, vx: 0, vy: 0, grounded: true, invulnerable: 0, attacks: 0, hits: 0, model: new Group() };
    }
    function step(owner, target, frames = 1) {
        for (let i = 0; i < frames; i++) {
            api.tickFighter(owner, 1 / 60); api.tickFighter(target, 1 / 60);
            owner.invulnerable = Math.max(0, owner.invulnerable - 1 / 60);
            target.invulnerable = Math.max(0, target.invulnerable - 1 / 60);
            api.update(1 / 60);
            scene.traverse(object => {
                for (const vector of [object.position, object.rotation, object.scale]) for (const value of Object.values(vector)) assert(Number.isFinite(value));
            });
        }
    }
    function cast(owner, target, slot, blocked = false, onHit) {
        return api.cast({ THREE, scene, owner, target, slot, isShielded: f => blocked && f === target, onNotice() {}, onHit });
    }
    return { api, data, scene, fighter, step, cast, context };
}

test('a special reports its first hit and displays a short-lived burst only on impact', () => {
    const { data, fighter, cast, step, scene } = setup();
    const [id, moves] = Object.entries(data).find(([, moves]) => moves.some(move => move.kind === 'stream'));
    const slot = moves.findIndex(move => move.kind === 'stream');
    let reactions = 0;
    const first = fighter(id, 300);
    const distant = fighter('goku', 1500);
    cast(first, distant, slot, false, () => reactions++);
    step(first, distant, 180);
    assert.equal(reactions, 0);
    const second = fighter(id, 300);
    const nearby = fighter('goku', 355);
    cast(second, nearby, slot, false, () => reactions++);
    for (let frame = 0; frame < 180 && second.hits === 0; frame++) step(second, nearby);
    const burst = scene.children.find(object => object.name === 'special-impact');
    assert.ok(burst);
    step(second, nearby, 180);
    assert.ok(second.hits > 1);
    assert.equal(reactions, 1);
    assert.ok(!scene.children.includes(burst));
    assert.ok(burst.children.every(mesh => mesh.material.disposed && !mesh.geometry.disposed));
});

test('overlapping specials keep two scene lights and release their slots on reset', () => {
    const { api, scene, fighter, cast } = setup();
    api.prepareLighting(THREE, scene);
    api.prepareLighting(THREE, scene);
    const lights = scene.children.filter(child => child.name === 'special-move-light');
    assert.equal(lights.length, 2);
    const owner = fighter('goku', 300);
    const target = fighter('naruto', 1500);
    assert.equal(cast(owner, target, 0), true);
    assert.equal(cast(owner, target, 1), true);
    for (let frame = 0; frame < 45; frame++) api.update(1 / 60);
    assert.ok(lights.every(light => light.intensity > 0));
    api.reset();
    assert.deepEqual(scene.children, lights);
    assert.ok(lights.every(light => light.intensity === 0));
    owner.specialCooldowns[0] = 0;
    assert.equal(cast(owner, target, 0), true);
    for (let frame = 0; frame < 45; frame++) api.update(1 / 60);
    assert.ok(lights.some(light => light.intensity > 0));
    api.reset();
});

test('all 112 moves map to exactly the 56 roster IDs and preserve source names', () => {
    const { api, data, context } = setup();
    context.window.AnimeMaps = { arenas: {} };
    const script = fs.readFileSync(path.join(__dirname, '../../../javascript/script.js'), 'utf8');
    vm.runInContext(script.slice(0, script.indexOf('const selection =')) + '\nthis.roster = ROSTER;', context);
    assert.equal(context.roster.length, 56);
    assert.equal(Object.values(data).flat().length, 112);
    assert.deepEqual(Object.keys(data).sort(), Array.from(context.roster, character => character.id).sort());
    const source = fs.readFileSync(path.join(__dirname, '../moves-source.txt'), 'utf8');
    for (const character of context.roster) for (const [slot, direction] of ['neutral', 'side'].entries()) {
        assert.equal(character.moves[direction].name, data[character.id][slot].name);
        assert(source.includes(data[character.id][slot].name + ': '));
    }
    assert.equal(context.roster.find(c => c.id === 'naruto').moves.side.name, 'Rasenshuriken');
    assert.equal(context.roster.find(c => c.id === 'goku').moves.neutral.name, 'Kamehameha');
    assert(api);
});

test('each move casts, has a cooldown, produces finite transforms, applies gameplay and cleans up', () => {
    for (const [id, moves] of Object.entries(setup().data)) for (const [slot, move] of moves.entries()) {
        const { api, scene, fighter, step, cast } = setup();
        const owner = fighter(id, 300), target = fighter('goku', 355);
        assert(cast(owner, target, slot), `${id}/${slot} cast`);
        assert(!cast(owner, target, slot), `${id}/${slot} cooldown`);
        step(owner, target, 70);
        if (move.kind === 'heal') { assert(owner.damage < 40); assert(owner.specialStatus.buff > 0); }
        else if (move.kind === 'transform') { assert(owner.specialStatus.buff > 0); assert(owner.specialStatus.armor > 0); }
        else if (move.kind === 'guard') assert(owner.specialStatus.armor > 0);
        else assert(target.damage > 40, `${id}/${slot} ${move.kind} should hit close target`);
        step(owner, target, 500);
        assert.equal(scene.children.length, 0, `${id}/${slot} visual cleanup`);
        assert.equal(owner.specialStatus.buff, 0);
        assert.equal(owner.specialStatus.armor, 0);
        api.reset();
    }
});

test('CPU damage reduction applies to special attacks', () => {
    const damage = multiplier => {
        const { fighter, cast, step } = setup();
        const owner = fighter('goku', 300), target = fighter('hit', 355);
        owner.damageMultiplier = multiplier; cast(owner, target, 0); step(owner, target, 70);
        return target.damage - 40;
    };
    assert.ok(Math.abs(damage(0.8) - damage(1) * 0.8) < 0.0001);
    assert.ok(damage(1) > 0);
});

test('independent cooldowns, immunity, blocking, stun and healing clamps', () => {
    const { api, fighter, step, cast, scene } = setup();
    const owner = fighter('goku', 300), target = fighter('hit', 355);
    assert(cast(owner, target, 0)); assert(cast(owner, target, 1));
    step(owner, target, 310);
    assert.equal(owner.specialCooldowns[0], 0); assert(owner.specialCooldowns[1] > 0);
    api.reset(); assert.equal(scene.children.length, 0);
    const sakura = fighter('sakura', 300); sakura.damage = 3;
    assert(cast(sakura, target, 1)); step(sakura, target, 60); assert.equal(sakura.damage, 0);
    api.reset();
    const itachi = fighter('itachi', 300); target.invulnerable = 4;
    const previous = target.damage;
    assert(cast(itachi, target, 1)); step(itachi, target, 170); assert.equal(target.damage, previous);
    api.reset();
    itachi.specialCooldowns = [0, 0]; target.invulnerable = 0;
    assert(cast(itachi, target, 1, true)); step(itachi, target, 45); assert.equal(target.specialStatus.stun, 0);
    const blockedDamage = target.damage - previous;
    assert(blockedDamage > 0 && blockedDamage < 10);
    api.reset(); itachi.specialCooldowns = [0, 0]; target.invulnerable = 0;
    assert(cast(itachi, target, 1)); step(itachi, target, 45); assert(target.specialStatus.stun > 0);
    api.clearFighter(target); assert.equal(target.specialStatus.stun, 0); assert.equal(scene.children.length, 0);
});

test('a target can dodge a locked spell; projectiles do not hit behind the caster', () => {
    const { api, fighter, step, cast } = setup();
    const owner = fighter('kakashi', 300), target = fighter('goku', 355);
    cast(owner, target, 1); target.x = 800;
    step(owner, target, 200); assert.equal(target.damage, 40);
    api.reset(); owner.character.id = 'goku'; owner.specialCooldowns = [0, 0]; target.x = 100;
    cast(owner, target, 0); step(owner, target, 100); assert.equal(target.damage, 40);
});

test('game integration: G/C, Q/E, 2/3, numpad, CPU cooldowns and returning to selection', () => {
    const { api, context, scene } = setup();
    const handlers = {}, elements = new Map();
    context.window.addEventListener = (name, callback) => { handlers[name] = callback; };
    context.window.CharacterMotion = { create: () => new Group(), attack() {}, update() {} };
    context.THREE = THREE;
    context.requestAnimationFrame = () => 1;
    context.cancelAnimationFrame = () => {};
    context.performance = { now: () => 1000 };
    context.document = {
        addEventListener() {},
        getElementById(id) {
            if (!elements.has(id)) elements.set(id, { value: id.endsWith('stocks-select') ? '3' : 'normal', textContent: '', style: { setProperty() {} }, setAttribute() {}, classList: { add() {}, remove() {}, toggle() {} } });
            return elements.get(id);
        }
    };
    for (const file of ['assest/maps/maps.js', 'javascript/battle-rules.js', 'javascript/script.js'])
        vm.runInContext(fs.readFileSync(path.join(__dirname, '../../..', file), 'utf8'), context);
    context.testScene = scene;
    vm.runInContext(`
        battleScene = testScene;
        gameMode = '2p'; gameRunning = true;
        fighters = [makeFighter(ROSTER.find(c => c.id === 'naruto'), 0), makeFighter(ROSTER.find(c => c.id === 'goku'), 1)];
        fighters.forEach(f => { f.invulnerable = 0; f.x = f.playerIndex === 0 ? 300 : 355; f.y = 300; });
        this.testFighters = fighters;
    `, context);
    function press(code) { handlers.keydown({ code, repeat: false, preventDefault() {} }); handlers.keyup({ code }); }
    const [p1, p2] = context.testFighters;
    press('KeyQ'); assert.equal(p1.specialCooldowns[0], 5);
    press('KeyC'); assert.equal(p1.specialCooldowns[1], 16);
    press('Digit2'); assert.equal(p2.specialCooldowns[0], 5);
    press('Numpad3'); assert.equal(p2.specialCooldowns[1], 16);
    assert.equal(p1.attacks, 2); assert.equal(p2.attacks, 2);
    press('KeyG'); press('KeyE'); assert.equal(p1.attacks, 2);
    vm.runInContext(`for (let i=0;i<30;i++) {
        updateFighter(fighters[0],fighters[1],1/60);
        updateFighter(fighters[1],fighters[0],1/60);
        window.SpecialMoves.update(1/60);
    }`, context);
    assert(p1.specialCooldowns[0] < 5); assert(p2.specialCooldowns[1] < 16);
    vm.runInContext('gameMode = "cpu";', context);
    p2.specialCooldowns = [0, 0]; const before = p2.attacks;
    press('Digit2'); assert.equal(p2.attacks, before);
    context.returnToSelection(); assert.equal(scene.children.length, 0);
    api.reset();
});
