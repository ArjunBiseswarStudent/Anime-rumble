(() => {
    const board = document.getElementById('start-artboard');
    const artwork = document.getElementById('start-artwork');
    const start = document.getElementById('press-start');
    const toggle = document.getElementById('start-motion-toggle');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let motion = !preference.matches, starting = false;
    const requested = new URLSearchParams(location.search).get('arena');
    if (requested) start.href = `game.html?arena=${encodeURIComponent(requested)}`;
    artwork.addEventListener('load', () => document.body.classList.add('has-artwork'));
    artwork.addEventListener('error', () => artwork.removeAttribute('src'));
    artwork.src = artwork.dataset.src;
    const petals = document.getElementById('start-petals');
    for (let i = 0; i < 24; i++) {
        const petal = document.createElement('i'); petal.className = 'petal';
        for (const [key, value] of Object.entries({ x: `${i * 41.7 % 100}%`, size: `${7 + i % 5 * 3}px`, duration: `${9 + i % 7}s`, delay: `${-i * .8}s`, drift: `${80 + i % 5 * 35}px` }))
            petal.style.setProperty(`--${key}`, value);
        petals.append(petal);
    }
    function updateMotion() {
        document.body.classList.toggle('motion-off', !motion);
        toggle.textContent = motion ? 'Animaties aan' : 'Animaties uit';
        toggle.setAttribute('aria-pressed', String(motion));
        if (!motion) { board.style.setProperty('--look-x', '0px'); board.style.setProperty('--look-y', '0px'); }
    }
    toggle.addEventListener('click', () => { motion = !motion; updateMotion(); });
    preference.addEventListener?.('change', event => { motion = !event.matches; updateMotion(); });
    document.addEventListener('pointermove', event => {
        if (!motion || event.pointerType !== 'mouse' || starting) return;
        board.style.setProperty('--look-x', `${(event.clientX / innerWidth - .5) * 6}px`);
        board.style.setProperty('--look-y', `${(event.clientY / innerHeight - .5) * 4}px`);
    });
    document.addEventListener('pointerleave', () => { board.style.setProperty('--look-x', '0px'); board.style.setProperty('--look-y', '0px'); });
    start.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
        event.preventDefault(); if (starting) return;
        starting = true; document.body.classList.add('is-starting');
        setTimeout(() => location.assign(start.href), motion ? 220 : 0);
    });
    document.addEventListener('keydown', event => {
        if (event.key !== 'Enter' || event.repeat || event.target.closest('a, button, input, select, textarea')) return;
        event.preventDefault(); start.click();
    });
    document.addEventListener('visibilitychange', () => document.body.classList.toggle('motion-off', document.hidden || !motion));
    window.addEventListener('pageshow', () => { starting = false; document.body.classList.remove('is-starting'); });
    updateMotion();
})();
