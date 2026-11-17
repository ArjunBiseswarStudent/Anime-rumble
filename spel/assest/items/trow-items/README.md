# Werpitems

- `css/trow-items.css`: werpiteminformatie, munitie en cooldown in het HUD.
- `javascript/trow-items.json`: de projectielen voor alle 33 opgegeven personages, met kleur, snelheid, schade, bereik en eventuele zwaartekracht, explosie of vertraging.
- `javascript/trow-items-data.js`: browserkopie van de JSON, zodat lokaal openen zonder fetch werkt.
- `javascript/trow-items.js`: werpen, beweging, botsingen, effecten, munitie en herladen.
- `javascript/trow-items.test.cjs`: tests voor alle projectieltypes en de spelregels.

P1 werpt met X; P2 met 5, ook op het numerieke toetsenbord. Drie worpen per personage. Alleen na de derde worp begint een cooldown van exact 10 seconden; daarna komen alle drie worpen terug. Tussen twee worpen zit 0,3 seconde. Eén of twee overgebleven worpen worden niet automatisch bijgevuld. De CPU gebruikt dezelfde regels. Meerdere projectieltypes per personage wisselen elkaar automatisch af.

Personages zonder vermelding krijgen geen werpitem. Blokkeren en tijdelijk vastgezet zijn voorkomen werpen zonder munitie te verbruiken. Munitie en herlaadtijd blijven behouden bij het verliezen van een leven. Een nieuwe wedstrijd begint weer met drie worpen.

De projectielen zijn gestileerde 3D-effecten: metalen shuriken en kunai, tags met markeringen, houten tonnen met metalen banden, ijssperen en lichtgevende energieprojectielen. Ze hebben lichteffecten, sporen, draaiing, zwaartekracht, platformbotsingen en inslagdeeltjes waar passend. Vuurballen van Mario en tonnen kunnen stuiteren. IJs en Pop Greens vertragen bij een onbeschermde treffer. Explosieve projectielen hebben een beperkt explosiebereik. Elk projectiel kan maar één keer schade doen.

Na een JSON-wijziging de browserkopie bijwerken vanuit de projectmap:

```powershell
node -e "const fs=require('node:fs');const p='spel/assest/items/trow-items/javascript/';fs.writeFileSync(p+'trow-items-data.js','window.TrowItemData = '+fs.readFileSync(p+'trow-items.json','utf8')+';');"
```

Testen: `node --test spel/assest/items/trow-items/javascript/trow-items.test.cjs`.
