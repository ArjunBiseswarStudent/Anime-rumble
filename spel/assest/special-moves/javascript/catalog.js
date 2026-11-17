document.addEventListener('DOMContentLoaded', () => {
    const catalog = document.getElementById('move-catalog');
    const search = document.getElementById('move-search');
    function element(tag, text) { const node = document.createElement(tag); node.textContent = text; return node; }
    function render() {
        const query = search.value.trim().toLocaleLowerCase('nl');
        const entries = Object.entries(window.SpecialMoveData).filter(([id, moves]) =>
            [id, ...moves.flatMap(move => [move.character, move.name, move.desc])].join(' ').toLocaleLowerCase('nl').includes(query));
        catalog.replaceChildren();
        for (const [id, moves] of entries) {
            const card = element('article', '');
            card.dataset.characterId = id;
            card.append(element('h2', moves[0].character));
            moves.forEach((move, slot) => {
                const section = element('section', '');
                section.append(element('span', `SPECIAL ${slot + 1}`), element('h3', move.name), element('p', move.desc));
                const stats = move.damage ? `${move.damage}% schade totaal` : 'Tijdelijke versterking';
                section.append(element('small', `${stats} · ${move.cooldown}s cooldown · ${move.duration}s effect`));
                card.append(section);
            });
            catalog.append(card);
        }
        document.getElementById('move-count').textContent = `${entries.length} personages · ${entries.length * 2} specials`;
    }
    search.addEventListener('input', render);
    render();
});
