const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
class Vector { constructor() { this.set(0, 0, 0); } set(x, y, z) { Object.assign(this, { x, y, z }); } setScalar(v) { this.set(v, v, v); } copy({ x, y, z }) { this.set(x, y, z); } }
class Group {
    constructor() { this.children = []; this.userData = {}; this.position = new Vector(); this.rotation = new Vector(); this.scale = new Vector(); }
    add(child) { child.parent?.remove(child); child.parent = this; this.children.push(child); }
    remove(child) { this.children = this.children.filter(c => c !== child); child.parent = null; }
    traverse(fn) { fn(this); this.children.forEach(child => child.traverse(fn)); }
}
function setup(index = 0, arenaKey) {
    const resources = [];
    class Geometry { constructor() { resources.push(this); } dispose() { this.disposed = true; } }
    class Material { constructor(options) { Object.assign(this, options); resources.push(this); } dispose() { this.disposed = true; } }
    class Mesh extends Group { constructor(geometry, material) { super(); Object.assign(this, { geometry, material }); } }
    class Shape { moveTo() {} quadraticCurveTo() {} lineTo() {} closePath() {} }
    const THREE = { Group, Mesh, Shape, MeshStandardMaterial: Material, MeshBasicMaterial: Material, MeshPhysicalMaterial: Material };
    for (const name of ['SphereGeometry', 'CylinderGeometry', 'TorusGeometry', 'BoxGeometry', 'ExtrudeGeometry', 'CircleGeometry']) THREE[name] = Geometry;
    const context = { window: {}, document: {}, console }; vm.createContext(context);
    for (const file of ['healing-models.js', 'supply-plane.js', 'healing-items-data.js', 'healing-items.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context);
    const api = context.window.HealingItems, scene = new Group(), notices = [];
    const casts = [];
    context.window.Shenron = { create(three, summoner) {
        assert.equal(three, THREE);
        assert.equal(summoner.name, 'Goku');
        const visual = new Group();
        visual.name = 'beerus-shenron';
        return { visual, update() {}, release(age) { casts.push(age); return { x: .35, y: 6.4, z: -2 }; } };
    } };
    if (arenaKey === 'frog') scene.userData.gamakichi = { userData: {
        cast(time) { casts.push(time); return { x: -4.4, y: 2.2, z: -3.1 }; }
    } };
    const fighters = [0, 1].map(playerIndex => ({ playerIndex, character: { name: 'Speler ' + playerIndex }, x: 333, y: 352, width: 34, height: 48, stocks: 3, damage: 75 }));
    let randomStep = 0;
    function init(platforms = [{ x: 200, y: 400, w: 300 }]) {
        randomStep = 0;
        api.init({ THREE, scene, platforms, fighters, arenaKey, createSummoner: () => ({ name: 'Goku' }),
            random: () => [index / 11 + 0.00001, 0, .5][randomStep++ % 3], onNotice: text => notices.push(text) });
    }
    init();
    const pickups = () => scene.children.filter(child => child.name?.startsWith('healing-pickup-'));
    return { api, scene, fighters, notices, resources, pickups, init, context, casts };
}

test('all eleven requested items have exact healing values, unique IDs and existing illustrations', () => {
    const { api, context } = setup();
    assert.equal(JSON.stringify(context.window.HealingItemData), JSON.stringify(require('./healing-items.json')));
    assert.equal(api.items.length, 11); assert.equal(new Set(api.items.map(i => i.id)).size, 11);
    assert.deepEqual(Array.from(api.items, i => i.heal), [15,20,35,45,60,20,30,40,50,65,100]);
    for (const item of api.items) assert.ok(fs.existsSync(path.join(__dirname, '../img', item.file)), item.file);
});

test('first spawn is exactly 10s, subsequent spawns every 10s, with no backlog burst', () => {
    const { api, pickups } = setup();
    api.update(.016, 9.999); assert.equal(pickups().length, 0);
    api.update(.016, 10); assert.equal(pickups().length, 1);
    api.update(.016, 19.999); assert.equal(pickups().length, 1);
    api.update(.016, 20); assert.equal(pickups().length, 2);
    api.update(.016, 20); assert.equal(pickups().length, 2);
    api.update(.016, 30); assert.equal(pickups().length, 2);
    api.update(.016, 130); assert.equal(pickups().length, 1);
    api.update(.016, 180); assert.equal(pickups().length, 0);
});

test('every item builds, animates, can be picked up, heals its stated amount, and disposes all resources', () => {
    for (let index = 0; index < 11; index++) {
        const { api, scene, fighters, pickups, resources } = setup(index), fighter = fighters[0];
        api.update(.016, 25); assert.equal(pickups().length, 1);
        api.update(.016, 25.2);
        scene.traverse(part => { for (const vector of [part.position, part.rotation, part.scale]) assert.ok(Object.values(vector).every(Number.isFinite)); });
        assert.equal(api.pickup(fighter), true); assert.equal(pickups().length, 0);
        assert.equal(fighter.healingItem.id, api.items[index].id);
        assert.equal(api.use(fighter), true);
        assert.equal(fighter.damage, Math.max(0, 75 - api.items[index].heal));
        assert.equal(fighter.healthRestored, Math.min(75, api.items[index].heal));
        assert.equal(fighter.healingItem, null);
        api.update(.6, 26); api.update(.6, 27); api.reset();
        assert.equal(scene.children.length, 0);
        assert.ok(resources.every(resource => resource.disposed), api.items[index].name + ': resources must be released');
    }
});

test('pickup needs proximity and is exclusive; a full inventory cannot overwrite or steal another drop', () => {
    const { api, fighters, pickups } = setup(), [a, b] = fighters;
    api.update(0, 25); a.x = 0; assert.equal(api.pickup(a), false);
    a.x = 333; assert.equal(api.pickup(a), true); assert.equal(api.pickup(b), false);
    api.update(0, 50); assert.equal(api.pickup(a), false); assert.equal(pickups().length, 1);
    assert.equal(api.pickup(b), true); assert.ok(a.healingItem && b.healingItem);
});

test('full health preserves the item, healing never exceeds 100%, and dead fighters cannot heal or pick up', () => {
    const { api, fighters } = setup(10), fighter = fighters[0];
    api.update(0, 25); api.pickup(fighter);
    fighter.damage = 0; assert.equal(api.use(fighter), false); assert.ok(fighter.healingItem);
    fighter.damage = 100; assert.equal(api.use(fighter), false);
    fighter.damage = 45; assert.equal(api.use(fighter), true); assert.equal(fighter.damage, 0);
    api.update(0, 50); fighter.stocks = 0; assert.equal(api.pickup(fighter), false);
});

test('death, expiry and replay clean up inventory and visuals and restart the timer', () => {
    const { api, fighters, pickups, scene, init } = setup(), fighter = fighters[0];
    api.update(0, 25); api.pickup(fighter); api.clearFighter(fighter); assert.equal(fighter.healingItem, null);
    api.update(0, 50); api.update(0, 85); assert.ok(pickups().length <= 1);
    api.reset(); assert.equal(scene.children.length, 0);
    init(); api.update(0, 9.9); assert.equal(pickups().length, 0);
    api.update(0, 25); assert.equal(pickups().length, 1);
});

test('CPU can only collect nearby items while injured and uses its own inventory', () => {
    const { api, fighters, pickups } = setup(), cpu = fighters[1];
    api.update(0, 25); cpu.damage = 0; api.controlCPU(cpu); assert.equal(pickups().length, 1);
    cpu.damage = 40; cpu.x = 0; api.controlCPU(cpu); assert.equal(cpu.damage, 40);
    cpu.x = 333; api.controlCPU(cpu); assert.equal(cpu.damage, 25); assert.equal(cpu.healingItem, null);
    assert.equal(fighters[0].damage, 75);
});

test('keyboard/touch input routes R/T and 6/7 independently and blocks CPU manual input', () => {
    const source = fs.readFileSync(path.join(__dirname, '../../../../javascript/script.js'), 'utf8');
    const calls = [], app = { window: { HealingItems: { pickup: f => calls.push(['pickup', f.playerIndex]), use: f => calls.push(['use', f.playerIndex]) } },
        gameRunning: true, gameMode: '2p', fighters: [{playerIndex:0},{playerIndex:1}], pressedKeys: new Set(), inputSources: new Map(), jumpRequests: [], performThrow() {}, performAttack() {} };
    vm.createContext(app);
    vm.runInContext(source.slice(source.indexOf('const PLAYER_CONTROLS ='), source.indexOf('const portraitCanvases =')), app);
    vm.runInContext(source.slice(source.indexOf('function normalizeGameKey('), source.indexOf("window.addEventListener('keydown'")), app);
    for (const key of ['KeyR','KeyT','Digit6','Numpad7']) app.pressGameInput(key, key);
    assert.equal(JSON.stringify(calls), JSON.stringify([['pickup',0],['use',0],['pickup',1],['use',1]]));
    app.gameMode = 'cpu'; app.releaseGameInput('Digit6'); app.pressGameInput('Digit6', 'cpu'); assert.equal(calls.length, 4);
});

test('only the four requested maps receive aircraft every 15 seconds instead of normal 10-second spawns', () => {
    for (const key of ['dojo', 'castle', 'island', 'neon']) {
        const { api, scene, pickups } = setup(0, key);
        api.update(0, 10); assert.equal(scene.children.length, 0, key);
        api.update(0, 14.999); assert.equal(scene.children.length, 0);
        api.update(0, 15); assert.equal(scene.children.filter(o => o.name === 'anime-supply-plane').length, 1);
        assert.equal(pickups().length, 0, 'Aircraft arrives before the parcel drops');
        api.update(0, 18); assert.equal(pickups().length, 1);
        api.update(0, 18); assert.equal(pickups().length, 1, 'Release happens once per flight');
        api.update(0, 22); assert.equal(scene.children.filter(o => o.name === 'anime-supply-plane').length, 0);
        api.update(0, 29.999); assert.equal(scene.children.filter(o => o.name === 'anime-supply-plane').length, 0);
        api.update(0, 30); assert.equal(scene.children.filter(o => o.name === 'anime-supply-plane').length, 1);
        api.reset();
    }
    for (const key of ['namek', 'arlong', 'kurukshetra']) {
        const { api, pickups, scene } = setup(0, key);
        api.update(0, 10); assert.equal(pickups().length, 1);
        assert.equal(scene.children.filter(o => o.name === 'anime-supply-plane').length, 0);
    }
});

test('Beerus Palace summons Shenron once and drops items at 15-second intervals', () => {
    const { api, scene, pickups, fighters, casts, init } = setup(0, 'beerus');
    api.update(0, 11.99);
    assert.equal(scene.children.length, 0);
    api.update(0, 12);
    assert.equal(scene.children[0].name, 'beerus-shenron');
    api.update(0, 14.99);
    assert.equal(pickups().length, 0);
    api.update(0, 15);
    assert.equal(pickups().length, 1);
    assert.equal(api.pickup(fighters[0]), false);
    api.update(0, 17);
    assert.equal(api.pickup(fighters[0]), true);
    api.update(0, 30);
    api.update(0, 30);
    assert.equal(scene.children.filter(child => child.name === 'beerus-shenron').length, 1);
    assert.deepEqual(casts, [3, 18]);
    assert.equal(pickups().length, 1);
    api.reset();
    assert.equal(scene.children.length, 0);
    init();
    api.update(0, 11.99);
    assert.equal(scene.children.length, 0);
});

test('Frog Island casts every 20 seconds and makes its platform drops collectible after landing', () => {
    const { api, fighters, pickups, resources, init, casts } = setup(0, 'frog');
    const platforms = [{ x: 200, y: 400, w: 300 }, { x: 560, y: 320, w: 200 }];
    init(platforms);
    api.update(0, 19.99);
    assert.equal(pickups().length, 0);
    api.update(0, 20);
    api.update(0, 20);
    const [first, second] = pickups();
    assert.deepEqual(casts, [20]);
    assert.deepEqual(first.position, second.position);
    assert.ok(first.position.z < 0);
    api.update(0, 20.4);
    assert.equal(api.pickup(fighters[0]), false);
    api.update(0, 21);
    assert.equal(first.position.z, 0);
    assert.equal(second.position.z, 0);
    assert.ok(second.position.y > first.position.y);
    const splash = second.children.find(child => child.children.length === 22);
    assert.ok(splash.children.some(blob => blob.visible));
    assert.equal(api.pickup(fighters[0]), true);
    api.update(0, 21.4);
    assert.ok(!second.children.includes(splash));
    api.update(0, 40);
    assert.deepEqual(casts, [20, 40]);
    assert.equal(pickups().length, 2);
    api.reset();
    assert.ok(resources.every(resource => resource.disposed));
    init(platforms);
    api.update(0, 19.99);
    assert.equal(pickups().length, 0);
});

test('all eleven airdropped items descend, land and become collectible only after landing', () => {
    for (let index = 0; index < 11; index++) {
        const { api, fighters, pickups, resources, scene } = setup(index, 'dojo');
        api.update(0, 15); api.update(0, 18);
        const parcel = pickups()[0], startY = parcel.position.y, resourceCount = resources.length;
        assert.ok(parcel.children.some(o => o.name === 'health-supply-parachute'));
        assert.equal(api.pickup(fighters[0]), false);
        for (const t of [18.1, 18.8, 19.5, 20.5]) api.update(.016, t);
        assert.ok(parcel.position.y < startY);
        scene.traverse(part => { for (const vector of [part.position, part.rotation, part.scale]) assert.ok(Object.values(vector).every(Number.isFinite)); });
        assert.equal(resources.length, resourceCount, 'Animation never allocates geometry/materials');
        api.update(.016, 21.5);
        assert.equal(parcel.children.some(o => o.name === 'health-supply-parachute'), false);
        assert.equal(api.pickup(fighters[0]), true);
        assert.equal(fighters[0].healingItem.id, api.items[index].id);
        api.reset(); assert.ok(resources.every(r => r.disposed));
    }
});

test('parachutes land on the highest platform below the release point instead of passing through it', () => {
    const { api, init, fighters } = setup(0, 'island');
    init([{ x: 200, y: 430, w: 400 }, { x: 300, y: 300, w: 200 }]);
    fighters[0].x = 383; fighters[0].y = 252;
    api.update(0, 15); api.update(0, 18); api.update(0, 21.5);
    assert.equal(api.pickup(fighters[0]), true);
});

test('round reset cleans aircraft and parachutes, and restarts the 15-second timer', () => {
    for (const elapsed of [15, 18, 20]) {
        const { api, scene, resources, init } = setup(0, 'neon');
        api.update(0, 15); if (elapsed > 15) api.update(0, elapsed);
        api.reset(); assert.equal(scene.children.length, 0); assert.ok(resources.every(r => r.disposed));
        init(); api.update(0, 14.9); assert.equal(scene.children.length, 0);
        api.update(0, 15); assert.ok(scene.children.some(o => o.name === 'anime-supply-plane'));
        api.update(0, 180); assert.equal(scene.children.filter(o => o.name === 'anime-supply-plane').length, 0);
    }
});
