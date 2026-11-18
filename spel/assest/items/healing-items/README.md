# Health-items

Op **Anime Dojo**, **Schaduw Kasteel**, **Zwevend Eiland** en **Neon Stad** vliegt
iedere 15 seconden een rood-wit 3D-bevoorradingsvliegtuig over de arena. Na drie
seconden laat het een willekeurig health-item vallen. Het item daalt in ongeveer
3,4 seconden aan een parachute af en wordt pas na de landing oppakbaar.
Het landt op het hoogste platform onder de gekozen drop-positie.

De andere vijf maps behouden hun willekeurige spawn iedere 10 seconden.
Een item verdwijnt na 35 seconden op het platform; er zijn maximaal twee
wereld-items tegelijk. Er worden geen extra drops opgestapeld na een stilgevallen
of verborgen browser-tab. Vliegtuig, parachute en inventaris worden bij het einde
van een ronde opgeruimd.

P1: **R** oppakken, **T** gebruiken. P2: **6** oppakken, **7** gebruiken, ook op het
numpad. Op touchscreens zijn **Pak HP** en **Herstel** beschikbaar. Elke speler kan
één item dragen. Oppakken vereist nabijheid, gebruiken kan daarna overal.

Gezondheid is maximaal 100%. Een item wordt niet verbruikt bij volle gezondheid en
kan geen uitgeschakelde speler herstellen. Bij verlies van een leven verdwijnt het
gedragen item. De CPU kan nabije items oppakken en gebruiken als hij gewond is.

| Serie | Item | HP | Afbeelding |
|---|---|---:|---|
| Naruto | Soldier Pill | 15 | 01_soldier_pill.png |
| Naruto | Ninja Rice Ball | 20 | 02_ninja_rice_ball.png |
| Naruto | Medical Chakra Scroll | 35 | 03_medical_chakra_scroll.png |
| Naruto | Ichiraku Ramen | 45 | 04_ichiraku_ramen.png |
| Naruto | Katsuyu Healing Summon | 60 | 05_katsuyu.png |
| One Piece | Chopper's Medicine | 20 | 07_rumble_ball.png |
| One Piece | Sanji's Bento | 30 | 09_sanjis_bento.png |
| One Piece | Pirate Meat | 40 | 06_pirate_meat.png |
| One Piece | Grand Line Recovery Potion | 50 | 08_miracle_drug.png |
| One Piece | Ivankov's Healing Hormones | 65 | 10_ivankov_hormones.png |
| Dragon Ball | Senzu Bean | 100 | 11_senzu_bean.png |

De itemgegevens staan in `javascript/healing-items.json`. Houd de browserkopie
`javascript/healing-items-data.js` gelijk aan de JSON, zodat het spel ook werkt
als je `game.html` rechtstreeks opent. De stylesheet staat in `css/healing-items.css`.

`javascript/healing-models.js` bouwt unieke 3D-vormen op basis van de meegeleverde afbeeldingen:
potje, rijstbal, scroll, ramenkom, slak, medicijn, bento, vlees, flesje, spuit en bonen.
De afbeeldingen verschijnen in de inventaris. De pick-ups zweven en draaien boven
een lichtgevende ring. Gebruik toont een bewegende groene herstelaura. Alle
geometrie en materialen worden bij ophalen, verdwijnen of een nieuwe ronde opgeruimd.

`javascript/supply-plane.js` bouwt het vliegtuig met vier geanimeerde motorfans, cockpitramen,
rood-witte vleugels, gouden accenten, navigatielichten en het bestaande Anime Rumble-logo.
De parachute bestaat uit acht afwisselend rode/witte panelen met ophanglijnen.
De afbeeldingen worden niet als platte vervanging voor het 3D-vliegtuig gebruikt.
