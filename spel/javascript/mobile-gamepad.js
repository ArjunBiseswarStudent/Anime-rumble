/* On-screen gamepad reuses the existing buttons and input ownership system. */
window.MobileGamepad = (() => {
    let handlers, controls, viewport, stick, knob, marker, parent, media;
    let twoPlayer = false, enabled = false, pointer = null, movement = null, jumping = false;
    let movementParent, movementOrder, actions, jumpButton, shieldButton;
    const originalLabels = new Map();
    function reset() {
        if (movement) handlers.release('joystick:move');
        if (jumping) handlers.release('joystick:jump');
        movement = null; jumping = false; pointer = null;
        if (knob) knob.style.transform = 'translate(0px, 0px)';
        if (stick) { stick.setAttribute('aria-valuenow', '0'); stick.setAttribute('aria-valuetext', 'Stil'); }
    }
    function axis(dx, dy) {
        const next = dx < -.22 ? 'KeyA' : dx > .22 ? 'KeyD' : null;
        if (next !== movement) {
            if (movement) handlers.release('joystick:move');
            movement = next;
            if (movement) handlers.press(movement, 'joystick:move');
        }
        const up = dy < -.55;
        if (up !== jumping) {
            jumping = up;
            if (up) handlers.press('KeyW', 'joystick:jump'); else handlers.release('joystick:jump');
        }
        stick.setAttribute('aria-valuenow', String(Math.round(dx * 100)));
        stick.setAttribute('aria-valuetext', next === 'KeyA' ? 'Links' : next === 'KeyD' ? 'Rechts' : 'Stil');
    }
    function move(event) {
        if (pointer !== event.pointerId) return;
        if (!enabled || !handlers.isRunning()) { reset(); return; }
        event.preventDefault();
        const rect = stick.getBoundingClientRect(), radius = rect.width * .35;
        if (radius <= 0) return;
        let x = event.clientX - rect.left - rect.width / 2, y = event.clientY - rect.top - rect.height / 2;
        const length = Math.hypot(x, y);
        if (length > radius) { x *= radius / length; y *= radius / length; }
        knob.style.transform = `translate(${x}px, ${y}px)`;
        axis(x / radius, y / radius);
    }
    function labels(active) {
        const icons = { 'KeyW': '↑', 'KeyS': '🛡', 'KeyF': '✊', 'KeyG': '✦', 'KeyC': '✹', 'KeyH': '⇄', 'KeyX': '➶', 'KeyR': '＋', 'KeyT': '♥' };
        actions.querySelectorAll('[data-touch-code]').forEach(button => {
            if (!originalLabels.has(button)) originalLabels.set(button, button.textContent);
            if (!active) { button.textContent = originalLabels.get(button); return; }
            const icon = document.createElement('span'), caption = document.createElement('span');
            icon.className = 'gamepad-icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = icons[button.dataset.touchCode] || '•';
            caption.className = 'gamepad-caption'; caption.textContent = originalLabels.get(button);
            button.replaceChildren(icon, caption);
        });
    }
    function updateLayout() {
        const next = media.matches && !twoPlayer;
        if (next === enabled) return;
        window.TouchControls?.reset(); reset(); enabled = next;
        controls.classList.toggle('mobile-gamepad', enabled);
        viewport.classList.toggle('has-mobile-gamepad', enabled);
        stick.hidden = !enabled;
        if (enabled) {
            actions.append(jumpButton, shieldButton);
            labels(true); viewport.append(controls);
        } else {
            labels(false); movementParent.append(...movementOrder);
            parent.insertBefore(controls, marker.nextSibling);
        }
    }
    function init(callbacks) {
        if (handlers) return;
        controls = document.getElementById('touch-controls');
        viewport = document.querySelector('.battle-viewport');
        stick = document.getElementById('mobile-joystick');
        if (!controls || !viewport || !stick) return;
        handlers = callbacks; knob = stick.querySelector('.joystick-knob');
        parent = controls.parentNode; marker = document.createComment('touch-controls original location'); parent.insertBefore(marker, controls);
        const panel = controls.querySelector('[data-touch-player="0"]');
        movementParent = panel.querySelector('.touch-movement'); actions = panel.querySelector('.touch-actions');
        movementOrder = Array.from(movementParent.children);
        jumpButton = panel.querySelector('[data-touch-code="KeyW"]'); shieldButton = panel.querySelector('[data-touch-code="KeyS"]');
        stick.addEventListener('pointerdown', event => {
            if (!enabled || !handlers.isRunning() || pointer !== null || event.button !== 0) return;
            event.preventDefault(); pointer = event.pointerId;
            try { stick.setPointerCapture(pointer); } catch { /* Window release also handles cancellation. */ }
            move(event);
        });
        stick.addEventListener('pointermove', move);
        const release = event => { if (event.pointerId === pointer) reset(); };
        stick.addEventListener('lostpointercapture', release);
        window.addEventListener('pointerup', release); window.addEventListener('pointercancel', release);
        stick.addEventListener('keydown', event => {
            if (!['ArrowLeft','ArrowRight','ArrowUp'].includes(event.key) || !enabled || !handlers.isRunning()) return;
            event.preventDefault(); event.stopPropagation();
            axis(event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0, event.key === 'ArrowUp' ? -1 : 0);
        });
        stick.addEventListener('keyup', event => { if (['ArrowLeft','ArrowRight','ArrowUp'].includes(event.key)) { event.stopPropagation(); reset(); } });
        stick.addEventListener('blur', reset);
        window.addEventListener('blur', reset);
        document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
        media = window.matchMedia('(any-pointer: coarse), (max-width: 700px)');
        media.addEventListener?.('change', updateLayout); updateLayout();
    }
    function updateMode(value) { twoPlayer = value; if (handlers) updateLayout(); }
    return { init, updateMode, reset };
})();
