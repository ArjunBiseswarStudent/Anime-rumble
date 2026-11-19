window.CombatFeedback = (() => {
    const HOLD_MS = 350;
    const DAMAGE_MS = 700;
    const NUMBER = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 });
    let canvas, overlay, options, hold, point;
    let markers = [], damage = [], slashes = [];
    let width = 0, height = 0, top = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    function attach(element, handlers) {
        canvas = element;
        overlay = document.getElementById('battle-feedback');
        options = handlers;
        markers = [...overlay.querySelectorAll('.fighter-indicator')];
        damage = [...overlay.querySelectorAll('.damage-number')].map(node => ({ node, until: 0 }));
        slashes = [...overlay.querySelectorAll('.fist-swipe')];
        const header = overlay.parentElement.querySelector('.battle-hud-overlay');
        const measure = () => {
            width = overlay.clientWidth;
            height = overlay.clientHeight;
            top = Math.min(height * .55, (header?.offsetTop || 0) + (header?.offsetHeight || 0) + 15);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(overlay);
        if (header) observer.observe(header);
        canvas.addEventListener('pointerdown', event => {
            if (!options.running() || hold || event.button !== 0 || (event.pointerType === 'mouse' && !event.isPrimary)) return;
            event.preventDefault();
            hold = { pointer: event.pointerId, started: performance.now(), signalled: false };
            canvas.setPointerCapture(event.pointerId);
            void window.ArenaMusic?.unlockCue();
        });
        canvas.addEventListener('pointerup', event => {
            if (event.pointerId !== hold?.pointer) return;
            const charged = performance.now() - hold.started >= HOLD_MS;
            cancel();
            if (options.running() && (!charged || options.canCharge())) options.attack(charged);
        });
        for (const type of ['pointercancel', 'lostpointercapture']) {
            canvas.addEventListener(type, event => { if (event.pointerId === hold?.pointer) cancel(); });
        }
    }

    function cancel() {
        const pointer = hold?.pointer;
        hold = null;
        if (pointer !== undefined && canvas?.hasPointerCapture(pointer)) canvas.releasePointerCapture(pointer);
        if (markers[0]) {
            markers[0].dataset.charge = '';
            markers[0].style.setProperty('--charge', '0%');
        }
    }

    function reset() {
        cancel();
        for (const marker of markers) marker.hidden = true;
        for (const info of damage) {
            info.until = 0;
            info.lastHit = -Infinity;
            info.node.hidden = true;
        }
        for (const slash of slashes) slash.hidden = true;
    }

    function hit(fighter, amount, blocked = false) {
        const info = damage[fighter.playerIndex];
        if (!info || !options.running() || amount <= 0) return;
        if (!blocked) fighter.hitReaction = .085;
        const now = performance.now();
        info.amount = now - (info.lastHit ?? -Infinity) < 150 ? info.amount + amount : amount;
        info.lastHit = now;
        info.until = now + DAMAGE_MS;
        info.x = (fighter.x + fighter.width / 2 - 480) / 65;
        info.y = (540 - fighter.y - fighter.height) / 65 + 1.25;
        info.node.textContent = `−${NUMBER.format(info.amount)}`;
        info.node.classList.toggle('is-blocked', blocked);
        info.node.hidden = false;
    }

    function swing(fighter) {
        const slash = slashes[fighter.playerIndex];
        if (!slash || !options.running()) return;
        slash.dataset.direction = fighter.facing;
        slash.hidden = false;
        slash.start = performance.now();
    }

    function draw(THREE, camera, fighters, cpu) {
        if (!width || !height) return;
        const now = performance.now();
        point ||= new THREE.Vector3();
        function move(node, x, y, lift = 0, shift = 0) {
            point.set(x, y, .12).project(camera);
            const padding = node === markers[0] && hold ? 42 : 19;
            const left = Math.min(width - padding, Math.max(padding, (point.x + 1) * width / 2 + shift));
            const up = Math.min(height - 14, Math.max(top, (1 - point.y) * height / 2 - lift));
            node.style.transform = `translate3d(${left}px, ${up}px, 0) translate(-50%, -50%)`;
        }
        const [first, second] = fighters;
        const close = Math.abs(first.model.position.x - second.model.position.x) < .7 &&
            Math.abs(first.model.position.y - second.model.position.y) < .5;
        fighters.forEach((fighter, index) => {
            const marker = markers[index];
            marker.hidden = fighter.stocks <= 0;
            if (!marker.hidden) {
                const label = index === 1 && cpu ? 'CPU' : `P${index + 1}`;
                if (marker.firstElementChild.textContent !== label) marker.firstElementChild.textContent = label;
                const shift = close ? (index === 0 ? (hold ? -35 : -18) : 18) : 0;
                move(marker, fighter.model.position.x, fighter.model.position.y + 2.35 * fighter.model.scale.y, 0, shift);
            }
            const info = damage[index];
            info.node.hidden = now >= info.until;
            if (!info.node.hidden) {
                const progress = 1 - (info.until - now) / DAMAGE_MS;
                move(info.node, info.x, info.y, reducedMotion?.matches ? 0 : progress * 34);
                info.node.style.opacity = String(Math.min(1, (1 - progress) * 3));
            }
        });
        slashes.forEach((slash, index) => {
            if (slash.hidden) return;
            const age = (now - slash.start) / 220;
            const fighter = fighters[index];
            slash.hidden = age >= 1;
            if (!slash.hidden) {
                move(slash, fighter.model.position.x + Number(slash.dataset.direction) * 1.05, fighter.model.position.y + 1.05);
                slash.style.opacity = String(1 - age);
            }
        });
        if (hold) {
            const progress = Math.min(1, (now - hold.started) / HOLD_MS);
            const ready = options.canCharge();
            markers[0].style.setProperty('--charge', `${progress * 100}%`);
            markers[0].dataset.charge = progress < 1 ? 'charging' : ready ? 'ready' : 'waiting';
            if (progress >= 1 && ready && !hold.signalled) {
                hold.signalled = true;
                void window.ArenaMusic?.cue('ready');
            }
        }
    }

    return { attach, cancel, reset, hit, swing, draw };
})();
