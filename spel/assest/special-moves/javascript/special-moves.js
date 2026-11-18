/* Two specials per roster ID. Simulation uses the same pixel coordinates as platform physics. */
window.SpecialMoves = (() => {
    const data = window.SpecialMoveData;
    const effects = new Set();
    const directions = ['neutral', 'side'];
    const projectiles = new Set(['projectile', 'explosive', 'bomb', 'bounce', 'guided', 'volley', 'slash']);
    const areas = new Set(['zone', 'ground', 'ice', 'rain', 'lightning', 'delayed', 'orbit', 'stun', 'freeze', 'pull']);
    const colors = {
        naruto: ['#56baff', '#b1faff'], sasuke: ['#80cfff', '#40294c'], sakura: ['#ff9dc3', '#53efb0'],
        itachi: ['#ff732e', '#e43563'], kakashi: ['#b1eaff', '#b780ee'], jiraiya: ['#e7ecff', '#ff733b'],
        gaara: ['#d2ae69', '#e5c68a'], shikamaru: ['#5e4c83', '#8d67ae'], kiba: ['#e4f5ff', '#ffffff'],
        goku: ['#3eafff', '#b2ebff'], vegeta: ['#bd6bff', '#ffe66b'], gohan: ['#ffdf59', '#c18bff'],
        piccolo: ['#fbdc77', '#b9f463'], trunks: ['#ffa74f', '#76eaff'], hit: ['#7ce6e2', '#ba8cff'],
        frieza: ['#db6bff', '#a46cff'], beerus: ['#b769ff', '#d679ff'], jiren: ['#ff6f37', '#ffac57'],
        gojo: ['#37aeff', '#c67bff'], sukuna: ['#ffd6d6', '#f4465c'], yuji: ['#75b5ff', '#ff305a'],
        sanji: ['#ff8037', '#59bfff'], brook: ['#a1edff', '#c7f8ff'], nami: ['#fff283', '#b3c7ff'],
        todoroki: ['#c3f6ff', '#ffb5ad'], gray: ['#c1f4ff', '#81dfff'], natsu: ['#ff9c45', '#ffcc51'],
        sonic: ['#559cff', '#ffe86a'], shadow: ['#ffe764', '#ff4a67'], power: ['#e63d68', '#f75b85']
    };
    function applyRoster(roster) {
        for (const character of roster) {
            if (!data[character.id] || data[character.id].length !== 2) throw new Error(`Specials ontbreken voor ${character.id}`);
            directions.forEach((direction, slot) => { character.moves[direction] = { ...data[character.id][slot] }; });
        }
    }
    function prepare(fighter) {
        fighter.specialCooldowns ||= [0, 0];
        fighter.specialStatus ||= { stun: 0, buff: 0, armor: 0, dash: 0, dashSpeed: 0 };
        return fighter.specialStatus;
    }
    function tickFighter(fighter, dt) {
        const status = prepare(fighter);
        for (let slot = 0; slot < 2; slot++) fighter.specialCooldowns[slot] = Math.max(0, fighter.specialCooldowns[slot] - dt);
        for (const key of ['stun', 'buff', 'armor', 'dash']) status[key] = Math.max(0, status[key] - dt);
        fighter.model.scale.setScalar(status.buff > 0 && ['chopper', 'robin'].includes(fighter.character.id) ? 1.45 : 1);
    }
    function remove(effect) {
        effect.scene.remove(effect.visual);
        const geometries = new Set(), materials = new Set();
        effect.visual.traverse(object => {
            if (object.geometry) geometries.add(object.geometry);
            if (object.material) materials.add(object.material);
        });
        geometries.forEach(geometry => geometry.dispose());
        materials.forEach(material => material.dispose());
        effects.delete(effect);
    }
    function clearFighter(fighter) {
        for (const effect of effects) if (effect.owner === fighter || effect.target === fighter) remove(effect);
        fighter.specialStatus = { stun: 0, buff: 0, armor: 0, dash: 0, dashSpeed: 0 };
        fighter.model.scale.setScalar(1);
    }
    function reset() { for (const effect of effects) remove(effect); }

    function makeVisual(THREE, move, color, facing) {
        const group = new THREE.Group();
        const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, depthWrite: false });
        const white = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, depthWrite: false });
        function part(geometry, mat, x = 0, y = 0, z = 0) {
            const object = new THREE.Mesh(geometry, mat);
            object.position.set(x, y, z);
            group.add(object);
            return object;
        }
        const radius = move.damage >= 20 ? 0.7 : 0.32;
        if (move.kind === 'beam' || move.kind === 'stream' || move.kind === 'reach') {
            const length = move.range / 65;
            const beam = part(new THREE.CylinderGeometry(radius * 0.6, radius * 0.9, length, 16), material, facing * length / 2);
            beam.rotation.z = Math.PI / 2;
            const core = part(new THREE.CylinderGeometry(radius * 0.18, radius * 0.3, length, 12), white, facing * length / 2);
            core.rotation.z = Math.PI / 2;
        } else if (['sword', 'slash', 'volley', 'rain', 'ice'].includes(move.kind)) {
            const count = move.kind === 'sword' ? 1 : 5;
            for (let i = 0; i < count; i++) {
                const blade = part(new THREE.ConeGeometry(0.13, move.kind === 'sword' ? 2.6 : 1.1, 4), material, (i - (count - 1) / 2) * 0.28, Math.abs(i - 2) * 0.12);
                blade.rotation.z = move.kind === 'ice' || move.kind === 'rain' ? 0 : -facing * Math.PI / 3;
            }
        } else if (move.kind === 'summon') {
            for (let i = 0; i < 3; i++) {
                part(new THREE.SphereGeometry(0.15, 12, 8), white, (i - 1) * 0.6, 0.45);
                part(new THREE.ConeGeometry(0.25, 0.8, 12), material, (i - 1) * 0.6, -0.05);
            }
        } else if (['lightning', 'guided'].includes(move.kind)) {
            for (let i = 0; i < 5; i++) {
                const bolt = part(new THREE.CylinderGeometry(0.04, 0.08, 0.5, 6), i % 2 ? white : material, i % 2 * 0.18, 0.9 - i * 0.42);
                bolt.rotation.z = i % 2 ? 0.5 : -0.5;
            }
        } else {
            part(new THREE.SphereGeometry(radius, 20, 14), material);
            part(new THREE.SphereGeometry(radius * 0.45, 14, 10), white);
        }
        const ring = part(new THREE.TorusGeometry(radius * 1.4, 0.04, 8, 32), material);
        ring.userData.spin = true;
        if (areas.has(move.kind)) { ring.rotation.x = Math.PI / 2; ring.scale.setScalar(2.2); }
        return group;
    }
    function center(fighter) { return { x: fighter.x + fighter.width / 2, y: fighter.y + fighter.height / 2 }; }
    function cast({ THREE, scene, owner, target, slot, isShielded, onNotice, onHit }) {
        const status = prepare(owner), move = data[owner.character.id]?.[slot];
        if (!move || owner.specialCooldowns[slot] > 0 || status.stun > 0 || isShielded(owner)) return false;
        owner.specialCooldowns[slot] = move.cooldown;
        owner.attacks++;
        window.CharacterMotion.attack(owner.model, directions[slot]);
        onNotice(`${owner.character.name}: ${move.name}`);
        const origin = center(owner), destination = center(target);
        const facing = owner.facing;
        const area = areas.has(move.kind) || move.kind === 'orbit';
        // Targeted spells lock their location at cast time, allowing the opponent to dodge.
        const targeted = ['delayed', 'stun', 'freeze', 'lightning', 'rain', 'orbit', 'pull', 'ice', 'zone'].includes(move.kind);
        const closeTarget = Math.hypot(destination.x - origin.x, destination.y - origin.y) <= move.range + 60;
        const point = targeted && closeTarget ? destination : { x: origin.x + (targeted ? facing * move.range : 0), y: origin.y };
        const effect = {
            owner, target, move, slot, scene, isShielded, onHit, x: point.x, y: point.y, facing,
            age: 0, nextHit: move.windup, hits: 0, launched: false, area,
            visual: makeVisual(THREE, move, colors[owner.character.id]?.[slot] || owner.character.aura, facing)
        };
        effect.visual.visible = false;
        scene.add(effect.visual);
        effects.add(effect);
        return true;
    }

    function hit(effect, portion, stun = 0, pull = false) {
        const { owner, target, move, isShielded } = effect;
        if (target.invulnerable > 0) return false;
        const blocked = isShielded(target);
        const status = prepare(target), ownerStatus = prepare(owner);
        const armor = status.armor > 0 ? 0.65 : 1;
        target.damage += move.damage * portion * (owner.damageMultiplier ?? 1) * (ownerStatus.buff > 0 ? 1.3 : 1) * (blocked ? 0.25 : 1) * armor;
        const direction = Math.sign(center(target).x - center(owner).x) || owner.facing;
        const force = (4 + move.damage / 6 + target.damage / 22) / (target.character.weight || 1);
        target.vx = direction * force * (blocked ? 0.3 : 1) * (portion < 1 ? 0.25 : 1) * (pull ? -1 : 1);
        target.vy = blocked ? -1 : portion < 1 ? -1.5 : -5;
        target.grounded = false;
        if (!blocked) status.stun = Math.max(status.stun, stun);
        // Each effect tracks its own hit count; a short shared grace period avoids stacked hits.
        target.invulnerable = 0.08;
        owner.hits++;
        if (effect.hits === 0) effect.onHit?.();
        return true;
    }
    function inRange(effect, horizontal, vertical = 85) {
        const point = center(effect.target);
        return Math.abs(point.x - effect.x) <= horizontal + effect.target.width / 2 && Math.abs(point.y - effect.y) <= vertical;
    }
    function activate(effect) {
        const { owner, target, move } = effect;
        const status = prepare(owner);
        if (move.kind === 'heal') {
            owner.damage = Math.max(0, owner.damage - 24);
            status.buff = move.duration;
            status.armor = move.duration;
        } else if (move.kind === 'transform') {
            status.buff = move.duration;
            status.armor = move.duration;
        } else if (move.kind === 'guard') status.armor = move.duration;
        else if (['dash', 'leap', 'spin', 'combo'].includes(move.kind)) {
            status.dash = move.kind === 'combo' ? 0.35 : 0.5;
            status.dashSpeed = effect.facing * (move.kind === 'dash' ? 15 : 10);
            if (move.kind === 'leap') { owner.vy = -7; owner.grounded = false; }
        } else if (move.kind === 'teleport' && Math.abs(target.x - owner.x) <= move.range + 60) {
            owner.x = Math.max(0, Math.min(960 - owner.width, target.x - effect.facing * 45));
            owner.y = target.y;
        } else if (move.kind === 'uppercut') { owner.vy = -14; owner.grounded = false; }
        else if (move.kind === 'slam') { owner.vy = owner.grounded ? -4 : 16; owner.grounded = false; }
    }
    function updateEffect(effect, dt) {
        const { owner, target, move } = effect;
        effect.age += dt;
        const elapsed = effect.age - move.windup;
        if (elapsed < 0) return;
        if (!effect.launched) { effect.launched = true; activate(effect); }
        effect.visual.visible = true;
        const origin = center(owner);
        if (projectiles.has(move.kind)) {
            if (effect.exploded) {
                if (effect.hits < 3 && effect.age >= effect.nextHit && inRange(effect, 90)) {
                    if (hit(effect, 1 / 3)) { effect.hits++; effect.nextHit = effect.age + 0.18; }
                }
            } else {
            const previousX = effect.x;
            const speed = move.kind === 'bomb' ? 220 : move.kind === 'guided' ? 280 : 480;
            effect.x += effect.facing * speed * dt;
            if (move.kind === 'guided') effect.y += Math.max(-120 * dt, Math.min(120 * dt, center(target).y - effect.y));
            if (move.kind === 'bounce') effect.y = origin.y - Math.abs(Math.sin(elapsed * 8)) * 55;
            const point = center(target), radius = move.kind === 'bomb' ? 65 : move.kind === 'explosive' ? 45 : 24;
            // Swept horizontal test keeps fast projectiles from tunnelling through the target.
            if (!effect.hits && point.x >= Math.min(previousX, effect.x) - radius && point.x <= Math.max(previousX, effect.x) + radius && Math.abs(point.y - effect.y) < radius + target.height / 2) {
                if (move.kind === 'explosive') {
                    effect.exploded = true;
                    effect.x = point.x;
                    // Allow the explosion's three ticks to finish even after a long projectile flight.
                    effect.age = Math.min(effect.age, move.windup + move.duration - 0.55);
                    if (hit(effect, 1 / 3)) { effect.hits++; effect.nextHit = effect.age + 0.18; }
                } else if (hit(effect, 1)) { effect.hits++; effect.age = move.windup + move.duration; }
            }
            }
        } else if (move.kind === 'beam' || move.kind === 'stream' || move.kind === 'reach') {
            effect.x = origin.x; effect.y = origin.y;
            const point = center(target), distance = (point.x - origin.x) * effect.facing;
            const ticks = move.kind === 'stream' ? 5 : 1;
            if (effect.hits < ticks && effect.age >= effect.nextHit && distance >= -20 && distance <= move.range + target.width / 2 && Math.abs(point.y - origin.y) <= 65) {
                if (hit(effect, 1 / ticks)) { effect.hits++; effect.nextHit = effect.age + 0.35; }
            }
        } else if (!['heal', 'transform', 'guard'].includes(move.kind)) {
            const persistent = ['zone', 'ground', 'rain', 'orbit', 'combo', 'summon', 'double', 'spin', 'uppercut'].includes(move.kind);
            const ticks = move.kind === 'double' ? 2 : move.kind === 'combo' ? (owner.character.id === 'sephiroth' ? 8 : owner.character.id === 'zenitsu' ? 6 : 5) : persistent ? 4 : 1;
            if (!areas.has(move.kind)) { effect.x = origin.x + effect.facing * (move.kind === 'summon' ? 80 : 30); effect.y = origin.y; }
            const radius = effect.area ? move.range / 2 : ['sword', 'heavy', 'summon'].includes(move.kind) ? move.range * 0.6 : 80;
            if (effect.hits < ticks && effect.age >= effect.nextHit && inRange(effect, radius, move.kind === 'uppercut' ? 150 : 85)) {
                const stun = move.kind === 'freeze' ? 1.3 : move.kind === 'stun' ? 0.9 : 0;
                if (hit(effect, 1 / ticks, stun, move.kind === 'pull')) { effect.hits++; effect.nextHit = effect.age + Math.max(0.12, move.duration / (ticks + 1)); }
            }
        } else { effect.x = origin.x; effect.y = origin.y; }
        const group = effect.visual;
        group.position.set((effect.x - 480) / 65, (540 - effect.y) / 65 + 0.7, 0.2);
        const pulse = 1 + Math.sin(elapsed * 16) * 0.08;
        group.scale.setScalar(pulse * (effect.exploded ? 2.8 : move.kind === 'bomb' ? 1.6 : 1));
        group.children.forEach(part => {
            if (part.userData.spin) part.rotation.z += dt * 5;
            part.material.opacity = Math.min(0.85, Math.max(0, (move.duration - elapsed) * 3));
        });
    }
    function update(dt) {
        for (const effect of effects) {
            updateEffect(effect, dt);
            if (effect.age >= effect.move.windup + effect.move.duration || effect.x < -150 || effect.x > 1110) remove(effect);
        }
    }
    function cooldownLabel(fighter, slot) {
        const seconds = fighter.specialCooldowns?.[slot] || 0;
        return seconds > 0 ? `${seconds.toFixed(1)}s` : 'klaar';
    }
    return { applyRoster, prepare, tickFighter, cast, update, reset, clearFighter, cooldownLabel };
})();
