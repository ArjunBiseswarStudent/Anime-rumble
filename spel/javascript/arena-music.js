/* Original procedural scores. No recordings, samples or third-party melodies. */
window.ArenaMusic = (() => {
    const tracks = {
        matchIntro: { title: 'Confrontatie', bpm: 126, root: 43, scale: [0, 2, 3, 5, 7, 8, 11],
            chords: [0, 0, 5, 4], wave: 'triangle', tone: 2800, beat: 'taiko',
            motif: [0, null, null, 0, 2, null, 4, null, null, 3, null, 1, 0, null, 6, null] },
        kurukshetra: { title: 'Vaandels in de avondzon', style: 'epic', bpm: 108, root: 57, scale: [0, 2, 3, 5, 7, 8, 11], chords: [0, 5, 3, 4, 0, 3, 1, 4], tone: 3200,
            motif: [0, null, null, 2, 4, null, 3, null, 2, null, 1, 2, 0, null, null, null, 3, null, 4, null, 5, 4, null, 2, 3, null, 1, null, 0, null, null, null],
            answer: [4, null, 5, 7, 6, null, 4, null, 3, 4, null, 2, 1, null, null, null, 5, null, 4, 3, 2, null, 4, null, 3, null, 2, 1, 0, null, null, null] },
        dojo: { title: 'Daken bij zonsondergang', bpm: 104, root: 57, scale: [0, 2, 4, 7, 9], chords: [0, 3, 1, 4], wave: 'triangle', tone: 2100, beat: 'taiko', motif: [0, null, 2, 1, 4, null, 3, null, 2, 4, null, 1, 0, null, 3, 2] },
        castle: { title: 'Wachters van de nacht', bpm: 78, root: 50, scale: [0, 2, 3, 5, 7, 8, 10], chords: [0, 5, 3, 4], wave: 'sine', tone: 1300, beat: 'slow', motif: [0, null, null, 4, 2, null, 1, null, 5, null, 4, null, 2, 1, null, null] },
        island: { title: 'Boven de wolken', bpm: 88, root: 60, scale: [0, 2, 4, 7, 9], chords: [0, 2, 3, 1], wave: 'sine', tone: 3400, beat: 'light', motif: [0, 2, null, 4, null, 3, 2, null, 1, null, 3, 4, 2, null, 1, null] },
        neon: { title: 'Nachtverkeer', bpm: 118, root: 45, scale: [0, 2, 3, 5, 7, 10], chords: [0, 3, 4, 2], wave: 'sawtooth', tone: 1800, beat: 'electro', motif: [0, null, 2, 4, null, 3, 2, null, 5, 4, null, 2, 3, null, 1, 2] },
        frog: { title: 'De gouden bron · Shinobi-avontuur', style: 'shinobi', bpm: 112, root: 62, scale: [0, 2, 5, 7, 9], chords: [0, 2, 3, 1, 0, 3, 2, 0], tone: 3400,
            motif: [0, null, 2, null, 3, 2, 1, null, 4, null, 3, 1, 2, null, null, null, 2, 3, null, 4, 5, null, 3, null, 1, 2, null, 0, null, null, 1, null],
            answer: [3, null, 5, 4, 2, null, 3, null, 6, null, 4, 3, 2, null, null, null, 4, 3, null, 2, 1, null, 3, null, 2, null, 1, 0, null, null, null, null] },
        namek: { title: 'Verre groene hemel · Kosmische strijd', style: 'cosmic', bpm: 132, root: 55, scale: [0, 2, 3, 5, 7, 8, 10], chords: [0, 5, 3, 4, 0, 3, 5, 4], tone: 3200,
            motif: [0, null, 4, 3, 2, null, 1, 2, 5, null, 4, null, 2, 3, 1, null, 3, null, 5, 4, 2, null, 6, null, 4, 3, null, 1, 2, null, 0, null],
            answer: [4, 5, null, 7, 6, null, 4, 3, 5, null, 2, 4, 3, null, null, null, 6, null, 5, 4, 3, 2, null, 1, 4, null, 2, 1, 0, null, null, null] },
        beerus: { title: 'Schemering bij de boom · Godentuin', style: 'celestial', bpm: 86, root: 60, scale: [0, 2, 4, 6, 7, 9, 11], chords: [0, 3, 1, 4, 5, 1, 3, 0], tone: 4400,
            motif: [0, null, null, 4, null, null, 6, null, 3, null, 5, null, 2, null, null, null, 4, null, 7, null, null, 5, null, null, 3, null, 1, null, 0, null, null, null],
            answer: [6, null, null, 4, 3, null, null, null, 5, null, 7, null, 4, null, null, null, 2, null, 3, null, 6, null, 5, null, 4, null, 2, null, 0, null, null, null] },
        arlong: { title: 'Tropisch getij · Piratenavontuur', style: 'adventure', bpm: 120, root: 60, scale: [0, 2, 4, 5, 7, 9, 10], chords: [0, 3, 4, 0, 5, 3, 1, 4], tone: 3800,
            motif: [0, null, 2, 4, 3, null, 1, null, 5, 4, null, 2, 3, null, null, null, 2, null, 3, 5, 6, null, 4, 3, 1, null, 2, 0, null, null, 4, null],
            answer: [4, 5, null, 7, 5, null, 3, 4, 6, null, 5, 3, 2, null, null, null, 3, null, 4, 2, 1, null, 3, null, 4, 2, null, 1, 0, null, null, null] }
    };
    let volume = 0.28, muted = false;
    try {
        const settings = JSON.parse(localStorage.getItem('anime-rumble-music') || 'null');
        if (settings && Number.isFinite(settings.volume)) volume = Math.max(0, Math.min(1, settings.volume));
        if (settings && typeof settings.muted === 'boolean') muted = settings.muted;
    } catch { /* Storage may be disabled; settings still work for this session. */ }
    let context, master, filter, delay, echo, compressor;
    let active = null, timer = null, step = 0, nextTime = 0, generation = 0, failed = false;
    const voices = new Set();
    const frequency = midi => 440 * Math.pow(2, (midi - 69) / 12);
    function degree(track, n, octave = 0) {
        const length = track.scale.length;
        return track.root + track.scale[((n % length) + length) % length] + 12 * (Math.floor(n / length) + octave);
    }
    function refresh() {
        document.querySelectorAll('[data-music-toggle]').forEach(button => {
            button.textContent = muted ? 'Muziek uit' : 'Muziek aan';
            button.setAttribute('aria-pressed', String(!muted));
            button.disabled = failed;
        });
        document.querySelectorAll('[data-music-volume]').forEach(input => { input.value = Math.round(volume * 100); input.disabled = failed; });
        document.querySelectorAll('[data-music-status]').forEach(label => {
            label.textContent = failed ? 'Muziek niet beschikbaar in deze browser' : active ? tracks[active].title : 'Start bij het gevecht';
        });
    }
    function save() {
        try { localStorage.setItem('anime-rumble-music', JSON.stringify({ volume, muted })); } catch { /* Optional persistence. */ }
    }
    function applyVolume() {
        if (!master) return;
        master.gain.setTargetAtTime(active && !muted && !document.hidden && !failed ? volume * 0.55 : 0, context.currentTime, 0.04);
    }
    function init() {
        if (context) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error('Web Audio unavailable');
        context = new AudioContext();
        master = context.createGain(); master.gain.value = 0;
        filter = context.createBiquadFilter(); filter.type = 'lowpass';
        delay = context.createDelay(1); delay.delayTime.value = 0.23;
        echo = context.createGain(); echo.gain.value = 0.14;
        compressor = context.createDynamicsCompressor();
        compressor.threshold.value = -16; compressor.ratio.value = 5;
        filter.connect(master); filter.connect(delay); delay.connect(echo); echo.connect(master);
        master.connect(compressor); compressor.connect(context.destination);
    }
    function note(midi, time, duration, level, wave, attack = 0.015, pan = 0, expression = {}) {
        const osc = context.createOscillator(), envelope = context.createGain();
        const panner = context.createStereoPanner ? context.createStereoPanner() : null;
        osc.type = wave;
        const pitch = frequency(midi) * Math.pow(2, (expression.cents || 0) / 1200);
        osc.frequency.setValueAtTime(pitch, time);
        if (expression.vibrato) {
            for (let offset = 0.08; offset < duration; offset += 0.04)
                osc.frequency.linearRampToValueAtTime(pitch * (1 + Math.sin(offset * 32) * 0.0035), time + offset);
        }
        envelope.gain.setValueAtTime(0, time);
        envelope.gain.linearRampToValueAtTime(level, time + attack);
        if (expression.sustain) envelope.gain.setValueAtTime(level * 0.7, time + Math.max(attack, duration * 0.65));
        envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        osc.connect(envelope);
        if (panner) { panner.pan.value = pan; envelope.connect(panner); panner.connect(filter); }
        else envelope.connect(filter);
        const voice = { osc, envelope, panner };
        voices.add(voice);
        osc.onended = () => { osc.disconnect(); envelope.disconnect(); panner?.disconnect(); voices.delete(voice); };
        osc.start(time); osc.stop(time + duration + 0.03);
    }
    function drum(time, bass, light = false) {
        const osc = context.createOscillator(), envelope = context.createGain();
        osc.type = bass ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(bass ? 135 : light ? 1100 : 280, time);
        osc.frequency.exponentialRampToValueAtTime(bass ? 42 : light ? 360 : 100, time + 0.12);
        envelope.gain.setValueAtTime(bass ? 0.3 : light ? 0.035 : 0.09, time);
        envelope.gain.exponentialRampToValueAtTime(0.0001, time + (bass ? 0.24 : 0.12));
        osc.connect(envelope); envelope.connect(filter);
        const voice = { osc, envelope };
        voices.add(voice);
        osc.onended = () => { osc.disconnect(); envelope.disconnect(); voices.delete(voice); };
        osc.start(time); osc.stop(time + 0.28);
    }
    function instrument(kind, midi, time, duration, level, pan = 0) {
        if (kind === 'flute') {
            note(midi, time, duration, level, 'sine', 0.045, pan, { vibrato: true, sustain: true });
            note(midi + 12, time, duration * 0.8, level * 0.16, 'triangle', 0.06, pan);
        } else if (kind === 'strings') {
            for (const cents of [-5, 5]) note(midi, time, duration, level * 0.5, 'triangle', 0.12, pan + cents / 40, { cents, sustain: true });
        } else if (kind === 'synth') {
            for (const cents of [-7, 7]) note(midi, time, duration, level * 0.46, 'sawtooth', 0.018, pan + cents / 40, { cents, sustain: true });
        } else if (kind === 'bell') {
            for (const [interval, strength] of [[0, 0.75], [12, 0.22], [19.1, 0.1]])
                note(midi + interval, time, duration, level * strength, 'sine', 0.006, pan);
        } else if (kind === 'brass') {
            note(midi, time, duration, level * 0.65, 'sawtooth', 0.035, pan, { sustain: true });
            note(midi, time, duration, level * 0.3, 'sine', 0.025, pan);
        } else { // Plucked strings, entirely synthesized.
            note(midi, time, duration, level, 'triangle', 0.004, pan);
            note(midi + 12, time, duration * 0.5, level * 0.18, 'sine', 0.003, pan);
        }
    }
    function scheduleAnime(track, position, time) {
        const tick = 60 / track.bpm / 4, beat = position % 16, bar = Math.floor(position / 16);
        const chord = track.chords[bar % track.chords.length], style = track.style;
        const lifted = bar % 16 >= 8;
        if (beat === 0) for (const interval of [0, 2, 4])
            instrument('strings', degree(track, chord + interval, -1), time, tick * 14, 0.045, (interval - 2) * 0.2);
        if (beat % (style === 'cosmic' ? 4 : 8) === 0)
            note(degree(track, chord, -2), time, tick * 2.7, 0.16, 'triangle');
        const phrase = lifted ? track.answer : track.motif;
        const melody = phrase[position % phrase.length];
        // A quieter bridge and a final-bar breath create a sixteen-bar arrangement.
        if (melody !== null && !(bar % 16 === 15 && beat > 9)) {
            const lead = { shinobi: 'flute', cosmic: 'synth', celestial: 'bell', adventure: 'brass', epic: 'brass' }[style];
            instrument(lead, degree(track, melody), time, tick * (style === 'celestial' ? 5.5 : style === 'shinobi' ? 3.2 : 1.7),
                bar % 16 === 7 ? 0.075 : 0.12, -0.12);
        }
        const arpeggioStep = style === 'celestial' ? beat % 4 === 2 : beat % 2 === 1;
        if (arpeggioStep) {
            const arpeggio = chord + [0, 4, 2, 4][Math.floor(beat / 2) % 4];
            instrument(style === 'celestial' ? 'bell' : 'pluck', degree(track, arpeggio, style === 'shinobi' ? 0 : -1),
                time, tick * 1.6, 0.045, 0.4);
        }
        if (beat === 0 || (style !== 'celestial' && beat === 8) || (style === 'cosmic' && beat % 4 === 0)) drum(time, true);
        if (style !== 'celestial' && (beat === 4 || beat === 12)) drum(time, false);
        if ((style === 'cosmic' && beat % 2 === 1) || (style === 'adventure' && [3, 6, 11, 14].includes(beat))) drum(time, false, true);
        if (lifted && bar % 4 === 3 && [13, 14, 15].includes(beat)) drum(time, false, beat === 14);
        if (style === 'epic') {
            // Low battle drums, a plucked drone and a restrained horn response.
            if ([3, 6, 10, 14].includes(beat)) drum(time, beat === 6 || beat === 14, beat === 3);
            if (beat === 0 || beat === 10) instrument('pluck', degree(track, 0, -1), time, tick * 5, 0.055, -0.4);
            if (lifted && beat === 8) instrument('brass', degree(track, chord + 4, -1), time, tick * 4, 0.065, 0.25);
        }
    }
    function schedule(track, position, time) {
        if (track.style) { scheduleAnime(track, position, time); return; }
        const tick = 60 / track.bpm / 4, beat = position % 16, bar = Math.floor(position / 16);
        const chord = track.chords[bar % 4];
        if (beat === 0) {
            for (const interval of [0, 2, 4]) note(degree(track, chord + interval), time, tick * 14, 0.045, 'sine', 0.15, (interval - 2) * 0.22);
        }
        if (beat % (track.beat === 'electro' ? 4 : 8) === 0)
            note(degree(track, chord, -2), time, tick * 2.6, 0.17, 'triangle');
        const motif = track.motif[beat];
        // Eight-bar phrases: alternate register and leave a breath at the end.
        if (motif !== null && !(bar % 8 === 7 && beat > 11))
            note(degree(track, motif + (bar % 4 === 2 ? 1 : 0), bar % 8 >= 4 ? 1 : 0), time, tick * (track.wave === 'sine' ? 2.8 : 1.8), 0.12, track.wave, 0.012, Math.sin(position * 0.7) * 0.3);
        if (beat === 0 || (track.beat !== 'slow' && beat === 8) || (track.beat === 'electro' && beat % 4 === 0)) drum(time, true);
        if ((beat === 4 || beat === 12) && track.beat !== 'light') drum(time, false);
        if ((track.beat === 'electro' && beat % 2 === 1) || (track.beat === 'tropical' && [3, 6, 11, 14].includes(beat))) drum(time, false, true);
    }
    function pump() {
        if (!active || muted || document.hidden || context.state !== 'running') return;
        // Never play a backlog after a stalled frame or background tab.
        if (nextTime < context.currentTime) nextTime = context.currentTime + 0.03;
        const track = tracks[active];
        while (nextTime < context.currentTime + 0.15) {
            schedule(track, step++, nextTime);
            nextTime += 60 / track.bpm / 4;
            step %= track.style ? 256 : 128;
        }
    }
    function halt() {
        if (timer !== null) clearInterval(timer);
        timer = null;
        if (!context) return;
        for (const voice of voices) {
            voice.envelope.gain.cancelScheduledValues(context.currentTime);
            voice.envelope.gain.setTargetAtTime(0.0001, context.currentTime, 0.01);
            voice.osc.stop(context.currentTime + 0.04);
        }
    }
    async function resume() {
        const token = ++generation;
        if (!active || muted || document.hidden || failed) return;
        try {
            init();
            await context.resume();
            if (token !== generation || !active || muted || document.hidden) return;
            filter.frequency.setValueAtTime(tracks[active].tone, context.currentTime);
            nextTime = context.currentTime + 0.04;
            applyVolume();
            pump();
            if (timer === null) timer = setInterval(pump, 25);
        } catch (error) {
            failed = true; halt(); applyVolume(); refresh();
            console.warn('Achtergrondmuziek kon niet starten.', error);
        }
    }
    function stop() {
        generation++; active = null; halt(); applyVolume(); refresh();
    }
    function start(key) {
        stop();
        if (!tracks[key]) return;
        active = key; step = 0; refresh();
        void resume();
    }
    function setMuted(value) {
        muted = Boolean(value); generation++; halt(); applyVolume(); save(); refresh();
        if (!muted) void resume();
    }
    function setVolume(value) {
        if (!Number.isFinite(value)) return;
        volume = Math.max(0, Math.min(1, value)); applyVolume(); save(); refresh();
    }
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-music-toggle]').forEach(button => button.addEventListener('click', () => setMuted(!muted)));
        document.querySelectorAll('[data-music-volume]').forEach(input => input.addEventListener('input', () => setVolume(Number(input.value) / 100)));
        refresh();
    });
    document.addEventListener('visibilitychange', () => {
        generation++; halt(); applyVolume();
        if (document.hidden) { if (context) void context.suspend().catch(() => {}); }
        else void resume();
    });
    window.addEventListener('pagehide', stop);
    return { start, stop, setMuted, setVolume };
})();
