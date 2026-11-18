/* Lightweight 3D supply aircraft and parachute; no image is used as a flat plane. */
window.SupplyPlane = (() => {
    const logoUrl = document.currentScript?.src ? new URL('../../img/anime-rumble-logo.png', document.currentScript.src).href : 'assest/img/anime-rumble-logo.png';
    let logoTexture;
    function create(THREE, direction) {
        const visual = new THREE.Group(); visual.name = 'anime-supply-plane';
        const mat = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: .38, ...options });
        const white = mat('#f2eee8'), red = mat('#cd283a'), gold = mat('#dfb34e', { metalness: .65 }), dark = mat('#1c283b');
        const glass = mat('#123e79', { metalness: .35, roughness: .16 });
        const add = (geometry, material, x, y, z) => {
            const object = new THREE.Mesh(geometry, material); object.position.set(x, y, z);
            visual.add(object); return object;
        };
        const ball = (material, x, y, z, sx, sy, sz) => {
            const object = add(new THREE.SphereGeometry(1, 20, 14), material, x, y, z); object.scale.set(sx, sy, sz); return object;
        };
        const box = (material, x, y, z, w, h, d) => add(new THREE.BoxGeometry(w, h, d), material, x, y, z);
        ball(white, 0, 0, 0, 2.2, .43, .48);
        ball(white, 1.8, -.015, 0, .58, .34, .38);
        ball(dark, 2.12, -.04, 0, .3, .22, .26);
        for (const side of [-1, 1]) {
            const wing = box(white, -.35, -.12, side * 1.35, .9, .075, 2.4); wing.rotation.y = side * -.22;
            const trim = box(red, -.35, -.09, side * 1.35, .14, .09, 2.42); trim.rotation.y = wing.rotation.y;
            const tip = box(red, -.6, .02, side * 2.46, .45, .24, .07); tip.rotation.x = side * -.2;
            const tail = box(red, -1.7, .12, side * .61, .57, .06, 1.15); tail.rotation.y = side * -.25;
            for (let i = 0; i < 7; i++) box(glass, -1.1 + i * .35, .12, side * .455, .13, .14, .025);
            const cockpit = box(glass, 1.48, .25, side * .29, .43, .17, .08); cockpit.rotation.z = -.15;
            for (let i = 0; i < 4; i++) ball(red, -.9 + i * .42, -.14, side * .455, .27, .12, .028);
        }
        const finShape = new THREE.Shape(); finShape.moveTo(-2.05, .1); finShape.lineTo(-2, 1.13); finShape.lineTo(-1.5, 1.13); finShape.lineTo(-1.15, .15); finShape.closePath();
        add(new THREE.ExtrudeGeometry(finShape, { depth: .06, bevelEnabled: false }), red, 0, 0, -.03);
        const sun = add(new THREE.CircleGeometry(.23, 20), gold, -1.72, .72, .04); sun.rotation.y = 0;
        const fans = [], nav = [];
        for (const z of [-1.8, -.92, .92, 1.8]) {
            const engine = add(new THREE.CylinderGeometry(.22, .25, .65, 20), white, .02, -.34, z); engine.rotation.z = -Math.PI / 2;
            const rim = add(new THREE.TorusGeometry(.23, .045, 8, 24), red, .35, -.34, z); rim.rotation.y = Math.PI / 2;
            const intake = add(new THREE.CircleGeometry(.21, 20), dark, .36, -.34, z); intake.rotation.y = Math.PI / 2;
            const fan = new THREE.Group(); fan.position.set(.38, -.34, z); visual.add(fan); fans.push(fan);
            for (let i = 0; i < 6; i++) {
                const angle = i * Math.PI / 3;
                const blade = box(gold, 0, Math.cos(angle) * .12, Math.sin(angle) * .12, .025, .17, .045);
                blade.rotation.x = angle; fan.add(blade);
            }
            fan.add(ball(gold, .02, 0, 0, .07, .065, .065));
        }
        for (const side of [-1, 1]) {
            const lamp = ball(mat(side < 0 ? '#ff5364' : '#6fffb4', { emissive: side < 0 ? '#f7364d' : '#28df92', emissiveIntensity: 1 }), -.6, .12, side * 2.5, .05, .05, .05);
            nav.push(lamp);
        }
        if (THREE.TextureLoader) {
            if (!logoTexture) { logoTexture = new THREE.TextureLoader().load(logoUrl); logoTexture.encoding = THREE.sRGBEncoding; }
            add(new THREE.PlaneGeometry(.65, .65), mat('#ffffff', { map: logoTexture, transparent: true, roughness: .55, depthWrite: false }), .18, -.02, .49);
            const other = add(new THREE.PlaneGeometry(.65, .65), mat('#ffffff', { map: logoTexture, transparent: true, roughness: .55, depthWrite: false }), .18, -.02, -.49); other.rotation.y = Math.PI;
        }
        visual.rotation.y = direction < 0 ? Math.PI : 0;
        visual.scale.setScalar(.8);
        return { visual, update(age) {
            fans.forEach(fan => { fan.rotation.x = age * 32; });
            nav.forEach((lamp, i) => { lamp.material.emissiveIntensity = .8 + Math.max(0, Math.sin(age * 4 + i)) * 1.2; });
            visual.rotation.z = Math.sin(age * 1.3) * .025;
            visual.rotation.x = Math.sin(age * .7) * .025;
        } };
    }
    function parachute(THREE) {
        const root = new THREE.Group(); root.name = 'health-supply-parachute';
        const material = color => new THREE.MeshStandardMaterial({ color, roughness: .8, side: THREE.DoubleSide });
        const colors = [material('#eee8d5'), material('#cb3d48')], ropeMaterial = material('#c4b99d');
        for (let i = 0; i < 8; i++) {
            const panel = new THREE.Mesh(new THREE.SphereGeometry(.67, 8, 8, i * Math.PI / 4, Math.PI / 4, 0, Math.PI / 2), colors[i % 2]);
            panel.position.y = 1.4; panel.scale.y = .45; root.add(panel);
            const angle = i * Math.PI / 4, x = Math.cos(angle) * .62, z = Math.sin(angle) * .62;
            const dx = x, dy = 1.12, dz = z, length = Math.hypot(dx, dy, dz);
            const rope = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, length, 4), ropeMaterial);
            rope.position.set(x / 2, .84, z / 2);
            rope.rotation.z = -Math.atan2(x, dy); rope.rotation.x = Math.atan2(z, Math.hypot(dy, x));
            root.add(rope);
        }
        return root;
    }
    return { create, parachute };
})();
