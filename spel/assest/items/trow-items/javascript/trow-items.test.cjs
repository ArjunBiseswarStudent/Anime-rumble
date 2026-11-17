const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
class Vector { constructor() { this.set(0, 0, 0); } set(x, y, z) { Object.assign(this, { x, y, z }); } setScalar(n) { this.set(n, n, n); } }
class Group {
    constructor() { this.children = []; this.position = new Vector(); this.rotation = new Vector(); this.scale = new Vector(); this.userData = {}; }
    add(child) { if (child.parent) child.parent.remove(child); child.parent = this; this.children.push(child); }
    remove(child) { this.children = this.children.filter(c => c !== child); child.parent = null; }
    traverse(fn) { fn(this); this.children.forEach(c => c.traverse(fn)); }
}
class Geometry { dispose() { this.disposed = true; } }
class Material { constructor(o) { Object.assign(this, o); } clone() { return new Material(this); } dispose() { this.disposed = true; } }
class Mesh extends Group { constructor(g, m) { super(); this.geometry = g; this.material = m; } }
const THREE = { Group, Mesh, MeshStandardMaterial: Material, MeshBasicMaterial: Material };
for (const name of ['SphereGeometry', 'ConeGeometry', 'CylinderGeometry', 'TorusGeometry', 'BoxGeometry']) THREE[name] = Geometry;
function setup() {
    const context = { window: { CharacterMotion: { attack() {} } } }; vm.createContext(context);
    for (const file of ['trow-items-data.js', 'trow-items.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context);
    const api = context.window.TrowItems, data = context.window.TrowItemData, scene = new Group();
    function fighter(id, x = 300) { return { character: { id }, model: new Group(), x, y: 300, width: 34, height: 48, facing: 1, damage: 0, attacks: 0, hits: 0, invulnerable: 0, vx: 0, vy: 0 }; }
    function fire(owner, target, options = {}) { return api.fire({ THREE, scene, owner, target, isShielded: () => false, ...options }); }
    function step(owner, target, seconds) {
        for (let i = 0; i < Math.round(seconds * 100); i++) {
            api.tickFighter(owner, 0.01); api.tickFighter(target, 0.01);
            target.invulnerable = Math.max(0, target.invulnerable - 0.01);
            api.update(0.01);
            scene.traverse(o => { for (const v of [o.position, o.rotation, o.scale]) for (const n of Object.values(v)) assert(Number.isFinite(n)); });
        }
    }
    return { api, data, scene, fighter, fire, step, context };
}
test('exactly three uses, then ten seconds to refill all three; partial ammunition never refills', () => {
    const { api, fighter, fire, step } = setup(); const owner = fighter('naruto'), target = fighter('goku', 600);
    assert(fire(owner, target)); assert(!fire(owner, target)); assert.equal(owner.throwState.ammo, 2);
    step(owner, target, 12); assert.equal(owner.throwState.ammo, 2); assert.equal(owner.throwState.reload, 0);
    assert(fire(owner, target)); step(owner, target, 0.31); assert(fire(owner, target));
    assert.equal(owner.throwState.ammo, 0); assert.equal(owner.throwState.reload, 10); assert(!fire(owner, target));
    step(owner, target, 9.99); assert.equal(owner.throwState.ammo, 0); assert(!fire(owner, target));
    step(owner, target, 0.02); assert.equal(owner.throwState.ammo, 3); assert.equal(owner.throwState.reload, 0); assert(fire(owner, target)); api.reset();
});
test('all 33 character loadouts and every projectile type render, hit once and clean up', () => {
    for (const [id, items] of Object.entries(setup().data)) for (let index = 0; index < items.length; index++) {
        const { api, scene, fighter, fire, step } = setup(); const owner = fighter(id), target = fighter('goku', 440);
        api.prepare(owner).variant = index;
        assert(fire(owner, target), id); step(owner, target, 2.7);
        assert.equal(owner.hits, 1, `${id}/${items[index].type} hit count`);
        assert.equal(target.damage, items[index].damage); assert.equal(scene.children.length, 0); api.reset();
    }
});
test('JSON is the same as browser data and all IDs belong to the existing roster', () => {
    const { data, context } = setup();
    assert.equal(JSON.stringify(data), JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname, 'trow-items.json'), 'utf8'))));
    assert.equal(Object.keys(data).length, 33);
    const script = fs.readFileSync(path.join(__dirname, '../../../../javascript/script.js'), 'utf8');
    context.window.AnimeMaps = { arenas: {} }; context.window.SpecialMoves = { applyRoster() {} };
    vm.runInContext(script.slice(0, script.indexOf('const selection =')) + '\nthis.roster=ROSTER;', context);
    for (const id of Object.keys(data)) assert(context.roster.some(c => c.id === id), id);
});
test('blocking reduces damage and prevents slow; invulnerable targets and wrong directions miss', () => {
    const { api, fighter, fire, step } = setup(); const owner = fighter('gray'), target = fighter('goku', 440);
    fire(owner, target, { isShielded: f => f === target }); step(owner, target, 2.7);
    assert.equal(target.damage, 11 / 4); assert(!target.weaponSlow);
    target.damage = 0; target.invulnerable = 4; fire(owner, target); step(owner, target, 2.7); assert.equal(target.damage, 0);
    owner.facing = -1; target.invulnerable = 0; fire(owner, target); step(owner, target, 2.7); assert.equal(target.damage, 0); api.reset();
});
test('barrels bounce on real platforms and active projectiles cannot survive stock loss', () => {
    const { api, scene, fighter, fire, step } = setup(); const owner = fighter('dk'), target = fighter('goku', 1000);
    fire(owner, target, { platforms: [{ x: 0, y: 380, w: 960 }] });
    let previousY = 324, reachedFloor = false, bounced = false;
    for (let i = 0; i < 100 && scene.children.length; i++) {
        step(owner, target, 0.01);
        const y = 540 - (scene.children[0].position.y - 0.7) * 65;
        if (y > 350) reachedFloor = true;
        if (reachedFloor && y < previousY) bounced = true;
        previousY = y;
    }
    assert(bounced); const ammo = owner.throwState.ammo;
    api.clearFighter(owner); assert.equal(scene.children.length, 0); assert.equal(owner.throwState.ammo, ammo);
    api.reset();
});
test('unsupported characters, shields and stun never consume ammunition', () => {
    const { api, fighter, fire } = setup(); const owner = fighter('luffy'), target = fighter('goku');
    assert(!fire(owner, target)); assert.equal(owner.throwState.ammo, 3);
    owner.character.id = 'naruto'; owner.specialStatus = { stun: 1 }; assert(!fire(owner, target));
    owner.specialStatus.stun = 0; assert(!fire(owner, target, { isShielded: () => true })); assert.equal(owner.throwState.ammo, 3); api.reset();
});

