window.FrogSages = {
    build(THREE, group, animations, rock, textures) {
        const geometry = new THREE.SphereGeometry(1, 24, 16);
        const material = (color, roughness = .75) => new THREE.MeshStandardMaterial({ color, roughness });
        const cloak = material('#494238');
        const collar = material('#635941');
        const ivory = material('#e8e4ce');
        const iris = material('#e8ac34', .34);
        const pupil = material('#221a16', .35);
        const mouth = material('#33202e');
        for (const fabric of [cloak, collar]) {
            fabric.bumpMap = textures.fabric;
            fabric.bumpScale = .055;
        }
        const sages = [false, true].map(isShima => {
            const root = new THREE.Group();
            root.name = isShima ? 'shima' : 'fukasaku';
            root.position.set(rock.x + (isShima ? 1.14 : -1.09), rock.y, rock.z + .12);
            root.rotation.y = isShima ? -.14 : .17;
            group.add(root);
            const skin = material(isShima ? '#83548b' : '#778347', .52);
            const face = material(isShima ? '#d8d690' : '#9aa55c', .54);
            for (const surface of [skin, face]) {
                surface.bumpMap = textures.skin;
                surface.bumpScale = .026;
            }
            const sheen = material('#fff1c8', .28);
            function oval(parent, mat, x, y, z, sx, sy, sz, roll = 0) {
                const mesh = new THREE.Mesh(geometry, mat);
                mesh.position.set(x, y, z);
                mesh.scale.set(sx, sy, sz);
                mesh.rotation.z = roll;
                mesh.castShadow = mesh.receiveShadow = true;
                parent.add(mesh);
                return mesh;
            }
            oval(root, cloak, 0, .86, -.18, .93, .87, .58);
            oval(root, face, 0, .7, .28, .63, .57, .43);
            for (const side of [-1, 1]) {
                oval(root, skin, side * .62, .28, .28, .51, .26, .51, side * .32);
                for (let i = 0; i < 3; i++) {
                    oval(root, skin, side * (.53 + i * .18), .09, .69, .11, .08, .25, side * -.13);
                }
                oval(root, cloak, side * .71, .86, .24, .27, .74, .38, side * .19);
                oval(root, skin, side * .37, .74, .67, .18, .45, .16, side * -.63);
                oval(root, skin, side * .087, 1.01, .8, .08, .30, .07, side * -.12);
            }
            const head = new THREE.Group();
            head.position.y = 1.57;
            root.add(head);
            oval(head, collar, 0, -.31, -.03, .93, .3, .67);
            oval(head, face, 0, .11, .08, .77, .59, .61);
            const lips = oval(head, mouth, 0, -.12, .63, .46, .065, .073);
            const lowerLip = oval(head, face, 0, -.18, .61, .47, .067, .095);
            for (const side of [-1, 1]) {
                oval(head, skin, side * .44, .24, .52, .24, .23, .17);
                oval(head, iris, side * .41, .21, .663, .16, .145, .067);
                oval(head, pupil, side * .41, .218, .72, .097, .035, .024);
                const shine = oval(head, sheen, side * .41 - .035, .278, .716, .032, .023, .013);
                shine.castShadow = false;
                oval(head, skin, side * .125, .008, .681, .045, .021, .017, side * .21);
                for (let i = 0; i < 3; i++) {
                    oval(head, skin, side * (.54 + i * .048), .065 - i * .044, .57 - i * .03,
                        .08, .018, .026, side * (.47 + i * .12));
                }
                if (!isShima) {
                    for (let i = 0; i < 3; i++) {
                        oval(head, ivory, side * (.36 + i * .13), .39 + i * .035, .67 - i * .05,
                            .25, .086, .09, side * .36);
                    }
                }
            }
            if (isShima) {
                for (let i = 0; i < 9; i++) {
                    const x = (i - 4) * .16;
                    oval(head, skin, x, .53 + .24 * (1 - Math.abs(x)), .22 + (i % 2) * .23, .24, .24, .25);
                }
            } else {
                for (let i = 0; i < 4; i++) {
                    oval(head, ivory, (i - 1.5) * .095, .64 + i % 2 * .12, -.18, .09, .35, .11, -.22);
                }
                oval(head, ivory, 0, -.30, .58, .16, .24, .07);
            }
            return { root, head, lips, lowerLip, lineAt: -Infinity };
        });
        let time = 0;
        let reaction = 0;
        function markLine(index, at) { sages[index].lineAt = at; }
        animations.push(elapsed => {
            time = elapsed;
            sages.forEach(({ root, head, lips, lowerLip, lineAt }, index) => {
                const age = time - lineAt;
                const vowel = center => Math.max(0, 1 - Math.abs(age - center) / .093);
                const opening = Math.max(.78 * vowel(.095), vowel(.255));
                head.rotation.x = Math.sin(time * 1.7 + index) * .027 + opening * .16;
                root.rotation.y = (index ? -.14 : .17) + Math.sin(time * .75 + index) * .075;
                lips.scale.y = .065 + opening * .125;
                lowerLip.position.y = -.18 - opening * .082;
            });
        });
        return elapsed => {
            const currentReaction = ++reaction;
            markLine(0, elapsed);
            markLine(1, elapsed + .36);
            window.FrogSages.speak(index => {
                if (reaction === currentReaction) markLine(index, time);
            });
        };
    },
    speak(onStart) {
        const synth = window.speechSynthesis;
        if (!synth || !window.SpeechSynthesisUtterance || synth.speaking || synth.pending) return;
        const voices = synth.getVoices().filter(voice => /^ja(?:-|$)/i.test(voice.lang));
        const lines = [
            { text: 'ばか！', pitch: .77, rate: 1.03, volume: .88 },
            { text: 'バカッ！', pitch: 1.08, rate: 1.29, volume: 1 }
        ];
        lines.forEach(({ text, pitch, rate, volume }, index) => {
            const line = new window.SpeechSynthesisUtterance(text);
            line.lang = 'ja-JP';
            if (voices.length) line.voice = voices[index % voices.length];
            line.pitch = pitch;
            line.rate = rate;
            line.volume = volume;
            line.onstart = () => onStart(index);
            synth.speak(line);
        });
    }
};
