# Combat items

- `css/combat-items.css`: wapeninformatie bij de geselecteerde personages.
- `javascript/combat-items.json`: wapens voor de 30 personages uit de aangeleverde lijst, gekoppeld via roster-ID.
- `javascript/combat-items-data.js`: browserkopie van de JSON voor gebruik zonder fetch bij lokaal openen.
- `javascript/combat-items.js`: gestileerde 3D-wapens en koppeling aan handen of uitrusting.
- `javascript/combat-actions.js`: wapenaanvallen, projectielen, combo's, treffers en effecten.
- `javascript/combat-actions.test.cjs`: tests voor alle wapens, bereik, blokkeren, combo's en opruimen.

Bij wijzigingen aan de JSON kan de browserkopie vanuit de projectmap worden bijgewerkt met:

```powershell
node -e "const fs=require('node:fs');const p='spel/assest/items/combat-items/javascript/';fs.writeFileSync(p+'combat-items-data.js','window.CombatItemData = '+fs.readFileSync(p+'combat-items.json','utf8')+';');"
```

Dezelfde uitrusting is zichtbaar in de portretten en gevechten. Wapens volgen de arm- en handbewegingen. Zoro draagt drie katana's, Jinwoo twee dolken, Asta vier zwaarden (één in de hand, drie op de rug) en Tifa/Bakugo uitrusting aan beide handen. Personages zonder vermelding blijven ongewapend. Bij personages met meerdere wapens is één uitrustingsset tegelijk actief.

P1 gebruikt F voor een wapenaanval en H om uitrusting te wisselen. P2 gebruikt 1 en 4 (ook numpad). Personages zonder wapen gebruiken hun bestaande vuistslag. De twee supers blijven ongewijzigd beschikbaar.

Kunai en Kuro Kabuto gebruiken op F/1 een korte wapenstoot. Projectielen gaan via X/5 en het werpitemsysteem met drie ladingen en tien seconden herladen; zo kan de werplimiet niet via de gewone aanval worden omzeild. Zwaarden geven zwaaiaanvallen, speren en staven lange steken, hamers langzame zware aanvallen en dolken/handschoenen snelle aanvallen. Drie aanvallen met hooguit 1,3 seconde ertussen vormen een combo; de derde aanval geeft 35% extra schade en extra verticale terugslag. IJs- en Soul Solid-treffers vertragen de tegenstander 0,7 seconde met 35%. Blokkeren beperkt wapenschade tot 25% en voorkomt deze vertraging.

Zwaaisporen, projectielen, vonken en blauwe schildinslagen worden in Three.js gerenderd. Elke wapenaanval kan zijn doel één keer raken. Uitgeruste wapens bewegen mee met een slag-, steek- of hamerhouding. De CPU gebruikt hetzelfde systeem. Effecten worden opgeruimd bij het verliezen van een leven, een nieuwe ronde of terugkeer naar de selectie.

Controle: `node --test spel/assest/items/combat-items/javascript/combat-actions.test.cjs spel/assest/special-moves/javascript/special-moves.test.cjs`.