test('game integration: X and 5/numpad5 consume independent ammo, ignore repeats and update HUD', () => {
    const { context, scene, api } = setup();
    const handlers = {}, elements = new Map();
    context.THREE = THREE;
    context.window.AnimeMaps = { arenas: {} };
    context.window.CharacterMotion = { create: () => new Group(), attack() {}, update() {} };
    context.window.addEventListener = (event, callback) => { handlers[event] = callback; };
    context.requestAnimationFrame = () => 1; context.cancelAnimationFrame = () => {};
    context.performance = { now: () => 1000 };
    context.document = { addEventListener() {}, getElementById(id) {
        if (!elements.has(id)) elements.set(id, { value: id === 'stocks-select' ? '3' : 'normal', textContent: '', classList: { add() {}, remove() {}, toggle() {} } });
        return elements.get(id);
    } };
    for (const file of ['moves-data.js', 'special-moves.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../../../special-moves/javascript', file), 'utf8'), context);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../../../../javascript/script.js'), 'utf8'), context);
    context.testScene = scene;
    vm.runInContext(`battleScene=testScene;gameMode='2p';gameRunning=true;
        fighters=[makeFighter(ROSTER.find(c=>c.id==='naruto'),0),makeFighter(ROSTER.find(c=>c.id==='goku'),1)];
        this.testFighters=fighters;`, context);
    const [p1, p2] = context.testFighters;
    function press(code, repeat = false) { handlers.keydown({ code, repeat, preventDefault() {} }); handlers.keyup({ code }); }
    press('KeyX'); assert.equal(p1.throwState.ammo, 2);
    press('KeyX', true); assert.equal(p1.throwState.ammo, 2);
    press('Digit5'); assert.equal(p2.throwState.ammo, 2);
    api.tickFighter(p2, 0.31); press('Numpad5'); assert.equal(p2.throwState.ammo, 1);
    assert.equal(p1.throwState.ammo, 2);
    context.updateBattleHud(); assert(elements.get('p1-throw-ammo').textContent.includes('2/3')); assert(elements.get('p2-throw-ammo').textContent.includes('1/3'));
    vm.runInContext('gameMode="cpu";', context);
    api.tickFighter(p2, 0.31); press('Digit5'); assert.equal(p2.throwState.ammo, 1);
    context.returnToSelection(); assert.equal(scene.children.length, 0);
});
