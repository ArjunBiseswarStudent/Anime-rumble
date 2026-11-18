/* Fully modeled pickups; the supplied illustrations guide shape and palette. */
window.HealingModels = (() => {
    function create(THREE, item) {
        const root = new THREE.Group();
        const material = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.48, ...options });
        const cream = material('#fff0ce'), green = material('#5a9a29'), gold = material('#d6a23e', { metalness: 0.65, roughness: 0.3 });
        const dark = material('#2a3531'), red = material('#d83736'), blue = material('#3bb9e8');
        const add = (geometry, mat, x = 0, y = 0, z = 0) => {
            const mesh = new THREE.Mesh(geometry, mat); mesh.position.set(x, y, z);
            mesh.castShadow = mesh.receiveShadow = true; root.add(mesh); return mesh;
        };
        const ball = (mat, x, y, z, sx, sy, sz) => {
            const object = add(new THREE.SphereGeometry(1, 18, 12), mat, x, y, z);
            object.scale.set(sx, sy, sz); return object;
        };
        const cylinder = (mat, x, y, z, top, bottom, height) => add(new THREE.CylinderGeometry(top, bottom, height, 24), mat, x, y, z);
        const box = (mat, x, y, z, w, h, d) => add(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
        const ring = (mat, x, y, z, radius, tube) => add(new THREE.TorusGeometry(radius, tube, 8, 28), mat, x, y, z);
        function egg(x, y, z) { ball(cream, x, y, z, .15, .04, .19); ball(gold, x, y + .04, z, .09, .035, .1); }
        if (item.kind === 'pill') {
            cylinder(red, 0, 0, 0, .19, .21, .45);
            cylinder(cream, 0, 0, 0, .215, .215, .23);
            cylinder(red, 0, .28, 0, .24, .24, .12);
            box(green, 0, .01, .218, .15, .045, .025);
            box(green, 0, .01, .22, .045, .14, .025);
            for (let i = 0; i < 3; i++) cylinder(cream, .27 + i * .06, -.21 + i * .045, .13, .065, .065, .035);
        } else if (item.kind === 'rice') {
            const shape = new THREE.Shape(); shape.moveTo(-.31, -.23); shape.quadraticCurveTo(-.38, -.2, -.3, -.05);
            shape.lineTo(-.06, .32); shape.quadraticCurveTo(0, .4, .07, .31); shape.lineTo(.31, -.09);
            shape.quadraticCurveTo(.38, -.24, .24, -.25); shape.closePath();
            add(new THREE.ExtrudeGeometry(shape, { depth: .19, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .045, bevelThickness: .035 }), cream, 0, 0, -.1);
            box(dark, 0, -.13, .15, .23, .24, .035);
            for (let i = 0; i < 24; i++) {
                const y = -.19 + i % 6 * .075, span = (.35 - y) * .42;
                ball(cream, Math.sin(i * 17) * span, y, .14, .025, .014, .018);
            }
        } else if (item.kind === 'scroll') {
            const parchment = cylinder(cream, 0, 0, 0, .17, .17, .52); parchment.rotation.z = -.55;
            [-1, 1].forEach(side => {
                const cap = cylinder(gold, side * .16, side * .26, 0, .21, .21, .1); cap.rotation.z = -.55;
            });
            box(green, 0, 0, .17, .12, .1, .035);
            for (let i = 0; i < 3; i++) ball(red, .18 + i * .025, -.13 - i * .07, .08, .04, .07, .04);
        } else if (item.kind === 'ramen') {
            cylinder(red, 0, -.04, 0, .34, .2, .3);
            cylinder(material('#e8a436'), 0, .115, 0, .3, .3, .025);
            const rim = ring(cream, 0, .12, 0, .33, .025); rim.rotation.x = Math.PI / 2;
            for (let i = 0; i < 7; i++) { const noodle = ring(cream, Math.sin(i * 3) * .13, .14, Math.cos(i * 3) * .12, .07, .012); noodle.rotation.x = Math.PI / 2; }
            egg(.12, .16, .08);
            for (let i = 0; i < 7; i++) { const spring = ring(green, -.14 + i % 3 * .05, .16, -.12 + Math.floor(i / 3) * .05, .025, .012); spring.rotation.x = Math.PI / 2; }
            for (const x of [.17, .24]) { const stick = cylinder(material('#79522c'), x, .4, -.13, .012, .012, .6); stick.rotation.z = -.4; }
            const steam = [];
            for (let i = 0; i < 4; i++) steam.push(ball(material('#fff5df', { transparent: true, opacity: .18, depthWrite: false }), 0, .3, 0, .035, .07, .035));
            root.userData.animate = time => steam.forEach((puff, i) => {
                const phase = (time * .55 + i / 4) % 1;
                puff.position.set(Math.sin(time * 2 + i) * .09, .2 + phase * .45, Math.cos(i) * .08);
                puff.material.opacity = Math.sin(phase * Math.PI) * .2;
            });
        } else if (item.kind === 'slug') {
            ball(cream, 0, -.07, 0, .4, .15, .22);
            ball(cream, .12, .12, 0, .19, .25, .18);
            ball(blue, -.17, .015, -.02, .2, .11, .18);
            for (const side of [-1, 1]) {
                const horn = cylinder(cream, .12 + side * .1, .36, 0, .025, .033, .2); horn.rotation.z = side * -.3;
                ball(dark, .12 + side * .07, .18, .17, .023, .03, .015);
            }
        } else if (item.kind === 'medicine') {
            const pink = material('#f273b8'); cylinder(pink, 0, 0, 0, .27, .27, .15).rotation.x = Math.PI / 2;
            box(cream, 0, 0, .09, .3, .08, .03).rotation.z = Math.PI / 4;
            box(cream, 0, 0, .09, .08, .3, .03).rotation.z = Math.PI / 4;
        } else if (item.kind === 'meat') {
            const roast = material('#bc6025'); ball(roast, 0, .01, 0, .32, .22, .22);
            cylinder(cream, 0, 0, 0, .07, .07, .88).rotation.z = Math.PI / 2;
            for (const side of [-1, 1]) for (const dz of [-.045, .045]) ball(cream, side * .44, 0, dz, .08, .08, .07);
            for (let i = 0; i < 4; i++) { const mark = ring(gold, (i - 1.5) * .12, .01, 0, .218, .012); mark.rotation.y = Math.PI / 2; }
        } else if (item.kind === 'potion') {
            const glass = material('#9be6f3', { transparent: true, opacity: .28, roughness: .12, metalness: .15, depthWrite: false });
            cylinder(blue, 0, -.05, 0, .18, .2, .34);
            cylinder(glass, 0, 0, 0, .22, .24, .49);
            cylinder(glass, 0, .3, 0, .11, .17, .14);
            cylinder(material('#b38754'), 0, .42, 0, .12, .11, .15);
            const bubbles = [];
            for (let i = 0; i < 5; i++) bubbles.push(ball(cream, Math.sin(i * 3) * .1, -.15 + i * .06, .13, .016, .016, .016));
            root.userData.animate = time => bubbles.forEach((bubble, i) => { bubble.position.y = -.2 + (time * .12 + i * .06) % .35; });
        } else if (item.kind === 'bento') {
            box(dark, 0, -.08, 0, .66, .23, .48); box(cream, -.13, .055, 0, .3, .07, .37);
            box(dark, .03, .06, 0, .025, .09, .42); egg(-.14, .11, 0);
            for (let i = 0; i < 6; i++) ball(i < 3 ? gold : green, .16, .1, (i % 3 - 1) * .12, .11, .075, .08);
            const tomato = material('#e74432'); ball(tomato, .18, .15, .1, .1, .025, .1);
        } else if (item.kind === 'hormones') {
            const purple = material('#bb51f2', { roughness: .23 });
            const body = cylinder(material('#d9efff', { transparent: true, opacity: .3, roughness: .15, depthWrite: false }), 0, 0, 0, .12, .12, .48);
            const liquid = cylinder(purple, 0, 0, .025, .09, .09, .38);
            for (const y of [-.26, .26]) cylinder(gold, 0, y, 0, .15, .15, .045);
            cylinder(dark, 0, .36, 0, .035, .035, .18); cylinder(cream, 0, .46, 0, .16, .16, .035);
            cylinder(gold, 0, -.43, 0, .008, .012, .28);
            body.rotation.z = liquid.rotation.z = 0;
        } else if (item.kind === 'bean') {
            const bean = material('#8fd92f', { roughness: .25 });
            for (let i = 0; i < 3; i++) {
                const object = ball(bean, (i - 1) * .16, i % 2 * .1, 0, .19, .1, .1); object.rotation.z = (i - 1) * .4;
                ball(green, (i - 1) * .16, i % 2 * .1, .09, .035, .02, .012);
            }
        }
        // Dispose even unused material choices; no textures or shared geometry are owned here.
        for (const mat of [cream, green, gold, dark, red, blue]) if (!root.children.some(child => child.material === mat)) mat.dispose();
        return root;
    }
    return { create };
})();
