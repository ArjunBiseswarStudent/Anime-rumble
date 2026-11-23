window.Jatayu = (() => {
    function create(THREE, direction) {
        const visual = new THREE.Group();
        visual.name = 'kurukshetra-jatayu';
        const bird = new THREE.Group();
        visual.add(bird);
        const mat = (color, roughness = .82, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
        const chest = mat('#a77350'), ivory = mat('#ebcda3'), cream = mat('#fff0c8');
        const browns = ['#503027', '#684131', '#82553b', '#a77550'].map(color => mat(color));
        const gold = mat('#dba847', .33, .56), bronze = mat('#855023', .39, .45);
        const red = mat('#871e2b'), dark = mat('#2e201b');
        const gem = new THREE.MeshStandardMaterial({ color: '#ff7854', emissive: '#ae2b13', emissiveIntensity: .65, roughness: .24 });
        const oval = new THREE.SphereGeometry(1, 12, 8);
        function mesh(parent, geometry, material, x, y, z) {
            const part = new THREE.Mesh(geometry, material);
            part.position.set(x, y, z);
            parent.add(part);
            return part;
        }
        function shape(parent, material, x, y, z, sx, sy, sz) {
            const part = mesh(parent, oval, material, x, y, z);
            part.scale.set(sx, sy, sz);
            return part;
        }
        function joint(parent, x, y, z) {
            const part = new THREE.Group();
            part.position.set(x, y, z);
            parent.add(part);
            return part;
        }

        shape(bird, chest, -.36, 0, 0, 1.32, .65, .61);
        shape(bird, ivory, .43, .075, 0, .69, .65, .52);
        const head = joint(bird, .89, .43, 0);
        shape(head, ivory, -.20, -.14, 0, .56, .68, .425).rotation.z = -.59;
        shape(head, cream, .12, .20, 0, .53, .44, .38);
        shape(head, gold, .60, .12, 0, .38, .21, .25);
        shape(head, gold, .83, .015, 0, .12, .20, .14).rotation.z = -.37;
        shape(head, bronze, .55, -.022, 0, .29, .072, .172);
        for (const side of [-1, 1]) {
            shape(head, dark, .36, .25, side * .301, .146, .1, .061);
            shape(head, gold, .39, .252, side * .348, .077, .069, .022);
            shape(head, dark, .415, .252, side * .364, .036, .055, .017);
            shape(head, cream, .34, .343, side * .30, .23, .055, .081).rotation.z = -.22;
            shape(head, bronze, .05, .17, side * .384, .065, .16, .044).rotation.z = -.28;
        }
        for (let i = 0; i < 5; i++) {
            shape(head, i % 2 ? cream : ivory, -.29 - i * .075, .35 - i * .064, 0,
                .49 + i * .036, .062, .25 - i * .029).rotation.z = -.29;
        }
        const crown = mesh(head, new THREE.TorusGeometry(.33, .036, 6, 20), gold, .15, .51, 0);
        crown.rotation.x = Math.PI / 2;
        crown.rotation.y = -.18;
        shape(head, gem, .38, .57, 0, .082, .13, .10);

        const harness = mesh(bird, new THREE.TorusGeometry(.58, .065, 6, 24), gold, .37, -.035, 0);
        harness.rotation.y = Math.PI / 2;
        shape(bird, gold, .50, -.48, .28, .17, .17, .09);
        shape(bird, gem, .59, -.44, .34, .085, .095, .044);
        const talons = [];
        for (const side of [-1, 1]) {
            const foot = joint(bird, .05, -.49, side * .24);
            shape(foot, bronze, 0, -.12, 0, .13, .27, .12).rotation.z = -.30;
            for (let i = -1; i <= 1; i++) {
                shape(foot, gold, .14, -.30, i * .078, .19, .054, .048);
                shape(foot, dark, .29, -.33, i * .078, .08, .038, .037).rotation.z = -.38;
            }
            talons.push(foot);
        }
        const tail = joint(bird, -1.18, -.05, 0);
        for (let i = -2; i <= 2; i++) {
            const plume = shape(tail, browns[Math.abs(i)], -.49, 0, i * .14, .76, .055, .14);
            plume.rotation.y = i * .13;
        }
        const sash = joint(bird, .1, -.17, .43);
        shape(sash, red, -.68, 0, 0, .91, .055, .18).rotation.z = .14;

        const wings = [-1, 1].map(side => {
            const shoulder = joint(bird, -.1, .13, side * .43);
            shape(shoulder, browns[2], -.05, 0, side * .74, .73, .16, .97).rotation.y = -side * .26;
            const tip = joint(shoulder, -.25, 0, side * 1.35);
            shape(tip, browns[1], -.13, 0, side * .48, .60, .115, .77).rotation.y = -side * .31;
            for (let i = 0; i < 9; i++) {
                const flightFeather = shape(tip, browns[i % 3], -.22 - i * .105, -.025,
                    side * (.09 + i * .17), .68 + i * .045, .047, .125);
                flightFeather.rotation.y = side * (.08 + i * .085);
                const covert = shape(shoulder, i % 3 ? browns[3] : ivory, -.35, .065,
                    side * (.15 + i * .143), .56, .046, .105);
                covert.rotation.y = side * (.05 + i * .045);
            }
            shape(shoulder, gold, .17, .11, side * .30, .28, .11, .31);
            return { shoulder, tip, side };
        });

        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const fire = ['#ff5a25', '#ffab3c', '#ffe6a0'].map((color, i) => new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: [.39, .68, .9][i], blending: THREE.AdditiveBlending, depthWrite: false
        }));
        const embers = Array.from({ length: reducedMotion ? 6 : 24 }, (_, i) =>
            mesh(bird, oval, fire[i % 3], 0, 0, 0));
        const plumes = reducedMotion ? [] : wings.map(({ tip, side }) => {
            const flame = joint(tip, -.54, -.01, side * 1.28);
            shape(flame, fire[0], -.45, .013, 0, .77, .14, .10).rotation.z = -.08;
            shape(flame, fire[1], -.29, 0, 0, .49, .09, .08).rotation.z = -.12;
            shape(flame, fire[2], -.11, 0, 0, .23, .048, .041);
            return flame;
        });
        visual.rotation.y = direction < 0 ? Math.PI - .16 : .16;
        return { visual, update(age, released = false) {
            const beat = age * 5.1;
            const flap = reducedMotion ? .16 : Math.sin(beat);
            const glide = Math.sin(age * 1.25);
            bird.position.y = .15 + flap * .12;
            bird.rotation.z = .035 * glide + flap * .035;
            bird.rotation.x = .075 * glide;
            head.rotation.z = -.035 - flap * .07;
            tail.rotation.z = -.10 + flap * .16;
            sash.rotation.z = -.17 + flap * .16;
            talons.forEach(foot => { foot.rotation.z = released ? -.48 : .16; });
            wings.forEach(({ shoulder, tip, side }) => {
                shoulder.rotation.x = -side * (.16 + flap * .57);
                tip.rotation.x = -side * (.10 + (reducedMotion ? .12 : Math.sin(beat - .64)) * .45);
            });
            plumes.forEach((flame, i) => {
                const wave = Math.sin(age * 13 + i * 2.3);
                flame.rotation.z = -.09 + wave * .13;
                flame.scale.set(1 + wave * .21, .84 + wave * .14, 1);
            });
            embers.forEach((ember, i) => {
                const progress = (age * (reducedMotion ? .65 : 1.28) + i * .147) % 1;
                const side = i % 2 ? -1 : 1, spread = (.39 + (i % 7) * .34);
                const drift = Math.sin(i * 2.4 + age * 5.6) * .14;
                ember.position.set(-.85 - progress * 3.4, .045 + side * spread * wings[i % 2].shoulder.rotation.x * -.62 + progress * .63 + drift,
                    side * (spread + progress * .55));
                const size = (.04 + i % 5 * .014) * (1 - progress * .77);
                ember.scale.set(size * (2.8 - progress), size, size);
            });
        } };
    }
    return { create };
})();
