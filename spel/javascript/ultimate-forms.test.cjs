const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const read = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
const script = read('script.js');
const context = vm.createContext({
    window: { AnimeMaps: { arenas: {} }, SpecialMoves: { applyRoster() {} } }
});
vm.runInContext(script.slice(0, script.indexOf('const selection =')) + '\nthis.roster = ROSTER;', context);
vm.runInContext(read('ultimate-forms.js'), context);
const api = context.window.UltimateForms;

class Group {
    children = [];
    position = { set() {} };
    rotation = {};
    scale = { set() {}, setScalar() {} };
    add(child) { this.children.push(child); }
    remove(child) { this.children = this.children.filter(item => item !== child); }
    traverse(visit) { visit(this); this.children.forEach(child => child.traverse(visit)); }
}
class Resource { dispose() { this.disposed = true; } }
class Mesh extends Group {
    constructor(geometry, material) { super(); Object.assign(this, { geometry, material }); }
}
class BufferGeometry extends Resource {
    setAttribute() {}
    setIndex() {}
}
class BufferAttribute {
    constructor(array) { this.array = array; }
    setUsage() {}
    setXYZ(index, x, y, z) { this.array.set([x, y, z], index * 3); }
}
const THREE = {
    Group, Mesh, BufferGeometry, BufferAttribute, PointLight: Group, MeshBasicMaterial: Resource, MeshStandardMaterial: Resource,
    SphereGeometry: Resource, ConeGeometry: Resource, TorusGeometry: Resource
};

test('every roster entry can transform once per life and restore its existing rig and materials', () => {
    assert.deepEqual(Object.keys(api.forms).sort(), Array.from(context.roster, character => character.id).sort());
    for (const character of context.roster) {
        const model = new Group(), fighter = { model, character, stocks: 3, damage: 19 };
        const palette = {};
        for (const [part, property] of [['suit', 'primary'], ['accent', 'secondary'], ['hair', 'hair'], ['skin', 'skin']]) {
            palette[part] = { color: { value: character[property], set(value) { this.value = value; } } };
        }
        model.userData = { palette };
        assert.equal(api.activate(THREE, fighter), api.forms[character.id][0]);
        assert.equal(api.activate(THREE, fighter), undefined);
        assert.equal(palette.suit.color.value, character.primary);
        assert.equal(fighter.ultimateForm.eruption.visible, false);
        api.update(fighter, .5);
        assert.equal(palette.suit.color.value, api.forms[character.id][2]);
        assert.equal(fighter.ultimateForm.eruption.visible, true);
        const { ribbons, energyLight } = fighter.ultimateForm;
        const burstIntensity = energyLight.intensity;
        const firstRibbon = ribbons[0].array.slice();
        assert.ok(firstRibbon.every(Number.isFinite));
        api.update(fighter, .5);
        assert.equal(fighter.ultimateForm.eruption.visible, false);
        assert.ok(energyLight.intensity < burstIntensity);
        assert.notDeepEqual(ribbons[0].array, firstRibbon);
        assert.equal(fighter.damage, 19);
        assert.equal(fighter.model, model);
        const [visual] = model.children;
        api.clear(fighter);
        assert.equal(model.children.length, 0);
        assert.equal(palette.suit.color.value, character.primary);
        assert.equal(palette.accent.color.value, character.secondary);
        assert.equal(palette.hair.color.value, character.hair);
        assert.equal(palette.skin.color.value, character.skin);
        visual.traverse(mesh => {
            if (mesh.geometry) assert.ok(mesh.geometry.disposed);
            if (mesh.material && !Object.values(palette).includes(mesh.material)) assert.ok(mesh.material.disposed);
        });
        assert.ok(api.activate(THREE, fighter));
        api.clear(fighter);
        fighter.stocks = 0;
        assert.equal(api.activate(THREE, fighter), undefined);
    }
    assert.equal(api.forms.goku[0], 'Ultra Instinct');
    assert.equal(api.forms.naruto[0], 'Six Paths Sage Mode');
});
