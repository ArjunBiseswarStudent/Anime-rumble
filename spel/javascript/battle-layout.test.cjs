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