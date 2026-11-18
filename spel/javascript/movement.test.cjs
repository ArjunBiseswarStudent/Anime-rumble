const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const rules = require('./battle-rules.js');
const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
function setup() {
    const app = { window: { BattleRules: rules, CharacterMotion: { update() {} },
        SpecialMoves: { applyRoster() {}, tickFighter(f) { f.specialStatus ||= { stun: 0, buff: 0, dash: 0 }; } } },
        document: { addEventListener() {}, getElementById() { return { value: 'normal' }; } },
        gameMode: '2p', pressedKeys: new Set(), jumpRequests: [false, false], performance: { now: () => 0 } };
    vm.createContext(app);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../assest/maps/maps.js'), 'utf8'), app);
    vm.runInContext(source.slice(0, source.indexOf('const selection =')) + '\nthis.roster = ROSTER;', app);
    vm.runInContext(source.slice(source.indexOf('const PLAYER_CONTROLS ='), source.indexOf('const portraitCanvases =')), app);
    vm.runInContext(source.slice(source.indexOf('function updateFighter('), source.indexOf('function drawBattle(')), app);
    const fighter = (character, x, feet) => ({ character, playerIndex: 0, x, y: feet - (character.scaleH || 48), width: character.scaleW || 34, height: character.scaleH || 48, vx: 0, vy: 0,
        grounded: true, coyoteTime: 0, jumpBuffer: 0, dropThroughTimer: 0, attackCooldown: 0, invulnerable: 0,
        model: { position: { set() {} }, userData: {} } });
    function step(f, dt, jump = false, move = 0) {
        app.jumpRequests[0] = jump; app.pressedKeys.clear();
        if (move) app.pressedKeys.add(move > 0 ? 'KeyD' : 'KeyA');
        app.updateFighter(f, f, dt); app.jumpRequests[0] = false;
    }
    return { app, fighter, step, arenas: app.window.AnimeMaps.arenas };
}

test('all 56 characters can reach every platform in all nine arenas at 30 and 60 FPS', () => {
    const { app, fighter, step, arenas } = setup();
    for (const dt of [1 / 60, 1 / 30]) for (const character of app.roster) for (const [key, arena] of Object.entries(arenas)) {
        app.currentArena = arena;
        const reached = new Set([arena.platforms.findIndex(p => p.main)]);
        function canReach(from, to) {
            for (const center of [to.x + to.w / 2, to.x + 20, to.x + to.w - 20]) {
                for (const jump of to.y > from.y ? [false, true] : [true]) {
                    const initialCenter = Math.max(from.x + 8, Math.min(center, from.x + from.w - 8));
                    const f = fighter(character, initialCenter - (character.scaleW || 34) / 2, from.y);
                    let airborne = false;
                    for (let frame = 0; frame < 3.5 / dt; frame++) {
                        const delta = center - f.x - f.width / 2;
                        step(f, dt, jump && frame === 0, Math.abs(delta) > 8 ? Math.sign(delta) : 0);
                        if (!f.grounded) airborne = true;
                        if (airborne && f.grounded) {
                            if (Math.abs(f.y + f.height - to.y) < .001 && f.x + f.width > to.x && f.x < to.x + to.w) return true;
                            break;
                        }
                        if (f.y > 630) break;
                    }
                }
            }
            return false;
        }
        let progress = true;
        while (progress) {
            progress = false;
            for (const from of [...reached]) for (let to = 0; to < arena.platforms.length; to++) {
                if (!reached.has(to) && canReach(arena.platforms[from], arena.platforms[to])) { reached.add(to); progress = true; }
            }
        }
        assert.equal(reached.size, arena.platforms.length, character.name + ' / ' + key + ' / ' + Math.round(1 / dt) + ' FPS; reached=' + [...reached].join(','));
    }
});

test('low-frame-rate jumps still reach a platform 185 pixels higher', () => {
    const { app, fighter, step } = setup();
    app.currentArena = { platforms: [{ x: 100, y: 425, w: 700 }, { x: 400, y: 240, w: 150 }] };
    const f = fighter({ jump: 11, speed: 4.5 }, 450, 425);
    let landed = false;
    for (let frame = 0; frame < 100; frame++) { step(f, .04, frame === 0); if (f.grounded && f.y + f.height === 240) { landed = true; break; } }
    assert.ok(landed);
});

test('a jump pressed just before landing triggers after touching the platform', () => {
    const { app, fighter, step } = setup();
    app.currentArena = { platforms: [{ x: 100, y: 430, w: 700 }] };
    const f = fighter({ jump: 12, speed: 5 }, 300, 429); f.grounded = false; f.vy = 4;
    step(f, 1 / 60, true); assert.ok(f.grounded);
    step(f, 1 / 60); assert.ok(f.vy < -20); assert.equal(f.grounded, false);
});

test('brief edge forgiveness works without enabling double jumps', () => {
    const { app, fighter, step } = setup(); app.currentArena = { platforms: [] };
    const f = fighter({ jump: 12, speed: 5 }, 300, 430);
    step(f, 1 / 60); step(f, 1 / 60, true); assert.ok(f.vy < -20);
    step(f, .04); const ascendingSpeed = f.vy;
    step(f, 1 / 60, true); assert.ok(f.vy > ascendingSpeed, 'airborne press must not restart the jump');
});

test('landing resolves the highest crossed platform regardless of definition order', () => {
    const { app, fighter, step } = setup();
    app.currentArena = { platforms: [{ x: 100, y: 430, w: 700 }, { x: 100, y: 315, w: 700 }] };
    const f = fighter({ jump: 12, speed: 5 }, 300, 300); f.grounded = false; f.vy = 200;
    step(f, .04); assert.equal(f.y + f.height, 315); assert.ok(f.grounded);
});

test('holding shield or being stunned still prevents jumping', () => {
    const { app, fighter } = setup(); app.currentArena = { platforms: [{ x: 100, y: 430, w: 700 }] };
    const f = fighter({ jump: 12, speed: 5 }, 300, 430);
    app.pressedKeys.add('KeyS'); app.jumpRequests[0] = true; app.updateFighter(f, f, 1 / 60); assert.equal(f.vy, 0);
    app.pressedKeys.clear(); f.specialStatus.stun = .5; app.updateFighter(f, f, 1 / 60); assert.equal(f.vy, 0);
});

test('CPU uses the same improved jump strength as human players', () => {
    const { app, fighter } = setup();
    app.currentArena = { platforms: [{ x: 100, y: 430, w: 700 }] };
    app.gameMode = 'cpu'; app.Math = Object.create(Math); app.Math.random = () => 0;
    const f = fighter({ jump: 12, speed: 5 }, 300, 430);
    f.playerIndex = 1; f.attackCooldown = 1; f.specialCooldowns = [1, 1];
    app.updateFighter(f, f, 1 / 60);
    assert.ok(f.vy < -22); assert.equal(f.grounded, false);
});
