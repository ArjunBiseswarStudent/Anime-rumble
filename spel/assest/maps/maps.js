/* Shared arena definitions and scenery. Platform coordinates match the game's 960 × 540 world. */
window.AnimeMaps = (() => {
    const platform = (x, y, w, main = false) => ({ x, y, w, main });
    const arenas = {
        dojo: { name: 'Anime Dojo', series: 'Anime Rumble · Stadsdak', description: 'Vecht op het dak van een dojo boven een levende stad, tussen lantaarns en wapperende banieren.', bgTop: '#303b78', bgBottom: '#f1a77e', horizon: '#efae89', cloud: '#f4c5af', accentColor: '#efb45f', surface: '#886855', structure: 'roof', platforms: [platform(180, 420, 600, true), platform(230, 310, 160), platform(570, 310, 160), platform(400, 215, 160)] },
        castle: { name: 'Schaduw Kasteel', series: 'Anime Rumble · Kasteelmuur', description: 'Een gevecht op de kasteelmuur, met torens, brandende vuurkorven en vleermuizen in de maanlucht.', bgTop: '#191b42', bgBottom: '#665475', horizon: '#665475', cloud: '#645d7e', accentColor: '#b49ae6', surface: '#777586', structure: 'wall', platforms: [platform(160, 430, 640, true), platform(210, 305, 180), platform(570, 305, 180)] },
        island: { name: 'Zwevend Eiland', series: 'Anime Rumble · Luchteilanden', description: 'Begroeide eilanden, een luchttempel en watervallen die verdwijnen in de wolken.', bgTop: '#3a9bce', bgBottom: '#d2e9e8', horizon: '#d2e9e8', cloud: '#f2f9f6', accentColor: '#c1e9c9', surface: '#719a58', structure: 'island', platforms: [platform(210, 425, 540, true), platform(120, 325, 140), platform(700, 325, 140), platform(410, 240, 140)] },
        neon: { name: 'Neon Stad', series: 'Anime Rumble · Nachtstraat', description: 'Vecht op een verhoogde straat naast rijdend verkeer, verlichte winkels en een neonstad.', bgTop: '#171a3c', bgBottom: '#433857', horizon: '#433857', cloud: '#62536d', accentColor: '#ed608e', surface: '#464d60', structure: 'street', platforms: [platform(150, 420, 660, true), platform(280, 315, 400), platform(410, 210, 140)] },
        frog: { name: 'Frog Island', series: 'Naruto · Mount Myōboku', description: 'Reusachtige paddenstoelen en wijze kikkers boven een mistige vallei.', bgTop: '#53c7cf', bgBottom: '#a9e3c8', horizon: '#b7e7bd', cloud: '#e0efd1', waterColor: '#d5a824', accentColor: '#d5ad35', surface: '#83a845', platforms: [platform(150, 430, 660, true), platform(170, 315, 150), platform(640, 315, 150), platform(405, 220, 150)] },
        namek: { name: 'Planet Namek', series: 'Dragon Ball', description: 'Gelaagde rotsplateaus, blauw water en het ruimteschip van Frieza onder een groene hemel.', bgTop: '#6eaa78', bgBottom: '#c1cc66', horizon: '#c1cc66', cloud: '#b2ca8b', waterColor: '#2799b6', accentColor: '#d2be67', surface: '#369fba', platforms: [platform(160, 430, 640, true), platform(245, 320, 155), platform(560, 285, 155)] },
        beerus: { name: 'Beerus Palace', series: 'Dragon Ball Super', description: 'Een paarse paleisarena met turquoise begroeiing, een oude boom en een perzikkleurige hemel.', bgTop: '#d77d86', bgBottom: '#ffce8d', horizon: '#ffce8d', cloud: '#ffe0aa', waterColor: '#279eaa', accentColor: '#b279eb', surface: '#7436bb', platforms: [platform(140, 430, 680, true), platform(210, 315, 170), platform(580, 315, 170), platform(410, 225, 140)] },
        arlong: { name: 'Arlong Park', series: 'One Piece', description: 'Tropische palmen, een haaienpoort en het zwembad van de Arlong Pirates.', bgTop: '#208de0', bgBottom: '#a4dcf4', horizon: '#b4e4f7', cloud: '#ffffff', waterColor: '#087ed0', accentColor: '#d3bd72', surface: '#ac7159', platforms: [platform(140, 430, 270, true), platform(550, 430, 270, true), platform(350, 330, 260), platform(130, 240, 145), platform(685, 240, 145)] },
        kurukshetra: { name: 'Kurukshetra Slagveld', series: 'Episch slagveld · Zonsondergang', description: 'Een stoffig slagveld onder een vurige avondhemel, met strijdwagens, olifanten en vechtende legers op de achtergrond.', bgTop: '#34303e', bgBottom: '#dc8d43', horizon: '#df9a50', cloud: '#50414a', accentColor: '#bf8c43', surface: '#9b7045', surfaceType: 'earth', sunColor: '#ffc177', ambientColor: '#837062', platforms: [platform(110, 440, 740, true), platform(185, 325, 165), platform(610, 325, 165), platform(405, 230, 150)] },
    };

    // Reuse generated surface maps between rounds; no external texture downloads.
    const surfaceTextures = new Map();
    function surfaceTexture(THREE, type) {
        if (surfaceTextures.has(type)) return surfaceTextures.get(type);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 2300; i++) {
            const x = (i * 73.37) % 128, y = (i * 39.71) % 128;
            const shade = 190 + Math.floor((Math.sin(i * 127.1) + 1) * 30);
            ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
            ctx.fillRect(x, y, type === 'bark' ? 1 : 2, type === 'bark' ? 14 : 2);
        }
        if (type === 'stone') {
            ctx.strokeStyle = '#b8b8b8';
            ctx.lineWidth = 1;
            for (let row = 0; row < 4; row++) {
                ctx.beginPath(); ctx.moveTo(0, row * 32); ctx.lineTo(128, row * 32); ctx.stroke();
                for (let col = 0; col < 4; col++) {
                    const x = (col * 40 + row % 2 * 20) % 128;
                    ctx.beginPath(); ctx.moveTo(x, row * 32); ctx.lineTo(x, row * 32 + 32); ctx.stroke();
                }
            }
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        surfaceTextures.set(type, texture);
        return texture;
    }

    function buildScenery(THREE, scene, key) {
        if (!arenas[key]) return;
        const group = new THREE.Group();
        scene.add(group);
        const animations = [];
        scene.background = new THREE.Color(arenas[key].bgTop);
        scene.fog = new THREE.Fog(arenas[key].horizon, 28, 75);
        scene.userData.updateMap = time => animations.forEach(fn => fn(time));
        const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 24, 16), new THREE.ShaderMaterial({
            side: THREE.BackSide, depthWrite: false,
            uniforms: { top: { value: new THREE.Color(arenas[key].bgTop) }, bottom: { value: new THREE.Color(arenas[key].horizon) } },
            vertexShader: 'varying vec3 skyPosition; void main(){skyPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
            fragmentShader: 'uniform vec3 top;uniform vec3 bottom;varying vec3 skyPosition;void main(){float h=smoothstep(-0.1,0.65,normalize(skyPosition).y);gl_FragColor=vec4(mix(bottom,top,h),1.0);}'
        }));
        group.add(sky);
        if (key === 'kurukshetra') {
            sky.material.uniforms.time = { value: 0 };
            sky.material.fragmentShader = `
                uniform vec3 top; uniform vec3 bottom; uniform float time;
                varying vec3 skyPosition;
                float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
                float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
                    return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
                void main(){
                    vec3 direction=normalize(skyPosition);
                    float height=direction.y;
                    vec2 p=vec2(direction.x*6.0+time*0.009,height*8.0);
                    float cloud=noise(p)*0.55+noise(p*2.1)*0.28+noise(p*4.3)*0.17;
                    vec3 sky=mix(bottom,top,smoothstep(-0.05,0.65,height));
                    vec3 storm=mix(vec3(.26,.18,.20),vec3(.12,.12,.16),smoothstep(0.,.55,height));
                    float cover=smoothstep(.39,.67,cloud)*smoothstep(.02,.22,height);
                    sky=mix(sky,storm,cover*.88);
                    float rim=exp(-abs(cloud-.43)*36.)*(1.0-smoothstep(.04,.4,height));
                    sky+=vec3(.30,.10,.015)*rim;
                    gl_FragColor=vec4(sky,1.0);
                }`;
            animations.push(t => { sky.material.uniforms.time.value = t; });
        }
        function mesh(geometry, color, x, y, z) {
            const object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
            object.position.set(x, y, z);
            object.castShadow = true;
            object.receiveShadow = true;
            group.add(object);
            return object;
        }
        const box = (c, x, y, z, w, h, d) => mesh(new THREE.BoxGeometry(w, h, d), c, x, y, z);
        const ball = (c, x, y, z, r, sx = 1, sy = 1, sz = 1) => {
            const object = mesh(new THREE.SphereGeometry(r, 16, 12), c, x, y, z);
            object.scale.set(sx, sy, sz);
            return object;
        };
        const pillar = (c, x, y, z, top, bottom, h, sides = 16) =>
            mesh(new THREE.CylinderGeometry(top, bottom, h, sides), c, x, y, z);
        function branch(c, a, b, radius, tip = radius * 0.6) {
            const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
            const object = pillar(c, 0, 0, 0, tip, radius, start.distanceTo(end), 9);
            object.position.copy(start.add(end).multiplyScalar(0.5));
            object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(new THREE.Vector3(...a)).normalize());
            object.material.map = surfaceTexture(THREE, 'bark');
            object.material.bumpMap = object.material.map;
            object.material.bumpScale = 0.12;
            return object;
        }
        function water(c, x, y, z, w, h) {
            const sheet = box(c, x, y, z, w, h, 0.12);
            sheet.material.transparent = true;
            sheet.material.opacity = 0.78;
            sheet.material.roughness = 0.22;
            sheet.castShadow = false;
            for (let i = 0; i < 6; i++) {
                const foam = mesh(new THREE.TorusGeometry(w * 0.25, 0.035, 6, 24), '#f1eecf', x, y - h / 2 + 0.06, z);
                foam.rotation.x = -Math.PI / 2;
                foam.material.transparent = true;
                foam.castShadow = false;
                animations.push(t => {
                    const phase = (t * 0.6 + i / 6) % 1;
                    foam.scale.setScalar(0.5 + phase * 2);
                    foam.material.opacity = (1 - phase) * 0.5;
                });
            }
            for (let i = 0; i < 12; i++) {
                const streak = box('#fff2b9', x + (i / 12 - 0.46) * w, y, z + 0.09, 0.035, 0.6, 0.025);
                animations.push(t => { streak.position.y = y + h / 2 - (t * 2 + i * 0.57) % h; });
            }
        }
        function clouds() {
            for (let i = 0; i < 8; i++) {
                const cloud = ball(arenas[key].cloud, i * 4 - 14, 10 + i % 3, -22, 1, 2.5, 0.5, 0.65);
                animations.push(t => { cloud.position.x = (i * 4 + t * 0.12) % 40 - 20; });
            }
        }
        function windows(x, y, z, count, spacing, color = '#354e68') {
            for (let i = 0; i < count; i++) {
                box(color, x + (i - (count - 1) / 2) * spacing, y, z, 0.23, 0.55, 0.08);
                ball(color, x + (i - (count - 1) / 2) * spacing, y + 0.28, z, 0.115, 1, 1, 0.4);
            }
        }
        function glow(object, color, intensity = 0.8) {
            object.material.emissive.set(color);
            object.material.emissiveIntensity = intensity;
            return object;
        }
        function banner(x, y, z, color) {
            pillar('#514957', x, y, z, 0.035, 0.035, 2.3);
            const flag = mesh(new THREE.PlaneGeometry(0.9, 1.1, 8, 6), color, x + 0.48, y + 0.3, z);
            flag.material.side = THREE.DoubleSide;
            const vertices = flag.geometry.attributes.position;
            animations.push(t => {
                for (let i = 0; i < vertices.count; i++) {
                    const influence = (vertices.getX(i) + 0.45) / 0.9;
                    vertices.setZ(i, Math.sin(t * 2.7 + vertices.getX(i) * 5 + vertices.getY(i) * 2) * 0.16 * influence);
                }
                vertices.needsUpdate = true;
                flag.geometry.computeVertexNormals();
            });
        }
        function traffic(roadY, z, count, speed) {
            box('#313748', 0, roadY - 0.13, z, 46, 0.22, 4.2);
            for (let i = 0; i < 18; i++) box('#c1b995', i * 2.6 - 22, roadY, z, 1.1, 0.02, 0.055);
            for (let i = 0; i < count; i++) {
                const car = new THREE.Group();
                car.name = 'background-traffic';
                group.add(car);
                const add = object => { car.add(object); return object; };
                const color = ['#c94a60', '#dfb94e', '#5e99b1', '#d0d7db', '#637183'][i % 5];
                add(box(color, 0, 0.28, 0, 1.7, 0.38, 0.76));
                add(box(color, -0.1, 0.61, 0, 0.93, 0.33, 0.68));
                add(box('#94c1ce', -0.1, 0.64, 0.35, 0.74, 0.21, 0.025));
                for (const x of [-0.54, 0.54]) for (const side of [-1, 1]) {
                    const wheel = add(pillar('#1b202c', x, 0.12, side * 0.39, 0.17, 0.17, 0.09, 12));
                    wheel.rotation.x = Math.PI / 2;
                    animations.push(t => { wheel.rotation.y = -t * speed * 3; });
                }
                for (const side of [-1, 1]) {
                    add(glow(box('#fff0bc', 0.86, 0.3, side * 0.25, 0.035, 0.12, 0.16), '#fff0bc', 1.5));
                    add(glow(box('#d85065', -0.86, 0.3, side * 0.25, 0.035, 0.11, 0.16), '#e84153'));
                }
                const direction = i % 2 ? -1 : 1;
                car.rotation.y = direction < 0 ? Math.PI : 0;
                animations.push(t => {
                    car.position.set((((t * speed + i * 46 / count) % 46) - 23) * direction,
                        roadY + 0.04 + Math.sin(t * 8 + i) * 0.008, z + direction * 0.98);
                });
            }
        }
        function skyline(night) {
            const windowPositions = [];
            for (let layer = 0; layer < 2; layer++) for (let i = 0; i < 11; i++) {
                const x = i * 3.2 - 16, z = -10 - layer * 9;
                const h = 3 + ((i * 7 + layer * 3) % 7);
                box(layer ? '#44485e' : '#343a51', x, h / 2 - 1, z, 2.5, h, 2.5);
                box('#505369', x, h - 0.9, z, 2.7, 0.16, 2.7);
                for (let row = 0; row < Math.floor(h); row++) for (let col = 0; col < 3; col++) {
                    if ((i + row + col) % 4 === 0) continue;
                    windowPositions.push([x + (col - 1) * 0.58, row - 0.25, z + 1.27]);
                }
            }
            // Render all lit windows together to keep the city inexpensive to draw.
            const panes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.25, 0.4, 0.025),
                new THREE.MeshStandardMaterial({ color: night ? '#e9bf87' : '#c4b7a0',
                    emissive: night ? '#ecbf82' : '#bca68d', emissiveIntensity: night ? 0.8 : 0.2 }), windowPositions.length);
            const transform = new THREE.Object3D();
            windowPositions.forEach((position, i) => {
                transform.position.set(...position);
                transform.updateMatrix();
                panes.setMatrixAt(i, transform.matrix);
            });
            group.add(panes);
        }
        if (key === 'kurukshetra') {
            window.BattlefieldScenery.build(THREE, { group, animations, mesh, box, ball, pillar, branch, banner, glow,
                texture: type => surfaceTexture(THREE, type), platforms: arenas[key].platforms });
        } else if (key === 'dojo') {
            clouds();
            skyline(false);
            traffic(-1.3, -6.5, 4, 2.4);
            // The solid building meets the underside of the playable rooftop.
            box('#665963', 0, -1.25, 0, 9.1, 5.8, 2.05);
            for (let i = 0; i < 7; i++) windows(i * 1.2 - 3.6, -0.5, 1.04, 1, 1, '#d9b77e');
            box('#50424c', 0, 1.95, -1.35, 9.3, 0.12, 0.16);
            for (let i = 0; i < 10; i++) box('#50424c', i - 4.5, 1.73, -1.35, 0.07, 0.55, 0.08);
            // Traditional dojo entrance and layered eaves behind the combat space.
            box('#9e775c', 0, 3.2, -4, 4.8, 2.6, 2.2);
            box('#4a3540', 0, 2.9, -2.86, 1.5, 2.1, 0.08);
            for (let i = 0; i < 7; i++) box('#c1a07b', (i - 3) * 0.22, 2.9, -2.8, 0.045, 2, 0.06);
            const roof = pillar('#384f5e', 0, 4.7, -4, 1.8, 3.7, 0.8, 4);
            roof.rotation.y = Math.PI / 4;
            for (const side of [-1, 1]) {
                banner(side * 3.7, 3.4, -2.5, '#af4651');
                const lantern = glow(ball('#ffd08c', side * 2, 3.6, -2.65, 0.25, 0.8, 1.3, 0.8), '#ff9e45');
                animations.push(t => { lantern.position.x = side * 2 + Math.sin(t * 1.1 + side) * 0.06; });
            }
            ball('#ffd5a5', -11, 8, -28, 1.2);
        } else if (key === 'castle') {
            clouds();
            ball('#e4dcf2', -9, 10, -27, 1.25);
            box('#4a455b', 0, -1.25, 0, 9.7, 5.8, 2.1);
            box('#39354c', 0, 0, -8, 28, 3.5, 3);
            for (let i = 0; i < 7; i++) {
                const x = i * 4.4 - 13.2, h = 5 + i % 3;
                pillar('#555066', x, h / 2, -11 - i % 2 * 3, 1.1, 1.3, h, 10);
                pillar('#34334f', x, h + 0.8, -11 - i % 2 * 3, 0, 1.5, 1.9, 10);
                glow(box('#c49565', x, h - 1.5, -9.85 - i % 2 * 3, 0.22, 0.8, 0.05), '#e3a75b', 0.8);
            }
            for (let i = 0; i < 12; i++) box('#89828d', i * 0.85 - 4.68, 2.07, -1.25, 0.52, 0.7, 0.4);
            for (const side of [-1, 1]) {
                banner(side * 5.7, 4, -4, '#683c83');
                pillar('#51404b', side * 4.25, 2.1, -1.3, 0.12, 0.18, 1);
                const flame = glow(ball('#ffb65b', side * 4.25, 2.95, -1.3, 0.2, 0.7, 1.8, 0.7), '#ff882c', 2);
                const light = new THREE.PointLight('#ffa055', 0.8, 5);
                light.position.copy(flame.position);
                group.add(light);
                animations.push(t => {
                    const flicker = Math.sin(t * 13 + side) * 0.12 + Math.sin(t * 21) * 0.06;
                    flame.scale.y = 1.7 + flicker;
                    light.intensity = 0.8 + flicker;
                });
            }
            for (let i = 0; i < 8; i++) {
                const bat = new THREE.Group(); group.add(bat);
                const wings = [-1, 1].map(side => {
                    const wing = box('#28263d', side * 0.16, 0, 0, 0.3, 0.045, 0.14);
                    bat.add(wing); return wing;
                });
                animations.push(t => {
                    bat.position.set(Math.sin(t * 0.25 + i) * 12, 5 + i % 3 + Math.sin(t * 0.7 + i) * 0.5, -7 - i);
                    wings.forEach((wing, index) => { wing.rotation.z = Math.sin(t * 11 + i) * (index ? 0.7 : -0.7); });
                });
            }
        } else if (key === 'island') {
            clouds();
            for (let i = 0; i < 9; i++) {
                const x = i * 3.8 - 15, y = 1.5 + i % 3 * 1.6, z = -8 - i % 3 * 4;
                const rock = pillar('#998b70', x, y - 1.5, z, 2, 0.25, 3, 7);
                const grass = pillar('#7da66b', x, y + 0.08, z, 2.05, 2, 0.16, 7);
                const crown = ball('#72a36f', x + 0.5, y + 1.6, z, 0.8, 1.2, 0.9, 1);
                const trunk = pillar('#8c7961', x + 0.5, y + 0.8, z, 0.09, 0.14, 1.5);
                animations.push(t => {
                    const rise = Math.sin(t * 0.35 + i) * 0.12;
                    rock.position.y = y - 1.5 + rise; grass.position.y = y + 0.08 + rise;
                    trunk.position.y = y + 0.8 + rise; crown.position.y = y + 1.6 + rise;
                });
                if (i % 3 === 0) water('#a4e0e6', x - 0.8, y - 2.6, z + 1.6, 0.6, 5.5);
            }
            // A distant temple anchors the drifting island skyline.
            box('#e0d2b0', 0, 6.4, -15, 3.4, 0.25, 2.4);
            for (const x of [-1.3, -0.45, 0.45, 1.3]) pillar('#dedcc1', x, 7.4, -15, 0.12, 0.17, 1.8);
            const templeRoof = pillar('#7e9a94', 0, 8.5, -15, 0.3, 2.3, 0.7, 4);
            templeRoof.rotation.y = Math.PI / 4;
            for (let i = 0; i < 6; i++) {
                const bird = mesh(new THREE.ConeGeometry(0.12, 0.45, 3), '#f2f1db', 0, 7, -8 - i);
                bird.rotation.z = Math.PI / 2;
                animations.push(t => { bird.position.set(((t * 0.7 + i * 5) % 34) - 17, 7 + Math.sin(t + i) * 0.3, -8 - i); });
            }
        } else if (key === 'neon') {
            skyline(true);
            traffic(1.35, -5.1, 6, 3.8);
            box('#383c51', 0, 0.25, 0, 10.1, 2.8, 2.05);
            for (const side of [-1, 1]) {
                box('#48455b', side * 7.5, 2.8, -5.8, 4, 5.5, 3);
                glow(box('#68c4d4', side * 7.5, 1.9, -4.25, 3.2, 1.4, 0.05), '#3693b0', 0.45);
                box('#39304a', side * 7.5, 2.9, -3.9, 3.7, 0.25, 0.8);
                const sign = glow(box(side < 0 ? '#e868a5' : '#67cbdc', side * 7.5, 4.7, -4.22, 2.7, 0.65, 0.12), side < 0 ? '#ee4095' : '#39b8d4', 1);
                for (let i = 0; i < 5; i++) box('#f6e0e5', side * 7.5 + (i - 2) * 0.4, 4.7, -4.13, 0.08, 0.34, 0.04);
                animations.push(t => { sign.material.emissiveIntensity = 0.8 + Math.sin(t * 2 + side) * 0.15; });
                pillar('#687087', side * 5.2, 3.2, -2.4, 0.055, 0.075, 4);
                glow(ball('#ffe2ad', side * 5.2, 5.2, -2.4, 0.18, 1.6, 0.5, 1), '#ffc779', 1.5);
            }
            for (let i = 0; i < 8; i++) box('#dfd9b3', i * 0.3 - 1.05, 1.48, -5.1, 0.15, 0.025, 3.7);
        } else if (key === 'frog') {
            clouds();
            box('#659831', 0, -0.65, -8, 34, 1.2, 12);
            for (let i = 0; i < 9; i++) {
                const x = -13 + i * 1.15;
                pillar(i % 2 ? '#797949' : '#9b9255', x, 4.5, -11, 1.4, 1.8, 12 + i % 3, 7);
            }
            water('#d9ad29', -9, 4.2, -8.8, 3.3, 11);
            function toad(x, y, z, size) {
                ball('#74794b', x, y, z, size, 1, 0.9, 0.65);
                ball('#989563', x, y - size * 0.2, z + size * 0.45, size * 0.65, 1, 0.75, 0.35);
                [-1, 1].forEach(side => {
                    ball('#7f8757', x + side * size * 0.55, y + size * 0.6, z + size * 0.2, size * 0.3);
                    ball('#303d2b', x + side * size * 0.55, y + size * 0.65, z + size * 0.48, size * 0.11, 1, 0.4, 0.3);
                    ball('#626e42', x + side * size * 0.9, y - size * 0.6, z + 0.2, size * 0.5, 1, 0.6, 1);
                });
                box('#424d32', x, y + size * 0.1, z + size * 0.64, size, 0.06, 0.05);
                const hat = ball('#56633a', x, y + size * 0.98, z, size, 1.45, 0.12, 0.8);
                hat.rotation.z = 0.15;
            }
            toad(-6.4, 2, -7, 2);
            water('#d9ad29', -6.4, 0.7, -5.65, 0.24, 2.4);
            toad(2.2, 0.9, -13, 1.5);
            for (let i = 0; i < 13; i++) {
                const x = -2 + i * 1.1, y = 2.2 + i % 4 * 0.7, z = -8 - i % 3 * 2;
                branch('#b3aa72', [x, -0.2, z], [x + 0.5, y, z], 0.15);
                const cap = ball(i % 2 ? '#91bd48' : '#b0cf57', x + 0.5, y, z, 1, 1.7, 0.24, 0.9);
                cap.rotation.z = (i % 3 - 1) * 0.25;
                const lean = cap.rotation.z;
                animations.push(t => { cap.rotation.z = lean + Math.sin(t * 0.7 + i) * 0.045; });
            }
            for (let i = 0; i < 27; i++) ball('#729a37', i * 0.9 - 12, -0.2, -3.5, 0.45, 1, 0.6, 1);
        } else if (key === 'beerus') {
            clouds();
            // Twisting ancient tree with the white palace wrapped around its trunk.
            box('#7137b1', 0, -1, -12, 40, 0.3, 20);
            for (let i = 0; i < 23; i++) {
                const x = i * 1.5 - 17;
                ball(i % 2 ? '#287c89' : '#338f94', x, 0.2 + i % 3, -15 - i % 4, 2, 1.2, 1, 1);
                ball('#279eaa', x, -0.2, -7 - i % 3, 1.3);
            }
            for (let i = 0; i < 11; i++) {
                const y = i * 0.95;
                ball(i % 2 ? '#65455d' : '#84616e', Math.sin(i * 0.7) * 0.55, y, -10, 2.3 - i * 0.12, 1, 0.65, 0.8);
                if (i > 4) {
                    const side = i % 2 ? 1 : -1;
                    const a = [Math.sin(i * 0.7) * 0.55, y, -10];
                    const b = [side * (3 + i % 3), y + 1.2, -10];
                    branch('#493b52', a, b, 0.36, 0.12);
                    branch('#493b52', b, [b[0] + side, y + 2.5, -10.2], 0.13, 0.025);
                    branch('#493b52', b, [b[0] + side * 1.5, y + 1.5, -9.8], 0.12, 0.02);
                }
            }
            ball('#241f32', 0, 0.8, -8.2, 1, 1, 1.45, 0.18);
            for (let level = 0; level < 4; level++) {
                const y = 3 + level * 1.25, width = 4 - level * 0.65;
                pillar('#b6a7c5', 0, y - 0.4, -9.7, width * 0.62, width * 0.65, 0.25, 24);
                box('#ece9e5', 0.15, y, -8.9, width, 0.9, 1.3);
                windows(0.15, y, -8.2, 5 - level, 0.65, '#5e597d');
                for (const side of [-1, 1]) pillar('#e4e2e5', side * width / 2, y + 0.3, -8.6, 0.23, 0.25, 1.4);
                ball('#328d98', -1 + Math.sin(level) * 1.2, y - 0.5, -8.15, 0.8, 1.8, 0.35, 0.65);
            }
            ball('#ffdc9b', 10, 12, -25, 0.9);
            for (let i = 0; i < 65; i++) {
                const star = ball('#ffe0b3', Math.sin(i * 17.3) * 22, 3 + (i * 3.71 % 15), -27, 0.025 + i % 3 * 0.012);
                star.material.emissive.set('#ffd69f');
            }
        } else if (key === 'namek') {
            clouds();
            box('#2799b6', 0, -1, -12, 45, 0.4, 25);
            ball('#aab77d', -11, 13, -28, 3.1);
            for (let i = 0; i < 17; i++) {
                const x = (i % 7) * 4 - 13, z = -7 - Math.floor(i / 7) * 5;
                const h = 1.2 + (i * 7 % 5) * 0.75;
                pillar(i % 2 ? '#b5a54f' : '#d2bd68', x, h / 2 - 0.8, z, 2.4, 2.9, h, 7);
                pillar('#329db5', x, h - 0.75, z, 2.38, 2.4, 0.12, 7);
                for (let j = 0; j < 3; j++) box('#8c824b', x - 1.6 + j, h / 2 - 0.6, z + 1.9, 0.1, h * 0.7, 0.14);
            }
            // Frieza's broad saucer, yellow portholes and landing struts.
            pillar('#3e4b3e', -2.5, 1.4, -5.8, 2.7, 2.9, 0.65, 40);
            pillar('#a4a378', -2.5, 1.8, -5.8, 1.8, 2.65, 0.45, 40);
            ball('#d1cfa4', -2.5, 1.98, -5.8, 1, 1.7, 0.28, 1.3);
            for (let i = 0; i < 12; i++) {
                const angle = i * Math.PI / 6;
                ball('#c3d65c', -2.5 + Math.cos(angle) * 2.7, 1.4, -5.8 + Math.sin(angle) * 2.7, 0.23, 0.85, 1.3, 0.85);
            }
            [-1, 1].forEach(side => branch('#c2c5b4', [-2.5 + side * 1.8, 1.3, -4.5], [-2.5 + side * 2.3, 0, -4], 0.13));
            for (let i = 0; i < 7; i++) {
                const x = i * 3.8 - 12, z = -12 - i % 2 * 6;
                pillar('#d2cb98', x, 3, z, 0.06, 0.12, 2);
                ball('#648a57', x, 4.1, z, 0.35, 1.2, 0.8, 1.2);
            }
        } else if (key === 'arlong') {
            clouds();
            box('#087ed0', 0, -0.8, -11, 40, 0.3, 22);
            box('#d7d7bf', 0, 0, -9, 13, 0.6, 6);
            for (let level = 0; level < 5; level++) {
                const width = 7.2 - level * 1.05, y = 1.5 + level * 1.48;
                box(level ? '#d8d17a' : '#e0e5de', 0, y, -11, width, 1.35, 3.2);
                windows(0, y + 0.05, -9.35, Math.max(2, 6 - level), 0.85);
                const roof = pillar('#ad5948', 0, y + 0.85, -11, width * 0.35, width * 0.79, 0.55, 4);
                roof.rotation.y = Math.PI / 4;
                box('#633b39', 0, y + 0.6, -9.15, width + 0.9, 0.12, 0.15);
            }
            ball('#536e84', 0, 9, -11, 0.65, 0.8, 1.3, 0.65);
            pillar('#555c57', 0, 10.2, -11, 0.045, 0.045, 1.5);
            const flag = box('#202e3b', 0.45, 10.5, -11, 0.9, 0.6, 0.05);
            ball('#ba554e', 0.45, 10.5, -10.95, 0.16, 1, 1, 0.2);
            animations.push(t => { flag.rotation.y = Math.sin(t * 2) * 0.2; });
            [-1, 1].forEach(side => {
                box('#ae7055', side * 9, 0.9, -6.5, 6, 2.5, 0.65);
                box('#a3664e', side * 6, 1.3, -6.5, 0.65, 3.3, 1);
                for (let row = 0; row < 5; row++) for (let col = 0; col < 7; col++)
                    box('#d89e7a', side * 9 - 2.7 + col * 0.85 + row % 2 * 0.25, row * 0.45, -6.14, 0.75, 0.035, 0.03);
                box('#d3c8b2', side * 6, 1.25, -10, 2.7, 2.3, 2);
                ball('#8c9aa6', side * 6, 3.2, -10, 1, 0.85, 1.5, 0.65);
                ball('#273e56', side * 6, 3.35, -9.4, 0.65, 0.8, 1, 0.12);
                for (let tooth = 0; tooth < 5; tooth++) {
                    const fang = mesh(new THREE.ConeGeometry(0.12, 0.4, 3), '#f7ead0', side * 6 + (tooth - 2) * 0.19, 3.65, -9.25);
                    fang.rotation.z = Math.PI;
                }
                for (let p = 0; p < 3; p++) {
                    const x = side * (8 + p * 2.6), z = -12 - p;
                    branch('#9b8456', [x, 0, z], [x + side * 0.4, 5.8 + p % 2, z], 0.15);
                    for (let leaf = 0; leaf < 7; leaf++) {
                        const a = leaf * Math.PI * 2 / 7;
                        const frond = ball('#3e8b71', x + side * 0.4 + Math.cos(a), 5.8 + p % 2, z + Math.sin(a), 1, 1.7, 0.12, 0.34);
                        frond.rotation.y = -a;
                        frond.rotation.z = Math.cos(a) * 0.3;
                        animations.push(t => {
                            frond.rotation.z = Math.cos(a) * 0.3 + Math.sin(t * 1.3 + p + leaf) * 0.075;
                            frond.position.y = 5.8 + p % 2 + Math.sin(t * 1.3 + p + leaf) * 0.06;
                        });
                    }
                }
            });
            ball('#48677d', 0, 0.8, -9.2, 1, 1, 1.2, 0.2);
            for (let i = 0; i < 14; i++) {
                const ripple = box('#86dcf0', i * 1.5 - 10, -0.61, -3 - i % 4, 0.9, 0.025, 0.05);
                animations.push(t => { ripple.scale.x = 1 + Math.sin(t * 1.4 + i) * 0.35; });
            }
        }
        // Architecture follows the existing collision platforms exactly.
        if (arenas[key].structure) arenas[key].platforms.forEach(p => {
            const x = (p.x + p.w / 2 - 480) / 65, top = (540 - p.y) / 65, width = p.w / 65;
            if (key === 'island') {
                const rock = pillar('#93816b', x, top - 1.1, 0, width * 0.48, 0.16, 1.8, 7);
                rock.scale.z = Math.min(1, 2 / width);
                const moss = box('#739e59', x, top - 0.15, 0, width * 0.98, 0.2, 2.1);
                moss.material.roughness = 1;
                for (let i = 0; i < 5; i++) {
                    const vine = branch('#4b8056', [x - width * 0.4 + i * width * 0.2, top - 0.2, 1],
                        [x - width * 0.4 + i * width * 0.2 + 0.08, top - 0.7 - i % 2 * 0.3, 0.95], 0.025);
                    animations.push(t => { vine.rotation.z = Math.sin(t * 0.9 + i) * 0.045; });
                }
            } else if (!p.main && key === 'dojo') {
                box('#3b515e', x, top - 0.32, 0, width + 0.05, 0.24, 2.3);
                for (let i = 0; i < Math.ceil(width / 0.22); i++) {
                    const tile = pillar('#54707a', x - width / 2 + 0.1 + i * 0.22, top - 0.25, 0, 0.055, 0.055, 2.2, 8);
                    tile.rotation.x = Math.PI / 2;
                }
                // Slender supports are set behind the fighters, keeping the view clear.
                [-1, 1].forEach(side => box('#72504b', x + side * width * 0.38, top - 1.2, -1.3, 0.12, 1.8, 0.12));
            } else if (!p.main && key === 'neon') {
                box('#3d4358', x, top - 1.2, -1.5, width * 0.94, 1.9, 0.7);
                for (let i = 0; i < Math.floor(width / 0.7); i++)
                    glow(box('#6dacc4', x - width * 0.4 + i * 0.7, top - 1.1, -1.13, 0.32, 0.5, 0.025), '#3684b5', 0.4);
                box('#667181', x, top - 0.25, 0, width, 0.12, 2.24);
            } else if (!p.main && key === 'castle') {
                for (const side of [-1, 1]) pillar('#686277', x + side * width * 0.35, top - 1.1, -1.3, 0.19, 0.25, 1.7);
                box('#8c8494', x, top - 0.3, 0, width, 0.2, 2.2);
            }
        });
        // Broad, continuously deformed water surface with small traveling highlights.
        if (key === 'namek' || key === 'arlong') {
            const geometry = new THREE.PlaneGeometry(40, 22, 64, 32);
            geometry.rotateX(-Math.PI / 2);
            const positions = geometry.attributes.position;
            const ocean = mesh(geometry, arenas[key].waterColor, 0, -0.55, -11);
            ocean.material.roughness = 0.24;
            ocean.material.metalness = 0.28;
            ocean.castShadow = false;
            animations.push(t => {
                for (let i = 0; i < positions.count; i++) {
                    const x = positions.getX(i), z = positions.getZ(i);
                    positions.setY(i, Math.sin(x * 1.1 + t * 1.4) * 0.055 + Math.cos(z * 1.6 + t * 0.85) * 0.035);
                }
                positions.needsUpdate = true;
                geometry.computeVertexNormals();
            });
            for (let i = 0; i < 32; i++) {
                const glint = box('#b6e9dc', Math.sin(i * 13.7) * 16, -0.43, -3 - i % 16, 0.2 + i % 3 * 0.15, 0.015, 0.035);
                glint.castShadow = false;
                glint.material.transparent = true;
                animations.push(t => {
                    glint.material.opacity = 0.15 + Math.pow(Math.max(0, Math.sin(t * 1.2 + i)), 6) * 0.6;
                    glint.position.x = Math.sin(i * 13.7) * 16 + Math.sin(t * 0.4 + i) * 0.3;
                });
            }
        }
        if (key === 'frog' || key === 'beerus') {
            const foliage = new THREE.Group();
            group.add(foliage);
            const blades = new THREE.InstancedMesh(new THREE.ConeGeometry(0.09, 0.7, 3),
                new THREE.MeshStandardMaterial({ color: key === 'frog' ? '#70a332' : '#279eaa', roughness: 0.9 }), 180);
            const transform = new THREE.Object3D();
            for (let i = 0; i < 180; i++) {
                transform.position.set(Math.sin(i * 34.31) * 16, -0.1 + i % 3 * 0.04, -4 - i * 1.71 % 10);
                transform.rotation.set(0.15 * Math.sin(i), i * 2.4, Math.cos(i) * 0.25);
                transform.scale.set(1, 0.5 + i % 7 * 0.16, 1);
                transform.updateMatrix();
                blades.setMatrixAt(i, transform.matrix);
            }
            blades.receiveShadow = true;
            foliage.add(blades);
            animations.push(t => { foliage.rotation.z = Math.sin(t * 0.8) * 0.008; });
        }
        // Give large solid scenery a visible grain and shallow relief.
        group.traverse(object => {
            if (!object.isMesh || !object.material.isMeshStandardMaterial || object.material.transparent) return;
            const size = object.geometry.parameters;
            if (object.geometry.type === 'BoxGeometry' && Math.max(size.width, size.height) > 1) {
                object.material.map = surfaceTexture(THREE, 'stone');
                object.material.bumpMap = object.material.map;
                object.material.bumpScale = 0.065;
            }
            if (object.geometry.type === 'CylinderGeometry' && size.height > 2) {
                object.material.map = surfaceTexture(THREE, key === 'beerus' ? 'bark' : 'rock');
                object.material.bumpMap = object.material.map;
                object.material.bumpScale = 0.16;
            }
        });
        // Small drifting particles occupy the space behind the fighters.
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(90 * 3);
        const particleMaterial = new THREE.PointsMaterial({
            color: key === 'kurukshetra' ? '#dca96e' : key === 'beerus' ? '#f9c5ef' : key === 'frog' ? '#e5f1b3' : '#def5ed',
            size: key === 'beerus' ? 0.065 : 0.035, transparent: true,
            opacity: 0.5, depthWrite: false
        });
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        group.add(new THREE.Points(particleGeometry, particleMaterial));
        animations.push(t => {
            for (let i = 0; i < 90; i++) {
                particlePositions[i * 3] = Math.sin(i * 31.7) * 16 + Math.sin(t * 0.17 + i) * 0.8;
                particlePositions[i * 3 + 1] = ((i * 1.71 + t * (key === 'beerus' ? 0.18 : 0.08)) % 12) - 0.4;
                particlePositions[i * 3 + 2] = -5 - (i * 7.3 % 17);
            }
            particleGeometry.attributes.position.needsUpdate = true;
        });
        // Run initial transforms for previews and the first gameplay frame.
        animations.forEach(fn => fn(0));
        return group;
    }
    document.addEventListener('DOMContentLoaded', () => {
        const select = document.getElementById('arena-select');
        if (select) {
            Object.entries(arenas).forEach(([key, arena]) => {
                if (!Array.from(select.options).some(option => option.value === key))
                    select.add(new Option(`${arena.name} — ${arena.series}`, key));
            });
            const requested = new URLSearchParams(location.search).get('arena');
            if (arenas[requested]) select.value = requested;
        }
        const gallery = document.getElementById('maps-gallery');
        if (gallery) Object.entries(arenas).forEach(([key, arena], index) => {
            const card = document.createElement('article');
            card.className = `map-card map-${key}`;
            card.style.setProperty('--sky', arena.bgTop);
            card.style.setProperty('--land', arena.surface);
            card.style.setProperty('--accent', arena.accentColor);
            card.innerHTML = `<div class="map-art" aria-hidden="true"><span class="map-number">0${index + 1}</span><span class="map-symbol">${({ kurukshetra: '⚔', dojo: '⌂', castle: '♜', island: '☁', neon: '▥', frog: '蛙', namek: '◉', beerus: '◇', arlong: '⚓' })[key]}</span><div class="map-platforms">${arena.platforms.map(p => `<i style="left:${p.x / 9.6}%;top:${p.y / 5.4}%;width:${p.w / 9.6}%"></i>`).join('')}</div></div><div class="map-details"><p>${arena.series}</p><h2>${arena.name}</h2><p>${arena.description}</p><a href="../../game.html?arena=${key}">Speel deze map →</a></div>`;
            gallery.append(card);
            if (typeof THREE !== 'undefined') {
                const art = card.querySelector('.map-art');
                try {
                    const renderer = new THREE.WebGLRenderer({ antialias: true });
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                    renderer.setSize(640, 320, false);
                    renderer.outputEncoding = THREE.sRGBEncoding;
                    renderer.toneMapping = THREE.ACESFilmicToneMapping;
                    renderer.toneMappingExposure = 1;
                    const scene = new THREE.Scene();
                    scene.add(new THREE.HemisphereLight(0xffffff, arena.ambientColor || 0x77766e, 1.3));
                    const light = new THREE.DirectionalLight(arena.sunColor || 0xffffff, arena.sunColor ? 1.6 : 2);
                    light.position.set(-4, 9, 7);
                    scene.add(light);
                    const camera = new THREE.PerspectiveCamera(48, 2, 0.1, 80);
                    camera.position.set(0, 6, 16);
                    camera.lookAt(0, 3.5, -7);
                    buildScenery(THREE, scene, key);
                    renderer.render(scene, camera);
                    const preview = document.createElement('img');
                    preview.src = renderer.domElement.toDataURL('image/png');
                    preview.alt = '';
                    preview.className = 'map-preview';
                    art.prepend(preview);
                    scene.traverse(object => {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) object.material.dispose();
                    });
                    renderer.dispose();
                    renderer.forceContextLoss();
                } catch (error) {
                    console.warn('Map preview unavailable:', key, error);
                }
            }
        });
    });
    function updateScenery(scene, time) {
        if (scene && scene.userData.updateMap) scene.userData.updateMap(time);
    }
    return { arenas, buildScenery, updateScenery, surfaceTexture };
})();
