window.HealingItems = (() => {
    const base = document.currentScript?.src ? new URL('img/', document.currentScript.src).href : 'assest/items/healing-items/img/';
    const items = Object.freeze([
        ['soldier-pill', 'Naruto', 'Soldier Pill', 15, '01_soldier_pill.png', 'pill'],
        ['rice-ball', 'Naruto', 'Ninja Rice Ball', 20, '02_ninja_rice_ball.png', 'rice'],
        ['chakra-scroll', 'Naruto', 'Medical Chakra Scroll', 35, '03_medical_chakra_scroll.png', 'scroll'],
        ['ramen', 'Naruto', 'Ichiraku Ramen', 45, '04_ichiraku_ramen.png', 'ramen'],
        ['katsuyu', 'Naruto', 'Katsuyu Healing Summon', 60, '05_katsuyu.png', 'slug'],
        ['chopper-medicine', 'One Piece', "Chopper's Medicine", 20, '07_rumble_ball.png', 'medicine'],
        ['bento', 'One Piece', "Sanji's Bento", 30, '09_sanjis_bento.png', 'bento'],
        ['meat', 'One Piece', 'Pirate Meat', 40, '06_pirate_meat.png', 'meat'],
        ['recovery-potion', 'One Piece', 'Grand Line Recovery Potion', 50, '08_miracle_drug.png', 'potion'],
        ['hormones', 'One Piece', "Ivankov's Healing Hormones", 65, '10_ivankov_hormones.png', 'hormones'],
        ['senzu', 'Dragon Ball', 'Senzu Bean', 100, '11_senzu_bean.png', 'bean']
    ].map(([id, series, name, heal, file, kind]) => Object.freeze({ id, series, name, heal, file, kind, image: base + file })));
    const INTERVAL = 10, LIFETIME = 35, MAX_DROPS = 2;
    let state = null, drops = [], effects = [], nextSpawn = INTERVAL;
    function dispose(root) {
        if (!root) return;
        root.parent?.remove(root);
        const geometries = new Set(), materials = new Set();
        root.traverse(part => { if (part.geometry) geometries.add(part.geometry); if (part.material) materials.add(part.material); });
        geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
    }
    function clearFighter(fighter) {
        fighter.healingItem = null;
        effects = effects.filter(effect => { if (effect.owner !== fighter) return true; dispose(effect.visual); return false; });
    }
    function reset() {
        drops.forEach(drop => dispose(drop.visual)); effects.forEach(effect => dispose(effect.visual));
        if (state) state.fighters.forEach(fighter => { fighter.healingItem = null; });
        drops = []; effects = []; state = null; nextSpawn = INTERVAL;
    }
    function init(options) { reset(); state = { random: Math.random, onNotice() {}, ...options }; }
    function randomIndex(length) { return Math.min(length - 1, Math.max(0, Math.floor(state.random() * length))); }
    function spawn(elapsed) {
        const platforms = state.platforms.filter(p => p.w >= 70);
        if (!platforms.length) return;
        while (drops.length >= MAX_DROPS) dispose(drops.shift().visual);
        const item = items[randomIndex(items.length)], platform = platforms[randomIndex(platforms.length)];
        const x = platform.x + 25 + Math.max(0, platform.w - 50) * Math.max(0, Math.min(1, state.random()));
        const { THREE, scene } = state;
        const visual = new THREE.Group(), model = window.HealingModels.create(THREE, item);
        visual.name = 'healing-pickup-' + item.id; visual.add(model);
        const halo = new THREE.Mesh(new THREE.TorusGeometry(.48, .018, 8, 40), new THREE.MeshStandardMaterial({ color: '#8effb6', emissive: '#42d982', emissiveIntensity: .9, roughness: .4 }));
        halo.rotation.x = -Math.PI / 2; halo.position.y = -.35; visual.add(halo);
        visual.position.set((x - 480) / 65, (540 - platform.y) / 65 + .65, 0);
        scene.add(visual); drops.push({ item, x, y: platform.y - 25, visual, model, halo, born: elapsed, baseY: visual.position.y });
        state.onNotice(`${item.name} (+${item.heal} HP) is verschenen. P1: R ophalen · P2: 6 ophalen.`);
    }
    function available(fighter) { return fighter.stocks > 0 && fighter.damage < 100; }
    function nearby(fighter) {
        if (!state || !available(fighter)) return null;
        const x = fighter.x + fighter.width / 2, y = fighter.y + fighter.height / 2;
        let nearest = null, best = Infinity;
        for (const drop of drops) {
            const dx = Math.abs(drop.x - x), dy = Math.abs(drop.y - y), distance = dx + dy;
            if (dx <= 72 && dy <= 55 && distance < best) { nearest = drop; best = distance; }
        }
        return nearest;
    }
    function pickup(fighter) {
        if (!state || !available(fighter)) return false;
        if (fighter.healingItem) { state.onNotice('Je draagt al een health-item. Gebruik dit eerst.'); return false; }
        const drop = nearby(fighter);
        if (!drop) { state.onNotice('Ga dichter bij een health-item staan om het op te pakken.'); return false; }
        fighter.healingItem = drop.item; drops.splice(drops.indexOf(drop), 1); dispose(drop.visual);
        state.onNotice(`${fighter.character.name} pakt ${drop.item.name} op. Gebruik: ${fighter.playerIndex === 0 ? 'T' : '7'}.`);
        return true;
    }
    function healingEffect(fighter, restored) {
        const { THREE, scene } = state, visual = new THREE.Group();
        for (let i = 0; i < 12; i++) {
            const part = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), new THREE.MeshBasicMaterial({ color: '#9bffc5', transparent: true, opacity: .9, depthWrite: false }));
            visual.add(part);
        }
        const ring = new THREE.Mesh(new THREE.TorusGeometry(.6, .025, 8, 32), new THREE.MeshBasicMaterial({ color: '#5bff9f', transparent: true, opacity: .75, depthWrite: false }));
        ring.rotation.x = Math.PI / 2; visual.add(ring); scene.add(visual);
        effects.push({ owner: fighter, visual, ring, age: 0 });
        state.onNotice(`${fighter.character.name}: ${fighter.healingItem.name} herstelt ${Math.round(restored * 10) / 10} HP.`);
    }
    function use(fighter) {
        if (!state || !available(fighter) || !fighter.healingItem) return false;
        if (fighter.damage <= 0) { state.onNotice('Je gezondheid is al 100%. Je behoudt het item.'); return false; }
        const before = fighter.damage;
        fighter.damage = Math.max(0, fighter.damage - fighter.healingItem.heal);
        fighter.healthRestored = (fighter.healthRestored || 0) + before - fighter.damage;
        healingEffect(fighter, before - fighter.damage); fighter.healingItem = null;
        return true;
    }
    function update(dt, elapsed) {
        if (!state) return;
        drops = drops.filter(drop => { if (elapsed - drop.born < LIFETIME) return true; dispose(drop.visual); return false; });
        if (elapsed >= nextSpawn && elapsed < 180) { spawn(elapsed); nextSpawn = (Math.floor(elapsed / INTERVAL) + 1) * INTERVAL; }
        for (const drop of drops) {
            drop.visual.position.y = drop.baseY + Math.sin(elapsed * 2.1 + drop.born) * .1;
            drop.model.rotation.y = elapsed * .65; drop.model.rotation.z = Math.sin(elapsed * 1.5) * .035;
            drop.model.userData.animate?.(elapsed);
            drop.halo.scale.setScalar(1 + Math.sin(elapsed * 3) * .07);
        }
        effects = effects.filter(effect => {
            effect.age += dt;
            if (effect.age >= 1.1) { dispose(effect.visual); return false; }
            const f = effect.owner;
            effect.visual.position.set((f.x + f.width / 2 - 480) / 65, (540 - f.y - f.height) / 65, .1);
            for (let i = 0; i < 12; i++) {
                const angle = i * Math.PI / 6 + effect.age * 5, part = effect.visual.children[i];
                part.position.set(Math.cos(angle) * .4, .2 + effect.age * 1.3 + i % 3 * .2, Math.sin(angle) * .4);
                part.material.opacity = 1 - effect.age / 1.1;
            }
            effect.ring.scale.setScalar(1 + effect.age); effect.ring.material.opacity = 1 - effect.age / 1.1;
            return true;
        });
    }
    function controlCPU(fighter) {
        if (!available(fighter)) return;
        if (!fighter.healingItem && fighter.damage >= 20) pickupNearCPU(fighter);
        if (fighter.healingItem && fighter.damage >= Math.min(20, fighter.healingItem.heal)) use(fighter);
    }
    function pickupNearCPU(fighter) { if (nearby(fighter)) pickup(fighter); }
    return { items, init, update, pickup, use, nearby: fighter => nearby(fighter)?.item || null, reset, clearFighter, controlCPU };
})();
