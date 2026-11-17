window.CombatActions = (() => {
    const effects = new Set();
    let clock = 0;
    function profile(type) {
        // Ranged throws use the shared X/5 ammunition system; F/1 stays a close weapon strike.
        if (type === 'kunai' || type === 'slingshot') return { kind: 'quick', damage: type === 'kunai' ? 7 : 5, range: 75, cooldown: 0.4, color: type === 'kunai' ? '#d4e6ff' : '#ffbc64' };
        if (/hammer|buster|fusion|four-swords/.test(type)) return { kind: 'heavy', damage: 15, range: 120, cooldown: 0.85, color: type.includes('blood') ? '#f25378' : '#ffcc77' };
        if (/spear|staff|pole|long-katana/.test(type)) return { kind: 'thrust', damage: 10, range: 175, cooldown: 0.6, color: /ice|water/.test(type) ? '#88eaff' : type.includes('blood') ? '#f25378' : '#c6dcff' };
        if (/gloves|bracers|dual-daggers/.test(type)) return { kind: 'quick', damage: 6, range: 90, cooldown: 0.28, color: type === 'bracers' ? '#ff9e43' : '#e3caff' };
        return { kind: 'slash', damage: 10, range: type === 'triple-katana' ? 130 : 115, cooldown: 0.48, color: /ice|lightning|wind/.test(type) ? (type.includes('wind') ? '#7af5bd' : '#a1eaff') : type.includes('blood') ? '#f25378' : '#e6f4ff' };
    }
    function equipped(fighter) {
        const items = window.CombatItems.list(fighter.character.id);
        return items[fighter.weaponIndex || 0];
    }
    function sync(fighter) {
        for (const weapon of fighter.model.userData.combatItems || []) weapon.visible = weapon.userData.loadoutIndex === (fighter.weaponIndex || 0);
    }
    function cycle(fighter) {
        const items = window.CombatItems.list(fighter.character.id);
        if (items.length < 2 || fighter.attackCooldown > 0 || fighter.specialStatus?.stun > 0) return false;
        fighter.weaponIndex = ((fighter.weaponIndex || 0) + 1) % items.length;
        fighter.weaponCombo = null;
        sync(fighter);
        return true;
    }
    function center(fighter) { return { x: fighter.x + fighter.width / 2, y: fighter.y + fighter.height / 2 }; }
    function dispose(effect) {
        effect.scene.remove(effect.visual);
        const geometry = new Set(), material = new Set();
        effect.visual.traverse(object => { if (object.geometry) geometry.add(object.geometry); if (object.material) material.add(object.material); });
        geometry.forEach(item => item.dispose()); material.forEach(item => item.dispose()); effects.delete(effect);
    }
    function reset() { for (const effect of effects) dispose(effect); clock = 0; }
    function clearFighter(fighter) { for (const effect of effects) if (effect.owner === fighter || effect.target === fighter) dispose(effect); fighter.weaponCombo = null; }
    function burst(THREE, scene, point, color, shield, owner, target) {
        const group = new THREE.Group();
        const material = new THREE.MeshBasicMaterial({ color: shield ? '#79bfff' : color, transparent: true, opacity: 1, depthWrite: false });
        for (let i = 0; i < 8; i++) {
            const spark = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), material);
            spark.userData.angle = i / 8 * Math.PI * 2;
            group.add(spark);
        }
        scene.add(group);
        effects.add({ owner, target, visual: group, scene, x: point.x, y: point.y, life: 0.3, duration: 0.3, burst: true });
    }
    function attack({ THREE, scene, owner, target, isShielded, onNotice }) {
        const item = equipped(owner);
        if (!item || owner.attackCooldown > 0 || owner.specialStatus?.stun > 0 || isShielded(owner)) return false;
        const stats = profile(item.type);
        const previous = owner.weaponCombo;
        const combo = previous && clock - previous.time < 1.3 ? previous.step % 3 + 1 : 1;
        owner.weaponCombo = { time: clock, step: combo };
        owner.attackCooldown = stats.cooldown;
        owner.attacks++;
        sync(owner);
        owner.model.userData.weaponAnimation = { kind: stats.kind, combo, remaining: stats.cooldown, duration: stats.cooldown };
        window.CharacterMotion.attack(owner.model, 'punch');
        const visual = new THREE.Group();
        const mat = new THREE.MeshBasicMaterial({ color: stats.color, transparent: true, opacity: 0.7, depthWrite: false, side: THREE.DoubleSide });
        if (stats.kind === 'projectile') {
            const projectile = item.type === 'kunai' ? window.CombatItems.createWeapon(THREE, 'kunai') : new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), mat);
            projectile.rotation.z = owner.facing * Math.PI / 2;
            visual.add(projectile);
        } else {
            const trail = new THREE.Mesh(new THREE.TorusGeometry(stats.range / 100, 0.035, 6, 24, stats.kind === 'thrust' ? 0.35 : Math.PI * 1.1), mat);
            trail.rotation.z = owner.facing > 0 ? -Math.PI / 2 : Math.PI / 2;
            visual.add(trail);
            // The material is owned by the trail; no frame-by-frame geometry allocation.
        }
        if (stats.kind === 'projectile' && item.type === 'kunai') mat.dispose();
        scene.add(visual);
        const point = center(owner);
        effects.add({ owner, target, item, stats, combo, THREE, scene, visual, isShielded, x: point.x + owner.facing * 24, y: point.y,
            facing: owner.facing, travel: 0, age: 0, life: stats.kind === 'projectile' ? 1.1 : stats.cooldown, duration: stats.kind === 'projectile' ? 1.1 : stats.cooldown, hit: false });
        onNotice(`${owner.character.name}: ${item.name}${combo === 3 ? ' — combo-finisher!' : ` — combo ${combo}/3`}`);
        return true;
    }
    function damage(effect) {
        const { owner, target, stats, combo } = effect;
        if (target.invulnerable > 0) return false;
        const shield = effect.isShielded(target);
        const amount = stats.damage * (combo === 3 ? 1.35 : 1) * (owner.specialStatus?.buff > 0 ? 1.3 : 1) * (target.specialStatus?.armor > 0 ? 0.65 : 1) * (shield ? 0.25 : 1);
        target.damage += amount;
        target.vx = effect.facing * (3 + target.damage / 22 + (stats.kind === 'heavy' ? 3 : 0)) * (shield ? 0.3 : 1);
        target.vy = shield ? -1 : combo === 3 ? -7 : -3;
        target.grounded = false;
        target.invulnerable = 0.16;
        owner.hits++;
        if (!shield && /ice|cane-sword/.test(effect.item.type)) target.weaponSlow = Math.max(target.weaponSlow || 0, 0.7);
        burst(effect.THREE, effect.scene, center(target), stats.color, shield, owner, target);
        return true;
    }
    function update(dt) {
        clock += dt;
        // Work on a snapshot so impact particles begin updating next frame.
        for (const effect of [...effects]) {
            effect.life -= dt;
            if (effect.burst) {
                const age = effect.duration - effect.life;
                effect.visual.children.forEach(spark => {
                    spark.position.set(Math.cos(spark.userData.angle) * age * 4, Math.sin(spark.userData.angle) * age * 4, 0);
                    spark.material.opacity = Math.max(0, effect.life / effect.duration);
                });
            } else {
                effect.age += dt;
                const previousX = effect.x;
                const point = center(effect.target);
                if (effect.stats.kind === 'projectile') {
                    effect.x += effect.facing * 580 * dt;
                    effect.travel += 580 * dt;
                    effect.visual.rotation.z += dt * 12;
                } else {
                    const origin = center(effect.owner);
                    effect.x = origin.x + effect.facing * 30; effect.y = origin.y;
                    effect.visual.rotation.z = effect.facing * effect.age * 8;
                }
                const forward = (point.x - center(effect.owner).x) * effect.facing;
                const inReach = effect.stats.kind === 'projectile'
                    ? point.x >= Math.min(previousX, effect.x) - 15 && point.x <= Math.max(previousX, effect.x) + 15
                    : forward >= -10 && forward <= effect.stats.range + effect.target.width / 2;
                const ready = effect.stats.kind === 'projectile' || effect.age >= effect.stats.cooldown * 0.25;
                if (!effect.hit && ready && inReach && Math.abs(point.y - effect.y) <= 60 && damage(effect)) {
                    effect.hit = true;
                    if (effect.stats.kind === 'projectile') effect.life = 0;
                }
                if (effect.travel > effect.stats.range) effect.life = 0;
                effect.visual.traverse(part => { if (part.material) part.material.opacity = Math.min(0.7, Math.max(0, effect.life / effect.duration)); });
            }
            effect.visual.position.set((effect.x - 480) / 65, (540 - effect.y) / 65 + 0.7, 0.35);
            if (effect.life <= 0) dispose(effect);
        }
    }
    return { attack, update, reset, clearFighter, cycle, equipped, profile };
})();
