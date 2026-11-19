/* Two specials per roster ID. Simulation uses the same pixel coordinates as platform physics. */
window.SpecialMoves = (() => {
    const data = window.SpecialMoveData;
    const effects = new Set();
    const impacts = new Set();
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
    function disposeVisual(effect) {
        effect.scene.remove(effect.visual);
        const geometries = new Set(), materials = new Set();
        effect.visual.traverse(object => {
            if (object.geometry) geometries.add(object.geometry);
            if (object.material) materials.add(object.material);
        });
        geometries.forEach(geometry => geometry.dispose());
        materials.forEach(material => material.dispose());
    }
    function remove(effect) { disposeVisual(effect); effects.delete(effect); }
    function removeImpact(impact) { disposeVisual(impact); impacts.delete(impact); }
    function clearFighter(fighter) {
        for (const effect of effects) if (effect.owner === fighter || effect.target === fighter) remove(effect);
        for (const impact of impacts) if (impact.owner === fighter || impact.target === fighter) removeImpact(impact);
        fighter.specialStatus = { stun: 0, buff: 0, armor: 0, dash: 0, dashSpeed: 0 };
        fighter.model.scale.setScalar(1);
    }
    function reset() {
        for (const effect of effects) remove(effect);
        for (const impact of impacts) removeImpact(impact);
    }

    function effectPalette(move, fallback) {
        const name = move.name.toLowerCase();
        if (/chidori|thunder|lightning|raikiri|electric|voltage/.test(name) || move.kind === 'lightning') return ['#789cff', '#e1efff'];
        if (/flame|fire|burn|phoenix|katon|amaterasu|diable|hellfire/.test(name)) return ['#ff5319', '#ffdf92'];
        if (/\bice\b|frost|snow|freeze|glacial/.test(name) || ['freeze', 'ice'].includes(move.kind)) return ['#61cfff', '#e0f9ff'];
        if (move.kind === 'heal') return ['#3cef91', '#c8ffe1'];
        return [fallback, '#fff5e6'];
    }
    function makeVisual(THREE, move, palette, facing) {
        const group = new THREE.Group();
        const [color, highlight] = palette;
        const glow = (tint, opacity, blending = THREE.AdditiveBlending) =>
            new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity, depthWrite: false, blending, toneMapped: false });
        const aura = glow(color, .42), streak = glow(color, .79), core = glow(highlight, .86, THREE.NormalBlending);
        const ink = glow('#191324', .9, THREE.NormalBlending);
        const paint = glow(color, .92, THREE.NormalBlending);
        const paper = glow(highlight, .94, THREE.NormalBlending);
        function part(geometry, mat, x = 0, y = 0, z = 0, animate) {
            const object = new THREE.Mesh(geometry, mat);
            object.position.set(x, y, z);
            object.userData.animate = animate;
            group.add(object);
            return object;
        }
        const radius = move.damage >= 20 ? .64 : .4;
        function cutout(points) {
            const shape = new THREE.Shape();
            shape.moveTo(...points[0]);
            for (const point of points.slice(1)) shape.lineTo(...point);
            shape.closePath();
            return new THREE.ShapeGeometry(shape);
        }
        if (move.kind === 'beam' || move.kind === 'stream' || move.kind === 'reach') {
            const length = move.range / 65;
            for (const [mat, width] of [[core, .34], [streak, .72], [aura, 1.05]]) {
                const beam = part(new THREE.CylinderGeometry(radius * width * .66, radius * width, length, 16),
                    mat, facing * length / 2, 0, 0, (mesh, t) => {
                        const pulse = 1 + .11 * Math.sin(t * 35 + width * 4);
                        mesh.scale.set(pulse, 1, pulse);
                    });
                beam.rotation.z = -facing * Math.PI / 2;
            }
            const filament = new THREE.ConeGeometry(.034, .65, 5);
            for (let i = 0; i < 10; i++) {
                const thread = part(filament, i % 2 ? streak : core, 0, 0, 0, (mesh, t) => {
                    const angle = i * 2.4 + t * 8;
                    mesh.position.set(facing * length * ((i / 10 + t * 2.8) % 1),
                        Math.cos(angle) * radius, Math.sin(angle) * radius);
                });
                thread.rotation.z = -facing * Math.PI / 2;
            }
        } else if (['sword', 'slash', 'spin', 'dash', 'uppercut', 'combo', 'double', 'heavy', 'leap', 'teleport', 'slam'].includes(move.kind)) {
            for (let i = 0; i < 3; i++) {
                part(new THREE.TorusGeometry(.65 + i * .25, .04 + i * .015, 6, 28, Math.PI * (1.15 - i * .17)),
                    [core, streak, aura][i], 0, 0, i * -.09, (mesh, t) => {
                        mesh.rotation.set(i * .2, facing * -.4, facing * (t * 10 - i * .42));
                        mesh.scale.set(1.23, .72 + i * .13, 1);
                    });
            }
        } else if (move.kind === 'lightning') {
            const bolt = cutout([[-.22, 3.2], [.24, 3.2], [-.12, 2.17], [.43, 2.4],
                [.12, 1.16], [.58, 1.43], [-.18, -.48], [.02, .85], [-.35, .65], [-.07, 1.85], [-.53, 1.59]]);
            for (const [material, width, depth] of [[ink, 1.38, .65], [paint, 1.12, .67], [paper, .52, .69]]) {
                part(bolt, material, 0, 0, depth, (mesh, t) => {
                    mesh.position.x = Math.sin(Math.floor(t * 18) * 2.4) * .17;
                    mesh.scale.x = width;
                });
            }
            const branch = cutout([[-.1, 1.7], [.65, 1.09], [.48, 1.02], [1.14, .21], [.23, .87], [.38, 1]]);
            part(branch, paint, 0, 0, .68);
        } else if (['volley', 'rain', 'ice', 'freeze'].includes(move.kind)) {
            const falling = move.kind !== 'volley';
            const shard = new THREE.ConeGeometry(.106, 1.05, 5);
            for (let i = 0; i < 12; i++) {
                const blade = part(shard, i % 3 === 0 ? core : streak, 0, 0, 0, (mesh, t) => {
                    const phase = (t * 2.55 + i * .147) % 1;
                    mesh.position.set((i % 6 - 2.5) * .37 - (falling ? phase * .45 : 0),
                        falling ? 2.7 - phase * 3.25 : (i % 4 - 1.5) * .19, (i % 3 - 1) * .29);
                    if (!falling) mesh.position.x += facing * (phase - .5) * 1.55;
                    mesh.scale.setScalar(.65 + Math.sin(phase * Math.PI) * .64);
                });
                blade.rotation.z = falling ? Math.PI - .16 : -facing * Math.PI / 2;
            }
        } else if (move.kind === 'summon') {
            const smoke = cutout(Array.from({ length: 40 }, (_, index) => {
                const angle = index * Math.PI * 2 / 40;
                const edge = .42 + Math.cos(angle * 5) * .069 + Math.sin(angle * 3) * .034;
                return [Math.cos(angle) * edge, Math.sin(angle) * edge];
            }));
            for (let i = 0; i < 7; i++) {
                for (const [material, size, depth] of [[ink, 1.13, 0], [i % 2 ? paint : paper, .97, .018]]) {
                    part(smoke, material, 0, 0, 0, (mesh, t) => {
                        const drift = Math.min(t, 1.6);
                        const angle = i * Math.PI * 2 / 7 + drift * .6;
                        mesh.position.set(Math.cos(angle) * (.35 + drift * .85), -.15 + drift * .68 + Math.sin(angle) * .38,
                            .45 + (i % 3) * .13 + depth);
                        mesh.scale.setScalar(size * (.64 + drift * .52));
                        mesh.rotation.z = angle * .45;
                    });
                }
            }
            for (let i = 0; i < 3; i++) {
                part(new THREE.SphereGeometry(.14, 12, 8), core, (i - 1) * .6, .45);
                part(new THREE.ConeGeometry(.23, .8, 12), streak, (i - 1) * .6, -.05);
            }
        } else if (areas.has(move.kind) || ['heal', 'guard', 'transform'].includes(move.kind)) {
            const span = areas.has(move.kind) ? Math.max(.74, move.range / 130) : .86;
            for (let i = 0; i < 3; i++) {
                const ring = part(new THREE.TorusGeometry(span * (.62 + i * .15), .025 + i * .016, 7, 36),
                    i === 0 ? core : streak, 0, -.54 + i * .4, 0, (mesh, t) => {
                        mesh.scale.setScalar(.90 + Math.sin(t * 8 - i * .65) * .12);
                        mesh.rotation.y = Math.sin(t * 2 + i) * .14;
                    });
                ring.rotation.x = Math.PI / 2;
            }
            const mote = new THREE.ConeGeometry(.057, .29, 5);
            for (let i = 0; i < 12; i++) part(mote, i % 3 ? streak : core, 0, 0, 0, (mesh, t) => {
                const angle = i * 2.4 + t * (move.kind === 'pull' ? -5 : 3);
                const rise = (t * 1.7 + i * .17) % 1;
                mesh.position.set(Math.cos(angle) * span, rise * 1.75 - .58, Math.sin(angle) * span);
                mesh.scale.setScalar(.3 + Math.sin(Math.PI * rise));
            });
        } else {
            part(new THREE.SphereGeometry(radius, 20, 14), aura);
            part(new THREE.SphereGeometry(radius * .57, 16, 12), core);
            for (let i = 0; i < 3; i++) part(new THREE.TorusGeometry(radius * (.77 + i * .13), .022, 6, 26, Math.PI * 1.45),
                streak, 0, 0, 0, (mesh, t) => mesh.rotation.set(t * 7 + i, i * 1.1, t * -8 + i * 2));
            const trail = new THREE.SphereGeometry(1, 10, 8);
            for (let i = 0; i < 8; i++) part(trail, i % 2 ? aura : streak, 0, 0, 0, (mesh, t) => {
                const phase = (t * 4.1 + i / 8) % 1;
                const spread = radius * (.18 + phase * .77);
                mesh.position.set(-facing * radius * (.45 + phase * 3.2),
                    Math.cos(i * 2.4 + t * 14) * spread, Math.sin(i * 2.4 + t * 14) * spread);
                mesh.scale.set(.27 * (1 - phase) + .048, .12 * (1 - phase) + .02, .1 * (1 - phase) + .02);
            });
        }
        if (move.kind !== 'lightning' && move.kind !== 'summon') {
            const speedLine = cutout([[0, -.027], [.34, -.043], [1.03, 0], [.27, .04]]);
            for (let i = 0; i < 5; i++) part(speedLine, i % 2 ? paint : paper, 0, 0, 0, (mesh, t) => {
                const phase = (t * 2.1 + i * .19) % 1;
                mesh.position.set(facing * ((phase - .45) * 1.6), (i - 2) * .27, .58);
                mesh.rotation.z = facing < 0 ? Math.PI : 0;
                mesh.scale.set(.23 + phase * .77, 1 - phase * .7, 1);
            });
        }
        group.userData.materials = [aura, streak, core, ink, paint, paper].filter(mat => {
            if (group.children.some(mesh => mesh.material === mat)) return true;
            mat.dispose();
            return false;
        }).map(mat => [mat, mat.opacity]);
        return group;
    }
    function center(fighter) { return { x: fighter.x + fighter.width / 2, y: fighter.y + fighter.height / 2 }; }
    function createPreview(THREE, scene, character, slot, facing) {
        const move = data[character.id]?.[slot];
        if (!move) return null;
        const [color, highlight] = effectPalette(move, colors[character.id]?.[slot] || character.aura);
        const visual = makeVisual(THREE, move, [color, highlight], facing);
        const light = new THREE.PointLight(color, 0, 3.2, 2);
        visual.add(light);
        scene.add(visual);
        const duration = Math.max(1.2, Math.min(move.duration, 2.3));
        const beam = ['beam', 'stream', 'reach'].includes(move.kind);
        const self = ['heal', 'transform', 'guard'].includes(move.kind);
        return {
            color,
            update(age, reducedMotion) {
                const elapsed = age - Math.min(move.windup, .45);
                visual.visible = elapsed >= 0 && elapsed < duration;
                if (!visual.visible) return;
                const time = reducedMotion ? .38 : elapsed;
                const scale = beam ? Math.min(.78, 1.55 / (move.range / 65)) : .72;
                const travel = projectiles.has(move.kind) ? Math.min(.95, time * 1.5) : 0;
                const offset = self ? 0 : beam ? .26 : .48;
                visual.position.set(facing * (offset + travel), 1.22, .48);
                visual.scale.setScalar(scale);
                const opacity = reducedMotion ? .8 : Math.min(1, elapsed / .09, (duration - elapsed) / .35);
                light.intensity = opacity * 1.4;
                visual.userData.materials.forEach(([material, initial]) => { material.opacity = initial * opacity; });
                visual.children.forEach(part => part.userData.animate?.(part, time));
            },
            dispose() { disposeVisual({ scene, visual }); }
        };
    }

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
        const palette = effectPalette(move, colors[owner.character.id]?.[slot] || owner.character.aura);
        const effect = {
            THREE, owner, target, move, slot, scene, isShielded, onHit, x: point.x, y: point.y, facing, palette,
            age: 0, nextHit: move.windup, hits: 0, launched: false, area,
            visual: makeVisual(THREE, move, palette, facing)
        };
        effect.visual.visible = false;
        scene.add(effect.visual);
        effects.add(effect);
        return true;
    }

    function burst(effect, blocked, portion) {
        const { THREE, scene, owner, target, palette } = effect;
        const point = center(target);
        const visual = new THREE.Group();
        visual.name = 'special-impact';
        visual.position.set((point.x - 480) / 65, (540 - point.y) / 65 + .4, .57);
        const color = blocked ? '#91bcff' : palette[0];
        const mat = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: .93, depthWrite: false, toneMapped: false
        });
        const flash = new THREE.MeshBasicMaterial({
            color: palette[1], transparent: true, opacity: .88, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false
        });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(.52, .035, 6, 28), mat);
        visual.add(ring);
        const sparks = [];
        const geometry = new THREE.ConeGeometry(.055, .39, 4);
        for (let i = 0; i < 10; i++) {
            const angle = i * Math.PI * 2 / 10 + effect.hits * .59;
            const mesh = new THREE.Mesh(geometry, i % 2 ? mat : flash);
            mesh.rotation.z = angle - Math.PI / 2;
            visual.add(mesh);
            sparks.push({ mesh, x: Math.cos(angle), y: Math.sin(angle), speed: 1.4 + i % 3 * .64 });
        }
        visual.scale.setScalar((blocked ? .78 : 1) * (.75 + portion * .25));
        scene.add(visual);
        impacts.add({ visual, scene, owner, target, ring, sparks, mat, flash, age: 0 });
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
        burst(effect, blocked, portion);
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
        const fade = Math.min(1, Math.max(0, (move.duration - elapsed) / .18));
        group.userData.materials.forEach(([material, opacity]) => { material.opacity = opacity * fade; });
        group.children.forEach(part => {
            part.userData.animate?.(part, elapsed);
        });
    }
    function update(dt) {
        for (const effect of effects) {
            updateEffect(effect, dt);
            if (effect.age >= effect.move.windup + effect.move.duration || effect.x < -150 || effect.x > 1110) remove(effect);
        }
        for (const impact of impacts) {
            impact.age += dt;
            const progress = impact.age / .28;
            if (progress >= 1) { removeImpact(impact); continue; }
            impact.ring.scale.setScalar(.65 + progress * 1.65);
            impact.mat.opacity = .93 * (1 - progress);
            impact.flash.opacity = .88 * (1 - progress) ** 2;
            for (const { mesh, x, y, speed } of impact.sparks) {
                const distance = .16 + progress * speed * .66;
                mesh.position.set(x * distance, y * distance - progress ** 2 * .23, .04);
                mesh.scale.setScalar(1 - progress * .87);
            }
        }
    }
    function cooldownLabel(fighter, slot) {
        const seconds = fighter.specialCooldowns?.[slot] || 0;
        return seconds > 0 ? `${seconds.toFixed(1)}s` : 'klaar';
    }
    return { applyRoster, prepare, tickFighter, cast, createPreview, update, reset, clearFighter, cooldownLabel };
})();
