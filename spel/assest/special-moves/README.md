# Special moves

112 aanvallen voor de 56 personages, gekoppeld via hetzelfde personage-ID als het rooster.

- `moves-source.txt`: de oorspronkelijke aangeleverde lijst.
- `javascript/moves.json`: aanvalsnamen, beschrijvingen, gedrag en balanswaarden.
- `javascript/moves-data.js`: dezelfde data als browser-script; werkt ook zonder fetch bij lokaal openen.
- `javascript/special-moves.js`: projectielen, stralen, gebiedsaanvallen, status-effecten en tijdelijke buffs.
- `index.html`, `javascript/catalog.js`, `css/special-moves.css`: doorzoekbaar overzicht van alle aanvallen.

Na wijzigingen aan de brontekst of de gedragsprofielen: `node spel/assest/special-moves/javascript/build-moves.cjs`.
Dit bouwt `javascript/moves.json` en `javascript/moves-data.js` opnieuw op.

Speler 1 gebruikt G/Q en C/E, speler 2 gebruikt 2 en 3 (ook numpad). Elke aanval heeft een eigen cooldown: 5 seconden voor special 1 en 16 seconden voor special 2. Het HUD toont wanneer elke aanval weer klaar is. CPU-vechters gebruiken dezelfde regels.

Het spel gebruikt schadepercentages en levens. Herstel verlaagt daarom het schadepercentage in plaats van een HP-balk aan te vullen. Buffs duren 6 seconden: 30% extra schade, 20% extra snelheid en 35% minder ontvangen schade. Chopper en Robin worden ook visueel groter. Blokkeren vermindert schade en voorkomt vastzetten of bevriezen.

De specials gebruiken gestileerde Three.js-effecten en de bestaande gevechtsanimaties. Aanvallen delen gedragsfamilies (zoals stralen, projectielen en combo's); dit zijn geen 112 afzonderlijke filmische karakteranimaties. Bestuurbare bliksem zoekt automatisch de hoogte van de tegenstander op, zodat dezelfde loop- en springtoetsen beschikbaar blijven.
