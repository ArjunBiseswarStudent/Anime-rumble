
 // =========================================================================
 // 1. FRANCHISES, ARENAS & CHARACTER ROSTER DATA
 // =========================================================================
 const FRANCHISES = [
     { key: 'all', label: 'Alle' },
     { key: 'Jujutsu Kaisen', label: 'Jujutsu Kaisen' },
     { key: 'Solo Leveling', label: 'Solo Leveling' },
     { key: 'My Hero Academia', label: 'My Hero Academia' },
     { key: 'Black Clover', label: 'Black Clover' },
     { key: 'Demon Slayer', label: 'Demon Slayer' },
     { key: 'Fairy Tail', label: 'Fairy Tail' },
     { key: 'Sonic', label: 'Sonic' },
     { key: 'Mario', label: 'Mario' },
     { key: 'Final Fantasy', label: 'Final Fantasy' },
     { key: 'Chainsaw Man', label: 'Chainsaw Man' },
     { key: 'Naruto', label: 'Naruto' },
     { key: 'One Piece', label: 'One Piece' },
     { key: 'Dragon Ball', label: 'Dragon Ball' }
 ];

 const ARENAS = window.AnimeMaps.arenas;

 const ROSTER = [
     {
         id: 'gojo', name: 'Satoru Gojo', franchise: 'Jujutsu Kaisen',
         desc: 'De almachtige leraar met witte haren, blinddoek en Mugen-kracht.',
         skin: '#fde68a', primary: '#1e293b', secondary: '#0f172a', hair: '#f8fafc', aura: '#38bdf8',
         speed: 5.8, jump: 12.6, weight: 1.0,
         moves: {
             neutral: { name: 'Mugen', desc: 'Onbegrensd schild dat vijanden vertraagt' },
             side: { name: 'Rode Brief (Aka)', desc: 'Krachtige rode energie-stoot' },
             up: { name: 'Teleportatie', desc: 'Teleporteert bliksemsnel omhoog' },
             down: { name: 'Onbegrensde Leegte', desc: 'Domeinuitbreiding die vijanden bevriest' }
         }
     },
     {
         id: 'sukuna', name: 'Sukuna', franchise: 'Jujutsu Kaisen',
         desc: 'De legendarische Vloekkoning met dodelijke snij-aanvallen.',
         skin: '#fed7aa', primary: '#f8fafc', secondary: '#1e1b4b', hair: '#f472b6', aura: '#ef4444',
         speed: 5.6, jump: 12.2, weight: 1.08,
         moves: {
             neutral: { name: 'Cleave', desc: 'Snelle onzichtbare snij-aanval' },
             side: { name: 'Dismantle', desc: 'Drie scherpe slash-golven naar voren' },
             up: { name: 'Vloekvlucht', desc: 'Schiet met duivelse snelheid omhoog' },
             down: { name: 'Vlammenpijl', desc: 'Explosieve vuurschokgolf' }
         }
     },
     {
         id: 'yuji', name: 'Yuji Itadori', franchise: 'Jujutsu Kaisen',
         desc: 'Energieke vechter met brute kracht en de Zwarte Flits.',
         skin: '#fed7aa', primary: '#1e293b', secondary: '#ef4444', hair: '#fda4af', aura: '#dc2626',
         speed: 6.1, jump: 12.8, weight: 1.0,
         moves: {
             neutral: { name: 'Divergent Fist', desc: 'Vervloekte dubbele vuistslag' },
             side: { name: 'Stormloop van Stoten', desc: 'Snelle voorwaartse combo-rush' },
             up: { name: 'Jump Power', desc: 'Hoge bovenmenselijke uppercut-sprong' },
             down: { name: 'Black Flash', desc: 'Counter die een zwarte flits ontketent' }
         }
     },
     {
         id: 'jinwoo', name: 'Sung Jinwoo', franchise: 'Solo Leveling',
         desc: 'De Shadow Monarch met koninklijke dolken en schaduwleger.',
         skin: '#fde68a', primary: '#0f172a', secondary: '#4c1d95', hair: '#1e293b', aura: '#a855f7',
         speed: 6.3, jump: 12.8, weight: 0.98,
         moves: {
             neutral: { name: 'Dagger Rush', desc: 'Gooit snelle schaduwdolken' },
             side: { name: 'Schaduwstap', desc: 'Teleporteert direct achter de vijand' },
             up: { name: 'Heerser der Schaduwen', desc: 'Zweeft met schaduwvleugels omhoog' },
            down: { name: 'Schaduwoproep', desc: 'Roept een schaduwsoldaat op' }
        }
    },
    {
        id: 'cha', name: 'Cha Hae-in', franchise: 'Solo Leveling',
        desc: 'Elegante S-Rank zwaardvechtster met bliksemsnelle zwaardkunst.',
        skin: '#fef3c7', primary: '#dc2626', secondary: '#f8fafc', hair: '#facc15', aura: '#fde047',
        speed: 6.4, jump: 12.7, weight: 0.92,
        moves: {
            neutral: { name: 'Zwaardsteek', desc: 'Bliksemsnelle steek met groot bereik' },
            side: { name: 'Dansende Bliksem', desc: 'Snijdt razendsnel door vijanden heen' },
            up: { name: 'Zwaardzwaai-Lancering', desc: 'Opwaartse gouden zwaardslag' },
            down: { name: 'Zwaardconcentratie', desc: 'Verhoogt haar aanvalskracht tijdelijk' }
        }
    },
    {
        id: 'beru', name: 'Beru', franchise: 'Solo Leveling',
        desc: 'De loyale Mierenkoning-schaduw met razendsnelle klauwen.',
        skin: '#1e1b4b', primary: '#090d16', secondary: '#581c87', hair: '#312e81', aura: '#c084fc',
        speed: 6.5, jump: 13.2, weight: 1.05,
        moves: {
            neutral: { name: 'Mierenklauw', desc: 'Snelle dodelijke klauwcombo' },
            side: { name: 'Koningstunnel', desc: 'Beestachtige stormloop naar voren' },
            up: { name: 'Insectenvlucht', desc: 'Vliegt met insectenvleugels omhoog' },
            down: { name: 'Krijs der Mieren', desc: 'Schokgolf die vijanden verdooft' }
        }
    },
    {
        id: 'deku', name: 'Izuku Midoriya (Deku)', franchise: 'My Hero Academia',
        desc: 'Held met One For All en groene bliksemtrappen.',
        skin: '#fed7aa', primary: '#15803d', secondary: '#dc2626', hair: '#14532d', aura: '#22c55e',
        speed: 6.2, jump: 13.0, weight: 0.96,
        moves: {
            neutral: { name: 'Delaware Smash', desc: 'Krachtige windgolf met vingerknip' },
            side: { name: 'Shoot Style', desc: 'Vliegende bliksemtrap naar voren' },
            up: { name: 'Float & Black Whip', desc: 'Zweeft met zwarte zwepen omhoog' },
            down: { name: 'Detroit Smash', desc: 'Neerwaartse vuistslag met schokgolf' }
        }
    },
    {
        id: 'bakugo', name: 'Katsuki Bakugo', franchise: 'My Hero Academia',
        desc: 'Explosieve vechter met nitroglycerine-explosies uit zijn handen.',
        skin: '#fed7aa', primary: '#1e293b', secondary: '#f97316', hair: '#fde047', aura: '#fb923c',
        speed: 6.1, jump: 12.8, weight: 1.0,
        moves: {
            neutral: { name: 'Stun Grenade', desc: 'Felle flitsexplosie voor zich uit' },
            side: { name: 'AP Shot', desc: 'Geconcentreerde explosiestraal' },
            up: { name: 'Explosieve Vlucht', desc: 'Raketlancering met handexplosies' },
            down: { name: 'Howitzer Impact', desc: 'Vurige explosietornado op de grond' }
        }
    },
    {
        id: 'todoroki', name: 'Shoto Todoroki', franchise: 'My Hero Academia',
        desc: 'Beheerst zowel ijskoude gletsjers als verzengend vuur.',
        skin: '#fef3c7', primary: '#1e3a8a', secondary: '#ef4444', hair: '#f8fafc', aura: '#38bdf8',
        speed: 5.5, jump: 12.0, weight: 1.0,
        moves: {
            neutral: { name: 'Ijsgletsjer', desc: 'Stuurt een bevriezende ijsmuur vooruit' },
            side: { name: 'Vlammenstroom', desc: 'Brede golf van vuur uit zijn linkerarm' },
            up: { name: 'Ijsbaan-Lancering', desc: 'Duwt zichzelf op een ijspilaar omhoog' },
            down: { name: 'Bevroren Grond', desc: 'Bevriest nabije tegenstanders' }
        }
    },
    {
        id: 'asta', name: 'Asta', franchise: 'Black Clover',
        desc: 'Vechter zonder magie met een gigantisch Anti-Magie zwaard.',
        skin: '#fed7aa', primary: '#0f172a', secondary: '#dc2626', hair: '#cbd5e1', aura: '#ef4444',
        speed: 6.0, jump: 12.5, weight: 1.06,
        moves: {
            neutral: { name: 'Zwaardzwaai', desc: 'Brede houw met anti-magiezwaard' },
            side: { name: 'Demonenstorm', desc: 'Stormt vooruit en kaatst projectielen terug' },
            up: { name: 'Zwarte Vleugel-Sprong', desc: 'Schiet met duivelse vleugel omhoog' },
            down: { name: 'Anti-Magie Counter', desc: 'Absorbeert en straft aanvallen af' }
        }
    },
    {
        id: 'yuno', name: 'Yuno Grinbellior', franchise: 'Black Clover',
        desc: 'Meester van windmagie en de windgeest Sylph.',
        skin: '#fef3c7', primary: '#0f172a', secondary: '#10b981', hair: '#1e293b', aura: '#34d399',
        speed: 6.2, jump: 13.0, weight: 0.95,
        moves: {
            neutral: { name: 'Windmes', desc: 'Scherpe halvemaanvormige windbladen' },
            side: { name: 'Spirit Storm', desc: 'Geconcentreerde straal van windmagie' },
            up: { name: "Sylph's Vlucht", desc: 'Snelle verticale windvlucht' },
            down: { name: 'Windschild', desc: 'Koepel van wervelwinden blaast vijanden weg' }
        }
    },
    {
        id: 'noelle', name: 'Noelle Silva', franchise: 'Black Clover',
        desc: 'Koninklijke watermagiër met haar Valkyrie Waterpantser.',
        skin: '#fef3c7', primary: '#1e1b4b', secondary: '#38bdf8', hair: '#e2e8f0', aura: '#0ea5e9',
        speed: 5.7, jump: 12.2, weight: 0.94,
        moves: {
            neutral: { name: "Waterdraak's Roer", desc: 'Schiet een krachtige waterdraak af' },
            side: { name: 'Valkenduis', desc: 'Stormt als een waterlans door de lucht' },
            up: { name: 'Waterstraal-Lift', desc: 'Lanceert zichzelf op een waterstraal' },
            down: { name: 'Valkenpantser', desc: 'Verhoogt verdediging met waterpantser' }
        }
    },
    {
        id: 'tanjiro', name: 'Tanjiro Kamado', franchise: 'Demon Slayer',
        desc: 'Zwaardvechter met Water- en Hinokami Kagura Vuurademhaling.',
        skin: '#fed7aa', primary: '#166534', secondary: '#0f172a', hair: '#7f1d1d', aura: '#38bdf8',
        speed: 5.9, jump: 12.4, weight: 0.98,
        moves: {
            neutral: { name: 'Wateroppervlakteslag', desc: 'Snelle zwaardstreek met watergolven' },
            side: { name: 'Hinokami Kagura', desc: 'Vurige dubbele combo naar voren' },
            up: { name: 'Waterwheel', desc: 'Salto-aanval met draaiend waterrad' },
            down: { name: 'Reukzintuig Focus', desc: 'Ziet zwakke plekken voor extra kracht' }
        }
    },
    {
        id: 'nezuko', name: 'Nezuko Kamado', franchise: 'Demon Slayer',
        desc: 'Vecht met scherpe demonenklauwen en roze bloeddemonenvlammen.',
        skin: '#fef3c7', primary: '#f472b6', secondary: '#1e1b4b', hair: '#0f172a', aura: '#ec4899',
        speed: 6.3, jump: 12.8, weight: 0.90,
        moves: {
            neutral: { name: 'Demonenklauw', desc: 'Snelle klauwaanval op korte afstand' },
            side: { name: 'Bloeddemonenvlam', desc: 'Roze exploderende demonenvlammen' },
            up: { name: 'Demonensprong', desc: 'Bovenmenselijke sprong omhoog' },
            down: { name: 'Demonen-Counter', desc: 'Ontwijkt en slaat keihard terug' }
        }
    },
    {
        id: 'zenitsu', name: 'Zenitsu Agatsuma', franchise: 'Demon Slayer',
        desc: 'Wordt bliksemsnel en dodelijk zodra hij in slaap valt.',
        skin: '#fed7aa', primary: '#facc15', secondary: '#f97316', hair: '#fde047', aura: '#eab308',
        speed: 6.7, jump: 12.6, weight: 0.92,
        moves: {
            neutral: { name: 'Thunderclap & Flash', desc: 'Bliksemsnelle dash over het hele scherm' },
            side: { name: 'Zesvoudige Snelheid', desc: 'Zigzagt als gele bliksem naar voren' },
            up: { name: 'Bliksem-Uppercut', desc: 'Schiet schuin omhoog in bliksem' },
            down: { name: 'Elektrische Slaap', desc: 'Slaap-counter met harde bliksemschok' }
        }
    },
    {
        id: 'natsu', name: 'Natsu Dragneel', franchise: 'Fairy Tail',
        desc: 'Vurige drakenmoordenaar die vlammen spuugt én opeet.',
        skin: '#fed7aa', primary: '#1e293b', secondary: '#f8fafc', hair: '#f472b6', aura: '#f97316',
        speed: 6.0, jump: 12.5, weight: 1.02,
        moves: {
            neutral: { name: "Vuurdraak's Roor", desc: 'Spuugt een grote vlammenbal vooruit' },
            side: { name: "Vuurdraak's IJzeren Vuist", desc: 'Stormt met brandende vuist naar voren' },
            up: { name: 'Vlammensprong', desc: 'Stuwt zichzelf met vlammen omhoog' },
            down: { name: 'Vuur Vreten', desc: 'Eet vuurenergie om schade te genezen' }
        }
    },
    {
        id: 'erza', name: 'Erza Scarlet', franchise: 'Fairy Tail',
        desc: 'Titania: wisselt bliksemsnel van harnassen en zwaarden.',
        skin: '#fef3c7', primary: '#cbd5e1', secondary: '#dc2626', hair: '#dc2626', aura: '#f43f5e',
        speed: 5.8, jump: 12.3, weight: 1.05,
        moves: {
            neutral: { name: 'Zwaardregen', desc: 'Vuurt magische zwaarden af' },
            side: { name: "Heaven's Wheel", desc: 'Stormvloed aan zwaardstoten naar voren' },
            up: { name: 'Vredeslans', desc: 'Lanceert zichzelf met speer omhoog' },
            down: { name: 'Adamantijn Harnas', desc: 'Onverwoestbaar schild met tegenaanval' }
        }
    },
    {
        id: 'gray', name: 'Gray Fullbuster', franchise: 'Fairy Tail',
        desc: 'IJs-Make magiër die ijslansen en hamers vormt.',
        skin: '#fed7aa', primary: '#0f172a', secondary: '#38bdf8', hair: '#1e293b', aura: '#7dd3fc',
        speed: 5.8, jump: 12.2, weight: 0.98,
        moves: {
            neutral: { name: 'Ijs-Make: Lans', desc: 'Gooit scherpe ijslansen naar de vijand' },
            side: { name: 'Ijs-Make: Hamer', desc: 'Slaat met een gigantische ijshamer' },
            up: { name: 'Ijs-Make: Slide', desc: 'Glijdt op een ijsbaan snel omhoog' },
            down: { name: 'Ijs-Make: Vloer', desc: 'Bevriest tegenstanders op de grond' }
        }
    },
    {
        id: 'sonic', name: 'Sonic', franchise: 'Sonic',
        desc: 'De snelste egel ter wereld met Homing Attack en Spin Dash.',
        skin: '#fde68a', primary: '#2563eb', secondary: '#ef4444', hair: '#1d4ed8', aura: '#3b82f6',
        speed: 7.2, jump: 13.2, weight: 0.88,
        moves: {
            neutral: { name: 'Homing Attack', desc: 'Vliegt automatisch op de tegenstander af' },
            side: { name: 'Spin Dash', desc: 'Racet als een blauwe kogel naar voren' },
            up: { name: 'Springveer', desc: 'Lanceert zichzelf hoog de lucht in' },
            down: { name: 'Spin Charge', desc: 'Schokgolf-spin op de grond' }
        }
    },
    {
        id: 'shadow', name: 'Shadow', franchise: 'Sonic',        desc: 'De duistere egel met Chaos Spears en tijdvertraging.',
        skin: '#fde68a', primary: '#0f172a', secondary: '#dc2626', hair: '#090d16', aura: '#facc15',
        speed: 7.0, jump: 13.0, weight: 0.92,
        moves: {
            neutral: { name: 'Chaos Spear', desc: 'Schiet gele energiebogen af' },
            side: { name: 'Chaos Control Dash', desc: 'Teleporteert achter de vijand' },
            up: { name: 'Chaos Boost Fly', desc: 'Schiet omhoog met chaos-energie' },
            down: { name: 'Chaos Tijdveld', desc: 'Vertraagt de tegenstander in slow-motion' }
        }
    },
    {
        id: 'knuckles', name: 'Knuckles', franchise: 'Sonic',
        desc: 'Krachtige vuistvechter die door elk schild heen slaat.',
        skin: '#fde68a', primary: '#dc2626', secondary: '#22c55e', hair: '#b91c1c', aura: '#ef4444',
        speed: 5.7, jump: 11.8, weight: 1.12,
        moves: {
            neutral: { name: 'Krachtige Stoot', desc: 'Keiharde stoot die schilden breekt' },
            side: { name: 'Boor-Aanval', desc: 'Draait als een boor horizontaal vooruit' },
            up: { name: 'Uppercut-Lancering', desc: 'Krachtige opwaartse uppercut' },
            down: { name: 'Gronddreun', desc: 'Slaat op de grond voor een schokgolf' }
        }
    },
    {
        id: 'mario', name: 'Mario', franchise: 'Mario',
        desc: 'Iconische allrounder met vuurballen, cape en Super Jump.',
        skin: '#fed7aa', primary: '#ef4444', secondary: '#2563eb', hair: '#451a03', aura: '#f97316',
        speed: 5.8, jump: 12.5, weight: 1.0,
        moves: {
            neutral: { name: 'Vuurbal', desc: 'Schiet stuiterende vuurballen' },
            side: { name: 'Super Cape', desc: 'Slaat en kaatst projectielen terug' },
            up: { name: 'Super Jump Punch', desc: 'Klassieke munten-uppercut' },
            down: { name: 'F.L.U.D.D.', desc: 'Krachtige waterstraal duwt vijanden ver weg' }
        }
    },
    {
        id: 'bowser', name: 'Bowser', franchise: 'Mario',
        desc: 'Zware drakenkoning met vuuradem en verwoestende klappen.',
        skin: '#facc15', primary: '#15803d', secondary: '#ef4444', hair: '#dc2626', aura: '#f97316',
        speed: 4.6, jump: 11.2, weight: 1.38, scaleW: 48, scaleH: 66,
        moves: {
            neutral: { name: 'Vuuradem', desc: 'Spuugt een grote vuurbal uit' },
            side: { name: 'Klap-Grijp', desc: 'Ram-aanval die de vijand verdooft' },
            up: { name: 'Whirling Fortress', desc: 'Draait als een tol in zijn schild omhoog' },
            down: { name: 'Bowser Bomb', desc: 'Zware grondstamp met enorme schokgolf' }
        }
    },
    {
        id: 'dk', name: 'Donkey Kong', franchise: 'Mario',
        desc: 'Enorme gorilla met de legendarische Giant Punch.',
        skin: '#d97706', primary: '#78350f', secondary: '#ef4444', hair: '#451a03', aura: '#f59e0b',
        speed: 5.0, jump: 11.5, weight: 1.34, scaleW: 48, scaleH: 64,
        moves: {
            neutral: { name: 'Giant Punch', desc: 'Reuzenklap die schilden verbrijzelt' },
            side: { name: 'Headbutt', desc: 'Kopstoot die vijanden tijdelijk vastzet' },
            up: { name: 'Spinning Kong', desc: 'Draait zijn armen als helikopter omhoog' },
            down: { name: 'Grondstamp', desc: 'Slaat keihard met beide vuisten op de grond' }
        }
    },
    {
        id: 'cloud', name: 'Cloud Strife', franchise: 'Final Fantasy',
        desc: 'Zwaardvechter met het gigantische Buster Sword en Limit Break.',
        skin: '#fef3c7', primary: '#1e1b4b', secondary: '#475569', hair: '#facc15', aura: '#38bdf8',
        speed: 5.9, jump: 12.4, weight: 1.04,
        moves: {
            neutral: { name: 'Cross-Slash Beam', desc: 'Snelle energiegolf met Buster Sword' },
            side: { name: 'Blade Beam', desc: 'Halvemaanvormige zwaardstraal' },
            up: { name: 'Climhazzard', desc: 'Hoge opwaartse zwaardsteek' },
            down: { name: 'Limit Charge', desc: 'Laadt zijn Limit-aura op voor extra schade' }
        }
    },
    {
        id: 'sephiroth', name: 'Sephiroth', franchise: 'Final Fantasy',
        desc: 'De een-vleugelige engel met het extreem lange Masamune-zwaard.',
        skin: '#f8fafc', primary: '#090d16', secondary: '#94a3b8', hair: '#e2e8f0', aura: '#a855f7',
        speed: 5.8, jump: 12.6, weight: 0.96,
        moves: {
            neutral: { name: 'Flare', desc: 'Explosieve magische vuurbol' },
            side: { name: 'Shadow Flare', desc: 'Snelle duistere energiebollen' },
            up: { name: 'Octave Shift', desc: 'Schiet omhoog met zijn zwarte vleugel' },
            down: { name: 'Scintilla', desc: 'Zilvergouden counter-schild' }
        }
    },
    {
        id: 'tifa', name: 'Tifa Lockhart', franchise: 'Final Fantasy',
        desc: 'Meester in vechtsporten met razendsnelle vuist- en trapcombo’s.',
        skin: '#fef3c7', primary: '#f8fafc', secondary: '#dc2626', hair: '#1e293b', aura: '#f43f5e',
        speed: 6.4, jump: 12.9, weight: 0.92,
        moves: {
            neutral: { name: 'Overtimed Combo', desc: 'Razendsnelle vuist- en trapreeks' },
            side: { name: 'Beat Rush', desc: 'Snelle schouderduw en stoten naar voren' },
            up: { name: 'Somersault', desc: 'Acrobatische salto-trap omhoog' },
            down: { name: 'Dodge & Counter', desc: 'Ontwijkt en deelt een harde hoekstrap uit' }
        }
    },
    {
        id: 'denji', name: 'Denji (Chainsaw Man)', franchise: 'Chainsaw Man',
        desc: 'Wilde kettingzaagduivel die kettingzagen uit hoofd en armen laat groeien.',
        skin: '#fed7aa', primary: '#f8fafc', secondary: '#ea580c', hair: '#facc15', aura: '#ef4444',
        speed: 6.1, jump: 12.5, weight: 1.02,
        moves: {            neutral: { name: 'Kettingzaag-Zwaai', desc: 'Zwaait wild met beide kettingzagen' },
            side: { name: 'Kettingzaag-Stormloop', desc: 'Stormt met gierende zagen naar voren' },
            up: { name: 'Kabel-Grijp', desc: 'Schiet omhoog met kettingzaag-kabels' },
            down: { name: 'Bloed-Transfusie', desc: 'Herstelt schade met duivelsbloed' }
        }
    },
    {
        id: 'power', name: 'Power', franchise: 'Chainsaw Man',
        desc: 'Eigenzinnige bloedfiend die hamers en spiesen van puur bloed maakt.',
        skin: '#fef3c7', primary: '#1e293b', secondary: '#e11d48', hair: '#fda4af', aura: '#e11d48',
        speed: 5.9, jump: 12.4, weight: 0.95,
        moves: {
            neutral: { name: 'Bloedhamer', desc: 'Slaat met een enorme hamer van bloed' },
            side: { name: 'Bloedspies', desc: 'Schiet een scherpe bloedspies vooruit' },
            up: { name: 'Bloedkat-Sprong', desc: 'Hoge sprong op bloeddruk' },
            down: { name: 'Bloedbom', desc: 'Plaatst een bloedbom-val op de grond' }
        }
    },
    {
        id: 'aki', name: 'Aki Hayakawa', franchise: 'Chainsaw Man',
        desc: 'Tactische duiveljager met katana en het Vossencontract (Kon).',
        skin: '#fef3c7', primary: '#0f172a', secondary: '#38bdf8', hair: '#1e293b', aura: '#f97316',
        speed: 5.9, jump: 12.3, weight: 0.98,
        moves: {
            neutral: { name: 'Katana-Steek', desc: 'Snelle, precieze zwaardsteek' },
            side: { name: 'Vossencontract (Kon)', desc: 'Roept de gigantische vossenkop op!' },
            up: { name: 'Zwaard-Lift', desc: 'Opwaartse wind- en zwaardsprong' },
            down: { name: 'Nagel & Vloek', desc: 'Vervloekt de vijand voor vertraagde impact' }
        }
    }
];

