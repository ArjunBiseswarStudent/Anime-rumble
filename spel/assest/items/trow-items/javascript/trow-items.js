/* Three throws, then a ten-second magazine cooldown. Uses game coordinates, not screen pixels. */
window.TrowItems = (() => {
    const data = window.TrowItemData;
    const effects = new Set();
    const MAX_AMMO = 3, RELOAD = 10, INTERVAL = 0.3;
    function list(id) { return data[id] || []; }
    function prepare(fighter) {
        fighter.throwState ||= { ammo: MAX_AMMO, reload: 0, interval: 0, variant: 0 };
        return fighter.throwState;
    }
    function tickFighter(fighter, dt) {
        const state = prepare(fighter);
        state.interval = Math.max(0, state.interval - dt);
        if (state.reload > 0) {
            state.reload = Math.max(0, state.reload - dt);
            if (state.reload < 0.000001) { state.reload = 0; state.ammo = MAX_AMMO; }
        }
    }
    function label(fighter) {
        if (!list(fighter.character.id).length) return 'Geen werpitems';
        const state = prepare(fighter);
        return state.reload > 0 ? `Herladen ${state.reload.toFixed(1)}s` : `${state.ammo}/${MAX_AMMO} worpen`;
    }
    function center(fighter) { return { x: fighter.x + fighter.width / 2, y: fighter.y + fighter.height / 2 }; }
    function remove(effect) {
        effect.scene.remove(effect.visual);
        const geometries = new Set(), materials = new Set();
        effect.visual.traverse(object => {
            if (object.geometry) geometries.add(object.geometry);
            if (object.material) materials.add(object.material);
        });
        geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
        effects.delete(effect);
    }
    function reset() { for (const effect of effects) remove(effect); }
    // Stocks remove active projectiles but do not refill ammunition or bypass reload.
    function clearFighter(fighter) { for (const effect of effects) if (effect.owner === fighter || effect.target === fighter) remove(effect); }

    function visual(THREE, item) {
        const root = new THREE.Group();
        const physical = ['shuriken', 'kunai', 'tag', 'barrel', 'seed'].includes(item.type);
        const material = new THREE.MeshStandardMaterial({ color: item.color, roughness: physical ? 0.45 : 0.22,
            metalness: ['shuriken', 'kunai'].includes(item.type) ? 0.85 : 0.05,
            emissive: physical ? '#000000' : item.color, emissiveIntensity: physical ? 0 : 1.2,
            transparent: !physical, opacity: physical ? 1 : 0.85 });
        function part(geometry, mat, x = 0, y = 0, z = 0) {
            const mesh = new THREE.Mesh(geometry, mat); mesh.position.set(x, y, z); root.add(mesh); return mesh;
        }
        if (item.type === 'shuriken') {
            for (let i = 0; i < 4; i++) {
                const angle = i * Math.PI / 2;
                const blade = part(new THREE.ConeGeometry(0.065, 0.28, 3), material, Math.sin(angle) * 0.15, Math.cos(angle) * 0.15);
                blade.rotation.z = -angle;
            }
            part(new THREE.TorusGeometry(0.065, 0.028, 8, 16), material);
        } else if (item.type === 'kunai') {
            const knife = part(new THREE.ConeGeometry(0.065, 0.32, 4), material, 0.14);
            knife.rotation.z = -Math.PI / 2;
            const handle = part(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 10), new THREE.MeshStandardMaterial({ color: '#242b3d' }), -0.1);
            handle.rotation.z = Math.PI / 2;
            part(new THREE.TorusGeometry(0.045, 0.01, 6, 16), material, -0.24);
        } else if (item.type === 'tag') {
            part(new THREE.BoxGeometry(0.19, 0.32, 0.015), material);
            const ink = new THREE.MeshBasicMaterial({ color: '#ad343a' });
            for (let i = 0; i < 4; i++) part(new THREE.BoxGeometry(0.07, 0.018, 0.02), ink, 0, i * 0.055 - 0.08, 0.015);
        } else if (item.type === 'barrel') {
            part(new THREE.CylinderGeometry(0.24, 0.24, 0.5, 16), material);
            const metal = new THREE.MeshStandardMaterial({ color: '#424654', metalness: 0.7, roughness: 0.5 });
            [-0.18, 0.18].forEach(y => { part(new THREE.TorusGeometry(0.245, 0.024, 6, 24), metal, 0, y).rotation.x = Math.PI / 2; });
        } else if (/lance|arrow|spear/.test(item.type) || item.type === 'chaos') {
            const length = item.type.includes('arrow') ? 0.7 : 1;
            part(new THREE.CylinderGeometry(0.025, 0.025, length, 8), material).rotation.z = Math.PI / 2;
            part(new THREE.ConeGeometry(0.1, 0.3, 4), material, length / 2).rotation.z = -Math.PI / 2;
        } else if (['slash', 'blade', 'wind'].includes(item.type)) {
            part(new THREE.TorusGeometry(0.36, 0.04, 8, 24, Math.PI * 1.3), material).rotation.z = -Math.PI * 0.65;
        } else if (item.type === 'beam') {
            part(new THREE.CylinderGeometry(0.025, 0.025, 1.6, 10), material).rotation.z = Math.PI / 2;
        } else {
            const core = part(new THREE.SphereGeometry(item.radius / 80, 20, 14), material);
            if (item.type === 'water') core.scale.set(1.4, 0.75, 0.75);
            if (item.type === 'ice') for (let i = 0; i < 4; i++) part(new THREE.ConeGeometry(0.06, 0.4, 4), material, 0.05, (i - 1.5) * 0.09).rotation.z = -Math.PI / 2;
            if (['purple', 'hakai', 'shadow', 'red', 'ki', 'weather'].includes(item.type)) {
                part(new THREE.TorusGeometry(item.radius / 65, 0.018, 6, 24), material).rotation.y = 0.6;
            }
        }
        // Reuse a fixed set of fading trail particles; no per-frame geometry allocations.
        const body = new THREE.Group();
        root.children.slice().forEach(part => body.add(part));
        root.add(body);
        root.userData.body = body;
        const trail = new THREE.Group();
        const trailMaterial = new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.4, depthWrite: false });
        for (let i = 0; i < 7; i++) {
            const particle = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), trailMaterial.clone());
            particle.position.x = -i * 0.14; particle.scale.setScalar(1 - i / 8); trail.add(particle);
        }
        trailMaterial.dispose();
        root.userData.trail = trail;
        root.add(trail);
        return root;
    }
    function impact(effect, shield = false) {
        const { THREE, scene, item, owner, target, x, y } = effect;
        const group = new THREE.Group();
        const material = new THREE.MeshBasicMaterial({ color: shield ? '#76baff' : item.color, transparent: true, opacity: 0.9, depthWrite: false });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 6, 24), material);
        ring.userData.ring = true; group.add(ring);
        for (let i = 0; i < 10; i++) {
            const spark = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), material);
            spark.userData.angle = i / 10 * Math.PI * 2; group.add(spark);
        }
        scene.add(group);
        effects.add({ owner, target, scene, visual: group, x, y, burst: true, age: 0, life: 0.45, item });
    }
    function hurt(effect) {
        const { target, owner, item } = effect;
        if (target.invulnerable > 0) return false;
        const shield = effect.isShielded(target);
        target.damage += item.damage * (owner.damageMultiplier ?? 1) * (owner.specialStatus?.buff > 0 ? 1.3 : 1) * (target.specialStatus?.armor > 0 ? 0.65 : 1) * (shield ? 0.25 : 1);
        target.vx = effect.facing * (3.5 + target.damage / 25) * (shield ? 0.3 : 1);
        target.vy = shield ? -1 : -3.5; target.grounded = false;
        target.invulnerable = 0.15;
        if (!shield && item.slow) target.weaponSlow = Math.max(target.weaponSlow || 0, item.slow);
        owner.hits++;
        impact(effect, shield);
        return true;
    }
    function fire({ THREE, scene, owner, target, platforms = [], isShielded, onNotice = () => {} }) {
        const items = list(owner.character.id), state = prepare(owner);
        if (!items.length || owner.specialStatus?.stun > 0 || isShielded(owner)) return false;
        if (state.ammo === 0 || state.reload > 0) { onNotice(`Werpitems herladen: ${state.reload.toFixed(1)}s`); return false; }
        if (state.interval > 0) return false;
        const item = items[state.variant % items.length];
        state.variant++; state.ammo--; state.interval = INTERVAL;
        if (state.ammo === 0) state.reload = RELOAD;
        owner.attacks++;
        window.CharacterMotion.attack(owner.model, 'throw');
        if (owner.model.userData.weaponAnimation) owner.model.userData.weaponAnimation.remaining = 0;
        const origin = center(owner), destination = center(target);
        const distance = Math.abs(destination.x - origin.x);
        const flightTime = Math.max(0.2, distance / item.speed);
        // A slight vertical lead; no homing, so jumping can evade a thrown projectile.
        const vy = item.type === 'barrel' ? -120 : Math.max(-170, Math.min(170, (destination.y - origin.y) / flightTime - (item.gravity || 0) * flightTime * 0.3));
        const mesh = visual(THREE, item);
        mesh.rotation.y = owner.facing < 0 ? Math.PI : 0;
        scene.add(mesh);
        effects.add({ THREE, scene, owner, target, item, platforms, isShielded, visual: mesh, x: origin.x + owner.facing * 25, y: origin.y,
            facing: owner.facing, vy, travel: 0, age: 0, life: 2.6, bounces: 0 });
        onNotice(`${owner.character.name}: ${item.name} — ${state.ammo}/3${state.reload ? ' · 10s herladen' : ''}`);
        return true;
    }
    function update(dt) {
        for (const effect of [...effects]) {
            effect.age += dt; effect.life -= dt;
            if (effect.burst) {
                effect.visual.children.forEach(part => {
                    if (part.userData.ring) part.scale.setScalar(1 + effect.age * (effect.item.blast ? 14 : 7));
                    else part.position.set(Math.cos(part.userData.angle) * effect.age * 3, Math.sin(part.userData.angle) * effect.age * 3 - effect.age ** 2, 0);
                    part.material.opacity = Math.max(0, effect.life / 0.45);
                });
            } else {
                const { item } = effect, previous = { x: effect.x, y: effect.y };
                effect.x += effect.facing * item.speed * dt; effect.travel += item.speed * dt;
                effect.vy += (item.gravity || 0) * dt; effect.y += effect.vy * dt;
                if (item.type === 'shuriken') effect.visual.userData.body.rotation.z += dt * 28;
                if (item.type === 'barrel') effect.visual.userData.body.rotation.z -= effect.facing * dt * 9;
                if (['purple', 'hakai', 'shadow', 'wind'].includes(item.type)) effect.visual.userData.body.rotation.x += dt * 4;
                effect.visual.userData.trail.children.forEach((particle, i) => { particle.position.y = Math.sin(effect.age * 20 + i) * 0.03; particle.material.opacity = (1 - i / 8) * 0.4; });
                let collided = false;
                // Real platform bounces, including raised platforms, instead of a fake sine wave.
                for (const platform of effect.platforms) {
                    if (effect.vy >= 0 && previous.y + item.radius <= platform.y && effect.y + item.radius >= platform.y && effect.x >= platform.x && effect.x <= platform.x + platform.w) {
                        if (item.bounces && effect.bounces < item.bounces) {
                            effect.y = platform.y - item.radius - 0.1;
                            effect.vy = -Math.max(110, Math.abs(effect.vy) * 0.65); effect.bounces++;
                        } else collided = true;
                        break;
                    }
                }
                const point = center(effect.target);
                // Closest point on the swept movement segment prevents tunnelling at low FPS.
                const dx = effect.x - previous.x, dy = effect.y - previous.y;
                const t = Math.max(0, Math.min(1, ((point.x - previous.x) * dx + (point.y - previous.y) * dy) / (dx * dx + dy * dy || 1)));
                const nearX = previous.x + dx * t, nearY = previous.y + dy * t;
                const hitTarget = Math.abs(point.x - nearX) <= item.radius + effect.target.width / 2 && Math.abs(point.y - nearY) <= item.radius + effect.target.height / 2;
                if (hitTarget && hurt(effect)) effect.life = 0;
                if (collided || effect.travel >= item.range) {
                    if (item.blast && !hitTarget && Math.hypot(point.x - effect.x, point.y - effect.y) <= item.blast) hurt(effect);
                    impact(effect); effect.life = 0;
                }
            }
            effect.visual.position.set((effect.x - 480) / 65, (540 - effect.y) / 65 + 0.7, 0.3);
            if (effect.life <= 0 || effect.x < -180 || effect.x > 1140 || effect.y > 750) remove(effect);
        }
    }
    return { list, prepare, tickFighter, fire, update, reset, clearFighter, label };
})();
