/* Rounded, articulated characters. All poses are relative to their joint rest positions. */
window.CharacterMotion = (() => {
    function create(THREE, character) {
        const root = new THREE.Group();
        const rig = new THREE.Group();
        root.add(rig);
        const material = color => new THREE.MeshStandardMaterial({ color, roughness: 0.78 });
        const skin = material(character.skin), suit = material(character.primary);
        const accent = material(character.secondary), hair = material(character.hair);
        const dark = material('#182131'), white = material('#f1eee6');
        function ellipsoid(parent, mat, x, y, z, sx, sy, sz) {
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), mat);
            mesh.position.set(x, y, z);
            mesh.scale.set(sx, sy, sz);
            parent.add(mesh);
            return mesh;
        }
        function segment(parent, mat, length, top, bottom) {
            const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, length, 16), mat);
            mesh.position.y = -length / 2;
            parent.add(mesh);
            return mesh;
        }
        function joint(parent, x, y, z) {
            const node = new THREE.Group();
            node.position.set(x, y, z);
            parent.add(node);
            return node;
        }
        const torso = joint(rig, 0, 1.13, 0);
        ellipsoid(torso, suit, 0, 0.25, 0, 0.29, 0.43, 0.18);
        ellipsoid(torso, accent, 0, -0.07, 0, 0.27, 0.12, 0.18);
        segment(joint(torso, 0, 0.68, 0), skin, 0.17, 0.09, 0.1);
        const head = joint(torso, 0, 0.77, 0);
        ellipsoid(head, skin, 0, 0.09, 0, 0.215, 0.285, 0.2);
        ellipsoid(head, skin, 0, 0.02, 0.195, 0.035, 0.055, 0.045);
        [-1, 1].forEach(side => {
            ellipsoid(head, skin, side * 0.215, 0.08, 0, 0.045, 0.075, 0.045);
            ellipsoid(head, white, side * 0.085, 0.12, 0.183, 0.06, 0.033, 0.018);
            ellipsoid(head, character.id === 'naruto' ? material('#409ace') : dark, side * 0.085, 0.12, 0.199, 0.023, 0.027, 0.009);
            const brow = ellipsoid(head, hair, side * 0.085, 0.185, 0.18, 0.065, 0.012, 0.018);
            brow.rotation.z = side * -0.12;
        });
        ellipsoid(head, dark, 0, -0.035, 0.19, 0.055, 0.007, 0.01);
        ellipsoid(head, hair, 0, 0.29, -0.025, 0.23, 0.12, 0.21);
        for (let i = 0; i < 9; i++) {
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.24, 5), hair);
            const angle = i / 9 * Math.PI * 2;
            spike.position.set(Math.sin(angle) * 0.16, 0.36 + (i % 2) * 0.045, Math.cos(angle) * 0.14);
            spike.rotation.z = -Math.sin(angle) * 0.7;
            spike.rotation.x = Math.cos(angle) * 0.5;
            head.add(spike);
        }
        if (character.franchise === 'Naruto') {
            ellipsoid(head, dark, 0, 0.25, 0, 0.225, 0.05, 0.212);
            ellipsoid(head, material('#b9c5cc'), 0, 0.25, 0.207, 0.13, 0.04, 0.015);
            const emblem = new THREE.Mesh(new THREE.TorusGeometry(0.021, 0.004, 5, 16), dark);
            emblem.position.set(0, 0.25, 0.225);
            head.add(emblem);
        }
        if (character.id === 'naruto') {
            ellipsoid(torso, dark, 0, 0.48, 0, 0.285, 0.16, 0.185);
            ellipsoid(torso, white, 0, 0.19, 0.183, 0.009, 0.35, 0.008);
            [-1, 1].forEach(side => {
                for (let line = 0; line < 3; line++) {
                    const whisker = ellipsoid(head, dark, side * 0.14, 0.025 - line * 0.035, 0.162, 0.045, 0.004, 0.005);
                    whisker.rotation.z = side * (0.1 + line * 0.1);
                }
            });
        }
        const limbs = [];
        [-1, 1].forEach(side => {
            const shoulder = joint(torso, side * 0.3, 0.49, 0);
            ellipsoid(shoulder, suit, 0, -0.035, 0, 0.12, 0.14, 0.12);
            segment(shoulder, suit, 0.34, 0.105, 0.08);
            const elbow = joint(shoulder, 0, -0.34, 0);
            ellipsoid(elbow, suit, 0, 0, 0, 0.082, 0.09, 0.082);
            segment(elbow, suit, 0.3, 0.08, 0.06);
            ellipsoid(elbow, accent, 0, -0.26, 0, 0.066, 0.055, 0.069);
            ellipsoid(elbow, skin, 0, -0.36, 0.015, 0.065, 0.09, 0.045);
            for (let finger = 0; finger < 4; finger++) {
                ellipsoid(elbow, skin, (finger - 1.5) * 0.025, -0.435, 0.026, 0.014, 0.042, 0.018);
            }
            const hip = joint(rig, side * 0.145, 1.08, 0);
            segment(hip, suit, 0.46, 0.135, 0.1);
            const knee = joint(hip, 0, -0.46, 0);
            ellipsoid(knee, suit, 0, 0, 0, 0.1, 0.105, 0.1);
            segment(knee, suit, 0.43, 0.1, 0.07);
            ellipsoid(knee, accent, 0, -0.44, 0.075, 0.09, 0.09, 0.18);
            limbs.push({ side, shoulder, elbow, hip, knee });
        });
        const shield = new THREE.Mesh(new THREE.SphereGeometry(1.25, 24, 18), new THREE.MeshBasicMaterial({ color: character.aura, transparent: true, opacity: 0.2, depthWrite: false }));
        shield.position.y = 1.1;
        shield.visible = false;
        root.add(shield);
        root.userData.shield = shield;
        root.userData.motion = { rig, torso, head, limbs, time: 0, blend: 0, landing: 0, wasGrounded: false, action: '', actionTime: 0 };
        return root;
    }

    function attack(root, action) {
        const motion = root.userData.motion;
        if (motion) { motion.action = action; motion.actionTime = action === 'punch' ? 0.42 : 0.7; }
    }

    function update(root, fighter, dt) {
        const m = root.userData.motion;
        if (!m) return;
        m.time += dt;
        m.actionTime = Math.max(0, m.actionTime - dt);
        const moving = Math.min(1, Math.abs(fighter.vx || 0) / 4);
        const follow = 1 - Math.exp(-dt * 14);
        m.blend += (moving - m.blend) * follow;
        if (fighter.grounded && !m.wasGrounded) m.landing = 1;
        m.wasGrounded = fighter.grounded;
        m.landing = Math.max(0, m.landing - dt * 5);
        const airborne = !fighter.grounded;
        const guard = fighter.blocking;
        const active = m.actionTime > 0;
        const punch = active && m.action === 'punch';
        const super1 = active && m.action === 'neutral';
        const super2 = active && m.action === 'side';
        const phase = m.time * (9 + moving * 5);
        const strike = punch ? Math.sin((1 - m.actionTime / 0.42) * Math.PI) : 0;
        const power = active && !punch ? Math.sin((1 - m.actionTime / 0.7) * Math.PI) : 0;
        m.rig.position.y = Math.sin(m.time * 2.6) * 0.015 + Math.abs(Math.sin(phase)) * m.blend * 0.045 - m.landing * 0.09;
        m.torso.rotation.x += ((guard ? 0.18 : airborne ? -0.1 : m.blend * 0.18) - m.torso.rotation.x) * follow;
        m.torso.rotation.y += ((strike * -0.55 + (super2 ? power * -0.8 : 0)) - m.torso.rotation.y) * follow;
        m.head.rotation.x = -m.torso.rotation.x * 0.6;
        m.head.rotation.y = -m.torso.rotation.y * 0.45;
        m.limbs.forEach(({ side, shoulder, elbow, hip, knee }) => {
            const swing = Math.sin(phase + (side === 1 ? Math.PI : 0)) * m.blend;
            let arm = swing * 0.85 - 0.15;
            let bend = -0.35 - Math.max(0, -swing) * 0.65;
            let leg = -swing * 0.8;
            let kneel = Math.max(0, swing) * m.blend * 1.1 + m.landing * 0.45;
            if (airborne) { arm = -0.55; bend = -0.9; leg = side === 1 ? -0.8 : 0.3; kneel = side === 1 ? 1.1 : 0.5; }
            if (guard) { arm = -1.05; bend = -1.25; leg = side * 0.15; kneel = 0.25; }
            if (punch && side === 1) { arm = -0.35 - strike * 1.3; bend = -0.95 + strike * 0.85; }
            if (super1) { arm = -0.6 - power; bend = -1.15 + power; }
            if (super2) { arm = side === 1 ? -1.7 * power : 0.4; bend = -0.4; leg = side === 1 ? -power * 1.4 : 0.25; kneel = side === 1 ? 0.2 : 0.4; }
            shoulder.rotation.x += (arm - shoulder.rotation.x) * follow;
            shoulder.rotation.z += ((-side * (guard ? 0.2 : 0.08)) - shoulder.rotation.z) * follow;
            elbow.rotation.x += (bend - elbow.rotation.x) * follow;
            hip.rotation.x += (leg - hip.rotation.x) * follow;
            knee.rotation.x += (kneel - knee.rotation.x) * follow;
        });
        const targetYaw = fighter.facing > 0 ? Math.PI / 2 - 0.3 : -Math.PI / 2 + 0.3;
        const difference = Math.atan2(Math.sin(targetYaw - root.rotation.y), Math.cos(targetYaw - root.rotation.y));
        root.rotation.y += difference * (1 - Math.exp(-dt * 18));
    }
    return { create, attack, update };
})();
