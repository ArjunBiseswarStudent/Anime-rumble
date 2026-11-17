/* Shared arena definitions and scenery. Platform coordinates match the game's 960 × 540 world. */
window.AnimeMaps = (() => {
    const platform = (x, y, w, main = false) => ({ x, y, w, main });
    const arenas = {
        frog: { name: 'Frog Island', series: 'Naruto · Mount Myōboku', description: 'Reusachtige paddenstoelen en wijze kikkers boven een mistige vallei.', bgTop: '#91cbb0', bgBottom: '#537d76', accentColor: '#e8b86c', surface: '#71854b', platforms: [platform(150, 430, 660, true), platform(170, 315, 150), platform(640, 315, 150), platform(405, 220, 150)] },
        namek: { name: 'Planet Namek', series: 'Dragon Ball', description: 'Blauw gras, ronde bomen en groene luchten op een verre planeet.', bgTop: '#a5e1a1', bgBottom: '#408e80', accentColor: '#8de9f5', surface: '#398db9', platforms: [platform(160, 430, 640, true), platform(245, 320, 155), platform(560, 285, 155)] },
        beerus: { name: 'Beerus Palace', series: 'Dragon Ball Super', description: 'Een gouden gevechtsterras bij het paleis van de God of Destruction.', bgTop: '#34264e', bgBottom: '#17152e', accentColor: '#e9bb61', surface: '#c5a685', platforms: [platform(140, 430, 680, true), platform(210, 315, 170), platform(580, 315, 170), platform(410, 225, 140)] },
        arlong: { name: 'Arlong Park', series: 'One Piece', description: 'Tropische palmen, een haaienpoort en het zwembad van de Arlong Pirates.', bgTop: '#83d4ef', bgBottom: '#369cb2', accentColor: '#ffe4a4', surface: '#ddc390', platforms: [platform(140, 430, 270, true), platform(550, 430, 270, true), platform(350, 330, 260), platform(130, 240, 145), platform(685, 240, 145)] }
    };

    function buildScenery(THREE, scene, key) {
        const arena = arenas[key];
        if (!arena) return;
        const group = new THREE.Group();
        scene.add(group);
        const animations = [];
        scene.userData.updateMap = (time) => animations.forEach(animate => animate(time));
        function mesh(geometry, color, x, y, z, rotation = 0) {
            const object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));
            object.position.set(x, y, z);
            object.rotation.z = rotation;
            group.add(object);
            return object;
        }
        const box = (color, x, y, z, w, h, d) => mesh(new THREE.BoxGeometry(w, h, d), color, x, y, z);
        const ball = (color, x, y, z, r) => mesh(new THREE.SphereGeometry(r, 20, 12), color, x, y, z);
        const pillar = (color, x, y, z, top, bottom, height) => mesh(new THREE.CylinderGeometry(top, bottom, height, 18), color, x, y, z);
        // Build once; animation only changes transforms, never allocates geometry per frame.
        if (key !== 'beerus') {
            for (let i = 0; i < 5; i++) {
                const cloud = new THREE.Group();
                group.add(cloud);
                for (let puff = 0; puff < 3; puff++) {
                    const part = ball('#dceee2', puff * 0.8, 0, 0, 0.8);
                    part.scale.set(1.4, 0.4, 0.7);
                    cloud.add(part);
                }
                cloud.position.set(i * 5 - 12, 7 + i % 2, -10);
                animations.push(time => {
                    cloud.position.x = ((i * 5 + time * 0.22) % 30) - 15;
                    cloud.position.y = 7 + i % 2 + Math.sin(time * 0.3 + i) * 0.12;
                });
            }
        }
        function water(x, y, z, width, height) {
            const curtain = box('#82dbe1', x, y, z, width, height, 0.15);
            curtain.material.transparent = true;
            curtain.material.opacity = 0.55;
            for (let i = 0; i < 22; i++) {
                const drop = box('#d7ffff', x + ((i * 17 % 23) / 23 - 0.5) * width, y, z + 0.13, 0.045, 0.16 + i % 3 * 0.12, 0.04);
                animations.push(time => {
                    drop.position.y = y + height / 2 - ((time * 2.8 + i * 0.31) % height);
                });
            }
            for (let i = 0; i < 4; i++) {
                const foam = mesh(new THREE.TorusGeometry(0.3, 0.025, 6, 24), '#c5ffff', x, y - height / 2, z);
                foam.rotation.x = -Math.PI / 2;
                animations.push(time => {
                    const phase = (time * 0.65 + i / 4) % 1;
                    foam.scale.setScalar(0.3 + phase * 2.5);
                    foam.material.transparent = true;
                    foam.material.opacity = (1 - phase) * 0.6;
                });
            }
        }
        if (key === 'frog') {
            pillar('#617a67', -3.5, 1.4, -7, 1.6, 2.3, 4.5);
            water(-3.5, 1.2, -5.3, 1.3, 5);
            for (let i = 0; i < 7; i++) {
                const x = (i - 3) * 2.7;
                const y = 1.6 + (i % 3) * 0.6;
                pillar('#b6ae7b', x, y, -4, 0.25, 0.4, 3.5);
                const cap = ball(i % 2 ? '#b8694e' : '#d8a565', x, y + 1.9, -4, 1.5);
                cap.scale.y = 0.4;
            }
            [-6, 6].forEach(x => {
                const frog = new THREE.Group();
                group.add(frog);
                frog.position.set(x, 1.5, -3.2);
                const body = ball('#78895b', 0, 0.3, 0, 0.7);
                body.scale.set(1, 0.7, 1);
                frog.add(body);
                const belly = ball('#b5bc80', 0, 0.2, 0.5, 0.4);
                belly.scale.z = 0.4;
                frog.add(belly);
                [-0.42, 0.42].forEach(dx => {
                    frog.add(ball('#9eaa72', dx, 0.8, 0.2, 0.28));
                    frog.add(ball('#2d3425', dx, 0.82, 0.44, 0.11));
                    const foot = ball('#657b46', dx * 1.4, -0.1, 0.2, 0.3);
                    foot.scale.set(1.2, 0.45, 1.5);
                    frog.add(foot);
                });
                animations.push(time => {
                    const phase = (time * 0.35 + (x > 0 ? 0.5 : 0)) % 1;
                    const jump = phase < 0.38 ? Math.sin(phase / 0.38 * Math.PI) : 0;
                    frog.position.y = 1.5 + jump * 1.5;
                    frog.position.x = x + Math.sin(time * 1.1) * jump * 0.7;
                    frog.scale.set(1 + (1 - jump) * 0.05, 0.9 + jump * 0.25, 1);
                    frog.rotation.z = Math.sin(time * 1.1) * jump * 0.12;
                });
            });
        } else if (key === 'namek') {
            box('#295c9d', 0, -0.8, -7, 38, 0.1, 14);
            for (let i = 0; i < 7; i++) {
                const x = (i - 3) * 3;
                const y = 1 + (i % 2) * 0.7;
                pillar('#d9d5a3', x, y, -4, 0.09, 0.2, 3.5);
                const crown = ball('#61bcb5', x, y + 1.8, -4, 1);
                crown.scale.y = 0.65;
                animations.push(time => { crown.rotation.z = Math.sin(time * 0.8 + i) * 0.06; });
                pillar('#4184b8', x, -0.6, -4, 1.6, 2.2, 1);
            }
            ball('#e1efb3', -7, 8, -12, 1.2);
            ball('#d2e7b2', 5, 7, -14, 0.65);
        } else if (key === 'beerus') {
            pillar('#69507b', 0, 0, -6, 3, 0.5, 7);
            box('#e0bc73', 0, 3.4, -5, 6.5, 0.3, 3);
            box('#b69491', 0, 5, -6, 3.6, 3, 2.2);
            pillar('#d9b15e', 0, 7.2, -6, 0, 3, 1.8);
            [-2.5, 2.5].forEach(x => {
                pillar('#e5c680', x, 4.9, -4.6, 0.2, 0.23, 3);
                ball('#8971bd', x, 6.6, -4.6, 0.32);
            });
            box('#453255', 0, 4.4, -4.85, 1.2, 2.2, 0.15);
            const ring = mesh(new THREE.TorusGeometry(4.8, 0.045, 8, 80), '#dabd7e', 0, 5, -9);
            ring.rotation.x = 0.4;
            animations.push(time => { ring.rotation.y = time * 0.08; });
            // Articulated background sparring partners: orange gi versus blue battle suit.
            function sparringFighter(isGoku) {
                const actor = new THREE.Group();
                group.add(actor);
                const suit = isGoku ? '#f47b24' : '#244bba';
                actor.add(box(suit, 0, 0.85, 0, 0.5, 0.65, 0.3));
                actor.add(box(isGoku ? '#23469b' : '#eee8cc', 0, 1, 0.17, 0.36, 0.25, 0.06));
                actor.add(ball('#efc09b', 0, 1.45, 0, 0.25));
                for (let i = 0; i < 5; i++) {
                    const hair = mesh(new THREE.ConeGeometry(0.12, isGoku ? 0.43 : 0.5, 4), '#171824', (i - 2) * 0.1, 1.7 + (i % 2) * 0.07, 0);
                    hair.rotation.z = (i - 2) * (isGoku ? -0.35 : -0.12);
                    actor.add(hair);
                }
                const limbs = [];
                [-1, 1].forEach(side => {
                    const arm = new THREE.Group();
                    arm.position.set(side * 0.32, 1.1, 0);
                    actor.add(arm);
                    arm.add(box(suit, 0, -0.22, 0, 0.18, 0.45, 0.2));
                    arm.add(ball(isGoku ? '#efc09b' : '#fff4dc', 0, -0.5, 0, 0.13));
                    const leg = new THREE.Group();
                    leg.position.set(side * 0.15, 0.55, 0);
                    actor.add(leg);
                    leg.add(box(suit, 0, -0.25, 0, 0.2, 0.5, 0.24));
                    leg.add(box(isGoku ? '#23469b' : '#fff4dc', 0, -0.5, 0.05, 0.22, 0.2, 0.3));
                    limbs.push({ arm, leg, side });
                });
                return { actor, limbs };
            }
            const goku = sparringFighter(true);
            const vegeta = sparringFighter(false);
            const flash = ball('#fff2a6', 0, 5, -3.5, 0.3);
            flash.material.emissive.set('#ffbd38');
            flash.material.emissiveIntensity = 2;
            const shockwave = mesh(new THREE.TorusGeometry(0.5, 0.025, 6, 32), '#8cddff', 0, 5, -3.6);
            shockwave.material.transparent = true;
            animations.push(time => {
                const cycle = time % 6;
                const approach = cycle < 2 ? cycle / 2 : cycle < 4 ? 1 : (6 - cycle) / 2;
                const separation = 3.1 - approach * 2.5;
                const height = 4.8 + Math.sin(time * 1.5) * 0.55;
                [goku, vegeta].forEach((fighter, i) => {
                    const direction = i === 0 ? 1 : -1;
                    fighter.actor.position.set(-direction * separation, height + Math.sin(time * 4 + i) * 0.12, -3.5);
                    fighter.actor.rotation.y = direction * 0.45;
                    fighter.actor.rotation.z = -direction * (1 - approach) * 0.45;
                    fighter.limbs.forEach(({ arm, leg, side }) => {
                        arm.rotation.z = -direction * (1.1 + Math.sin(time * 15 + i * Math.PI + side) * 0.7 * approach);
                        leg.rotation.z = direction * 0.25 + Math.sin(time * 9 + side + i) * 0.45 * approach;
                    });
                });
                const impact = cycle >= 2 && cycle < 4;
                flash.visible = impact && Math.sin(time * 22) > 0.55;
                flash.position.y = height + 1;
                flash.scale.setScalar(0.7 + Math.abs(Math.sin(time * 22)) * 1.8);
                shockwave.visible = impact;
                shockwave.position.y = height + 1;
                const pulse = (time * 3) % 1;
                shockwave.scale.setScalar(0.5 + pulse * 3);
                shockwave.material.opacity = (1 - pulse) * 0.7;
            });
        } else {
            box('#2089af', 0, -0.4, -5, 38, 0.15, 16);
            box('#4ebecd', 0, 1.1, -2, 6, 0.1, 4);
            water(-5.4, 1, -4, 0.65, 3);
            for (let i = 0; i < 7; i++) {
                const wave = mesh(new THREE.TorusGeometry(0.5, 0.018, 6, 32), '#a7e8ed', (i - 3) * 1.8, -0.28, -3 - i % 3);
                wave.rotation.x = -Math.PI / 2;
                animations.push(time => {
                    wave.scale.setScalar(0.8 + Math.sin(time * 1.4 + i) * 0.3);
                    wave.position.y = -0.25 + Math.sin(time * 1.8 + i) * 0.04;
                });
            }
            [-4.3, 4.3].forEach(x => {
                box('#ded5b7', x, 2, -5, 2, 4, 2);
                pillar('#675c8a', x, 4.7, -5, 0, 1.8, 1.7);
            });
            box('#ded5b7', 0, 3, -5, 7, 0.6, 1);
            for (let i = -2; i <= 2; i++) mesh(new THREE.ConeGeometry(0.28, 0.75, 3), '#fff2cb', i * 0.7, 2.4, -4.4, Math.PI);
            [-7, 7].forEach(x => {
                pillar('#927248', x, 2.4, -3, 0.14, 0.25, 4.5);
                for (let i = 0; i < 6; i++) {
                    const leaf = ball('#3c9b61', x, 4.8, -3, 1);
                    leaf.scale.set(1.8, 0.12, 0.35);
                    leaf.rotation.y = i * Math.PI / 3;
                    leaf.rotation.z = 0.2;
                    animations.push(time => { leaf.rotation.z = 0.2 + Math.sin(time * 1.2 + i + x) * 0.09; });
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const select = document.getElementById('arena-select');
        if (select) {
            Object.entries(arenas).forEach(([key, arena]) => select.add(new Option(`${arena.name} — ${arena.series}`, key)));
            const requested = new URLSearchParams(location.search).get('arena');
            if (arenas[requested]) select.value = requested;
        }
        const gallery = document.getElementById('maps-gallery');
        if (gallery) Object.entries(arenas).forEach(([key, arena], index) => {
            const card = document.createElement('article');
            card.className = `map-card map-${key}`;
            card.innerHTML = `<div class="map-art" aria-hidden="true"><span class="map-number">0${index + 1}</span><span class="map-symbol">${['蛙', '◉', '◇', '⚓'][index]}</span><div class="map-platforms">${arena.platforms.map(p => `<i style="left:${p.x / 9.6}%;top:${p.y / 5.4}%;width:${p.w / 9.6}%"></i>`).join('')}</div></div><div class="map-details"><p>${arena.series}</p><h2>${arena.name}</h2><p>${arena.description}</p><a href="../../index.html?arena=${key}">Speel deze map →</a></div>`;
            gallery.append(card);
        });
    });
    function updateScenery(scene, time) {
        if (scene && scene.userData.updateMap) scene.userData.updateMap(time);
    }
    return { arenas, buildScenery, updateScenery };
})();
