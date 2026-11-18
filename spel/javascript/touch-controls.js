/* Pointer capture keeps each finger independent, including held movement/shields. */
window.TouchControls = (() => {
    const pointers = new Map();
    let handlers;
    function release(pointerId) {
        const button = pointers.get(pointerId);
        if (!button) return;
        pointers.delete(pointerId);
        handlers.release(`touch:${pointerId}`);
        if (![...pointers.values()].includes(button)) {
            button.classList.remove('is-held');
            button.setAttribute('aria-pressed', 'false');
        }
    }
    function reset() { for (const id of [...pointers.keys()]) release(id); window.MobileGamepad?.reset(); }
    function updateMode(twoPlayer) {
        reset();
        const controls = document.getElementById('touch-controls');
        if (!controls) return;
        controls.dataset.twoPlayer = String(twoPlayer);
        document.querySelector('[data-touch-player="1"]').hidden = !twoPlayer;
        window.MobileGamepad?.updateMode(twoPlayer);
    }
    function init(callbacks) {
        if (handlers) return;
        handlers = callbacks;
        document.querySelectorAll('[data-touch-code]').forEach(button => {
            button.addEventListener('pointerdown', event => {
                if (event.button !== 0 || !handlers.isRunning() || button.closest('[hidden]')) return;
                event.preventDefault();
                pointers.set(event.pointerId, button);
                button.classList.add('is-held');
                button.setAttribute('aria-pressed', 'true');
                try { button.setPointerCapture(event.pointerId); } catch { /* Window release is also handled. */ }
                handlers.press(button.dataset.touchCode, `touch:${event.pointerId}`);
            });
            button.addEventListener('lostpointercapture', event => release(event.pointerId));
            // Keyboard activation of these visible controls remains available.
            button.addEventListener('click', event => {
                if (event.detail !== 0 || !handlers.isRunning()) return;
                const source = `touch-keyboard:${button.dataset.touchCode}`;
                handlers.press(button.dataset.touchCode, source);
                handlers.release(source);
            });
        });
        window.addEventListener('pointerup', event => release(event.pointerId));
        window.addEventListener('pointercancel', event => release(event.pointerId));
        window.addEventListener('blur', reset);
        document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
        window.MobileGamepad?.init(callbacks);
    }
    return { init, reset, updateMode };
})();
