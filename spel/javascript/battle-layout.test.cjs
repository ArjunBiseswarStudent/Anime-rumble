const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../game.html'), 'utf8');

test('health inventory is inside the arena viewport and all IDs remain unique', () => {
    const stack = []; let found = false;
    for (const token of html.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
        const [tag, name] = token;
        if (tag.startsWith('</')) { if (stack[stack.length - 1]?.name === name) stack.pop(); continue; }
        if (/class="healing-inventory"/.test(tag)) {
            assert.ok(stack.some(parent => parent.tag.includes('class="battle-viewport"')));
            found = true;
        }
        if (!['meta','link','img','input','br','hr','path'].includes(name)) stack.push({ name, tag });
    }
    assert.ok(found);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
});

test('combat focus locks the page during battle and restores selection scrolling', () => {
    const root = new Set(), body = new Set(), options = { open: true };
    const element = set => ({ classList: { toggle(name, on) { if (on) set.add(name); else set.delete(name); } } });
    const app = { document: { documentElement: element(root), body: element(body), querySelector() { return options; } } };
    vm.createContext(app);
    vm.runInContext(source.slice(source.indexOf('function setBattleFocus('), source.indexOf('function startMatch(')), app);
    app.setBattleFocus(true); assert.ok(root.has('battle-active')); assert.ok(body.has('battle-active')); assert.equal(options.open, false);
    app.setBattleFocus(false); assert.equal(root.size, 0); assert.equal(body.size, 0);
});

test('resizing keeps the horizontal battlefield visible on phone and tablet displays', () => {
    for (const [width, height] of [[304,408],[374,640],[752,800],[828,220],[1350,680],[1904,992]]) {
        let resized;
        const app = { battleRenderer: { domElement: { clientWidth: width, clientHeight: height }, setSize(w,h) { resized = [w,h]; } },
            battleCamera: { updateProjectionMatrix() {} } };
        vm.createContext(app);
        vm.runInContext(source.slice(source.indexOf('function resizeBattleRenderer('), source.indexOf('function performThrow(')), app);
        app.resizeBattleRenderer();
        assert.deepEqual(resized, [width,height]);
        const camera = app.battleCamera;
        assert.ok(camera.fov > 0 && camera.fov < 160);
        const horizontal = Math.tan(camera.fov * Math.PI / 360) * camera.aspect;
        assert.ok(horizontal >= Math.tan(42 * Math.PI / 360) * 16 / 9 - .00001);
    }
});

test('the controls guide shows the actual bindings for the selected mode and can return to selection', () => {
    const elements = new Map();
    function element() {
        const classes = new Set();
        return {
            children: [], classList: classes, focus() { this.focused = true; },
            append(...children) { this.children.push(...children); },
            replaceChildren(...children) { this.children = children; }
        };
    }
    function getElementById(id) {
        if (!elements.has(id)) {
            const node = element();
            node.classList.remove = node.classList.delete.bind(node.classList);
            elements.set(id, node);
        }
        return elements.get(id);
    }
    const app = vm.createContext({
        gameMode: 'cpu', gameRunning: false, ARENAS: { dojo: { name: 'Anime Dojo' } },
        selection: ['Gojo', 'Sukuna'].map(name => ({ name, moves: { neutral: { name: name + ' 1' }, side: { name: name + ' 2' } } })),
        document: { createElement: element, getElementById }
    });
    vm.runInContext(source.slice(source.indexOf('const PLAYER_CONTROLS ='), source.indexOf('const portraitCanvases =')), app);
    vm.runInContext(source.slice(source.indexOf('function showControlsGuide('), source.indexOf('function startMatch(')), app);
    app.showControlsGuide();
    const table = getElementById('controls-bindings');
    assert.equal(app.gameRunning, false);
    assert.equal(getElementById('controls-player-two').hidden, true);
    assert.ok(getElementById('controls-title').focused);
    assert.equal(table.children.length, 12);
    assert.ok(table.children.every(row => row.children.length === 2));
    assert.deepEqual(table.children[5].children[1].children.map(node => node.textContent), ['G', 'Q', 'Gojo 1']);
    app.backFromControlsGuide();
    assert.ok(getElementById('controls-screen').classList.has('hidden'));
    assert.ok(getElementById('review-controls-btn').focused);
    app.gameMode = '2p';
    app.showControlsGuide();
    assert.equal(getElementById('controls-player-two').hidden, false);
    assert.ok(table.children.every(row => row.children.length === 3));
    assert.equal(table.children[7].children[2].children[0].textContent, '8');
});
