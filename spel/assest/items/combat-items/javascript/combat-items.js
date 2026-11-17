/* Equipment follows the articulated hand joints in portraits and combat. */
window.CombatItems = (() => {
    const data = window.CombatItemData;
    function list(id) { return data[id] || []; }
    function names(id) { return list(id).map(item => item.name).join(' · '); }
    function createWeapon(THREE, type) {
        const root = new THREE.Group();
        root.userData.weaponType = type;
        const energy = /wind|water|ice|blood/.test(type);
        const color = type.includes('blood') ? '#c82e51' : type.includes('wind') ? '#66efb5' : /water|ice/.test(type) ? '#80dcfa' : '#c2cdd8';
        const steel = new THREE.MeshStandardMaterial({ color, metalness: energy ? 0.1 : 0.7, roughness: 0.32, ...(energy ? { emissive: color, emissiveIntensity: 0.35, transparent: true, opacity: 0.85 } : {}) });
        const grip = new THREE.MeshStandardMaterial({ color: '#343348', roughness: 0.8 });
        const gold = new THREE.MeshStandardMaterial({ color: '#d9b261', metalness: 0.5, roughness: 0.4 });
        function part(geometry, material, x, y, z) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            root.add(mesh);
            return mesh;
        }
        function shaft(length, radius, material = grip, y = -length / 2) {
            return part(new THREE.CylinderGeometry(radius, radius, length, 12), material, 0, y, 0);
        }
        function blade(length, width) {
            part(new THREE.BoxGeometry(width, length, 0.035), steel, 0, -0.18 - length / 2, 0);
            const tip = part(new THREE.ConeGeometry(width * 0.6, 0.16, 4), steel, 0, -0.18 - length - 0.08, 0);
            tip.rotation.z = Math.PI;
            shaft(0.18, 0.035, grip, -0.04);
            part(new THREE.BoxGeometry(width + 0.16, 0.035, 0.1), gold, 0, -0.14, 0);
        }
        if (type === 'kunai') {
            shaft(0.15, 0.025, grip, 0.02);
            const tip = part(new THREE.ConeGeometry(0.075, 0.24, 4), steel, 0, -0.17, 0);
            tip.rotation.z = Math.PI;
            part(new THREE.TorusGeometry(0.045, 0.012, 6, 16), steel, 0, 0.13, 0);
        } else if (/bracers|gloves/.test(type)) {
            const bracer = part(new THREE.SphereGeometry(1, 16, 10), type === 'bracers' ? grip : gold, 0, 0.08, 0);
            bracer.scale.set(0.11, type === 'bracers' ? 0.22 : 0.1, 0.12);
            if (type === 'bracers') for (let i = 0; i < 4; i++) part(new THREE.TorusGeometry(0.105, 0.015, 6, 16), gold, 0, i * 0.08, 0).rotation.x = Math.PI / 2;
        } else if (type === 'slingshot') {
            shaft(0.42, 0.035, gold);
            [-1, 1].forEach(side => {
                const fork = part(new THREE.CylinderGeometry(0.035, 0.035, 0.35, 12), gold, side * 0.1, 0.08, 0);
                fork.rotation.z = side * -0.55;
            });
            const band = part(new THREE.CylinderGeometry(0.012, 0.012, 0.38, 8), grip, 0, 0.23, 0);
            band.rotation.z = Math.PI / 2;
        } else if (/hammer/.test(type)) {
            shaft(0.68, 0.045);
            part(new THREE.BoxGeometry(0.5, 0.25, 0.27), type === 'blood-hammer' ? steel : gold, 0, -0.65, 0);
        } else if (/spear|staff|pole/.test(type)) {
            shaft(1.35, 0.03, type === 'pole' ? new THREE.MeshStandardMaterial({ color: '#b92e39' }) : steel, -0.32);
            if (type.includes('spear')) {
                const tip = part(new THREE.ConeGeometry(0.09, 0.32, 4), steel, 0, -1.15, 0);
                tip.rotation.z = Math.PI;
            }
            if (type === 'staff') [-0.9, 0.3].forEach(y => part(new THREE.SphereGeometry(0.065, 12, 8), gold, 0, y, 0));
        } else {
            const large = ['buster-sword', 'fusion-sword', 'anti-sword'].includes(type);
            blade(type === 'dagger' ? 0.4 : type === 'long-katana' ? 1.4 : large ? 1.05 : 0.8, large ? 0.23 : 0.07);
        }
        return root;
    }
    function attach(THREE, model, character) {
        const items = list(character.id), motion = model.userData.motion;
        model.userData.combatItems = [];
        if (!motion || !items.length) return;
        const right = motion.limbs.find(limb => limb.side === 1).elbow;
        const left = motion.limbs.find(limb => limb.side === -1).elbow;
        let loadoutIndex = 0;
        function equip(type, parent, x = 0, y = -0.39, z = 0.035, tilt = 0) {
            const weapon = createWeapon(THREE, type);
            weapon.position.set(x, y, z);
            weapon.rotation.z = tilt;
            weapon.userData.loadoutIndex = loadoutIndex;
            weapon.visible = loadoutIndex === 0;
            parent.add(weapon);
            model.userData.combatItems.push(weapon);
        }
        items.forEach((item, index) => {
            loadoutIndex = index;
            if (item.type === 'triple-katana') {
                equip('katana', right); equip('katana', left);
                equip('katana', motion.head, 0, -0.04, 0.24, Math.PI / 2);
            } else if (item.type === 'dual-daggers') {
                equip('dagger', right); equip('dagger', left);
            } else if (item.type === 'four-swords') {
                equip('anti-sword', right);
                for (let i = 0; i < 3; i++) equip('anti-sword', motion.torso, (i - 1) * 0.14, 0.6, -0.25, (i - 1) * 0.3);
            } else if (['gloves', 'bracers'].includes(item.type)) {
                equip(item.type, right); equip(item.type, left);
            } else if (character.id === 'cloud' && index === 1) {
                equip(item.type, motion.torso, 0.1, 0.55, -0.3, -0.45);
            } else equip(item.type, index === 0 ? right : left);
        });
    }
    return { list, names, attach, createWeapon };
})();
