window.Gamakichi = {
    build(THREE) {
        const model = new THREE.Group();
        model.name = 'gamakichi';
        model.position.set(-4.4, .2, -4.6);
        const sphere = new THREE.SphereGeometry(1, 32, 24);
        const size = 128;
        const pores = new Uint8Array(size * size * 4);
        let seed = 23;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
                const mottling = Math.sin(x * Math.PI / 16) * Math.sin(y * Math.PI / 16);
                const value = 125 + mottling * 25 + (seed >>> 26);
                const offset = (y * size + x) * 4;
                pores.fill(value, offset, offset + 3);
                pores[offset + 3] = 255;
            }
        }
        const skinDetail = new THREE.DataTexture(pores, size, size);
        skinDetail.wrapS = skinDetail.wrapT = THREE.RepeatWrapping;
        skinDetail.repeat.set(3, 2);
        skinDetail.magFilter = THREE.LinearFilter;
        skinDetail.minFilter = THREE.LinearMipmapLinearFilter;
        skinDetail.generateMipmaps = skinDetail.needsUpdate = true;
        const skin = new THREE.MeshPhysicalMaterial({
            color: '#d95d28', roughness: .5, clearcoat: .27, clearcoatRoughness: .34,
            bumpMap: skinDetail, bumpScale: .043
        });
        skin.addEventListener('dispose', () => skinDetail.dispose());
        const markings = new THREE.MeshStandardMaterial({ color: '#39234f', roughness: .48 });
        const belly = new THREE.MeshStandardMaterial({ color: '#e8c29a', roughness: .73 });
        const coat = new THREE.MeshStandardMaterial({ color: '#192636', roughness: .83 });
        const iris = new THREE.MeshStandardMaterial({ color: '#d3ab47', roughness: .27 });
        const black = new THREE.MeshStandardMaterial({ color: '#140d18', roughness: .34 });
        const glint = new THREE.MeshBasicMaterial({ color: '#fff1cd' });
        const spot = new THREE.MeshStandardMaterial({ color: '#a14529', roughness: .61 });
        const gold = new THREE.MeshStandardMaterial({ color: '#be842f', metalness: .55, roughness: .28 });
        const wood = new THREE.MeshStandardMaterial({ color: '#bca188', roughness: .82 });
        function oval(parent, material, x, y, z, sx, sy, sz, tilt = 0) {
            const mesh = new THREE.Mesh(sphere, material);
            mesh.position.set(x, y, z);
            mesh.scale.set(sx, sy, sz);
            mesh.rotation.z = tilt;
            mesh.receiveShadow = mesh.castShadow = true;
            parent.add(mesh);
            return mesh;
        }

        const torso = oval(model, skin, 0, 1.21, 0, 1.24, 1.02, .87);
        const throat = oval(model, belly, 0, 1.13, .62, .92, .68, .38);
        oval(model, coat, 0, 1.65, -.39, 1.35, 1.06, .65);
        for (const side of [-1, 1]) {
            oval(model, markings, side * 1.23, .63, -.18, .88, .58, .65, side * .31);
            oval(model, skin, side * 1.39, .53, .15, .72, .43, .46, side * .24);
            oval(model, skin, side * 1.43, .19, .43, .74, .2, .57);
            for (let toe = 0; toe < 3; toe++) {
                oval(model, skin, side * (1.2 + toe * .29), .12, .94 - toe * .08, .2, .12, .38);
            }
            oval(model, coat, side * .93, 1.48, .56, .27, .92, .31, side * .19);
            const armY = side < 0 ? .91 : 1.69;
            oval(model, skin, side * 1.33, armY, .65, .37, .88, .36, side * (side < 0 ? -.28 : .91));
            oval(model, markings, side * 1.46, armY - .12, .88, .26, .55, .17, side * (side < 0 ? -.28 : .91));
        }
        oval(model, gold, 0, 1.42, 1.04, .29, .29, .19);
        oval(model, wood, 1.94, 1.42, .72, .11, 1.42, .11, -.07);
        for (let i = 0; i < 3; i++) oval(model, skin, 1.93, 1.91 - i * .13, .87, .2, .092, .15);

        const head = new THREE.Group();
        head.position.set(0, 2.44, .38);
        model.add(head);
        oval(head, skin, 0, .03, 0, 1.39, .99, .94);
        const muzzle = oval(head, skin, 0, -.18, .57, 1.22, .57, .57);
        const eyes = [];
        for (const side of [-1, 1]) {
            oval(head, markings, side * .8, .36, .62, .55, .54, .46, side * .24);
            const eye = new THREE.Group();
            eye.position.set(side * .78, .34, 1.01);
            head.add(eye);
            eyes.push(eye);
            oval(eye, iris, 0, 0, 0, .31, .25, .14, side * .2);
            oval(eye, black, 0, 0, .128, .225, .064, .032, side * .16);
            oval(eye, glint, -.068, .08, .133, .047, .025, .016, .31);
            oval(head, skin, side * .74, .69, .89, .27, .66, .24, side * -.78);
            oval(head, markings, side * .19, -.17, 1.12, .053, .027, .02, side * .55);
            for (let i = 0; i < 6; i++) {
                oval(head, spot, side * (.91 + i * .045), -.26 + (i % 3) * .049,
                    .94 - i * .042, .033 + i % 2 * .012, .026, .025);
            }
        }
        for (let i = 0; i < 19; i++) {
            const x = Math.sin(i * 2.4) * .96;
            const y = .48 + (i % 5) * .085;
            const z = .94 * Math.sqrt(Math.max(0, 1 - (x / 1.39) ** 2 - ((y - .03) / .99) ** 2));
            oval(head, skin, x, y, z, .064 + i % 3 * .021, .087, .065);
        }
        const mouth = oval(head, black, 0, -.42, .79, 1.05, .095, .34);
        const jaw = oval(head, skin, 0, -.53, .64, 1.08, .18, .42);
        const nozzle = new THREE.Object3D();
        nozzle.position.set(0, -.44, 1.14);
        head.add(nozzle);
        let castAt = -Infinity;
        model.userData.cast = time => {
            castAt = time;
            model.updateMatrixWorld(true);
            return nozzle.getWorldPosition(new THREE.Vector3());
        };
        model.userData.animate = time => {
            const open = Math.max(0, 1 - (time - castAt) / .85);
            const breath = Math.sin(time * 2.2);
            torso.scale.y = 1.02 + breath * .022;
            throat.scale.z = .38 + breath * .027 + open * .055;
            head.position.y = 2.44 + breath * .035;
            head.rotation.x = -.075 * open;
            const blink = Math.max(0, 1 - Math.abs(time % 4.7 - 3.7) / .12);
            eyes.forEach(eye => { eye.scale.y = 1 - blink * .94; });
            muzzle.scale.x = 1.22 + .09 * open;
            mouth.scale.y = .095 + .15 * open;
            jaw.position.y = -.53 - .21 * open;
        };
        return model;
    }
};