// Personages uit extra_personages.json, aangevuld met spelwaarden en specials.
ROSTER.push(...[
    {
        "id": "naruto",
        "name": "Naruto Uzumaki",
        "franchise": "Naruto",
        "skin": "#f3bf8f",
        "primary": "#f97316",
        "secondary": "#1e293b",
        "hair": "#facc15",
        "aura": "#f59e0b",
        "desc": "De ninja van Konoha met schaduwklonen en de kracht van Kurama.",
        "speed": 6.2,
        "jump": 13,
        "weight": 1,
        "moves": {
            "neutral": {
                "name": "Rasengan",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Schaduwkloon-aanval",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Chakra-sprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Kurama-uitbarsting",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "sasuke",
        "name": "Sasuke Uchiha",
        "franchise": "Naruto",
        "skin": "#f3c5a5",
        "primary": "#64748b",
        "secondary": "#312e81",
        "hair": "#171717",
        "aura": "#8b5cf6",
        "desc": "Uchiha-zwaardvechter met Sharingan, bliksem en zwarte vlammen.",
        "speed": 6.3,
        "jump": 12.8,
        "weight": 0.98,
        "moves": {
            "neutral": {
                "name": "Chidori",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Zwaardflits",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Hemelse sprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Amaterasu",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "sakura",
        "name": "Sakura Haruno",
        "franchise": "Naruto",
        "skin": "#f4c4a3",
        "primary": "#ec4899",
        "secondary": "#991b1b",
        "hair": "#f9a8d4",
        "aura": "#22c55e",
        "desc": "Medische ninja die haar chakra bundelt in verwoestende vuistslagen.",
        "speed": 5.8,
        "jump": 12.4,
        "weight": 1.08,
        "moves": {
            "neutral": {
                "name": "Chakra-vuist",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Kersenbloesem-stoot",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Opwaartse mokerslag",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Grondverbrijzelaar",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "itachi",
        "name": "Itachi Uchiha",
        "franchise": "Naruto",
        "skin": "#e8b899",
        "primary": "#18181b",
        "secondary": "#991b1b",
        "hair": "#111827",
        "aura": "#dc2626",
        "desc": "Sharingan-meester van de Akatsuki met illusies en zwarte vlammen.",
        "speed": 6,
        "jump": 12.6,
        "weight": 0.96,
        "moves": {
            "neutral": {
                "name": "Vuurbol-jutsu",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Kraaienaanval",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Kraaienvlucht",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Tsukuyomi",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "kakashi",
        "name": "Kakashi Hatake",
        "franchise": "Naruto",
        "skin": "#eac4a4",
        "primary": "#334155",
        "secondary": "#64748b",
        "hair": "#cbd5e1",
        "aura": "#38bdf8",
        "desc": "De Copy Ninja combineert tactiek met zijn bliksemsnelle Raikiri.",
        "speed": 6.1,
        "jump": 12.7,
        "weight": 1,
        "moves": {
            "neutral": {
                "name": "Raikiri",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Bliksemhond",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Bliksemsprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Kamui",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "jiraiya",
        "name": "Jiraiya",
        "franchise": "Naruto",
        "skin": "#e8c5a4",
        "primary": "#991b1b",
        "secondary": "#64748b",
        "hair": "#f8fafc",
        "aura": "#ef4444",
        "desc": "Legendarische Sannin en paddenwijze van Mount Myoboku.",
        "speed": 5.5,
        "jump": 12.5,
        "weight": 1.2,
        "moves": {
            "neutral": {
                "name": "Rasengan",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Paddenolie-vuur",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Paddensprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Wijzenstoot",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "gaara",
        "name": "Gaara",
        "franchise": "Naruto",
        "skin": "#efc3a4",
        "primary": "#7f1d1d",
        "secondary": "#92400e",
        "hair": "#991b1b",
        "aura": "#d97706",
        "desc": "De Kazekage beheerst zand als wapen en schild.",
        "speed": 5.2,
        "jump": 12,
        "weight": 1.15,
        "moves": {
            "neutral": {
                "name": "Zandkogel",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Zandgolf",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Zandlift",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Zandbegrafenis",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "shikamaru",
        "name": "Shikamaru Nara",
        "franchise": "Naruto",
        "skin": "#e8bc99",
        "primary": "#4b5563",
        "secondary": "#14532d",
        "hair": "#1f2937",
        "aura": "#64748b",
        "desc": "Slimme strateeg die tegenstanders met schaduwtechnieken verrast.",
        "speed": 5.6,
        "jump": 12.2,
        "weight": 1,
        "moves": {
            "neutral": {
                "name": "Schaduwstoot",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Schaduwgreep",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Tactische sprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Schaduwnekbinding",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "kiba",
        "name": "Kiba Inuzuka",
        "franchise": "Naruto",
        "skin": "#e8bc99",
        "primary": "#64748b",
        "secondary": "#292524",
        "hair": "#422006",
        "aura": "#ef4444",
        "desc": "Snelle ninja die met Akamaru zijn beestachtige vechtstijl inzet.",
        "speed": 6.5,
        "jump": 13,
        "weight": 0.96,
        "moves": {
            "neutral": {
                "name": "Klauwcombo",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Gatsuga",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Beestensprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Dubbele wolventand",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "luffy",
        "name": "Monkey D. Luffy",
        "franchise": "One Piece",
        "skin": "#eeb88b",
        "primary": "#dc2626",
        "secondary": "#2563eb",
        "hair": "#171717",
        "aura": "#f59e0b",
        "desc": "Kapitein van de Straw Hats met een elastisch lichaam.",
        "speed": 6.1,
        "jump": 13.2,
        "weight": 1.08,
        "moves": {
            "neutral": {
                "name": "Gum-Gum Pistol",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Gum-Gum Bazooka",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Gum-Gum Rocket",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Gum-Gum Gatling",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "zoro",
        "name": "Roronoa Zoro",
        "franchise": "One Piece",
        "skin": "#eac09a",
        "primary": "#15803d",
        "secondary": "#111827",
        "hair": "#22c55e",
        "aura": "#22c55e",
        "desc": "Zwaardvechter die met drie zwaarden de sterkste wil worden.",
        "speed": 5.9,
        "jump": 12.3,
        "weight": 1.15,
        "moves": {
            "neutral": {
                "name": "Oni Giri",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "108 Pound Phoenix",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Drakentornado",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Asura",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "sanji",
        "name": "Sanji",
        "franchise": "One Piece",
        "skin": "#f0c5a3",
        "primary": "#171717",
        "secondary": "#1e293b",
        "hair": "#facc15",
        "aura": "#f59e0b",
        "desc": "Kok van de Straw Hats met vurige trappen en luchtacrobatiek.",
        "speed": 6.5,
        "jump": 13.4,
        "weight": 0.98,
        "moves": {
            "neutral": {
                "name": "Diable Jambe",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Collier Shoot",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Sky Walk",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Ifrit Jambe",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "usopp",
        "name": "Usopp",
        "franchise": "One Piece",
        "skin": "#b77c54",
        "primary": "#92400e",
        "secondary": "#eab308",
        "hair": "#1f2937",
        "aura": "#f59e0b",
        "desc": "Scherpschutter met zijn Kabuto-katapult en verrassende Pop Greens.",
        "speed": 5.7,
        "jump": 12.2,
        "weight": 0.94,
        "moves": {
            "neutral": {
                "name": "Kabuto-schot",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Pop Green",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Springspruit",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Exploderende ster",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "chopper",
        "name": "Tony Tony Chopper",
        "franchise": "One Piece",
        "skin": "#b7835d",
        "primary": "#ec4899",
        "secondary": "#7c3aed",
        "hair": "#78350f",
        "aura": "#f472b6",
        "desc": "De scheepsdokter verandert met zijn Rumble Ball in een sterke vechter.",
        "speed": 6,
        "jump": 13,
        "weight": 0.85,
        "scaleW": 28,
        "scaleH": 38,
        "moves": {
            "neutral": {
                "name": "Hoefslag",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Horn Point",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Jumping Point",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Monster Point",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "nami",
        "name": "Nami",
        "franchise": "One Piece",
        "skin": "#f2c09c",
        "primary": "#16a34a",
        "secondary": "#2563eb",
        "hair": "#f97316",
        "aura": "#38bdf8",
        "desc": "Navigator die het weer beheerst met haar Clima-Tact.",
        "speed": 5.9,
        "jump": 12.5,
        "weight": 0.92,
        "moves": {
            "neutral": {
                "name": "Thunderbolt Tempo",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Gust Sword",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Windlift",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Zeus Thunder",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "robin",
        "name": "Nico Robin",
        "franchise": "One Piece",
        "skin": "#e9b795",
        "primary": "#4c1d95",
        "secondary": "#1f2937",
        "hair": "#111827",
        "aura": "#a855f7",
        "desc": "Archeoloog die met haar duivelsvrucht extra ledematen laat bloeien.",
        "speed": 5.6,
        "jump": 12.2,
        "weight": 1,
        "moves": {
            "neutral": {
                "name": "Dos Fleur",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Treinta Fleur",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Wings",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Gigantesco Mano",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "brook",
        "name": "Brook",
        "franchise": "One Piece",
        "skin": "#f8fafc",
        "primary": "#111827",
        "secondary": "#f8fafc",
        "hair": "#09090b",
        "aura": "#e2e8f0",
        "desc": "Muzikale skeletzwaardvechter met ijskoude zielskrachten.",
        "speed": 6.4,
        "jump": 13.1,
        "weight": 0.86,
        "moves": {
            "neutral": {
                "name": "Soul Solid",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Hanauta Sancho",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Zielensprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Soul King",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "goku",
        "name": "Goku",
        "franchise": "Dragon Ball",
        "skin": "#eeb88b",
        "primary": "#f97316",
        "secondary": "#2563eb",
        "hair": "#171717",
        "aura": "#facc15",
        "desc": "Saiyan met ontembare vechtlust en de legendarische Kamehameha.",
        "speed": 6.2,
        "jump": 13.2,
        "weight": 1.08,
        "moves": {
            "neutral": {
                "name": "Kamehameha",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Dragon Fist",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Instant Transmission",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Spirit Bomb",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "vegeta",
        "name": "Vegeta",
        "franchise": "Dragon Ball",
        "skin": "#eeb88b",
        "primary": "#1d4ed8",
        "secondary": "#f8fafc",
        "hair": "#171717",
        "aura": "#facc15",
        "desc": "De trotse Saiyan-prins met explosieve ki-aanvallen.",
        "speed": 6.1,
        "jump": 13,
        "weight": 1.1,
        "moves": {
            "neutral": {
                "name": "Galick Gun",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Big Bang Attack",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Saiyan-vlucht",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Final Flash",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "gohan",
        "name": "Gohan",
        "franchise": "Dragon Ball",
        "skin": "#eeb88b",
        "primary": "#7c3aed",
        "secondary": "#ef4444",
        "hair": "#171717",
        "aura": "#facc15",
        "desc": "Gokus zoon ontketent zijn verborgen kracht wanneer het nodig is.",
        "speed": 6,
        "jump": 13,
        "weight": 1.06,
        "moves": {
            "neutral": {
                "name": "Masenko",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Beast Rush",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Ki-vlucht",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Special Beam Cannon",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "piccolo",
        "name": "Piccolo",
        "franchise": "Dragon Ball",
        "skin": "#65a30d",
        "primary": "#7c3aed",
        "secondary": "#db2777",
        "hair": "#365314",
        "aura": "#a3e635",
        "desc": "Namekiaanse krijger met rekbare armen en geconcentreerde ki.",
        "speed": 5.7,
        "jump": 12.8,
        "weight": 1.18,
        "moves": {
            "neutral": {
                "name": "Special Beam Cannon",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Demon Hand",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Namekiaanse vlucht",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Hellzone Grenade",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "trunks",
        "name": "Trunks",
        "franchise": "Dragon Ball",
        "skin": "#eeb88b",
        "primary": "#1d4ed8",
        "secondary": "#64748b",
        "hair": "#c4b5fd",
        "aura": "#facc15",
        "desc": "Tijdreizende Saiyan die zwaardkunst met krachtige ki combineert.",
        "speed": 6.2,
        "jump": 13,
        "weight": 1.02,
        "moves": {
            "neutral": {
                "name": "Burning Attack",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Shining Sword",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Saiyan-sprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Heat Dome Attack",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "hit",
        "name": "Hit",
        "franchise": "Dragon Ball",
        "skin": "#a78bfa",
        "primary": "#4c1d95",
        "secondary": "#312e81",
        "hair": "#6d28d9",
        "aura": "#a78bfa",
        "desc": "Koelbloedige vechter die met Time-Skip onverwacht toeslaat.",
        "speed": 6.4,
        "jump": 12.6,
        "weight": 1.04,
        "moves": {
            "neutral": {
                "name": "Flash Fist",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Time-Skip",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Tijdsprong",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Time Cage",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "frieza",
        "name": "Frieza",
        "franchise": "Dragon Ball",
        "skin": "#f8fafc",
        "primary": "#f8fafc",
        "secondary": "#7e22ce",
        "hair": "#f8fafc",
        "aura": "#c084fc",
        "desc": "Gevaarlijke keizer met precieze ki-stralen en vernietigende kracht.",
        "speed": 6.1,
        "jump": 13.2,
        "weight": 0.98,
        "moves": {
            "neutral": {
                "name": "Death Beam",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Death Slicer",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Keizervlucht",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Supernova",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "beerus",
        "name": "Beerus",
        "franchise": "Dragon Ball",
        "skin": "#a78bfa",
        "primary": "#1e293b",
        "secondary": "#38bdf8",
        "hair": "#7c3aed",
        "aura": "#a78bfa",
        "desc": "De God of Destruction gebruikt goddelijke ki en Hakai.",
        "speed": 6.3,
        "jump": 13.4,
        "weight": 1.08,
        "moves": {
            "neutral": {
                "name": "Hakai",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Goddelijke stoot",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Godenvlucht",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Sphere of Destruction",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    },
    {
        "id": "jiren",
        "name": "Jiren",
        "franchise": "Dragon Ball",
        "skin": "#9ca3af",
        "primary": "#dc2626",
        "secondary": "#171717",
        "hair": "#9ca3af",
        "aura": "#ef4444",
        "desc": "De machtige Pride Trooper overweldigt vijanden met pure kracht.",
        "speed": 5.8,
        "jump": 12.6,
        "weight": 1.3,
        "moves": {
            "neutral": {
                "name": "Power Impact",
                "desc": "Een krachtige speciale aanval voor je vechter."
            },
            "side": {
                "name": "Justice Rush",
                "desc": "Een gerichte aanval met extra zijwaarts bereik."
            },
            "up": {
                "name": "Power Rise",
                "desc": "Een speciale aanval die je omhoog lanceert."
            },
            "down": {
                "name": "Overheat Magnetron",
                "desc": "Een krachtige aanval op tegenstanders dichtbij."
            }
        }
    }
]);

window.SpecialMoves.applyRoster(ROSTER);

const selection = [ROSTER[0], ROSTER[1]];
let selectionTarget = 0;
let gameMode = 'cpu';
let activeFranchise = 'all';
let gameRunning = false;
let animationFrame = 0;
let lastFrameTime = 0;
let matchStartedAt = 0;
let matchElapsed = 0;
let fighters = [];
let currentArena = ARENAS.dojo;
const pressedKeys = new Set();
const inputSources = new Map();
const jumpRequests = [false, false];
const PLAYER_CONTROLS = [
    { left: 'KeyA', right: 'KeyD', jump: 'KeyW', shield: 'KeyS', attack: 'KeyF', super1: 'KeyG', super2: 'KeyC', pickup: 'KeyR', heal: 'KeyT' },
    { left: 'ArrowLeft', right: 'ArrowRight', jump: 'ArrowUp', shield: 'ArrowDown', attack: 'Digit1', super1: 'Digit2', super2: 'Digit3', pickup: 'Digit6', heal: 'Digit7' }
];
const GAME_KEYS = new Set([...PLAYER_CONTROLS.flatMap(controls => Object.values(controls)), 'KeyH', 'Digit4', 'KeyX', 'Digit5']);

const portraitCanvases = [
    document.getElementById('p1-portrait-canvas'),
    document.getElementById('p2-portrait-canvas')
];
const portraitViewers = new Map();
const rosterPortraitCache = new Map();
let rosterPortraitStudio = null;
const portraitMotionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
let battleRenderer = null;
let battleScene = null;
let battleCamera = null;
let battleResizeObserver = null;

function createCharacterModel(character) {
    return window.CharacterMotion.create(THREE, character);
}

function set3DPortrait(canvas, character) {
    let viewer = portraitViewers.get(canvas);
    if (!viewer) {
        try {
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setSize(canvas.width, canvas.height, false);
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(36, canvas.width / canvas.height, 0.1, 20);
            camera.position.set(0, 1.25, 4.2);
            camera.lookAt(0, 1.15, 0);
            scene.add(new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.3));
            const light = new THREE.DirectionalLight(0xffffff, 1.3);
            light.position.set(2, 4, 3);
            scene.add(light);
            const rim = new THREE.DirectionalLight(canvas.id.startsWith('p1') ? '#ff6977' : '#65b1ff', 1.5);
            rim.position.set(-3, 2, -2);
            scene.add(rim);
            viewer = { renderer, scene, camera, model: null, facing: canvas.id.startsWith('p1') ? 1 : -1 };
            portraitViewers.set(canvas, viewer);
        } catch (error) {
            console.warn('3D-portret is niet beschikbaar; er wordt een getekend portret getoond.', error);
            return false;
        }
    }
    if (viewer.model && viewer.characterId === character.id) return true;
    if (viewer.model) {
        viewer.scene.remove(viewer.model);
        disposePortraitModel(viewer.model);
    }
    viewer.model = createCharacterModel(character);
    viewer.characterId = character.id;
    viewer.model.rotation.y = viewer.facing * 0.3;
    viewer.scene.add(viewer.model);
    viewer.renderer.render(viewer.scene, viewer.camera);
    return true;
}

function animatePortraits() {
    const selectionVisible = !document.hidden && !document.getElementById('select-screen').classList.contains('hidden');
    portraitViewers.forEach((viewer) => {
        if (!viewer.model || !selectionVisible || portraitMotionPreference?.matches) { viewer.lastFrame = 0; return; }
        const now = performance.now();
        const dt = Math.min((now - (viewer.lastFrame || now)) / 1000, 0.04);
        viewer.lastFrame = now;
        window.CharacterMotion.update(viewer.model, { vx: 0, grounded: true, blocking: false, facing: 1 }, dt);
        viewer.model.rotation.y = viewer.facing * (0.3 + Math.sin(now / 2600) * 0.1);
        viewer.renderer.render(viewer.scene, viewer.camera);
    });
    requestAnimationFrame(animatePortraits);
}
requestAnimationFrame(animatePortraits);

function drawPortrait(canvas, character) {
    if (!canvas || !character) return;
    canvas.dataset.characterId = character.id;
    canvas.setAttribute('aria-label', `Portret van ${character.name}`);
    if (canvas.id.startsWith('p') && typeof THREE !== 'undefined' &&
        canvas.id.endsWith('-portrait-canvas') && set3DPortrait(canvas, character)) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.warn(`Portretcanvas kon niet worden getekend: ${canvas.id || 'rooster'}`);
        return;
    }
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    if (typeof THREE !== 'undefined') {
        try {
            if (!rosterPortraitCache.has(character.id)) {
                if (!rosterPortraitStudio) {
                    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
                    renderer.setSize(180, 180);
                    renderer.setPixelRatio(1);
                    const scene = new THREE.Scene();
                    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.7));
                    const light = new THREE.DirectionalLight(0xffffff, 1.8);
                    light.position.set(-2, 4, 5);
                    scene.add(light);
                    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
                    camera.position.set(0, 1.85, 2.9);
                    camera.lookAt(0, 1.68, 0);
                    rosterPortraitStudio = { renderer, scene, camera };
                }
                const { renderer, scene, camera } = rosterPortraitStudio;
                const model = createCharacterModel(character);
                model.rotation.y = -0.14;
                scene.add(model);
                try {
                    renderer.render(scene, camera);
                    const snapshot = document.createElement('canvas');
                    snapshot.width = snapshot.height = 180;
                    snapshot.getContext('2d').drawImage(renderer.domElement, 0, 0);
                    rosterPortraitCache.set(character.id, snapshot);
                } finally {
                    scene.remove(model);
                    disposePortraitModel(model);
                }
            }
            const glow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
            glow.addColorStop(0, character.aura);
            glow.addColorStop(1, '#10182c');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(rosterPortraitCache.get(character.id), 0, 0, width, height);
            return;
        } catch (error) {
            console.warn(`Portret voor ${character.id} kon niet worden gerenderd.`, error);
        }
    }
    ctx.fillStyle = '#17233a';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = character.aura;
    ctx.font = 'bold ' + Math.round(width * 0.24) + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character.name.split(' ').map(part => part[0]).slice(0, 2).join(''), width / 2, height / 2);
    canvas.title = '3D-portret niet beschikbaar: ' + character.name;
}

function disposePortraitModel(model) {
    const geometries = new Set();
    const materials = new Set();
    model.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
}

function updateSelectionCards() {
    selection.forEach((character, index) => {
        const prefix = `p${index + 1}`;
        document.getElementById(`${prefix}-char-name`).textContent = character.name;
        document.getElementById(`${prefix}-char-franchise`).textContent = character.franchise;
        document.getElementById(`${prefix}-char-desc`).textContent = character.desc;
        const equipment = document.getElementById(`${prefix}-equipment`);
        if (equipment) equipment.textContent = window.CombatItems.names(character.id) || 'Ongewapend';
        const throwInfo = document.getElementById(`${prefix}-throw-items`);
        if (throwInfo && window.TrowItems) throwInfo.textContent = window.TrowItems.list(character.id).map(item => item.name).join(' / ') || 'Geen werpitems';
        document.getElementById(`${prefix}-move-n`).textContent = character.moves.neutral.name;
        document.getElementById(`${prefix}-move-s`).textContent = character.moves.side.name;
        ['neutral', 'side'].forEach((direction, slot) => {
            const label = document.getElementById(`${prefix}-move-${slot === 0 ? 'n' : 's'}`);
            label.title = `${character.moves[direction].desc} Cooldown: ${character.moves[direction].cooldown}s.`;
        });
        drawPortrait(portraitCanvases[index], character);
    });

    document.getElementById('p2-role-label').textContent =
        gameMode === 'cpu' ? 'CPU TEGENSTANDER' : 'PLAYER 2';
    syncRosterSelection();
}

function syncRosterSelection() {
    document.querySelectorAll('.char-card[data-character-id]').forEach(button => {
        const p1 = button.dataset.characterId === selection[0].id;
        const p2 = button.dataset.characterId === selection[1].id;
        button.classList.toggle('selected-p1', p1);
        button.classList.toggle('selected-p2', p2);
        button.setAttribute('aria-pressed', String(p1 || p2));
        button.setAttribute('aria-label', `Kies ${button.dataset.characterName}${p1 ? ', gekozen door speler 1' : ''}${p2 ? ', gekozen door speler 2' : ''}`);
    });
}

function setSelectorTarget(target) {
    selectionTarget = target;
    document.getElementById('target-p1-btn').classList.toggle('target-active-red', target === 0);
    document.getElementById('target-p2-btn').classList.toggle('target-active-blue', target === 1);
    document.getElementById('target-p1-btn').setAttribute('aria-pressed', String(target === 0));
    document.getElementById('target-p2-btn').setAttribute('aria-pressed', String(target === 1));
    document.querySelector('.player-one').classList.toggle('is-selecting', target === 0);
    document.querySelector('.player-two').classList.toggle('is-selecting', target === 1);
    const player = target === 1 && gameMode === 'cpu' ? 'de CPU' : `speler ${target + 1}`;
    document.getElementById('selection-instruction').textContent = `Kies een personage voor ${player}`;
}

function chooseRandomCharacter(playerIndex) {
    const character = ROSTER[Math.floor(Math.random() * ROSTER.length)];
    selection[playerIndex] = character;
    updateSelectionCards();
    setSelectorTarget(playerIndex === 0 ? 1 : 0);
    const player = playerIndex === 1 && gameMode === 'cpu' ? 'CPU' : `Speler ${playerIndex + 1}`;
    document.getElementById('random-character-status').textContent = `${player}: ${character.name} willekeurig gekozen uit alle ${ROSTER.length} personages.`;
}

function buildFranchiseTabs() {
    const tabs = document.getElementById('franchise-tabs');
    tabs.replaceChildren();
    const availableFranchises = FRANCHISES.filter((franchise) =>
        franchise.key === 'all' || ROSTER.some((character) => character.franchise === franchise.key)
    );
    if (!availableFranchises.some((franchise) => franchise.key === activeFranchise)) {
        activeFranchise = 'all';
    }

    availableFranchises.forEach((franchise) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = franchise.key === 'all' ? `Alle ${ROSTER.length}` : franchise.label;
        button.classList.toggle('active', activeFranchise === franchise.key);
        button.addEventListener('click', () => {
            activeFranchise = franchise.key;
            buildFranchiseTabs();
            buildRosterUI();
        });
        tabs.append(button);
    });
}

function buildRosterUI() {
    const grid = document.getElementById('roster-grid');
    grid.replaceChildren();
    const characters = activeFranchise === 'all'
        ? ROSTER
        : ROSTER.filter((character) => character.franchise === activeFranchise);

    characters.forEach((character) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'char-card';
        button.dataset.characterId = character.id;
        button.dataset.characterName = character.name;
        button.title = `${character.name} — ${character.franchise}`;
        button.setAttribute('aria-label', `Kies ${character.name}`);
        const portrait = document.createElement('canvas');
        portrait.width = 100;
        portrait.height = 100;
        drawPortrait(portrait, character);
        const name = document.createElement('span');
        name.textContent = character.name;
        button.append(portrait, name);
        button.addEventListener('click', () => {
            selection[selectionTarget] = character;
            document.getElementById('random-character-status').textContent = '';
            updateSelectionCards();
            setSelectorTarget(selectionTarget === 0 ? 1 : 0);
        });
        grid.append(button);
    });
    syncRosterSelection();
}

function setGameMode(mode) {
    gameMode = mode;
    window.TouchControls?.updateMode(mode === '2p');
    document.getElementById('random-character-status').textContent = '';
    document.getElementById('mode-cpu-btn').classList.toggle('active', mode === 'cpu');
    document.getElementById('mode-2p-btn').classList.toggle('active', mode === '2p');
    document.getElementById('cpu-diff-wrapper').classList.toggle('hidden', mode !== 'cpu');
    updateSelectionCards();
    setSelectorTarget(selectionTarget);
}

function makeFighter(character, playerIndex) {
    const requestedStocks = Number(document.getElementById(`p${playerIndex + 1}-stocks-select`).value);
    const stocks = requestedStocks === 5 ? 5 : 3;
    return {
        character,
        model: createCharacterModel(character),
        playerIndex,
        damageMultiplier: gameMode === 'cpu' && playerIndex === 1 ? 0.8 : 1,
        x: playerIndex === 0 ? 330 : 630,
        y: 180,
        vx: 0,
        vy: 0,
        grounded: false,
        coyoteTime: 0,
        jumpBuffer: 0,
        dropThroughTimer: 0,
        width: character.scaleW || 34,
        height: character.scaleH || 48,
        stocks,
        maxStocks: stocks,
        damage: 0,
        get health() { return window.BattleRules.health(this); },
        defeats: 0,
        healingItem: null,
        healthRestored: 0,
        facing: playerIndex === 0 ? 1 : -1,
        attackCooldown: 0,
        specialCooldowns: [0, 0],
        blocking: false,
        invulnerable: 1.2,
        attacks: 0,
        hits: 0,
        knockouts: 0
    };
}

function setBattleFocus(active) {
    document.documentElement?.classList.toggle('battle-active', active);
    document.body?.classList.toggle('battle-active', active);
    const options = document.querySelector?.('.battle-options');
    if (options) options.open = false;
}

function startMatch() {
    window.ArenaMusic?.stop();
    if (typeof THREE === 'undefined') {
        window.alert('De 3D-engine kan niet worden geladen. Controleer je internetverbinding en laad de pagina opnieuw.');
        return;
    }
    cancelAnimationFrame(animationFrame);
    window.SpecialMoves.reset();
    window.CombatActions?.reset();
    window.TrowItems?.reset();
    window.HealingItems?.reset();
    resetGameInput();
    currentArena = ARENAS[document.getElementById('arena-select').value] || ARENAS.dojo;
    fighters = [makeFighter(selection[0], 0), makeFighter(selection[1], 1)];
    gameRunning = true;
    matchElapsed = 0;
    document.getElementById('select-screen').classList.add('hidden');
    document.getElementById('arena-screen').classList.remove('hidden');
    setBattleFocus(true);
    document.getElementById('result-overlay').classList.add('hidden');
    document.getElementById('arena-note').textContent =
        `${currentArena.name} · Maximaal 3 minuten · 100% gezondheid per leven · Geen levens meer? Dan is het gevecht voorbij.`;
    document.getElementById('p1-hud-name').textContent = selection[0].name;
    document.getElementById('p2-hud-name').textContent = selection[1].name;
    document.getElementById('p2-hud-role').textContent = gameMode === 'cpu' ? 'CPU' : 'PLAYER 2';
    selection.forEach((character, index) => drawPortrait(document.getElementById(`p${index + 1}-hud-portrait`), character));
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 960;
    canvas.height = 540;
    try {
        initBattleScene(canvas);
    } catch (error) {
        gameRunning = false;
        console.error('De 3D-arena kon niet worden gestart.', error);
        setBattleFocus(false);
        document.getElementById('arena-screen').classList.add('hidden');
        document.getElementById('select-screen').classList.remove('hidden');
        window.alert('De 3D-arena kon niet starten. Controleer of WebGL in je browser is ingeschakeld.');
        return;
    }
    matchStartedAt = performance.now();
    lastFrameTime = matchStartedAt;
    updateBattleHud();
    window.ArenaMusic?.start(document.getElementById('arena-select').value);
    animationFrame = requestAnimationFrame(battleLoop);
}

function initBattleScene(canvas) {
    const touchDevice = window.matchMedia?.('(any-pointer: coarse)').matches || false;
    if (!battleRenderer) {
        battleRenderer = new THREE.WebGLRenderer({ canvas, antialias: !touchDevice });
        battleRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touchDevice ? 1.5 : 2));
        battleRenderer.outputEncoding = THREE.sRGBEncoding;
        battleRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        battleRenderer.toneMappingExposure = 1;
        battleRenderer.shadowMap.enabled = true;
        battleRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    battleScene = new THREE.Scene();
    if (!battleResizeObserver && typeof ResizeObserver !== 'undefined') {
        battleResizeObserver = new ResizeObserver(resizeBattleRenderer);
        battleResizeObserver.observe(canvas);
    }
    battleScene.background = new THREE.Color(currentArena.bgBottom);
    battleScene.fog = new THREE.Fog(currentArena.bgBottom, 13, 30);

    battleCamera = new THREE.PerspectiveCamera(42, canvas.width / canvas.height, 0.1, 80);
    battleCamera.position.set(0, 6, 15);
    battleCamera.lookAt(0, 2.5, 0);

    battleScene.add(new THREE.HemisphereLight(0xffffff, currentArena.ambientColor || 0x77766e, 1.3));
    const keyLight = new THREE.DirectionalLight(currentArena.sunColor || 0xffffff, currentArena.sunColor ? 1.6 : 2);
    keyLight.position.set(-4, 9, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(touchDevice ? 512 : 1024, touchDevice ? 512 : 1024);
    Object.assign(keyLight.shadow.camera, { left: -16, right: 16, top: 16, bottom: -8, near: 0.5, far: 50 });
    keyLight.shadow.normalBias = 0.04;
    keyLight.shadow.bias = -0.0003;
    battleScene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(currentArena.sunColor || 0xffffff, currentArena.sunColor ? 1.1 : 0.35);
    rimLight.position.set(5, 6, -10);
    battleScene.add(rimLight);

    const accent = new THREE.Color(currentArena.accentColor);
    currentArena.platforms.forEach((platform) => {
        const width = platform.w / 65;
        const top = (540 - platform.y) / 65;
        const material = new THREE.MeshStandardMaterial({
            color: currentArena.surface || (platform.main ? '#202b42' : '#28334d'),
            emissive: accent,
            emissiveIntensity: 0.025,
            roughness: 0.84,
            map: window.AnimeMaps.surfaceTexture(THREE, currentArena.surfaceType || 'stone'),
            bumpMap: window.AnimeMaps.surfaceTexture(THREE, currentArena.surfaceType || 'stone'),
            bumpScale: 0.045
        });
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.22, 2.2), material);
        mesh.position.set((platform.x + platform.w / 2 - 480) / 65, top - 0.11, 0);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        battleScene.add(mesh);

        const foundation = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.98, platform.main ? 0.48 : 0.28, 2.05),
            new THREE.MeshStandardMaterial({ color: currentArena.surface, roughness: 0.95,
                map: window.AnimeMaps.surfaceTexture(THREE, 'rock'),
                bumpMap: window.AnimeMaps.surfaceTexture(THREE, 'rock'), bumpScale: 0.12 })
        );
        foundation.position.set(mesh.position.x, top - (platform.main ? 0.43 : 0.33), 0);
        foundation.castShadow = foundation.receiveShadow = true;
        battleScene.add(foundation);

        const edge = new THREE.Mesh(
            new THREE.BoxGeometry(width, 0.045, 2.24),
            new THREE.MeshBasicMaterial({ color: accent })
        );
        edge.position.set(mesh.position.x, top - 0.01, 0);
        battleScene.add(edge);
    });

    window.AnimeMaps.buildScenery(THREE, battleScene, document.getElementById('arena-select').value);

    fighters.forEach((fighter) => {
        fighter.model.traverse(part => { if (part.isMesh) part.castShadow = part.receiveShadow = true; });
        battleScene.add(fighter.model);
    });
    window.HealingItems?.init({ THREE, scene: battleScene, platforms: currentArena.platforms, fighters,
        arenaKey: document.getElementById('arena-select').value,
        onNotice: message => { document.getElementById('arena-note').textContent = message; } });
    resizeBattleRenderer();
}

function resizeBattleRenderer() {
    if (!battleRenderer || !battleCamera) return;
    const canvas = battleRenderer.domElement;
    const width = canvas.clientWidth || 960;
    const height = canvas.clientHeight || 540;
    battleRenderer.setSize(width, height, false);
    battleCamera.aspect = width / height;
    // Preserve the horizontal arena view when the viewport is tall and narrow.
    const portraitScale = Math.max(1, (16 / 9) / battleCamera.aspect);
    battleCamera.fov = 2 * Math.atan(Math.tan(42 * Math.PI / 360) * portraitScale) * 180 / Math.PI;
    battleCamera.updateProjectionMatrix();
}

function performThrow(owner, target) {
    if (!window.TrowItems) return;
    const controls = PLAYER_CONTROLS[owner.playerIndex];
    if (pressedKeys.has(controls.left)) owner.facing = -1;
    if (pressedKeys.has(controls.right)) owner.facing = 1;
    window.TrowItems.fire({ THREE, scene: battleScene, owner, target, platforms: currentArena.platforms,
        isShielded: isFighterShielded, onNotice: text => { document.getElementById('arena-note').textContent = text; } });
}

function isFighterShielded(fighter) {
    return (fighter.playerIndex === 0 || gameMode === '2p') && pressedKeys.has(PLAYER_CONTROLS[fighter.playerIndex].shield);
}

function performAttack(attacker, target, isSpecial, specialMove = 'neutral') {
    const controls = PLAYER_CONTROLS[attacker.playerIndex];
    const status = window.SpecialMoves.prepare(attacker);
    if (status.stun > 0 || isFighterShielded(attacker)) return;
    if (pressedKeys.has(controls.left)) attacker.facing = -1;
    if (pressedKeys.has(controls.right)) attacker.facing = 1;
    if (isSpecial) {
        window.SpecialMoves.cast({
            THREE, scene: battleScene, owner: attacker, target, slot: specialMove === 'side' ? 1 : 0,
            isShielded: isFighterShielded,
            onNotice: message => { document.getElementById('arena-note').textContent = message; },
            onHit: battleScene.userData.reactFrogSages && (() => {
                battleScene.userData.reactFrogSages(matchElapsed);
                document.getElementById('arena-note').textContent = 'Fukasaku en Shima: “Bagga!”';
            })
        });
        return;
    }
    if (window.CombatActions && window.CombatItems.list(attacker.character.id).length) {
        window.CombatActions.attack({ THREE, scene: battleScene, owner: attacker, target, isShielded: isFighterShielded,
            onNotice: message => { document.getElementById('arena-note').textContent = message; } });
        return;
    }
    if (attacker.attackCooldown > 0) return;
    attacker.attackCooldown = 0.48;
    attacker.attacks++;
    window.CharacterMotion.attack(attacker.model, 'punch');
    const distanceX = Math.abs(attacker.x + attacker.width / 2 - target.x - target.width / 2);
    const distanceY = Math.abs(attacker.y + attacker.height / 2 - target.y - target.height / 2);
    if (distanceX > (status.buff > 0 ? 110 : 82) || distanceY > 82 || target.invulnerable > 0) return;
    const shielding = isFighterShielded(target);
    const targetStatus = window.SpecialMoves.prepare(target);
    target.damage += 8 * (attacker.damageMultiplier ?? 1) * (status.buff > 0 ? 1.3 : 1) * (targetStatus.armor > 0 ? 0.65 : 1) * (shielding ? 0.25 : 1);
    const direction = Math.sign(target.x - attacker.x) || attacker.facing;
    target.vx = direction * (4.5 + target.damage / 18) * (shielding ? 0.35 : 1);
    target.vy = shielding ? -2 : -4;
    target.invulnerable = 0.5;
    attacker.hits++;
    updateBattleHud();
}

function loseStock(fighter) {
    window.SpecialMoves.clearFighter(fighter);
    window.CombatActions?.clearFighter(fighter);
    window.TrowItems?.clearFighter(fighter);
    window.HealingItems?.clearFighter(fighter);
    fighter.weaponSlow = 0;
    fighter.defeats++;
    fighter.stocks = Math.max(0, fighter.maxStocks - fighter.defeats);
    fighters[1 - fighter.playerIndex].knockouts++;
    if (fighter.stocks === 0) {
        fighter.damage = 100;
        fighter.model.visible = false;
        return;
    }
    fighter.damage = 0;

    fighter.x = fighter.playerIndex === 0 ? 330 : 630;
    fighter.y = 125;
    fighter.vx = 0;
    fighter.vy = 0;
    fighter.grounded = false;
    fighter.dropThroughTimer = 0;
    fighter.coyoteTime = 0;
    fighter.jumpBuffer = 0;
    fighter.invulnerable = 2;
    fighter.blocking = false;
    fighter.attackCooldown = 0;
    fighter.specialCooldowns.fill(0);
    fighter.model.visible = true;
    fighter.model.position.set((fighter.x + fighter.width / 2 - 480) / 65, (540 - fighter.y - fighter.height) / 65, 0);
    updateBattleHud();
}

function finishMatch(winner, reason = 'time') {
    resetGameInput();
    window.ArenaMusic?.stop();
    window.SpecialMoves.reset();
    window.CombatActions?.reset();
    window.TrowItems?.reset();
    window.HealingItems?.reset();
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    const elapsed = Math.floor(matchElapsed);
    document.getElementById('result-winner').textContent = winner ? `${winner.character.name} wint!` : 'Gelijkspel!';
    document.getElementById('result-subtitle').textContent =
        reason === 'elimination'
            ? (winner ? 'De tegenstander heeft geen levens meer over.' : 'Beide spelers zijn tegelijk hun laatste leven kwijt.')
            : (winner ? 'Tijd om! Meeste resterende levens wint; bij gelijke levens telt de gezondheid.' : 'Tijd om! Beide spelers hebben evenveel levens en gezondheid.');
    document.getElementById('result-duration').textContent =
        `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
    fighters.forEach((fighter, index) => {
        document.getElementById(`result-p${index + 1}-name`).textContent = fighter.character.name;
        document.getElementById(`result-p${index + 1}-stats`).innerHTML =
            `<span>Levens over <b>${fighter.stocks}</b></span>` +
            `<span>Gezondheid <b>${Math.ceil(fighter.health)}%</b></span>` +
            `<span>HP hersteld <b>${Math.round(fighter.healthRestored || 0)}</b></span>` +
            `<span>Aanvallen <b>${fighter.attacks}</b></span>` +
            `<span>Treffers <b>${fighter.hits}</b></span>` +
            `<span>Uitschakelingen <b>${fighter.knockouts}</b></span>`;
    });
    document.getElementById('result-overlay').classList.remove('hidden');
}

function replayMatch() {
    startMatch();
}

function returnToSelection() {
    setBattleFocus(false);
    window.ArenaMusic?.stop();
    window.SpecialMoves.reset();
    window.CombatActions?.reset();
    window.TrowItems?.reset();
    window.HealingItems?.reset();
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    resetGameInput();
    document.getElementById('result-overlay').classList.add('hidden');
    document.getElementById('arena-screen').classList.add('hidden');
    document.getElementById('select-screen').classList.remove('hidden');
}

function returnToHome() {
    returnToSelection();
    location.href = 'index.html';
}

function updateFighter(fighter, target, dt) {
    window.SpecialMoves.tickFighter(fighter, dt);
    window.TrowItems?.tickFighter(fighter, dt);
    const specialStatus = fighter.specialStatus;
    fighter.weaponSlow = Math.max(0, (fighter.weaponSlow || 0) - dt);
    const isPlayerOne = fighter.playerIndex === 0;
    const { left: leftKey, right: rightKey, shield: shieldKey } = PLAYER_CONTROLS[fighter.playerIndex];
    const isCpu = gameMode === 'cpu' && !isPlayerOne;
    fighter.coyoteTime = fighter.grounded ? 0.1 : Math.max(0, (fighter.coyoteTime || 0) - dt);
    fighter.jumpBuffer = Math.max(0, (fighter.jumpBuffer || 0) - dt);
    if (!isCpu && jumpRequests[fighter.playerIndex]) fighter.jumpBuffer = 0.12;
    let move = 0;
    fighter.blocking = !isCpu && pressedKeys.has(shieldKey);

    if (isCpu && specialStatus.stun <= 0) {
        const difficulty = document.getElementById('cpu-diff-select').value;
        const attackRange = difficulty === 'hard' ? 122 : difficulty === 'easy' ? 78 : 100;
        const attackChance = difficulty === 'hard' ? 0.075 : difficulty === 'easy' ? 0.02 : 0.045;
        const specialChance = difficulty === 'hard' ? 0.016 : difficulty === 'easy' ? 0.003 : 0.008;
        const distance = target.x - fighter.x;
        if (Math.abs(distance) > 66) move = Math.sign(distance);
        if (Math.abs(distance) < attackRange && fighter.attackCooldown <= 0 && Math.random() < attackChance) {
            performAttack(fighter, target, false);
        }
        if (Math.abs(distance) < attackRange + 40 && fighter.specialCooldowns.some(time => time <= 0) && Math.random() < specialChance) {
            const availableSlots = fighter.specialCooldowns.map((time, slot) => time <= 0 ? slot : -1).filter(slot => slot >= 0);
            const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            performAttack(fighter, target, true, slot === 0 ? 'neutral' : 'side');
        }
        if (Math.abs(distance) > 90 && Math.abs(distance) < 600 && Math.random() < 0.008) performThrow(fighter, target);
        if (fighter.grounded && Math.random() < 0.025) {
            fighter.vy = -window.BattleRules.jumpVelocity(fighter.character);
            fighter.grounded = false;
            fighter.coyoteTime = 0;
        }
    } else if (!isCpu && specialStatus.stun <= 0) {
        if (!fighter.blocking && pressedKeys.has(leftKey)) move--;
        if (!fighter.blocking && pressedKeys.has(rightKey)) move++;
        if (fighter.jumpBuffer > 0 && (fighter.grounded || fighter.coyoteTime > 0) && !fighter.blocking) {
            fighter.vy = -window.BattleRules.jumpVelocity(fighter.character);
            fighter.grounded = false;
            fighter.coyoteTime = 0;
            fighter.jumpBuffer = 0;
        }
    }

    if (move) fighter.facing = move;
    const difficulty = isCpu ? document.getElementById('cpu-diff-select').value : 'normal';
    const speedFactor = difficulty === 'hard' ? 1 : difficulty === 'easy' ? 0.75 : 0.9;
    const speed = (fighter.character.speed || 5.5) * (isCpu ? speedFactor : 1) * (specialStatus.buff > 0 ? 1.2 : 1) * (fighter.weaponSlow > 0 ? 0.65 : 1);
    if (specialStatus.stun > 0) fighter.vx *= Math.exp(-dt * 15);
    else if (specialStatus.dash > 0) fighter.vx = specialStatus.dashSpeed;
    else fighter.vx += (move * speed - fighter.vx) * Math.min(1, dt * 12);
    if (!move && specialStatus.dash <= 0) fighter.vx *= Math.pow(0.82, dt * 60);
    fighter.x += fighter.vx * dt * 18;
    const previousFeet = fighter.y + fighter.height;
    fighter.vy += 23 * dt;
    fighter.y += fighter.vy * dt * 18;
    fighter.attackCooldown = Math.max(0, fighter.attackCooldown - dt);
    fighter.invulnerable = Math.max(0, fighter.invulnerable - dt);
    fighter.dropThroughTimer = Math.max(0, fighter.dropThroughTimer - dt);

    fighter.grounded = false;
    let landing = null;
    for (const platform of currentArena.platforms) {
        const feet = fighter.y + fighter.height;
        if (fighter.dropThroughTimer === 0 && fighter.vy >= 0 &&
            feet >= platform.y && previousFeet <= platform.y &&
            fighter.x + fighter.width > platform.x && fighter.x < platform.x + platform.w) {
            if (!landing || platform.y < landing.y) landing = platform;
        }
    }
    if (landing) {
        fighter.y = landing.y - fighter.height;
        fighter.vy = 0;
        fighter.grounded = true;
    }
    fighter.model.position.set(
        (fighter.x + fighter.width / 2 - 480) / 65,
        (540 - fighter.y - fighter.height) / 65,
        0
    );
    window.CharacterMotion.update(fighter.model, fighter, dt);
    if (fighter.model.userData.shield) fighter.model.userData.shield.visible = fighter.blocking;
    fighter.model.visible = fighter.invulnerable <= 0 || Math.floor(performance.now() / 90) % 2 === 0;
}

function drawBattle() {
    if (!battleRenderer || !battleScene || !battleCamera) return;
    const midpointX = (fighters[0].model.position.x + fighters[1].model.position.x) / 2;
    const midpointY = Math.max(2.2, (fighters[0].model.position.y + fighters[1].model.position.y) / 2 + 1.4);
    const distance = Math.abs(fighters[0].model.position.x - fighters[1].model.position.x);
    const cameraZ = Math.min(20, Math.max(13, 12 + distance * 0.55));
    battleCamera.position.x += (midpointX - battleCamera.position.x) * 0.08;
    battleCamera.position.y += (midpointY + 2.8 - battleCamera.position.y) * 0.08;
    battleCamera.position.z += (cameraZ - battleCamera.position.z) * 0.08;
    battleCamera.lookAt(midpointX, midpointY, 0);
    battleRenderer.render(battleScene, battleCamera);
}

function battleLoop(now) {
    if (!gameRunning) return;
    const dt = Math.min((now - lastFrameTime) / 1000, 0.04);
    lastFrameTime = now;
    matchElapsed = Math.min(window.BattleRules.durationSeconds, Math.max(0, (now - matchStartedAt) / 1000));
    updateFighter(fighters[0], fighters[1], dt);
    jumpRequests[0] = false;
    if (gameRunning) updateFighter(fighters[1], fighters[0], dt);
    jumpRequests[1] = false;
    if (gameRunning) {
        window.SpecialMoves.update(dt);
        window.CombatActions?.update(dt);
        window.TrowItems?.update(dt);
        window.HealingItems?.update(dt, matchElapsed);
        if (gameMode === 'cpu') window.HealingItems?.controlCPU(fighters[1]);
        // Resolve both fighters after all damage sources, including simultaneous KOs.
        const defeated = fighters.filter(fighter => window.BattleRules.isDefeated(fighter));
        defeated.forEach(loseStock);
        window.AnimeMaps.updateScenery(battleScene, (now - matchStartedAt) / 1000);
        drawBattle();
        updateBattleHud();
        if (fighters.some(fighter => fighter.stocks === 0)) {
            finishMatch(window.BattleRules.chooseWinner(fighters), 'elimination');
            return;
        }
        if (matchElapsed >= window.BattleRules.durationSeconds) {
            finishMatch(window.BattleRules.chooseWinner(fighters));
            return;
        }
        animationFrame = requestAnimationFrame(battleLoop);
    }
}

function updateBattleHud() {
    const elapsed = Math.max(0, Math.ceil(window.BattleRules.durationSeconds - matchElapsed));
    const clock = document.getElementById('battle-clock');
    const time = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
    if (clock.textContent !== time) clock.textContent = time;
    fighters.forEach((fighter, index) => {
        const prefix = `p${index + 1}`;
        const healingLabel = document.getElementById(`${prefix}-healing-label`);
        const healingImage = document.getElementById(`${prefix}-healing-image`);
        if (healingLabel && window.HealingItems) {
            const item = fighter.healingItem, close = window.HealingItems.nearby(fighter);
            const pickupKey = index === 0 ? 'R' : '6', useKey = index === 0 ? 'T' : '7';
            const message = item ? `${item.name} · +${item.heal} HP · ${useKey}: gebruiken`
                : close ? `${close.name} · ${pickupKey}: oppakken` : `${pickupKey}: oppakken · ${useKey}: gebruiken · Leeg`;
            if (healingLabel.textContent !== message) healingLabel.textContent = message;
            if (healingImage) {
                if (item && healingImage.dataset.itemId !== item.id) {
                    healingImage.src = item.image; healingImage.alt = item.name; healingImage.dataset.itemId = item.id;
                }
                healingImage.hidden = !item;
            }
        }
        const label = document.getElementById(`${prefix}-hud-stats`);
        const ammo = document.getElementById(`${prefix}-throw-ammo`);
        if (ammo && window.TrowItems) {
            const text = (index === 0 ? 'X: ' : '5: ') + window.TrowItems.label(fighter);
            if (ammo.textContent !== text) ammo.textContent = text;
            ammo.classList.toggle('reloading', (fighter.throwState?.reload || 0) > 0);
        }
        const stocks = Math.max(0, fighter.stocks);
        const health = fighter.health;
        const text = `${stocks} ${stocks === 1 ? 'leven' : 'levens'} · ${Math.ceil(health)}% leven`;
        if (label.textContent !== text) {
            label.textContent = text;
            label.setAttribute('data-compact', `${stocks} ♥ · ${Math.ceil(health)}%`);
        }
        const weapon = window.CombatActions?.equipped(fighter);
        label.title = weapon ? `Wapen: ${weapon.name}` : 'Ongewapend';
        const meter = document.getElementById(`${prefix}-stock-meter`);
        meter.setAttribute('aria-valuemax', '100');
        meter.setAttribute('aria-valuenow', String(Math.round(health)));
        meter.classList.toggle('health-low', health <= 25);
        document.getElementById(`${prefix}-stock-fill`).style.width = `${health}%`;
        ['neutral', 'side'].forEach((direction, slot) => {
            const cooldown = fighter.character.moves[direction].cooldown || 1;
            const remaining = Math.max(0, fighter.specialCooldowns[slot]);
            const ready = Math.max(0, Math.min(100, (1 - remaining / cooldown) * 100));
            const bar = document.getElementById(`${prefix}-super-${slot}`);
            bar.style.setProperty('--ready', `${ready}%`);
            bar.classList.toggle('is-ready', remaining <= 0);
            bar.setAttribute('aria-valuenow', String(Math.round(ready)));
            bar.setAttribute('aria-valuetext', remaining <= 0 ? 'Klaar' : `Nog ${Math.ceil(remaining)} seconden`);
            bar.title = `${fighter.character.moves[direction].name}: ${window.SpecialMoves.cooldownLabel(fighter, slot)}`;
            const caption = document.getElementById(`${prefix}-super-${slot}-label`);
            const text = `S${slot + 1} ${remaining <= 0 ? 'klaar' : `${Math.ceil(remaining)}s`}`;
            if (caption.textContent !== text) caption.textContent = text;
        });
    });
}

window.addEventListener('resize', resizeBattleRenderer);
function normalizeGameKey(code) {
    if (code === 'KeyQ') return 'KeyG';
    if (code === 'KeyE') return 'KeyC';
    return /^Numpad[1-7]$/.test(code) ? code.replace('Numpad', 'Digit') : code;
}

function pressGameInput(rawCode, source, repeat = false) {
    if (!gameRunning) return;
    const code = normalizeGameKey(rawCode);
    if (!GAME_KEYS.has(code) || repeat || inputSources.has(source)) return;
    inputSources.set(source, code);
    pressedKeys.add(code);
    PLAYER_CONTROLS.forEach((controls, index) => {
        if (index === 1 && gameMode !== '2p') return;
        if (code === controls.pickup) window.HealingItems?.pickup(fighters[index]);
        if (code === controls.heal) window.HealingItems?.use(fighters[index]);
        if (code === (index === 0 ? 'KeyH' : 'Digit4') && window.CombatActions?.cycle(fighters[index])) {
            document.getElementById('arena-note').textContent = window.CombatActions.equipped(fighters[index]).name;
        }
        if (code === (index === 0 ? 'KeyX' : 'Digit5')) performThrow(fighters[index], fighters[1 - index]);
        if (code === controls.jump) jumpRequests[index] = true;
        if (code === controls.attack) performAttack(fighters[index], fighters[1 - index], false);
        if (code === controls.super1) performAttack(fighters[index], fighters[1 - index], true, 'neutral');
        if (code === controls.super2) performAttack(fighters[index], fighters[1 - index], true, 'side');
    });
}
function releaseGameInput(source) {
    const code = inputSources.get(source);
    inputSources.delete(source);
    if (code && !Array.from(inputSources.values()).includes(code)) pressedKeys.delete(code);
}
function resetGameInput() {
    inputSources.clear();
    pressedKeys.clear();
    jumpRequests.fill(false);
    window.TouchControls?.reset();
}
window.addEventListener('keydown', event => {
    if (!gameRunning || event.target?.matches('input, select, textarea')) return;
    const code = normalizeGameKey(event.code);
    if (!GAME_KEYS.has(code)) return;
    event.preventDefault();
    pressGameInput(code, `keyboard:${code}`, event.repeat);
});
window.addEventListener('keyup', event => releaseGameInput(`keyboard:${normalizeGameKey(event.code)}`));
window.addEventListener('blur', resetGameInput);
document.addEventListener('visibilitychange', () => { if (document.hidden) resetGameInput(); });
document.addEventListener('DOMContentLoaded', () => {
    window.TouchControls?.init({ press: pressGameInput, release: releaseGameInput, isRunning: () => gameRunning });
    window.TouchControls?.updateMode(gameMode === '2p');
    document.getElementById('roster-grid').addEventListener('keydown', event => {
        if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
        const cards = Array.from(event.currentTarget.querySelectorAll('.char-card'));
        const index = cards.indexOf(event.target);
        if (index < 0) return;
        event.preventDefault();
        const columns = getComputedStyle(event.currentTarget).gridTemplateColumns.split(' ').filter(Boolean).length;
        const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns }[event.key];
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : Math.max(0, Math.min(cards.length - 1, index + offset));
        cards[next].focus();
    });
    document.querySelectorAll('[data-random-player]').forEach(button => {
        button.addEventListener('click', () => chooseRandomCharacter(Number(button.dataset.randomPlayer)));
    });
    document.getElementById('roster-count').textContent = `${ROSTER.length} HELDEN · ${new Set(ROSTER.map(character => character.franchise)).size} WERELDEN`;
    document.getElementById('target-p1-btn').addEventListener('click', () => setSelectorTarget(0));
    document.getElementById('target-p2-btn').addEventListener('click', () => setSelectorTarget(1));
    document.getElementById('mode-cpu-btn').addEventListener('click', () => setGameMode('cpu'));
    document.getElementById('mode-2p-btn').addEventListener('click', () => setGameMode('2p'));
    buildFranchiseTabs();
    buildRosterUI();
    updateSelectionCards();
    setSelectorTarget(0);
});
