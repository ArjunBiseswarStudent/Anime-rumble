/* Articulated cel-shaded characters. Poses are relative to their joint rest positions. */
window.CharacterMotion = (() => {
    let toonRamp;
    function gradient(THREE) {
        if (!toonRamp) {
            const pixels = Uint8Array.from([30, 30, 30, 255, 104, 104, 104, 255, 230, 230, 230, 255]);
            toonRamp = new THREE.DataTexture(pixels, 3, 1, THREE.RGBAFormat);
            toonRamp.minFilter = toonRamp.magFilter = THREE.NearestFilter;
            toonRamp.generateMipmaps = false;
            toonRamp.needsUpdate = true;
        }
        return toonRamp;
    }

    function inkSilhouette(THREE, rig) {
        const ink = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            vertexShader: `
                void main() {
                    vec4 point = modelViewMatrix * vec4(position, 1.0);
                    point.xyz += normalize(normalMatrix * normal) * 0.012;
                    gl_Position = projectionMatrix * point;
                }`,
            fragmentShader: `
                void main() {
                    gl_FragColor = vec4(0.035, 0.028, 0.05, 1.0);
                }`
        });
        const surfaces = [];
        rig.traverse(part => {
            if (!part.geometry) return;
            if (!part.geometry.boundingSphere) part.geometry.computeBoundingSphere();
            const radius = part.geometry.boundingSphere.radius * Math.max(part.scale.x, part.scale.y, part.scale.z);
            if (radius >= .105) surfaces.push(part);
        });
        for (const surface of surfaces) {
            const outline = new THREE.Mesh(surface.geometry, ink);
            outline.userData.characterOutline = true;
            surface.add(outline);
        }
    }
    // Body proportions, hair silhouette and the main piece of clothing for each fighter.
    const looks = {
        gojo: ['lean', 'swept', 'uniform'], sukuna: ['athletic', 'crop', 'robe'], yuji: ['athletic', 'crop', 'hood'],
        jinwoo: ['lean', 'fringe', 'coat'], cha: ['slim', 'bob', 'armor'], beru: ['beast', 'bare', 'carapace'],
        deku: ['compact', 'rough', 'armor'], bakugo: ['athletic', 'burst', 'armor'], todoroki: ['lean', 'split', 'uniform'],
        asta: ['compact', 'burst', 'mantle'], yuno: ['lean', 'fringe', 'mantle'], noelle: ['slim', 'twin', 'armor'],
        tanjiro: ['compact', 'swept', 'checkered'], nezuko: ['slim', 'flow', 'robe'], zenitsu: ['lean', 'bob', 'triangles'],
        natsu: ['athletic', 'burst', 'scarf'], erza: ['athletic', 'flow', 'armor'], gray: ['lean', 'rough', 'open'],
        sonic: ['mascot', 'bare', 'gloves'], shadow: ['mascot', 'bare', 'gloves'], knuckles: ['beast', 'bare', 'gloves'],
        mario: ['round', 'crop', 'overalls'], bowser: ['beast', 'bare', 'shell'], dk: ['beast', 'bare', 'open'],
        cloud: ['lean', 'burst', 'pauldron'], sephiroth: ['tall', 'flow', 'pauldron'], tifa: ['slim', 'flow', 'straps'],
        denji: ['lean', 'rough', 'shirt'], power: ['slim', 'flow', 'shirt'], aki: ['tall', 'knot', 'lapels'],
        naruto: ['athletic', 'burst', 'uniform'], sasuke: ['lean', 'swept', 'robe'], sakura: ['slim', 'bob', 'uniform'],
        itachi: ['lean', 'flow', 'coat'], kakashi: ['tall', 'swept', 'vest'], jiraiya: ['broad', 'mane', 'mantle'],
        gaara: ['compact', 'crop', 'sling'], shikamaru: ['lean', 'knot', 'vest'], kiba: ['athletic', 'rough', 'hood'],
        luffy: ['lean', 'crop', 'open'], zoro: ['broad', 'crop', 'sash'], sanji: ['tall', 'side', 'lapels'],
        usopp: ['lean', 'rough', 'overalls'], chopper: ['round', 'bare', 'scarf'], nami: ['slim', 'flow', 'straps'],
        robin: ['tall', 'flow', 'lapels'], brook: ['tall', 'bare', 'lapels'],
        goku: ['broad', 'burst', 'gi'], vegeta: ['athletic', 'flame', 'armor'], gohan: ['broad', 'flame', 'gi'],
        piccolo: ['tall', 'bare', 'mantle'], trunks: ['athletic', 'side', 'coat'], hit: ['tall', 'bare', 'coat'],
        frieza: ['slim', 'bare', 'carapace'], beerus: ['tall', 'bare', 'sash'], jiren: ['broad', 'bare', 'uniform']
    };
    const builds = {
        lean: [1, 1, 1], athletic: [1.075, 1, 1.08], slim: [.89, 1, .91], compact: [1, .96, 1.03],
        tall: [.94, 1.045, .98], broad: [1.16, 1.025, 1.16], beast: [1.24, .99, 1.19],
        mascot: [.94, .94, 1.04], round: [1.12, .91, 1.15]
    };
    const eyeColors = {
        naruto: '#409ace', sakura: '#5a9b66', itachi: '#a93143', sasuke: '#293047', gaara: '#4e9e93',
        gojo: '#5cb3ef', sukuna: '#922f38', deku: '#3a926f', bakugo: '#9b323d', natsu: '#514032',
        noelle: '#a366b1', nezuko: '#b9709f', zenitsu: '#c27b37', power: '#c78d43',
        cha: '#7589a9', sephiroth: '#68af96', cloud: '#638acd', trunks: '#5eb4dd'
    };
    function create(THREE, character) {
        const id = character.id;
        const [build, haircut, outfit] = looks[id] || ['lean', 'rough', 'uniform'];
        const root = new THREE.Group();
        const rig = new THREE.Group();
        rig.scale.set(...builds[build]);
        root.add(rig);
        const ramp = gradient(THREE);
        const material = color => new THREE.MeshToonMaterial({ color, gradientMap: ramp });
        const skin = material(character.skin), suit = material(character.primary);
        const accent = material(character.secondary), hair = material(character.hair);
        root.userData.palette = { skin, suit, accent, hair };
        const dark = material('#182131'), white = material('#f1eee6');
        const sphere = new THREE.SphereGeometry(1, 24, 16);
        function ellipsoid(parent, mat, x, y, z, sx, sy, sz) {
            const mesh = new THREE.Mesh(sphere, mat);
            mesh.position.set(x, y, z);
            mesh.scale.set(sx, sy, sz);
            parent.add(mesh);
            return mesh;
        }
        function profile(parent, mat, outline, depth) {
            const geometry = new THREE.LatheGeometry(outline.map(([radius, height]) => new THREE.Vector2(radius, height)), 28);
            const mesh = new THREE.Mesh(geometry, mat);
            mesh.scale.z = depth;
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
        profile(torso, suit, [[0, -.18], [.17, -.17], [.255, -.11], [.251, .015], [.245, .18],
            [.272, .34], [.313, .49], [.294, .56], [.224, .61], [.096, .656], [0, .656]], .67);
        ellipsoid(torso, suit, 0, -.068, 0, .265, .13, .176);
        if (character.id !== 'gojo') ellipsoid(torso, accent, 0, -.017, 0, .253, .045, .176);
        segment(joint(torso, 0, 0.68, 0), skin, 0.17, 0.09, 0.1);
        const head = joint(torso, 0, 0.77, 0);
        profile(head, skin, [[0, -.17], [.08, -.16], [.135, -.124], [.177, -.059], [.211, .035],
            [.218, .12], [.208, .217], [.176, .296], [.113, .35], [0, .373]], .92);
        const eyeColor = material(eyeColors[id] || '#59463c', .31);
        const eyeTilt = ['sukuna', 'bakugo', 'vegeta', 'sephiroth', 'jiren'].includes(id) ? .26 : .14;
        const eyeHeight = ['nezuko', 'chopper', 'deku', 'cha', 'noelle'].includes(id) ? 1.22 : 1;
        ellipsoid(head, skin, 0, .046, .192, .034, .06, .036).rotation.x = -.24;
        ellipsoid(head, skin, 0, .015, .213, .032, .024, .023);
        [-1, 1].forEach(side => {
            ellipsoid(head, skin, side * 0.215, 0.08, 0, 0.045, 0.075, 0.045);
            ellipsoid(head, skin, side * .19, .077, .098, .03, .057, .032);
            ellipsoid(head, dark, side * .084, .122, .178, .059, .027 * eyeHeight, .017).rotation.z = side * eyeTilt;
            ellipsoid(head, white, side * .084, .119, .186, .055, .022 * eyeHeight, .014).rotation.z = side * eyeTilt;
            ellipsoid(head, eyeColor, side * .077, .119, .197, .023, .022 * eyeHeight, .009);
            ellipsoid(head, dark, side * .077, .119, .204, .012, .014, .004);
            ellipsoid(head, white, side * .077 - .005, .127, .207, .005, .005, .002);
            const brow = ellipsoid(head, hair, side * .087, .168, .176, .062, .012, .016);
            brow.rotation.z = side * (character.id === 'sukuna' ? .26 : .11);
        });
        ellipsoid(head, skin, 0, -.059, .17, .059, .024, .018);
        ellipsoid(head, dark, 0, -.048, .185, .048, .004, .005);
        if (haircut !== 'bare') {
            const upright = ['burst', 'flame', 'rough', 'crop', 'swept'].includes(haircut);
            const long = ['flow', 'mane', 'twin'].includes(haircut);
            const splitHair = haircut === 'split' ? material('#a13536', .54) : hair;
            ellipsoid(head, hair, 0, .265, -.05, .221, .124, .201);
            if (haircut === 'split') ellipsoid(head, splitHair, -.102, .263, -.037, .127, .115, .185);
            if (upright) {
                const peak = { burst: .22, flame: .29, rough: .12, crop: .067, swept: .19 }[haircut];
                const count = haircut === 'rough' || haircut === 'crop' ? 10 : 7;
                for (let i = 0; i < count; i++) {
                    const angle = i / count * Math.PI * 2;
                    const height = peak * (1 - (i % 3) * .16);
                    const lock = profile(head, hair, [[0, -.09], [.071, -.063], [.073, -.014], [.052, height * .28],
                        [.026, height * .69], [0, height]], haircut === 'crop' ? .83 : .67);
                    lock.position.set(Math.sin(angle) * .147, .323 + Math.sin(i * 2) * .022, Math.cos(angle) * .14 - .035);
                    lock.rotation.z = -Math.sin(angle) * (haircut === 'flame' ? .25 : .73) + (haircut === 'swept' ? -.37 : -.09);
                    lock.rotation.x = Math.cos(angle) * .31 - (haircut === 'swept' ? .43 : .12);
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    const x = (i - 2) * .075;
                    const sidePart = haircut === 'side';
                    const hanging = sidePart ? (4 - i) * .022 + .054 : .052 + Math.cos(i * 1.25) * .023;
                    const mat = haircut === 'split' && i < 2 ? splitHair : hair;
                    const fringe = ellipsoid(head, mat, x, .284 - hanging / 2, .153 - x * x * .6, .052, hanging, .057);
                    fringe.rotation.z = sidePart ? -.57 : (i - 2) * -.18;
                }
            }
            if (long || haircut === 'bob') {
                const length = id === 'sephiroth' || haircut === 'mane' ? .54 : long ? .41 : .25;
                ellipsoid(head, hair, 0, .23 - length, -.153, .225, length, .129);
                for (const side of [-1, 1]) {
                    for (let i = 0; i < 3; i++) {
                        const strand = ellipsoid(head, hair, side * (.165 + i * .024), .19 - length * .7,
                            -.045 - i * .052, .055, length * (.72 + i * .12), .065);
                        strand.rotation.z = side * (-.1 - i * .066);
                    }
                }
            }
            if (haircut === 'knot' || haircut === 'twin') {
                const count = haircut === 'twin' ? 2 : 1;
                for (let i = 0; i < count; i++) {
                    const x = count === 1 ? 0 : (i ? .21 : -.21);
                    ellipsoid(head, hair, x, .34, -.189, .092, .079, .092);
                    ellipsoid(head, hair, x, .276, -.236, .062, count === 1 ? .12 : .27, .078).rotation.x = -.44;
                }
            }
        }
        // Signature details are attached to the same rig used by portraits and combat.
        const detailMaterial = color => color === character.primary ? suit : color === character.skin ? skin : material(color);
        const detail = (parent, color, x, y, z, sx, sy, sz) => ellipsoid(parent, detailMaterial(color), x, y, z, sx, sy, sz);
        const gold = ['vest', 'overalls', 'sash'].includes(outfit) ? material('#b49759', .39) : null;
        function strip(parent, mat, x, y, z, width, length, angle = 0) {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, length, .025), mat);
            mesh.position.set(x, y, z);
            mesh.rotation.z = angle;
            parent.add(mesh);
            return mesh;
        }
        function horn(parent, color, x, y, z, radius, height, tilt = 0) {
            const mesh = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 12), detailMaterial(color));
            mesh.position.set(x, y, z);
            mesh.rotation.z = tilt;
            parent.add(mesh);
            return mesh;
        }
        if (['coat', 'mantle', 'robe', 'checkered', 'triangles'].includes(outfit)) {
            const cloth = outfit === 'mantle' && id === 'piccolo' ? white : suit;
            const lapel = outfit === 'robe' ? white : accent;
            for (const side of [-1, 1]) {
                const panel = ellipsoid(torso, cloth, side * .167, .125, -.117, .134, .51, .097);
                panel.rotation.z = side * .13;
                const fold = ellipsoid(torso, lapel, side * .103, .391, .171, .035, .231, .031);
                fold.rotation.z = side * -.30;
            }
        }
        if (outfit === 'checkered' || outfit === 'triangles') {
            const triangle = outfit === 'triangles';
            const pattern = triangle ? white : dark;
            const tile = triangle ? new THREE.ConeGeometry(.031, .057, 3) : new THREE.BoxGeometry(.066, .073, .013);
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 5; col++) {
                    if (!triangle && (col + row) % 2) continue;
                    const x = (col - 2) * .069;
                    const y = .086 + row * .102;
                    const radius = .245 + row * .012;
                    const mesh = new THREE.Mesh(tile, pattern);
                    mesh.position.set(x, y, Math.sqrt(radius ** 2 - x ** 2) * .67 + .013);
                    mesh.rotation.y = Math.asin(x / radius) * .7;
                    torso.add(mesh);
                }
            }
        }
        if (['shirt', 'lapels', 'gi'].includes(outfit)) {
            const lining = outfit === 'shirt' ? white : accent;
            for (const side of [-1, 1]) {
                strip(torso, lining, side * .078, .438, .196, .049, .194, side * -.47);
            }
            if (outfit === 'shirt' || outfit === 'lapels') {
                strip(torso, dark, 0, .301, .199, .038, .225).rotation.z = -.045;
                ellipsoid(torso, dark, 0, .417, .209, .039, .033, .016);
            }
        }
        if (['vest', 'overalls', 'straps', 'sling'].includes(outfit)) {
            const vest = outfit === 'vest' || outfit === 'overalls';
            const panel = outfit === 'overalls' ? accent : suit;
            if (vest) ellipsoid(torso, panel, 0, .249, .153, .222, .277, .068);
            for (const side of outfit === 'sling' ? [1] : [-1, 1]) {
                const strap = strip(torso, outfit === 'overalls' ? accent : dark, side * .128, .369, .188, .058,
                    outfit === 'sling' ? .61 : .332, outfit === 'sling' ? -.62 : side * -.13);
                strap.rotation.y = side * .21;
                if (vest) ellipsoid(torso, gold, side * .131, .294, .214, .026, .026, .011);
            }
        }
        if (['armor', 'carapace', 'pauldron'].includes(outfit)) {
            const plate = outfit === 'carapace' ? accent : material(id === 'noelle' ? '#c2e9f3' : '#aab7cc', .38);
            if (outfit !== 'pauldron') {
                for (const side of [-1, 1]) {
                    const chestPlate = ellipsoid(torso, plate, side * .107, .378, .163, .119, .167, .063);
                    chestPlate.rotation.z = side * -.28;
                }
            }
            for (let row = 0; row < 3; row++) {
                const rib = ellipsoid(torso, outfit === 'armor' ? accent : plate, 0, .133 + row * .064, .167, .167, .034, .043);
                rib.rotation.z = outfit === 'pauldron' ? -.19 : 0;
            }
        }
        if (outfit === 'scarf' || outfit === 'hood' || outfit === 'uniform') {
            const collar = outfit === 'scarf' ? white : accent;
            ellipsoid(torso, collar, 0, .588, .013, .167, .086, .137);
            if (outfit === 'scarf') {
                for (let i = 0; i < 4; i++) strip(torso, dark, (i - 1.5) * .051, .586, .145, .008, .083, -.17);
                ellipsoid(torso, white, -.119, .359, -.111, .071, .259, .045).rotation.z = -.39;
            }
        }
        if (outfit === 'sash') {
            ellipsoid(torso, accent, 0, .072, 0, .257, .081, .181);
            ellipsoid(torso, gold, 0, .08, .188, .053, .067, .017);
        }
        if (outfit === 'shell') {
            const shell = material('#385b3f', .54);
            ellipsoid(torso, shell, 0, .213, -.197, .351, .435, .162);
            for (let i = 0; i < 7; i++) {
                const angle = i * Math.PI * 2 / 7;
                horn(torso, '#e0c999', Math.cos(angle) * .22, .213 + Math.sin(angle) * .331, -.333, .046, .15).rotation.x = -Math.PI / 2;
            }
        }
        if (id === 'gaara') {
            const gourd = material('#996936', .64);
            ellipsoid(torso, gourd, -.22, .143, -.237, .22, .302, .19).rotation.z = -.36;
            ellipsoid(torso, gourd, -.333, .421, -.237, .15, .174, .133).rotation.z = -.36;
        }
        if (id === 'itachi') {
            const cloud = material('#b33d48');
            ellipsoid(torso, cloud, -.088, .279, .196, .082, .038, .012);
            ellipsoid(torso, cloud, -.111, .302, .194, .037, .031, .013);
            ellipsoid(torso, cloud, -.056, .303, .195, .039, .045, .013);
        }
        if (id === 'nezuko') {
            const bow = material('#f48bac');
            for (const side of [-1, 1]) ellipsoid(head, bow, -.177 + side * .036, .245, .129, .044, .024, .022).rotation.z = side * .42;
            ellipsoid(head, bow, -.177, .245, .148, .025, .021, .017);
        }
        if (id === 'tanjiro') {
            const paper = material('#e7dfc9');
            for (const side of [-1, 1]) {
                strip(head, paper, side * .215, -.045, .045, .037, .102);
                ellipsoid(head, accent, side * .215, -.025, .061, .012, .012, .005);
                strip(head, dark, side * .215, -.079, .061, .025, .004);
            }
        }
        if (id === 'beerus') {
            strip(torso, accent, 0, .401, .196, .142, .318);
            strip(torso, white, 0, .431, .214, .07, .07, Math.PI / 4);
            strip(torso, gold, 0, .549, .213, .128, .019);
        }
        if (id === 'gojo') {
            detail(head, '#111827', 0, .133, .133, .229, .072, .114);
            detail(head, '#283345', 0, .174, .179, .181, .012, .052);
            detail(torso, '#20283a', 0, .628, .012, .139, .105, .129);
            detail(torso, '#30394a', .024, .432, .183, .008, .175, .011).rotation.z = -.08;
        }
        if (id === 'sukuna') {
            detail(torso, '#263144', 0, -.025, 0, .254, .06, .18);
            [-1, 1].forEach(side => {
                detail(torso, '#d4d4cc', side * .095, .421, .157, .024, .179, .032).rotation.z = side * -.47;
                detail(head, '#42232c', side * .131, .069, .172, .038, .008, .009).rotation.z = side * .16;
                detail(head, '#42232c', side * .146, -.003, .151, .01, .067, .012).rotation.z = side * .44;
            });
            detail(head, '#42232c', 0, .232, .174, .013, .045, .009);
            detail(head, '#42232c', 0, .213, .181, .04, .008, .008);
        }
        if (id === 'kakashi') {
            detail(head, '#273449', 0, -.025, .14, .204, .133, .092);
            detail(head, '#3c4758', -.091, .175, .193, .113, .042, .043).rotation.z = .32;
        }
        if (['yuji', 'gaara', 'kiba', 'jiraiya', 'tanjiro'].includes(id)) {
            [-1, 1].forEach(side => {
                const mark = detail(head, id === 'tanjiro' ? '#7c2828' : '#992f33', side * 0.14, id === 'tanjiro' ? 0.22 : 0, 0.175, 0.018, 0.07, 0.008);
                mark.rotation.z = side * 0.25;
            });
        }
        if (id === 'nezuko') {
            const bamboo = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 16), material('#5f9748'));
            bamboo.rotation.z = Math.PI / 2;
            bamboo.position.set(0, -0.04, 0.22);
            head.add(bamboo);
        }
        if (['luffy', 'mario', 'usopp', 'chopper'].includes(id)) {
            const color = id === 'luffy' ? '#dfb858' : id === 'mario' ? '#d42b31' : id === 'chopper' ? '#e36eab' : '#b49a65';
            detail(head, color, 0, 0.33, 0, id === 'luffy' ? 0.39 : 0.29, 0.035, 0.3);
            detail(head, color, 0, 0.39, -0.01, 0.245, 0.14, 0.23);
            if (id === 'luffy') detail(head, '#b23533', 0, 0.355, 0, 0.25, 0.035, 0.235);
            if (id === 'mario' || id === 'chopper') {
                detail(head, '#ffffff', 0, 0.4, 0.217, 0.08, 0.07, 0.014);
                if (id === 'chopper') {
                    [-1, 1].forEach(side => {
                        horn(head, '#885c36', side * 0.32, 0.5, 0, 0.045, 0.3, side * -0.65);
                        horn(head, '#885c36', side * 0.4, 0.57, 0, 0.03, 0.16, side * 0.4);
                    });
                    detail(head, '#3288be', 0, 0.02, 0.23, 0.045, 0.035, 0.035);
                }
            }
        }
        if (id === 'mario') {
            detail(head, '#573721', 0, -0.01, 0.21, 0.13, 0.035, 0.025);
            detail(head, '#efbc94', 0, 0.06, 0.23, 0.07, 0.065, 0.06);
        }
        if (id === 'usopp') detail(head, character.skin, 0, 0.045, 0.29, 0.035, 0.035, 0.16);
        if (id === 'zoro') {
            [-1, 0, 1].forEach(i => detail(head, '#e8c34a', -0.235, -0.035 + i * 0.035, 0.04, 0.009, 0.025, 0.009));
        }
        if (id === 'todoroki') detail(head, '#a45450', -.11, .117, .166, .07, .047, .025);
        if (['power', 'bowser', 'beru'].includes(id)) {
            [-1, 1].forEach(side => horn(head, id === 'power' ? '#b73345' : '#e9d9b2', side * 0.18, 0.48, 0, 0.055, 0.26, side * -0.2));
        }
        if (id === 'piccolo') {
            [-1, 1].forEach(side => {
                horn(head, character.skin, side * 0.13, 0.36, 0.1, 0.025, 0.22, side * -0.3);
                detail(head, character.skin, side * 0.28, 0.13, 0, 0.13, 0.05, 0.05);
            });
            detail(torso, '#eee8d9', 0, 0.48, -0.14, 0.43, 0.12, 0.19);
        }
        if (id === 'beerus') {
            [-1, 1].forEach(side => {
                horn(head, character.skin, side * 0.15, 0.5, 0, 0.08, 0.48, side * -0.12);
                detail(head, '#65508a', side * 0.15, 0.48, 0.04, 0.035, 0.14, 0.02);
            });
            detail(head, character.skin, 0, -0.01, 0.19, 0.12, 0.08, 0.08);
        }
        if (id === 'frieza') detail(head, '#8644ab', 0, 0.29, 0, 0.18, 0.09, 0.175);
        if (id === 'hit') detail(head, '#8970a8', 0, 0.27, 0, 0.205, 0.1, 0.19);
        if (id === 'jiren') {
            [-1, 1].forEach(side => detail(head, '#171820', side * 0.09, 0.14, 0.19, 0.068, 0.06, 0.015));
        }
        if (id === 'brook') {
            detail(head, '#11121c', 0, 0.32, -0.09, 0.36, 0.3, 0.23);
            [-1, 1].forEach(side => detail(head, '#161723', side * 0.085, 0.13, 0.195, 0.06, 0.065, 0.02));
            detail(head, '#161723', 0, 0.015, 0.205, 0.025, 0.03, 0.015);
            for (let i = -2; i <= 2; i++) detail(head, '#33323b', i * 0.026, -0.065, 0.19, 0.004, 0.025, 0.007);
        }
        if (['sonic', 'shadow', 'knuckles'].includes(id)) {
            detail(head, character.primary, 0, 0.18, -0.03, 0.26, 0.25, 0.22);
            [-1, 1].forEach(side => {
                horn(head, character.primary, side * 0.17, 0.42, 0, 0.075, 0.2, side * -0.25);
                detail(head, '#faf5e3', side * 0.085, 0.14, 0.195, 0.08, 0.09, 0.025);
                detail(head, '#202027', side * 0.07, 0.13, 0.22, 0.025, 0.055, 0.01);
            });
            detail(head, '#e7b68a', 0, -0.005, 0.18, 0.17, 0.095, 0.085);
            detail(head, '#22232b', 0, 0.04, 0.27, 0.035, 0.03, 0.04);
            for (let i = -1; i <= 1; i++) horn(head, character.primary, i * 0.18, 0.14, -0.24, 0.12, 0.4, i * 0.8 + Math.PI);
        }
        if (id === 'dk' || id === 'bowser') {
            detail(head, id === 'dk' ? '#a97850' : '#e6be78', 0, -0.015, 0.18, 0.21, 0.13, 0.12);
            if (id === 'dk') detail(torso, '#c63232', 0, 0.3, 0.19, 0.06, 0.24, 0.025);
        }
        if (id === 'deku') {
            detail(torso, '#b6c6bf', 0, 0.53, 0.12, 0.23, 0.11, 0.12);
            [-1, 1].forEach(side => detail(head, '#4b5243', side * 0.14, 0.02, 0.18, 0.025, 0.008, 0.008));
        }
        if (id === 'bakugo' || id === 'asta') detail(head, '#252b32', 0, id === 'asta' ? 0.24 : 0.13, 0.16, 0.23, 0.04, 0.07);
        if (['goku', 'gohan', 'vegeta', 'trunks'].includes(id)) {
            detail(torso, character.secondary, 0, 0.53, 0.12, 0.2, 0.065, 0.12);
            if (id === 'vegeta') detail(torso, '#e7e5d9', 0, 0.27, 0.16, 0.245, 0.22, 0.055);
        }
        if (['naruto', 'kakashi', 'itachi', 'jiraiya', 'sakura', 'kiba'].includes(id)) {
            const band = joint(head, 0, .245, 0);
            if (id === 'kakashi') band.rotation.z = .27;
            ellipsoid(band, dark, 0, 0, 0, .225, .044, .214);
            ellipsoid(band, material('#a6b4bf', .34), 0, 0, .207, .126, .035, .018);
            const emblem = new THREE.Mesh(new THREE.TorusGeometry(0.021, 0.004, 5, 16), dark);
            emblem.position.set(0, 0, .227);
            band.add(emblem);
            for (const side of [-1, 1]) ellipsoid(band, dark, side * .099, 0, .22, .006, .006, .004);
            if (id === 'itachi') strip(band, dark, 0, -.005, .23, .17, .006);
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
        const shortSleeve = ['gi', 'open', 'straps', 'gloves'].includes(outfit);
        const gloves = outfit === 'gloves';
        const legs = outfit === 'overalls' || (outfit === 'open' && id === 'luffy') ? accent : suit;
        [-1, 1].forEach(side => {
            const shoulder = joint(torso, side * 0.3, 0.49, 0);
            profile(shoulder, shortSleeve ? skin : suit, [[0, -.371], [.075, -.352], [.084, -.256],
                [.104, -.155], [.117, -.062], [.102, .026], [.057, .067], [0, .073]], .97);
            if (outfit === 'gi') ellipsoid(shoulder, accent, 0, -.042, 0, .125, .129, .114);
            if (outfit === 'armor' || (outfit === 'pauldron' && (id === 'sephiroth' || side === -1))) {
                const pad = ellipsoid(shoulder, white, side * .032, -.015, 0, .136, .092, .133);
                pad.rotation.z = side * -.31;
            }
            const elbow = joint(shoulder, 0, -0.34, 0);
            profile(elbow, shortSleeve ? skin : suit, [[0, -.302], [.06, -.299], [.067, -.236], [.088, -.146],
                [.085, -.05], [.075, .022], [0, .05]], .94);
            const cuff = gloves ? white : id === 'gojo' ? suit : accent;
            const hand = gloves ? white : skin;
            ellipsoid(elbow, cuff, 0, -.278, 0, gloves ? .087 : .066, .029, .066);
            ellipsoid(elbow, hand, 0, -.35, .015, gloves ? .078 : .057, .072, .036);
            ellipsoid(elbow, hand, -side * .048, -.363, .041, .021, .041, .021).rotation.z = side * .32;
            for (let finger = 0; finger < 4; finger++) {
                ellipsoid(elbow, hand, (finger - 1.5) * .023, -.408, .023, .012, .026 + Math.sin(finger) * .011, .015);
            }
            const hip = joint(rig, side * 0.145, 1.08, 0);
            profile(hip, legs, [[0, -.492], [.091, -.471], [.095, -.382], [.112, -.278],
                [.132, -.135], [.137, -.006], [.098, .048], [0, .059]], .93);
            const knee = joint(hip, 0, -0.46, 0);
            profile(knee, id === 'luffy' ? skin : legs, [[0, -.451], [.073, -.427], [.075, -.335], [.096, -.209],
                [.103, -.092], [.096, .01], [.069, .052], [0, .067]], .91);
            ellipsoid(knee, dark, 0, -.478, .065, .101, .042, .179);
            ellipsoid(knee, accent, 0, -.439, .067, .096, .061, .168);
            ellipsoid(knee, accent, 0, -.401, -.006, .082, .067, .102);
            limbs.push({ side, shoulder, elbow, hip, knee });
        });
        const shield = new THREE.Mesh(new THREE.SphereGeometry(1.25, 24, 18), new THREE.MeshBasicMaterial({ color: character.aura, transparent: true, opacity: 0.2, depthWrite: false }));
        shield.position.y = 1.1;
        shield.visible = false;
        root.add(shield);
        root.userData.shield = shield;
        root.userData.motion = { rig, torso, head, limbs, time: 0, blend: 0, landing: 0, wasGrounded: false, action: '', actionTime: 0 };
        inkSilhouette(THREE, rig);
        if (window.CombatItems) window.CombatItems.attach(THREE, root, character);
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
        const weaponAnimation = root.userData.weaponAnimation;
        if (weaponAnimation) weaponAnimation.remaining = Math.max(0, weaponAnimation.remaining - dt);
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
        const throwing = active && m.action === 'throw';
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
            if (throwing && side === 1) { arm = -0.4 - power * 1.9; bend = -1.1 + power; }
            if (weaponAnimation?.remaining > 0 && !guard && !super1 && !super2) {
                const progress = 1 - weaponAnimation.remaining / weaponAnimation.duration;
                const swing = Math.sin(progress * Math.PI);
                if (side === 1 || weaponAnimation.combo > 1) {
                    arm = weaponAnimation.kind === 'heavy' ? -2.5 + swing * 2 : -0.4 - swing * 1.7;
                    bend = weaponAnimation.kind === 'thrust' ? -0.9 + swing * 0.85 : -0.45;
                }
            }
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
