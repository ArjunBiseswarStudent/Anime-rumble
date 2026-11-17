const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
class Vector { constructor() { this.set(0, 0, 0); } set(x, y, z) { Object.assign(this, { x, y, z }); } setScalar(v) { this.set(v, v, v); } }
class Group {
    constructor() { this.children = []; this.position = new Vector(); this.rotation = new Vector(); this.scale = new Vector(); this.userData = {}; }
    add(c) { this.children.push(c); } remove(c) { this.children = this.children.filter(x => x !== c); }
    traverse(fn) { fn(this); this.children.forEach(c => c.traverse(fn)); }
}
class Geometry { dispose() { this.disposed = true; } }
class Material { constructor(o) { Object.assign(this, o); } dispose() { this.disposed = true; } }
class Mesh extends Group { constructor(g, m) { super(); this.geometry = g; this.material = m; } }
const THREE = { Group, Mesh, MeshBasicMaterial: Material, MeshStandardMaterial: Material, SphereGeometry: Geometry, TorusGeometry: Geometry, BoxGeometry: Geometry, CylinderGeometry: Geometry, ConeGeometry: Geometry };
function setup() {
    const context = { window: { CharacterMotion: { attack() {} } } };
    vm.createContext(context);
    for (const file of ['combat-items-data.js', 'combat-items.js', 'combat-actions.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context);
    const api = context.window.CombatActions, scene = new Group();
    const fighter = (id, x) => ({ character: { id }, model: new Group(), x, y: 300, width: 34, height: 48, facing: 1, vx: 0, vy: 0, damage: 0, invulnerable: 0, attackCooldown: 0, attacks: 0, hits: 0 });
    function attack(owner, target, shield = false) { return api.attack({ THREE, scene, owner, target, isShielded: f => shield && f === target, onNotice() {} }); }
    function step(owner, target, seconds) {
        for (let i = 0; i < Math.ceil(seconds * 60); i++) {
            for (const f of [owner, target]) { f.invulnerable = Math.max(0, f.invulnerable - 1 / 60); f.attackCooldown = Math.max(0, f.attackCooldown - 1 / 60); }
            api.update(1 / 60);
            scene.traverse(o => { for (const v of [o.position, o.rotation, o.scale]) for (const n of Object.values(v)) assert(Number.isFinite(n)); });
        }
    }
    return { api, scene, fighter, attack, step, data: context.window.CombatItemData };
}
test('every listed weapon has a functional attack, finite effects and eventual cleanup', () => {
    for (const [id, items] of Object.entries(setup().data)) for (let slot = 0; slot < items.length; slot++) {
        const { api, scene, fighter, attack, step } = setup();
        const owner = fighter(id, 300), target = fighter('gojo', 355); owner.weaponIndex = slot;
        assert(attack(owner, target), id); assert(!attack(owner, target), 'cooldown prevents spam');
        step(owner, target, 1.5); assert(target.damage > 0, `${id}/${items[slot].type} should hit`); assert.equal(owner.hits, 1);
        assert.equal(scene.children.length, 0); api.reset();
    }
});
test('melee misses behind or outside reach; spear reaches further than fists', () => {
    const { fighter, attack, step, api } = setup();
    const owner = fighter('noelle', 300), target = fighter('gojo', 450);
    attack(owner, target); step(owner, target, 1); assert(target.damage > 0);
    target.damage = 0; target.x = 100; attack(owner, target); step(owner, target, 1); assert.equal(target.damage, 0);
    target.x = 700; attack(owner, target); step(owner, target, 1); assert.equal(target.damage, 0); api.reset();
});
test('kunai normal attack is melee, preventing an unlimited ranged-ammo bypass', () => {
    const { fighter, attack, step, api, scene } = setup();
    const owner = fighter('naruto', 100), target = fighter('gojo', 400);
    attack(owner, target); assert.equal(target.damage, 0); step(owner, target, 0.7); assert.equal(target.damage, 0);
    target.x = 150; attack(owner, target); step(owner, target, 0.7); assert.equal(target.damage, 7);
    target.x = 900; target.damage = 0; attack(owner, target); step(owner, target, 1.5); assert.equal(target.damage, 0);
    target.x = 400; target.invulnerable = 3; attack(owner, target); step(owner, target, 1.5); assert.equal(target.damage, 0);
    assert.equal(scene.children.length, 0); api.reset();
});
test('three attacks give a finisher; blocking reduces damage and prevents ice slow', () => {
    const { fighter, attack, step, api } = setup();
    const owner = fighter('tifa', 300), target = fighter('gojo', 350);
    for (let i = 0; i < 3; i++) { attack(owner, target); step(owner, target, 0.35); }
    assert.equal(owner.weaponCombo.step, 3); assert(Math.abs(target.damage - (6 + 6 + 8.1)) < 0.001);
    const icy = fighter('gray', 300), shielded = fighter('gojo', 350);
    attack(icy, shielded, true); step(icy, shielded, 0.6); assert.equal(shielded.damage, 2.5); assert(!shielded.weaponSlow);
    attack(icy, shielded); step(icy, shielded, 0.2); assert(shielded.weaponSlow > 0); api.reset();
});
test('switching equipment respects attack lock and stun; lifecycle removes active attacks', () => {
    const { fighter, attack, step, api, scene } = setup();
    const owner = fighter('sasuke', 300), target = fighter('gojo', 350);
    owner.model.userData.combatItems = [new Group(), new Group()];
    owner.model.userData.combatItems.forEach((w, i) => w.userData.loadoutIndex = i);
    assert(api.cycle(owner)); assert.equal(api.equipped(owner).type, 'kunai');
    assert.equal(owner.model.userData.combatItems[0].visible, false); assert.equal(owner.model.userData.combatItems[1].visible, true);
    attack(owner, target); assert(!api.cycle(owner)); step(owner, target, 0.1);
    api.clearFighter(owner); assert.equal(scene.children.length, 0);
    owner.attackCooldown = 0; owner.specialStatus = { stun: 1 }; assert(!api.cycle(owner)); assert(!attack(owner, target));
    api.reset(); assert.equal(scene.children.length, 0);
});
