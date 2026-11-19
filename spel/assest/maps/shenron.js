/* Procedural arena cameo. Geometry and effects are created locally. */
window.Shenron = {
    create(THREE, goku, reducedMotion = false) {
        const visual = new THREE.Group();
        visual.name = 'beerus-shenron';
        const dragon = new THREE.Group();
        const altar = new THREE.Group();
        altar.position.set(-5.15, 2.1, -2.1);
        visual.add(dragon, altar);
        goku.position.set(-.8, 0, 0);
        goku.rotation.y = .72;
        altar.add(goku);

        const gold = new THREE.MeshStandardMaterial({
            color: '#d18126', roughness: .38, metalness: .38, emissive: '#ad4a10', emissiveIntensity: .45
        });
        const ivory = new THREE.MeshStandardMaterial({ color: '#ffe1a2', roughness: .46, metalness: .12 });
        const dark = new THREE.MeshStandardMaterial({ color: '#451b24', roughness: .65 });
        const glow = new THREE.MeshBasicMaterial({ color: '#fff2a5', transparent: true,
            blending: THREE.AdditiveBlending, depthWrite: false, opacity: .76, toneMapped: false });
        const eyes = new THREE.MeshBasicMaterial({ color: '#ff633d', toneMapped: false });
        function mesh(parent, geometry, material, x, y, z) {
            const part = new THREE.Mesh(geometry, material);
            part.position.set(x, y, z);
            parent.add(part);
            return part;
        }
        const curve = new THREE.CatmullRomCurve3([
            [0, 0, 0], [-1.25, .62, -.5], [-3.25, .25, -1.2], [-4, -.85, -1.45],
            [-2.7, -1.48, -1.67], [-.45, -.77, -1.85], [2, .34, -1.75],
            [4.1, .25, -1.9], [4.35, -.7, -2.1], [3.35, -1.52, -2.32],
            [1.4, -1.65, -2.42], [.9, -2.27, -2.7], [2.45, -2.69, -2.85]
        ].map(point => new THREE.Vector3(...point)));
        const spine = new THREE.TubeGeometry(curve, 96, .27, 12, false);
        const positions = spine.getAttribute('position');
        const center = new THREE.Vector3();
        const vertex = new THREE.Vector3();
        for (let ring = 0; ring <= 96; ring++) {
            const t = ring / 96;
            curve.getPointAt(t, center);
            for (let side = 0; side <= 12; side++) {
                const index = ring * 13 + side;
                vertex.fromBufferAttribute(positions, index).lerp(center, .87 * t ** 4);
                positions.setXYZ(index, vertex.x, vertex.y, vertex.z);
            }
        }
        spine.computeVertexNormals();
        mesh(dragon, spine, gold, 0, 0, 0);
        const scaleMaterial = new THREE.MeshStandardMaterial({ color: '#e8a647', roughness: .42, metalness: .32 });
        const scales = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 5), scaleMaterial, 210);
        const scalePose = new THREE.Object3D();
        const up = new THREE.Vector3(0, 1, 0);
        const frame = curve.computeFrenetFrames(42, false);
        for (let row = 0; row < 42; row++) {
            const t = row / 42;
            const radius = .27 * (1 - .87 * t ** 4);
            const point = curve.getPointAt(t);
            for (let column = 0; column < 5; column++) {
                const angle = (column + (row % 2) * .5) * Math.PI * 2 / 5;
                scalePose.position.copy(point)
                    .addScaledVector(frame.normals[row], Math.cos(angle) * radius)
                    .addScaledVector(frame.binormals[row], Math.sin(angle) * radius);
                scalePose.quaternion.setFromUnitVectors(up, frame.tangents[row]);
                scalePose.scale.set(radius * .28, radius * .52, radius * .28);
                scalePose.updateMatrix();
                scales.setMatrixAt(row * 5 + column, scalePose.matrix);
            }
        }
        dragon.add(scales);
        const rib = new THREE.TorusGeometry(.268, .018, 5, 16, Math.PI * 1.15);
        const spike = new THREE.ConeGeometry(.12, .42, 6);
        for (let index = 1; index <= 38; index++) {
            const t = index / 40;
            const point = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t);
            const band = mesh(dragon, rib, ivory, point.x, point.y, point.z);
            band.rotation.y = Math.atan2(tangent.x, tangent.z);
            band.rotation.z = Math.PI;
            band.scale.setScalar(1 - .87 * t ** 4);
            const tooth = mesh(dragon, spike, gold, point.x, point.y + .3 * band.scale.x, point.z);
            tooth.rotation.z = -tangent.x * .38;
            tooth.scale.setScalar(band.scale.x);
        }

        const head = new THREE.Group();
        dragon.add(head);
        const sphere = new THREE.SphereGeometry(1, 18, 12);
        function shape(material, x, y, z, width, height, depth) {
            const part = mesh(head, sphere, material, x, y, z);
            part.scale.set(width, height, depth);
            return part;
        }
        shape(gold, 0, .05, .05, .48, .36, .42);
        const jaw = shape(ivory, 0, -.23, .43, .32, .1, .44);
        shape(dark, 0, -.12, .48, .34, .12, .43);
        shape(gold, 0, .005, .49, .36, .16, .43);
        shape(dark, -.15, .045, .87, .044, .027, .022);
        shape(dark, .15, .045, .87, .044, .027, .022);
        for (const side of [-1, 1]) {
            shape(eyes, side * .27, .14, .365, .113, .049, .062);
            const brow = shape(gold, side * .28, .205, .35, .16, .052, .1);
            brow.rotation.z = side * .26;
            const horn = mesh(head, new THREE.ConeGeometry(.125, .72, 8), ivory, side * .32, .51, -.1);
            horn.rotation.z = -side * .53;
            horn.rotation.x = -.32;
            for (let tooth = 0; tooth < 3; tooth++) {
                const fang = mesh(head, new THREE.ConeGeometry(.033, .13, 6), ivory, side * .24, -.13, .48 + tooth * .12);
                fang.rotation.z = Math.PI;
            }
            const whisker = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * .27, -.04, .57), new THREE.Vector3(side * .73, -.23, .68),
                new THREE.Vector3(side * 1.15, -.12, .55), new THREE.Vector3(side * 1.55, .2, .36)
            ]);
            mesh(head, new THREE.TubeGeometry(whisker, 18, .028, 6, false), ivory, 0, 0, 0);
        }

        const gate = mesh(altar, new THREE.TorusGeometry(1.1, .052, 8, 56), glow, 0, .11, .12);
        gate.rotation.x = Math.PI / 2;
        const beam = mesh(altar, new THREE.CylinderGeometry(.17, .55, 5.1, 18, 1, true), glow, 0, 2.7, 0);
        beam.material = glow.clone();
        beam.material.side = THREE.DoubleSide;
        const sheath = mesh(altar, new THREE.CylinderGeometry(.36, .91, 5, 24, 1, true), beam.material.clone(), 0, 2.62, 0);
        const wave = mesh(altar, new THREE.TorusGeometry(1.1, .025, 6, 48), glow.clone(), 0, .16, 0);
        wave.rotation.x = Math.PI / 2;
        const summonLight = new THREE.PointLight('#ffc56f', 0, 8, 2);
        summonLight.position.set(0, 1.2, .6);
        altar.add(summonLight);
        const filament = new THREE.CatmullRomCurve3(Array.from({ length: 18 }, (_, index) => {
            const t = index / 17;
            const angle = t * Math.PI * 4;
            const radius = .8 - .53 * t;
            return new THREE.Vector3(Math.cos(angle) * radius, .19 + t * 4.8, Math.sin(angle) * radius);
        }));
        const spiral = mesh(altar, new THREE.TubeGeometry(filament, 52, .028, 5, false), glow, 0, 0, 0);
        const orbs = Array.from({ length: 7 }, (_, index) => {
            const angle = index * Math.PI * 2 / 7;
            return mesh(altar, sphere, gold, Math.cos(angle), .2, Math.sin(angle));
        });
        orbs.forEach(orb => orb.scale.setScalar(.105));
        const pulse = mesh(dragon, new THREE.TorusGeometry(.38, .035, 8, 40), glow, 0, -.12, .86);
        pulse.material = glow.clone();
        const sparks = new THREE.Group();
        altar.add(sparks);
        const sparkShape = new THREE.SphereGeometry(.037, 6, 5);
        for (let index = 0; index < 32; index++) mesh(sparks, sparkShape, glow, 0, 0, 0);
        let releaseAt = -Infinity;
        let previousAge = 0;
        let casting = false;
        function update(age) {
            const reveal = THREE.MathUtils.smoothstep(age, .65, 2.7);
            dragon.position.set(.35, 5.75 + (reducedMotion ? 0 : Math.sin(age * 1.3) * .18), -3);
            dragon.visible = reveal > 0;
            dragon.scale.setScalar(reducedMotion ? 1 : Math.max(.05, reveal));
            dragon.rotation.z = reducedMotion ? 0 : Math.sin(age * .8) * .028;
            altar.visible = age < 4.2;
            if (altar.visible && !reducedMotion) {
                if (!casting && age >= .55) {
                    window.CharacterMotion.attack(goku, 'neutral');
                    casting = true;
                }
                window.CharacterMotion.update(goku, { grounded: true, blocking: false, facing: 1 },
                    Math.min(.04, Math.max(0, age - previousAge)));
            }
            previousAge = age;
            const energy = reducedMotion ? .45 : Math.sin(Math.PI * Math.min(1, age / 4.2));
            beam.material.opacity = .21 * energy;
            sheath.material.opacity = .08 * energy;
            summonLight.intensity = 2 * energy;
            spiral.rotation.y = reducedMotion ? 0 : age * 2.4;
            const ripple = reducedMotion ? 0 : age % 1.3 / 1.3;
            wave.scale.setScalar(1 + ripple * 1.8);
            wave.material.opacity = .55 * energy * (1 - ripple);
            gate.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(age * 6) * .075);
            sparks.children.forEach((spark, index) => {
                const height = (index * .137 + (reducedMotion ? 0 : age * .52)) % 1;
                spark.position.set(Math.cos(index * 2.4) * (1.1 - height * .6), height * 4.6,
                    Math.sin(index * 2.4) * (1.1 - height * .6));
            });
            const burst = age - releaseAt;
            pulse.visible = burst >= 0 && burst < .8;
            if (pulse.visible) pulse.scale.setScalar(reducedMotion ? 1 : 1 + burst * 3);
            pulse.material.opacity = pulse.visible ? .8 * (1 - burst / .8) : 0;
            jaw.position.y = -.23 - (pulse.visible && !reducedMotion ? .16 * (1 - burst / .8) : 0);
        }
        return {
            visual, update,
            release(age) {
                releaseAt = age;
                dragon.updateWorldMatrix(true, false);
                return dragon.localToWorld(new THREE.Vector3(0, -.15, .96));
            }
        };
    }
};
