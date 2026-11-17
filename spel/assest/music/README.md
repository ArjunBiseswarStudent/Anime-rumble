# Arena music

The nine arena scores are synthesized locally by `../../javascript/arena-music.js`
using the Web Audio API. The note sequences, harmony, arrangement and synthesized
instruments were written for this game. No music files, commercial soundtracks,
third-party compositions, recordings, sample packs or external music services are
used. The themes describe the scenery rather than quoting anime soundtracks.

| Map | Theme | Sound |
| --- | --- | --- |
| Kurukshetra Slagveld | Vaandels in de avondzon | Original cinematic minor theme, deep battle drums, brass-like lead, strings and plucked drone |
| Anime Dojo | Daken bij zonsondergang | Pentatonic plucked tones and low drums |
| Schaduw Kasteel | Wachters van de nacht | Slow minor harmonies and bell-like tones |
| Zwevend Eiland | Boven de wolken | Airy major pentatonic melody and soft accompaniment |
| Neon Stad | Nachtverkeer | Electronic bass, synth lead and rhythmic pulses |
| Frog Island | De gouden bron · Shinobi-avontuur | Synthesized flute with vibrato, plucked strings, string pads and low drums |
| Planet Namek | Verre groene hemel · Kosmische strijd | Energetic detuned synth lead, driving bass, strings and battle percussion |
| Beerus Palace | Schemering bij de boom · Godentuin | Layered celestial bells, spacious Lydian strings and sparse percussion |
| Arlong Park | Tropisch getij · Piratenavontuur | Adventurous brass-like lead, plucked accompaniment and syncopated percussion |

The four anime themes and the battlefield theme use original sixteen-bar arrangements with separate opening
and answering melodies, chord changes, a quieter bridge and rhythmic fills.
The instrument timbres are constructed from oscillators and envelopes. They evoke
broad adventure-animation genres without reproducing any series' soundtrack.

Playback begins after the player starts a match, stops at the result screen or
when returning to selection, and pauses while the tab is hidden. Music volume and
mute preferences are saved locally when browser storage is available. No audio
is downloaded. Browsers without Web Audio can still run the game without music.

Keep this provenance note if replacing the scores; record the source, author,
license and any attribution requirements for every future third-party asset.
