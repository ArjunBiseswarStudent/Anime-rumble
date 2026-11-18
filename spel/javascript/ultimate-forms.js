/* Ultimate looks are cosmetic. Each fighter keeps their rig, moves and hitbox. */
window.UltimateForms = (() => {
    const REVEAL_AT = .34;
    const BURST_DURATION = .46;
    const RIBBON_SEGMENTS = 24;
    const forms = Object.freeze({
        gojo: ['Limitless Awakening', '#925eff', '#243567', 'halo'],
        sukuna: ['Heian Form', '#ff463e', '#24202d', 'horns', '#e794ae'],
        yuji: ['Black Flash Awakening', '#f6545b', '#231b30', 'surge'],
        jinwoo: ['Shadow Monarch', '#8b54ff', '#171323', 'wings'],
        cha: ['Radiant Sword Saint', '#fff2a7', '#bd9149', 'halo'],
        beru: ['Shadow General', '#be75ff', '#21152d', 'wings'],
        deku: ['One For All: Full Cowl', '#56ffbb', '#12594d', 'surge'],
        bakugo: ['Cluster Awakening', '#ff9639', '#3a2830', 'surge'],
        todoroki: ['Phosphor', '#8ce9ff', '#324766', 'wings'],
        asta: ['Devil Union', '#fb4260', '#211726', 'horns'],
        yuno: ['Spirit Dive', '#9effb8', '#287255', 'wings'],
        noelle: ['Valkyrie Dress', '#8ddaff', '#347396', 'wings'],
        tanjiro: ['Sun Breathing', '#ff963e', '#412535', 'halo'],
        nezuko: ['Awakened Demon Form', '#ff69ad', '#6d3156', 'horns'],
        zenitsu: ['Seventh Form: Flaming Thunder God', '#fff27b', '#c28126', 'surge'],
        natsu: ['Dragon Force', '#ff734b', '#872f34', 'wings'],
        erza: ['Nakagami Armor', '#fff0cd', '#914149', 'wings'],
        gray: ['Ice Devil Slayer', '#78dcff', '#253558', 'horns'],
        sonic: ['Super Sonic', '#ffdb44', '#efb321', 'surge', '#fff17b'],
        shadow: ['Super Shadow', '#fff2a0', '#c3aa65', 'surge', '#fff0ac'],
        knuckles: ['Super Knuckles', '#ff99da', '#e259a5', 'surge', '#ff99da'],
        mario: ['Super Star Mario', '#fff26b', '#ae482a', 'halo'],
        bowser: ['Fury Bowser', '#ff7131', '#261e28', 'horns', '#ff542a'],
        dk: ['Jungle Power', '#ffbb4c', '#70401c', 'surge'],
        cloud: ['Omnislash Ascension', '#8ddcff', '#243c64', 'surge'],
        sephiroth: ['One-Winged Angel', '#b5a3ff', '#241b3b', 'singleWing', '#eaecff'],
        tifa: ['Final Heaven', '#ffae75', '#5a2437', 'surge'],
        denji: ['Chainsaw Devil', '#ff7740', '#322831', 'horns'],
        power: ['Blood Devil', '#fa4667', '#613146', 'horns'],
        aki: ['Fox Contract Awakening', '#a4dcff', '#273a55', 'surge'],
        naruto: ['Six Paths Sage Mode', '#ffbd2e', '#f29a22', 'orbs', '#ffde65'],
        sasuke: ['Perfect Susanoo', '#a467ff', '#392865', 'wings'],
        sakura: ['Strength of a Hundred', '#ff86be', '#8b284e', 'surge'],
        itachi: ['Susanoo Awakening', '#ff6848', '#542137', 'wings'],
        kakashi: ['Dual Mangekyō Awakening', '#86d7ff', '#274765', 'wings'],
        jiraiya: ['Sage Mode', '#e77b63', '#6a3a37', 'halo', '#f5f0dd'],
        gaara: ['Shukaku Awakening', '#f0c377', '#805c38', 'horns'],
        shikamaru: ['Shadow Possession Master', '#a391c8', '#32304c', 'orbs'],
        kiba: ['Three-Headed Wolf Mode', '#e3b397', '#52383c', 'surge'],
        luffy: ['Gear 5', '#e7dcff', '#f2ede9', 'cloud', '#fff9ed'],
        zoro: ['King of Hell', '#68ffa4', '#194f41', 'surge'],
        sanji: ['Ifrit Jambe', '#74cbff', '#202c49', 'surge'],
        usopp: ['God Usopp', '#ffe681', '#74552a', 'halo'],
        chopper: ['Monster Point', '#e491bc', '#713448', 'horns'],
        nami: ['Zeus Tempest', '#9fbeff', '#435598', 'cloud'],
        robin: ['Demonio Fleur', '#d17dff', '#47254d', 'wings'],
        brook: ['Soul King', '#7cffe2', '#21524e', 'surge'],
        goku: ['Ultra Instinct', '#c1ddff', '#30475e', 'surge', '#e6eeff'],
        vegeta: ['Ultra Ego', '#d26fff', '#4a265e', 'surge', '#b960ed'],
        gohan: ['Beast', '#d8c8ff', '#382b60', 'surge', '#edf0ff'],
        piccolo: ['Orange Piccolo', '#ffb344', '#612d57', 'surge', null, '#f4a03d'],
        trunks: ['Super Saiyan Rage', '#ffd662', '#344e76', 'surge', '#ffe472'],
        hit: ['Time-Skip Master', '#d598ff', '#443057', 'halo'],
        frieza: ['Black Frieza', '#cf8cff', '#292033', 'horns', null, '#51415f'],
        beerus: ['God of Destruction', '#c37dff', '#3c2470', 'orbs'],
        jiren: ['Full Power', '#ff774d', '#631e32', 'surge']
    });

    function activate(THREE, fighter) {
        const form = forms[fighter.character.id];
        if (!form || fighter.ultimateForm || fighter.stocks <= 0 || fighter.damage >= 100) return;
        const [name, color, outfit, style, hair, skin] = form;
        const { model } = fighter;
        const palette = model.userData.palette;
        const effect = new THREE.Group();
        const reveal = new THREE.Group();
        const eruption = new THREE.Group();
        effect.add(reveal);
        effect.add(eruption);
        const aura = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: .62, blending: THREE.AdditiveBlending,
            depthWrite: false, toneMapped: false
        });
        const flash = new THREE.MeshBasicMaterial({
            color: '#f3f8ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
            depthWrite: false, toneMapped: false
        });
        const wave = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
            depthWrite: false, toneMapped: false
        });
        const ribbonMaterial = new THREE.MeshBasicMaterial({
            color, vertexColors: true, transparent: true, opacity: .53, blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide, depthWrite: false, toneMapped: false
        });
        const ribbons = Array.from({ length: 3 }, () => {
            const geometry = new THREE.BufferGeometry();
            const positions = new THREE.BufferAttribute(new Float32Array((RIBBON_SEGMENTS + 1) * 6), 3);
            positions.setUsage(THREE.DynamicDrawUsage);
            geometry.setAttribute('position', positions);
            const colors = new Float32Array(positions.array.length);
            const indices = [];
            for (let i = 0; i <= RIBBON_SEGMENTS; i++) {
                const vertex = i * 2;
                const brightness = Math.sin(Math.PI * i / RIBBON_SEGMENTS) ** .65;
                colors.fill(brightness, vertex * 3, vertex * 3 + 3);
                colors.fill(brightness * .16, vertex * 3 + 3, vertex * 3 + 6);
                if (i < RIBBON_SEGMENTS) indices.push(vertex, vertex + 1, vertex + 2, vertex + 1, vertex + 3, vertex + 2);
            }
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setIndex(indices);
            const ribbon = new THREE.Mesh(geometry, ribbonMaterial);
            ribbon.frustumCulled = false;
            effect.add(ribbon);
            return positions;
        });
        const energyLight = new THREE.PointLight(color, 0, 3.6, 2);
        energyLight.position.set(.28, 1.47, .58);
        effect.add(energyLight);
        const solid = style === 'surge' || style === 'orbs' ? null
            : new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .24, roughness: .55 });
        const orbMaterial = style === 'orbs' ? new THREE.MeshStandardMaterial({ color: '#20202c', roughness: .3 }) : solid;
        function part(geometry, material, x, y, z, parent = effect) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            parent.add(mesh);
            return mesh;
        }
        const ring = part(new THREE.TorusGeometry(.71, .025, 8, 36), aura, 0, .16, 0);
        ring.rotation.x = Math.PI / 2;
        const particles = [];
        const spark = new THREE.ConeGeometry(.047, .36, 5);
        for (let i = 0; i < 10; i++) particles.push(part(spark, aura, 0, 0, 0));
        const auraArc = new THREE.TorusGeometry(.66, .035, 8, 32, Math.PI * .83);
        const arcs = [];
        for (let i = 0; i < 3; i++) {
            const arc = part(auraArc, aura, 0, .74 + i * .44, 0);
            arc.rotation.x = Math.PI / 2 + (i - 1) * .22;
            arcs.push(arc);
        }
        const groundWave = part(new THREE.TorusGeometry(.57, .035, 8, 48), wave, 0, .12, 0, eruption);
        groundWave.rotation.x = Math.PI / 2;
        const ray = new THREE.ConeGeometry(.045, 1, 5);
        const rays = [];
        for (let i = 0; i < 14; i++) {
            const angle = i * 2.4;
            const tilt = (i % 5 - 1) * .17;
            const mesh = part(ray, i % 2 ? wave : flash, 0, 0, 0, eruption);
            mesh.rotation.y = Math.PI / 2 - angle;
            mesh.rotation.z = -1.34 + tilt;
            rays.push({ mesh, angle, tilt });
        }
        if (style === 'halo') part(new THREE.TorusGeometry(.48, .038, 8, 36), solid, 0, 2.16, -.24, reveal);
        if (style === 'horns') {
            const horn = new THREE.ConeGeometry(.075, .37, 8);
            for (const side of [-1, 1]) part(horn, solid, side * .18, 2.32, 0, reveal).rotation.z = side * -.39;
        }
        if (style === 'wings' || style === 'singleWing') {
            const feather = new THREE.ConeGeometry(.135, .98, 5);
            for (const side of style === 'singleWing' ? [1] : [-1, 1]) {
                for (let i = 0; i < 5; i++) {
                    const plume = part(feather, solid, side * (.43 + i * .108), 1.84 - i * .135, -.22 - i * .035, reveal);
                    plume.rotation.z = side * (-.98 - i * .14);
                    plume.scale.set(.72, 1 - i * .075, .48);
                }
            }
        }
        const satellites = [];
        if (style === 'orbs' || style === 'cloud') {
            const sphere = new THREE.SphereGeometry(style === 'orbs' ? .092 : .128, 14, 10);
            for (let i = 0; i < 7; i++) {
                const angle = i * Math.PI * 2 / 7;
                const mesh = part(sphere, orbMaterial, Math.cos(angle) * .65,
                    style === 'orbs' ? 1.33 + Math.sin(angle) * .72 : 1.87 + Math.sin(angle) * .22,
                    -.38 + Math.sin(angle) * .14, reveal);
                satellites.push({ mesh, angle, y: mesh.position.y, z: mesh.position.z });
            }
        }
        if (fighter.character.id === 'naruto') {
            const crest = new THREE.TorusGeometry(.036, .012, 6, 14);
            for (let i = -1; i <= 1; i++) part(crest, orbMaterial, i * .093, 1.62 - Math.abs(i) * .045, .23, reveal);
            const hem = new THREE.SphereGeometry(1, 14, 10);
            for (const side of [-1, 1]) {
                const panel = part(hem, palette.suit, side * .195, 1.05, -.13, reveal);
                panel.scale.set(.15, .49, .077);
                panel.rotation.z = side * .21;
            }
        }
        model.add(effect);
        fighter.ultimateForm = {
            name, color, outfit, hair, skin, palette, effect, aura, ring, particles, arcs, satellites,
            reveal, eruption, groundWave, rays, flash, wave, ribbons, ribbonMaterial, energyLight, age: 0, revealed: false
        };
        update(fighter, 0);
        return name;
    }
    function update(fighter, dt) {
        const form = fighter.ultimateForm;
        if (!form) return;
        form.age += dt;
        const charging = form.age < REVEAL_AT;
        const charge = charging ? form.age / REVEAL_AT : 0;
        if (!charging && !form.revealed) {
            form.palette.suit.color.set(form.outfit);
            form.palette.accent.color.set(form.color);
            if (form.hair) form.palette.hair.color.set(form.hair);
            if (form.skin) form.palette.skin.color.set(form.skin);
            form.revealed = true;
        }
        const burst = Math.min(1, (form.age - REVEAL_AT) / BURST_DURATION);
        form.eruption.visible = !charging && burst < 1;
        form.reveal.visible = form.revealed;
        const intensity = charging ? charge ** 2 : (1 - burst) ** 2;
        form.energyLight.intensity = .26 + intensity * 1.55;
        form.ribbonMaterial.opacity = .38 + .23 * intensity;
        form.ribbons.forEach((positions, index) => {
            const winding = index === 1 ? -1 : 1;
            for (let step = 0; step <= RIBBON_SEGMENTS; step++) {
                const t = step / RIBBON_SEGMENTS;
                const angle = winding * (t * 4.7 + form.age * 3.4) + index * 2.09;
                const ripple = Math.sin(t * 16 - form.age * 9 + index) * .065;
                const radius = .68 + ripple + intensity * .29 - t * .19;
                const y = .31 + t * 2.13 + index * .09;
                const width = Math.sin(Math.PI * t) * (.1 + intensity * .13);
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                positions.setXYZ(step * 2, x, y, z);
                positions.setXYZ(step * 2 + 1, x + Math.cos(angle) * width, y + width * 1.6, z + Math.sin(angle) * width);
            }
            positions.needsUpdate = true;
        });
        if (form.eruption.visible) {
            const spread = 1 - (1 - burst) ** 2;
            form.flash.opacity = .59 * (1 - burst) ** 2;
            form.wave.opacity = .76 * (1 - burst);
            form.groundWave.scale.setScalar(1 + 3.8 * spread);
            form.rays.forEach(({ mesh, angle, tilt }) => {
                const radius = .42 + spread * 1.65;
                mesh.position.set(Math.cos(angle) * radius, 1.27 + tilt * radius, Math.sin(angle) * radius);
                mesh.scale.set(.85, (1 - burst) * (.55 + Math.cos(angle) ** 2 * .55), .85);
            });
        }
        form.aura.opacity = charging ? .24 + .46 * charge : .45;
        form.ring.scale.setScalar(charging ? 1.36 - charge * .49 : 1 + .08 * Math.sin(form.age * 6));
        form.arcs.forEach((arc, index) => {
            arc.rotation.z = form.age * (index % 2 ? -3.5 : 3.5) + index * 2.1;
            const size = (charging ? 1.25 - .4 * charge : 1) + Math.sin(form.age * 5 + index) * .08;
            arc.scale.setScalar(size);
        });
        form.satellites.forEach(({ mesh, angle, y, z }) => {
            mesh.position.y = y + Math.sin(form.age * 2 + angle) * .085;
            mesh.position.z = z + Math.cos(form.age * 2 + angle) * .075;
        });
        form.particles.forEach((particle, index) => {
            const angle = index * 2.4 - form.age * 2;
            const height = (index / 10 + form.age * .93) % 1;
            const radius = .66 + (charging ? .38 * (1 - charge) : 0) - .19 * height;
            particle.position.set(Math.cos(angle) * radius, height * 2.65, Math.sin(angle) * radius);
            particle.scale.setScalar(.35 + Math.sin(height * Math.PI) * (.8 + charge * .75));
        });
    }
    function clear(fighter) {
        const form = fighter.ultimateForm;
        if (!form) return;
        const { model, character } = fighter;
        const { suit, accent, hair, skin } = model.userData.palette;
        suit.color.set(character.primary);
        accent.color.set(character.secondary);
        hair.color.set(character.hair);
        skin.color.set(character.skin);
        model.remove(form.effect);
        const geometry = new Set(), materials = new Set();
        form.effect.traverse(mesh => {
            if (mesh.geometry) geometry.add(mesh.geometry);
            if (mesh.material) materials.add(mesh.material);
        });
        geometry.forEach(item => item.dispose());
        const paletteMaterials = Object.values(model.userData.palette);
        materials.forEach(item => { if (!paletteMaterials.includes(item)) item.dispose(); });
        fighter.ultimateForm = null;
    }
    return { forms, activate, update, clear };
})();
