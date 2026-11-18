# Health-items

Een willekeurig item verschijnt na 10 seconden, daarna iedere 10 seconden tot het
einde van de ronde. De spawn ligt op een willekeurig speelbaar platform. Een item
verdwijnt na 35 seconden; er zijn maximaal twee wereld-items tegelijk.

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

`healing-models.js` bouwt unieke 3D-vormen op basis van de meegeleverde afbeeldingen:
potje, rijstbal, scroll, ramenkom, slak, medicijn, bento, vlees, flesje, spuit en bonen.
De afbeeldingen verschijnen in de inventaris. De pick-ups zweven en draaien boven
een lichtgevende ring. Gebruik toont een bewegende groene herstelaura. Alle
geometrie en materialen worden bij ophalen, verdwijnen of een nieuwe ronde opgeruimd.
