/* Code-built scenery inspired by an ancient battlefield; no poster/logo assets. */
window.BattlefieldScenery = (() => {
    let hazeTexture;
    function build(THREE, { group, animations, mesh, box, ball, pillar, branch, banner, glow, texture, platforms }) {
        const metal = '#a88a59', dark = '#4c3d36', red = '#732d27';
        function rough(object, type = 'earth', amount = 0.13) {
            object.material.map = texture(type); object.material.bumpMap = object.material.map;
            object.material.bumpScale = amount;
            return object;
        }
        function steel(object) { object.material.metalness = 0.65; object.material.roughness = 0.38; return object; }
        function attach(parent, object) { parent.add(object); return object; }
        function warBanner(x, y, z, color, size = 1) {
            banner(x, y, z, color);
            const flag = group.children[group.children.length - 1];
            const vertices = flag.geometry.attributes.position;
            for (let i = 0; i < vertices.count; i++) {
                if (vertices.getX(i) > 0.4) vertices.setX(i, vertices.getX(i) - (i % 3) * 0.09);
                if (vertices.getY(i) < -0.5) vertices.setY(i, vertices.getY(i) + (i % 4) * 0.055);
            }
            flag.scale.set(size, size, size);
            flag.position.x = x + size * 0.48;
            flag.material.side = THREE.DoubleSide;
            rough(flag, 'bark', 0.025);
        }
        // A tessellated, uneven plain behind the playable embankment.
        const groundGeometry = new THREE.PlaneGeometry(90, 60, 90, 60);
        groundGeometry.rotateX(-Math.PI / 2);
        const vertices = groundGeometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i), z = vertices.getZ(i);
            vertices.setY(i, Math.sin(x * 0.7) * Math.cos(z * 0.6) * 0.12 + Math.sin(x * 2.3 + z) * 0.035);
        }
        groundGeometry.computeVertexNormals();
        const ground = rough(mesh(groundGeometry, '#85613e', 0, -0.75, -32));
        ground.name = 'battlefield-terrain'; ground.castShadow = false;
        const sun = mesh(new THREE.SphereGeometry(2.35, 32, 20), '#ffda8a', 0, 3.3, -39);
        sun.material.dispose(); sun.material = new THREE.MeshBasicMaterial({ color: '#ffd68a', fog: false });
        sun.castShadow = false;
        // Irregular rock and rubble silhouettes use two instanced batches.
        const rubbleGeometry = new THREE.IcosahedronGeometry(1, 0);
        const rubbleMaterial = new THREE.MeshStandardMaterial({ color: '#69533e', roughness: 1,
            map: texture('rock'), bumpMap: texture('rock'), bumpScale: 0.15 });
        const rubble = new THREE.InstancedMesh(rubbleGeometry, rubbleMaterial, 150);
        const transform = new THREE.Object3D();
        for (let i = 0; i < 150; i++) {
            transform.position.set(Math.sin(i * 37.41) * 27, -0.55, -3 - i * 1.71 % 42);
            transform.rotation.set(i * 0.7, i * 1.3, i * 0.17);
            const size = 0.12 + i % 7 * 0.08;
            transform.scale.set(size * 1.7, size * 0.55, size);
            transform.updateMatrix(); rubble.setMatrixAt(i, transform.matrix);
        }
        rubble.receiveShadow = true; group.add(rubble);
        // The main collision surface is a raised earthen battlefield terrace.
        platforms.forEach((p, index) => {
            const x = (p.x + p.w / 2 - 480) / 65, top = (540 - p.y) / 65, w = p.w / 65;
            const earth = rough(mesh(new THREE.CylinderGeometry(w * 0.5, w * 0.43, p.main ? 1.5 : 0.65, 9), '#795d40', x, top - (p.main ? 1 : 0.55), 0));
            earth.scale.z = Math.min(1, 2 / w);
            if (!p.main) {
                for (const side of [-1, 1]) rough(branch('#63513c', [x + side * w * 0.3, top - 0.5, -1],
                    [x + side * w * 0.35, top - 1.65, -1.4], 0.13), 'bark');
                if (index === 3) warBanner(x, top + 0.9, -1.5, red);
            }
        });
        function wheel(parent, x, y, z, r) {
            const rim = steel(mesh(new THREE.TorusGeometry(r, r * 0.1, 6, 20), metal, x, y, z));
            attach(parent, rim);
            attach(parent, steel(ball(metal, x, y, z, r * 0.18, 1, 1, 0.65)));
            for (let spoke = 0; spoke < 8; spoke++) {
                const angle = spoke * Math.PI / 4;
                attach(parent, branch('#786044', [x, y, z], [x + Math.cos(angle) * r, y + Math.sin(angle) * r, z], r * 0.035));
            }
            return rim;
        }
        function shield(x, y, z, radius) {
            const disk = steel(ball(metal, x, y, z, radius, 1, 1, 0.14));
            disk.material.map = texture('rock');
            steel(mesh(new THREE.TorusGeometry(radius * 0.84, 0.025, 6, 24), '#cfaa69', x, y, z + 0.08));
            return disk;
        }
        // Abandoned wheels, shields and spears frame the sides of the arena.
        for (const side of [-1, 1]) {
            const wreck = new THREE.Group(); group.add(wreck);
            wheel(wreck, 0, 0.8, 0, 1.1);
            wreck.position.set(side * 7.7, -0.65, -2.6); wreck.rotation.set(-0.15, side * 0.35, side * 0.22);
            shield(side * 6.4, -0.05, -2.3, 0.7).rotation.z = side * 0.3;
            warBanner(side * 8.6, 2.5, -4, red, 1.7);
            for (let i = 0; i < 5; i++) {
                const x = side * (5.8 + i * 0.45), z = -3.5 - i * 0.65;
                rough(branch('#63503a', [x, -0.6, z], [x + side * 0.4, 0.8 + i % 3 * 0.2, z], 0.025), 'bark');
                steel(mesh(new THREE.ConeGeometry(0.08, 0.38, 4), metal, x + side * 0.4, 1 + i % 3 * 0.2, z));
            }
        }
        function chariot(x, z, phase) {
            const cart = new THREE.Group(); cart.name = 'battlefield-chariot'; group.add(cart);
            attach(cart, rough(box('#664a32', 0, 0.65, 0, 2, 0.3, 1.6), 'bark'));
            attach(cart, box('#96734a', 0, 1.2, -0.7, 2, 0.8, 0.13));
            wheel(cart, -0.7, 0.5, 0.85, 0.6); wheel(cart, 0.7, 0.5, 0.85, 0.6);
            for (const side of [-1, 1]) attach(cart, pillar(metal, side * 0.85, 2.05, -0.5, 0.055, 0.065, 2.1));
            const canopy = attach(cart, pillar(red, 0, 3.2, -0.5, 0.25, 1.45, 0.6, 4)); canopy.rotation.y = Math.PI / 4;
            cart.position.set(x, -0.55, z);
            animations.push(t => { cart.position.x = x + Math.sin(t * 0.13 + phase) * 0.6; cart.rotation.z = Math.sin(t * 1.5 + phase) * 0.008; });
        }
        chariot(-10, -18, 0); chariot(11, -23, 2);
        function elephant(x, z, phase) {
            const actor = new THREE.Group(); actor.name = 'battlefield-elephant'; group.add(actor);
            attach(actor, ball('#5b5049', 0, 1.7, 0, 1, 1.5, 1, 0.7));
            attach(actor, ball('#63564c', -1.25, 2, 0, 0.65, 1, 1, 0.8));
            attach(actor, ball('#716056', -0.95, 1.95, 0.45, 0.65, 0.7, 1.1, 0.18));
            const trunk = attach(actor, branch('#65574b', [-1.7, 1.85, 0], [-1.9, 0.7, 0], 0.15, 0.1));
            attach(actor, branch('#65574b', [-1.9, 0.7, 0], [-2.15, 0.65, 0], 0.1, 0.07));
            attach(actor, branch('#c3b18b', [-1.65, 1.5, 0.35], [-2.2, 1.7, 0.35], 0.07, 0.015));
            attach(actor, box(red, 0.2, 2.65, 0, 1.6, 0.2, 1.35));
            const legs = [];
            for (const side of [-1, 1]) for (const end of [-1, 1]) {
                const leg = attach(actor, pillar('#51473f', end * 0.85, 0.75, side * 0.48, 0.23, 0.24, 1.4));
                legs.push(leg);
            }
            actor.position.set(x, -0.6, z);
            animations.push(t => {
                actor.position.x = x + Math.sin(t * 0.09 + phase) * 1.3;
                actor.position.y = -0.6 + Math.sin(t * 1.1 + phase) * 0.025;
                legs.forEach((leg, i) => { leg.rotation.z = Math.sin(t * 1.1 + phase + i % 2 * Math.PI) * 0.1; });
                trunk.rotation.z = Math.sin(t * 0.7 + phase) * 0.06;
            });
        }
        elephant(-15, -25, 0); elephant(15, -29, 3);
        // Articulated duels: approach, swing, block, recoil, then reset.
        function warrior(color, direction) {
            const actor = new THREE.Group(); actor.name = 'battlefield-warrior'; group.add(actor);
            attach(actor, pillar(color, 0, 0.95, 0, 0.19, 0.25, 0.55, 8));
            const armor = attach(actor, box(metal, 0, 1.02, 0.13, 0.28, 0.3, 0.09)); steel(armor);
            attach(actor, ball('#ab805d', 0, 1.48, 0, 0.17));
            steel(attach(actor, ball('#a08150', 0, 1.57, 0, 0.18, 1, 0.7, 1)));
            const limbs = [];
            for (const side of [-1, 1]) {
                const arm = new THREE.Group(); arm.position.set(side * 0.25, 1.17, 0); actor.add(arm);
                attach(arm, pillar(color, 0, -0.18, 0, 0.065, 0.075, 0.37, 8));
                attach(arm, ball('#a77b57', 0, -0.4, 0, 0.065));
                const leg = new THREE.Group(); leg.position.set(side * 0.12, 0.69, 0); actor.add(leg);
                attach(leg, pillar('#514335', 0, -0.24, 0, 0.085, 0.065, 0.48, 8));
                attach(leg, box('#3e332b', 0.02, -0.54, 0.03, 0.16, 0.16, 0.23));
                if (side === direction) {
                    steel(attach(arm, box('#bbb3a0', 0, -0.8, 0, 0.075, 0.75, 0.025)));
                    attach(arm, box(metal, 0, -0.46, 0, 0.22, 0.05, 0.06));
                } else {
                    const guard = steel(attach(arm, ball(metal, 0, -0.25, 0.11, 0.24, 1, 1, 0.2)));
                    guard.material.roughness = 0.55;
                }
                limbs.push({ arm, leg, side });
            }
            return { actor, limbs };
        }
        for (let pair = 0; pair < 4; pair++) {
            const x = (pair - 1.5) * 5.3, z = -7.5 - pair % 2 * 5;
            const soldiers = [warrior('#8b3930', 1), warrior('#6d6852', -1)];
            const spark = glow(ball('#ffd48a', x, 0.7, z + 0.2, 0.07), '#ffb347', 1.5);
            spark.castShadow = false;
            animations.push(t => {
                const cycle = (t * 0.5 + pair * 0.27) % 1;
                const engage = Math.sin(cycle * Math.PI);
                soldiers.forEach(({ actor, limbs }, index) => {
                    const facing = index ? -1 : 1;
                    actor.position.set(x - facing * (1.4 - engage * 0.65), -0.55 + Math.abs(Math.sin(t * 3 + index)) * 0.025, z);
                    actor.rotation.y = facing * 0.55;
                    actor.rotation.z = facing * Math.sin(cycle * Math.PI * 4 + index) * 0.065 * engage;
                    limbs.forEach(({ arm, leg, side }) => {
                        arm.rotation.z = -facing * (side === facing ? 1.3 + Math.sin(t * 4 + pair + index * Math.PI) * 0.9 * engage : 0.8);
                        arm.rotation.x = side === facing ? Math.sin(t * 4 + pair) * 0.3 : -0.4;
                        leg.rotation.z = Math.sin(t * 3 + side + index) * (0.2 - engage * 0.1);
                    });
                });
                spark.visible = engage > 0.8 && Math.sin(t * 8 + pair) > 0.93;
                spark.scale.setScalar(0.5 + Math.abs(Math.sin(t * 8 + pair)) * 1.3);
            });
        }
        // Distant ranks share geometry; animation updates only their instance matrices.
        const ranks = new THREE.InstancedMesh(new THREE.ConeGeometry(0.16, 0.85, 5),
            new THREE.MeshStandardMaterial({ color: '#4e463d', roughness: 1 }), 72);
        ranks.name = 'battlefield-distant-ranks'; group.add(ranks);
        animations.push(t => {
            for (let i = 0; i < ranks.count; i++) {
                transform.position.set((i % 18 - 8.5) * 1.8 + Math.sin(t * 0.45 + i) * 0.35, -0.1 + Math.abs(Math.sin(t * 2 + i)) * 0.04, -18 - Math.floor(i / 18) * 4);
                transform.rotation.set(0, Math.sin(t + i) * 0.2, Math.sin(t * 2 + i) * 0.05);
                transform.scale.set(1, 1, 1); transform.updateMatrix(); ranks.setMatrixAt(i, transform.matrix);
            }
            ranks.instanceMatrix.needsUpdate = true;
        });
        for (let i = 0; i < 12; i++) warBanner(i * 3.6 - 20, 1.1 + i % 3 * 0.3, -16 - i % 4 * 4, i % 2 ? '#6c4530' : red);
        // Soft, billboarding dust uses a generated opacity texture, never flat opaque blobs.
        if (!hazeTexture) {
            const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
            const ctx = canvas.getContext('2d'), gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255,255,255,0.3)'); gradient.addColorStop(0.4, 'rgba(255,255,255,0.15)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
            hazeTexture = new THREE.CanvasTexture(canvas);
        }
        for (let i = 0; i < 16; i++) {
            const dust = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTexture, color: '#d5aa7b', transparent: true, opacity: 0.42, depthWrite: false }));
            dust.name = 'battlefield-dust'; group.add(dust);
            animations.push(t => {
                const phase = (t * 0.035 + i / 16) % 1;
                dust.position.set(((i * 5.7 + t * 0.25) % 48) - 24, 0.2 + phase * 0.9, -9 - i % 5 * 5);
                dust.scale.set(5 + phase * 4, 1.3 + phase * 1.5, 1);
                dust.material.opacity = Math.sin(phase * Math.PI) * 0.38;
            });
        }
    }
    return { build };
})();
