// =========================================================================
// 1. FRANCHISES, ARENAS & ALL 30 CHARACTERS ROSTER DATA
// =========================================================================
const FRANCHISES = [
    { key: 'all', label: 'Alle 30' },
    { key: 'Jujutsu Kaisen', label: 'Jujutsu Kaisen' },
    { key: 'Solo Leveling', label: 'Solo Leveling' },
    { key: 'My Hero Academia', label: 'My Hero Academia' },
    { key: 'Black Clover', label: 'Black Clover' },
    { key: 'Demon Slayer', label: 'Demon Slayer' },
    { key: 'Fairy Tail', label: 'Fairy Tail' },
    { key: 'Sonic', label: 'Sonic' },
    { key: 'Mario', label: 'Mario' },
    { key: 'Final Fantasy', label: 'Final Fantasy' },
    { key: 'Chainsaw Man', label: 'Chainsaw Man' }
];

const ARENAS = {
    dojo: {
        name: 'Anime Dojo',
        bgTop: '#1e1b4b',
        bgBottom: '#0f172a',
        accentColor: '#f59e0b',
        platforms: [
            { x: 180, y: 420, w: 600, main: true },
            { x: 230, y: 310, w: 160, main: false },
            { x: 570, y: 310, w: 160, main: false },
            { x: 400, y: 215, w: 160, main: false }
        ]
    },
    castle: {
        name: 'Schaduw Kasteel',
        bgTop: '#2e1065',
        bgBottom: '#090d16',
        accentColor: '#a855f7',
        platforms: [
            { x: 160, y: 430, w: 640, main: true },
            { x: 210, y: 305, w: 180, main: false },
            { x: 570, y: 305, w: 180, main: false }
        ]
    },
    island: {
        name: 'Zwevend Eiland',
        bgTop: '#0369a1',
        bgBottom: '#0f172a',
        accentColor: '#38bdf8',
        platforms: [
            { x: 210, y: 425, w: 540, main: true },
            { x: 120, y: 325, w: 140, main: false },
            { x: 700, y: 325, w: 140, main: false },
            { x: 410, y: 240, w: 140, main: false }
        ]
    },
    neon: {
        name: 'Neon Stad',
        bgTop: '#311042',
        bgBottom: '#090d16',
        accentColor: '#f43f5e',
        platforms: [
            { x: 150, y: 420, w: 660, main: true },
            { x: 280, y: 315, w: 400, main: false },
            { x: 410, y: 210, w: 140, main: false }
        ]
    }
};

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
        id: 'shadow', name: 'Shadow', franchise: 'Sonic',
        desc: 'De duistere egel met Chaos Spears en tijdvertraging.',
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
        id: 'bowser', name: 'Mario', franchise: 'Mario',
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
        moves: {
            neutral: { name: 'Kettingzaag-Zwaai', desc: 'Zwaait wild met beide kettingzagen' },
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

// =========================================================================
// 3. THREE.JS 3D ANIME CHARACTER BUILDER & ENGINE
// =========================================================================
const ASSET_PATHS = {
    characters: 'assest/carakters/',
    maps: 'assest/maps/',
    items: 'assest/items/'
};

const gltfLoader = (typeof THREE !== 'undefined' && THREE.GLTFLoader && window.location.protocol.startsWith('http')) ? new THREE.GLTFLoader() : null;
const loadedGLBTemplates = {};
const failedGLBPaths = {};

function loadExternalCharacterGLB(charId, onLoadedCallback) {
    const path = `${ASSET_PATHS.characters}${charId}.glb`;
    if (!gltfLoader || failedGLBPaths[path]) return;

    if (loadedGLBTemplates[path]) {
        onLoadedCallback(loadedGLBTemplates[path].clone());
        return;
    }

    try {
        gltfLoader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                const box = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                box.getSize(size);
                if (size.y > 0) {
                    const scale = 1.95 / size.y;
                    model.scale.setScalar(scale);
                }
                const scaledBox = new THREE.Box3().setFromObject(model);
                const center = new THREE.Vector3();
                scaledBox.getCenter(center);
                model.position.set(-center.x, -scaledBox.min.y, -center.z);

                const wrapper = new THREE.Group();
                wrapper.add(model);
                loadedGLBTemplates[path] = wrapper;
                onLoadedCallback(wrapper.clone());
            },
            undefined,
            () => { failedGLBPaths[path] = true; }
        );
    } catch (err) {
        failedGLBPaths[path] = true;
    }
}

const toonGradientMap = (() => {
    const c = document.createElement('canvas');
    c.width = 4; c.height = 1;
    const g = c.getContext('2d');
    g.fillStyle = '#555555'; g.fillRect(0, 0, 1, 1);
    g.fillStyle = '#aaaaaa'; g.fillRect(1, 0, 1, 1);
    g.fillStyle = '#e5e5e5'; g.fillRect(2, 0, 1, 1);
    g.fillStyle = '#ffffff'; g.fillRect(3, 0, 1, 1);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    return tex;
})();

function makeToonMat(hexColor, emissiveHex = null, emissiveInt = 0.25) {
    const params = { color: new THREE.Color(hexColor), gradientMap: toonGradientMap };
    if (emissiveHex) {
        params.emissive = new THREE.Color(emissiveHex);
        params.emissiveIntensity = emissiveInt;
    }
    return new THREE.MeshToonMaterial(params);
}

function addCelOutline(mesh, scale = 1.06) {
    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x090d16, side: THREE.BackSide });
    const outline = new THREE.Mesh(mesh.geometry, outlineMat);
    outline.scale.set(scale, scale, scale);
    mesh.add(outline);
    return mesh;
}

function create3DAnimeCharacter(charData, onExternalModelLoaded = null) {
    const root = new THREE.Group();
    const isHeavy = (charData.id === 'bowser' || charData.id === 'dk');
    const isCompact = ['sonic', 'shadow', 'knuckles', 'mario', 'nezuko'].includes(charData.id);

    const skinMat = makeToonMat(charData.skin);
    const primaryMat = makeToonMat(charData.primary);
    const secondaryMat = makeToonMat(charData.secondary);
    const hairMat = makeToonMat(charData.hair);
    const auraMat = makeToonMat(charData.aura, charData.aura, 0.65);
    const darkMat = makeToonMat('#0f172a');
    const whiteMat = makeToonMat('#f8fafc');
    const metalMat = makeToonMat('#cbd5e1', '#94a3b8', 0.15);

    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    const torsoW = isHeavy ? 0.92 : 0.66;
    const torsoH = isHeavy ? 0.95 : (isCompact ? 0.68 : 0.82);
    const torsoD = isHeavy ? 0.64 : 0.40;
    const torsoGeo = new THREE.BoxGeometry(torsoW, torsoH, torsoD);
    const torsoMesh = addCelOutline(new THREE.Mesh(torsoGeo, charData.id === 'bowser' ? makeToonMat('#facc15') : primaryMat), 1.05);
    torsoMesh.position.y = 0.92;
    bodyPivot.add(torsoMesh);

    const headGroup = new THREE.Group();
    headGroup.position.y = isHeavy ? 1.66 : (isCompact ? 1.52 : 1.62);
    bodyPivot.add(headGroup);

    const headRadius = isHeavy ? 0.44 : 0.36;
    const headMesh = addCelOutline(new THREE.Mesh(new THREE.SphereGeometry(headRadius, 16, 16), skinMat), 1.06);
    headGroup.add(headMesh);

    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-(torsoW * 0.5 + 0.10), 1.24, 0);
    const leftArmMesh = addCelOutline(new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.09, 0.56, 10), primaryMat), 1.06);
    leftArmMesh.position.y = -0.28;
    leftArmPivot.add(leftArmMesh);
    bodyPivot.add(leftArmPivot);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(torsoW * 0.5 + 0.10, 1.24, 0);
    const rightArmMesh = leftArmMesh.clone();
    rightArmPivot.add(rightArmMesh);
    bodyPivot.add(rightArmPivot);

    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-torsoW * 0.26, 0.54, 0);
    const leftLegMesh = addCelOutline(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.10, 0.54, 10), primaryMat), 1.06);
    leftLegMesh.position.y = -0.27;
    leftLegPivot.add(leftLegMesh);
    root.add(leftLegPivot);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(torsoW * 0.26, 0.54, 0);
    const rightLegMesh = leftLegMesh.clone();
    rightLegPivot.add(rightLegMesh);
    root.add(rightLegPivot);

    const auraRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.04, 8, 24), auraMat);
    auraRing.rotation.x = Math.PI / 2;
    auraRing.position.y = 0.08;
    auraRing.visible = false;
    root.add(auraRing);

    const shieldSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.18, 18, 18),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(charData.aura), transparent: true, opacity: 0.34 })
    );
    shieldSphere.position.y = 1.05;
    shieldSphere.visible = false;
    root.add(shieldSphere);

    const iceCube = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, 2.05, 1.35),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 })
    );
    iceCube.position.y = 1.02;
    iceCube.visible = false;
    root.add(iceCube);

    const rig = { root, bodyPivot, headGroup, leftArmPivot, rightArmPivot, leftLegPivot, rightLegPivot, auraRing, shieldSphere, iceCube, isExternalGLB: false, externalModel: null };

    loadExternalCharacterGLB(charData.id, (glbModel) => {
        bodyPivot.visible = false;
        leftLegPivot.visible = false;
        rightLegPivot.visible = false;
        root.add(glbModel);
        rig.isExternalGLB = true;
        rig.externalModel = glbModel;
        if (onExternalModelLoaded) onExternalModelLoaded(rig);
    });

    return rig;
}

function animate3DCharacter(rig, animTick, state) {
    const walkSwing = state.isMoving && state.isGrounded ? Math.sin(animTick * 0.32) * 0.85 : 0;
    const idleBob = state.isGrounded ? Math.sin(animTick * 0.14) * 0.04 : 0.06;

    if (rig.isExternalGLB && rig.externalModel) {
        rig.externalModel.position.y = idleBob;
    } else {
        rig.bodyPivot.position.y = idleBob;
        rig.leftLegPivot.rotation.x = walkSwing;
        rig.rightLegPivot.rotation.x = -walkSwing;
    }

    rig.auraRing.visible = (state.auraBoost > 0 || state.isAttacking);
    if (rig.auraRing.visible) {
        rig.auraRing.rotation.z = animTick * 0.12;
    }
    rig.shieldSphere.visible = !!state.shieldActive;
    rig.iceCube.visible = !!state.isFrozen;
}

// =========================================================================
// 4. PREVIEW VIEWERS & UI ROUTINES
// =========================================================================
const previewViewers = {};
const rosterThumbnailRigs = {};
let rosterThumbnailViewer = null;

function setup3DPreviewViewer(canvasId, interactive = true) {
    const c = document.getElementById(canvasId);
    if (!c) return null;
    const renderer = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
    renderer.setSize(c.width, c.height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, c.width / c.height, 0.1, 30);
    camera.position.set(0, 1.15, 3.65);
    camera.lookAt(0, 1.0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.15);
    dir.position.set(2.5, 4, 3);
    scene.add(dir);

    const state = { renderer, scene, camera, rig: null, rotY: 0.35, dragging: false, lastX: 0 };

    if (interactive) {
        c.addEventListener('pointerdown', (e) => { state.dragging = true; state.lastX = e.clientX; });
        window.addEventListener('pointermove', (e) => {
            if (!state.dragging) return;
            state.rotY += (e.clientX - state.lastX) * 0.025;
            state.lastX = e.clientX;
        });
        window.addEventListener('pointerup', () => { state.dragging = false; });
    }

    previewViewers[canvasId] = state;
    return state;
}

function setPreviewCharacter3D(canvasId, charData) {
    let viewer = previewViewers[canvasId];
    if (!viewer) viewer = setup3DPreviewViewer(canvasId, canvasId.includes('portrait'));
    if (!viewer) return;

    if (viewer.rig) viewer.scene.remove(viewer.rig.root);
    viewer.rig = create3DAnimeCharacter(charData);
    viewer.scene.add(viewer.rig.root);
    viewer.renderer.render(viewer.scene, viewer.camera);
}

function setupRosterThumbnailViewer() {
    if (rosterThumbnailViewer) return rosterThumbnailViewer;

    const canvas = document.createElement('canvas');
    canvas.width = 54;
    canvas.height = 54;
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true
    });
    renderer.setSize(canvas.width, canvas.height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
    camera.position.set(0, 1.15, 3.65);
    camera.lookAt(0, 1.0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.15);
    dir.position.set(2.5, 4, 3);
    scene.add(dir);

    rosterThumbnailViewer = { renderer, scene, camera };
    return rosterThumbnailViewer;
}

function drawRosterThumbnail(canvasEl, rig) {
    const context = canvasEl.getContext('2d');
    if (!context) return;

    const viewer = setupRosterThumbnailViewer();
    viewer.scene.add(rig.root);
    viewer.renderer.render(viewer.scene, viewer.camera);
    context.clearRect(0, 0, canvasEl.width, canvasEl.height);
    context.drawImage(viewer.renderer.domElement, 0, 0, canvasEl.width, canvasEl.height);
    viewer.scene.remove(rig.root);
}

function renderRosterThumbnail(canvasEl, charData) {
    let rig = rosterThumbnailRigs[charData.id];
    if (!rig) {
        rig = create3DAnimeCharacter(charData, (loadedRig) => {
            rosterThumbnailRigs[charData.id] = loadedRig;
            const currentCanvas = document.getElementById(`roster-portrait-${charData.id}`);
            if (currentCanvas) drawRosterThumbnail(currentCanvas, loadedRig);
        });
        rosterThumbnailRigs[charData.id] = rig;
    }

    drawRosterThumbnail(canvasEl, rig);
}

function renderPortrait(canvasEl, charData) {
    if (!canvasEl) return;
    if (canvasEl.id && canvasEl.id.startsWith('roster-portrait-')) {
        renderRosterThumbnail(canvasEl, charData);
        return;
    }
    if (canvasEl.id && (canvasEl.id.includes('portrait') || canvasEl.id.includes('hud-'))) {
        setPreviewCharacter3D(canvasEl.id, charData);
        return;
    }
}

let selectedP1Index = 0;
let selectedP2Index = 1;
let activeSelectorTarget = 1;
let activeFranchiseFilter = 'all';
let gameMode = 'cpu';
let selectedArenaKey = 'dojo';

const franchiseTabsEl = document.getElementById('franchise-tabs');
const rosterGrid = document.getElementById('roster-grid');

function buildFranchiseTabs() {
    if (!franchiseTabsEl) return;
    franchiseTabsEl.innerHTML = '';
    FRANCHISES.forEach(f => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = activeFranchiseFilter === f.key
            ? 'px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-500 text-slate-950 shadow cursor-pointer'
            : 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/80 cursor-pointer';
        btn.textContent = f.label;
        btn.addEventListener('click', () => {
            activeFranchiseFilter = f.key;
            buildFranchiseTabs();
            buildRosterUI();
        });
        franchiseTabsEl.appendChild(btn);
    });
}

function buildRosterUI() {
    if (!rosterGrid) return;
    rosterGrid.innerHTML = '';
    ROSTER.forEach((char, idx) => {
        if (activeFranchiseFilter !== 'all' && char.franchise !== activeFranchiseFilter) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'char-card flex flex-col items-center p-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 hover:border-amber-400 cursor-pointer relative';
        btn.dataset.index = idx;

        const miniCanvas = document.createElement('canvas');
        miniCanvas.id = `roster-portrait-${char.id}`;
        miniCanvas.width = 54; miniCanvas.height = 54;
        miniCanvas.className = 'rounded-lg bg-slate-950 pointer-events-none';
        renderPortrait(miniCanvas, char);

        const label = document.createElement('span');
        label.className = 'mt-1 text-[10px] font-extrabold text-slate-200 truncate w-full text-center';
        label.textContent = char.name.split(' ')[0];

        btn.appendChild(miniCanvas);
        btn.appendChild(label);

        btn.addEventListener('click', () => {
            if (activeSelectorTarget === 1) { selectedP1Index = idx; setSelectorTarget(2); }
            else { selectedP2Index = idx; setSelectorTarget(1); }
            updateSelectionCards();
        });
        rosterGrid.appendChild(btn);
    });
    updateSelectionCards();
}

function setSelectorTarget(target) {
    activeSelectorTarget = target;
    const b1 = document.getElementById('target-p1-btn');
    const b2 = document.getElementById('target-p2-btn');
    if (!b1 || !b2) return;
    if (target === 1) {
        b1.className = 'px-2.5 py-1 rounded-md text-xs font-extrabold bg-red-600 text-white cursor-pointer';
        b2.className = 'px-2.5 py-1 rounded-md text-xs font-extrabold text-slate-400 hover:text-white cursor-pointer';
    } else {
        b2.className = 'px-2.5 py-1 rounded-md text-xs font-extrabold bg-blue-600 text-white cursor-pointer';
        b1.className = 'px-2.5 py-1 rounded-md text-xs font-extrabold text-slate-400 hover:text-white cursor-pointer';
    }
}

function updateSelectionCards() {
    const c1 = ROSTER[selectedP1Index];
    const c2 = ROSTER[selectedP2Index];

    renderPortrait(document.getElementById('p1-portrait-canvas'), c1);
    document.getElementById('p1-char-name').textContent = c1.name;
    document.getElementById('p1-char-franchise').textContent = c1.franchise;
    document.getElementById('p1-char-desc').textContent = c1.desc;
    document.getElementById('p1-move-n').textContent = `${c1.moves.neutral.name} — ${c1.moves.neutral.desc}`;
    document.getElementById('p1-move-s').textContent = `${c1.moves.side.name} — ${c1.moves.side.desc}`;
    document.getElementById('p1-move-u').textContent = `${c1.moves.up.name} — ${c1.moves.up.desc}`;
    document.getElementById('p1-move-d').textContent = `${c1.moves.down.name} — ${c1.moves.down.desc}`;

    renderPortrait(document.getElementById('p2-portrait-canvas'), c2);
    document.getElementById('p2-char-name').textContent = c2.name;
    document.getElementById('p2-char-franchise').textContent = c2.franchise;
    document.getElementById('p2-char-desc').textContent = c2.desc;
    document.getElementById('p2-move-n').textContent = `${c2.moves.neutral.name} — ${c2.moves.neutral.desc}`;
    document.getElementById('p2-move-s').textContent = `${c2.moves.side.name} — ${c2.moves.side.desc}`;
    document.getElementById('p2-move-u').textContent = `${c2.moves.up.name} — ${c2.moves.up.desc}`;
    document.getElementById('p2-move-d').textContent = `${c2.moves.down.name} — ${c2.moves.down.desc}`;
}

// =========================================================================
// 5. 3D BATTLE ARENA ENGINE & GAMEPLAY LOOP
// =========================================================================
let battleRunning = false;
let battleScene, battleCamera, battleRenderer;
let p1Fighter, p2Fighter;
let activeArenaData = null;
let maxStocks = 3;
let cpuDifficulty = 'normal';
let keysDown = {};

function startMatch() {
    const selectScreen = document.getElementById('select-screen');
    const arenaScreen = document.getElementById('arena-screen');
    if (selectScreen && arenaScreen) {
        selectScreen.classList.add('hidden');
        selectScreen.classList.remove('flex');
        arenaScreen.classList.remove('hidden');
        arenaScreen.classList.add('flex');
    }

    const stocksEl = document.getElementById('stocks-select');
    if (stocksEl) maxStocks = parseInt(stocksEl.value) || 3;

    const diffEl = document.getElementById('cpu-diff-select');
    if (diffEl) cpuDifficulty = diffEl.value;

    const arenaEl = document.getElementById('arena-select');
    const arenaKey = arenaEl ? arenaEl.value : 'dojo';
    activeArenaData = ARENAS[arenaKey] || ARENAS.dojo;

    initBattleScene();
    battleRunning = true;
    requestAnimationFrame(battleLoop);
}

function initBattleScene() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    battleRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    battleRenderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    battleScene = new THREE.Scene();
    battleScene.background = new THREE.Color(activeArenaData.bgBottom);

    battleCamera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    battleCamera.position.set(0, 5.5, 14.5);
    battleCamera.lookAt(0, 2.5, 0);

    battleScene.add(new THREE.HemisphereLight(0xffffff, 0x0f172a, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 10, 7);
    battleScene.add(dirLight);

    // Bouw Arena Platforms in 3D
    activeArenaData.platforms.forEach(p => {
        const platGeo = new THREE.BoxGeometry(p.w / 65, 0.4, 1.8);
        const platMat = makeToonMat(activeArenaData.accentColor);
        const platMesh = addCelOutline(new THREE.Mesh(platGeo, platMat));
        platMesh.position.set((p.x - 400) / 65, -(p.y - 250) / 65, 0);
        battleScene.add(platMesh);
    });

    // Initialiseer Vechters
    const c1 = ROSTER[selectedP1Index];
    const c2 = ROSTER[selectedP2Index];

    p1Fighter = createFighterObject(c1, -3.5, 3.0, 0);
    p2Fighter = createFighterObject(c2, 3.5, 3.0, 1);

    battleScene.add(p1Fighter.rig.root);
    battleScene.add(p2Fighter.rig.root);
}

function createFighterObject(charData, x, y, playerIndex) {
    const rig = create3DAnimeCharacter(charData);
    rig.root.position.set(x, y, 0);

    return {
        data: charData,
        rig: rig,
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        percent: 0,
        stocks: maxStocks,
        facing: playerIndex === 0 ? 1 : -1,
        isGrounded: false,
        isMoving: false,
        isAttacking: false,
        shieldActive: false,
        isFrozen: false,
        auraBoost: 0,
        playerIndex: playerIndex,
        animTick: Math.random() * 100
    };
}

function updateFighter(f, opponent, controls) {
    if (f.isFrozen) return;

    f.animTick += 0.2;
    if (f.auraBoost > 0) f.auraBoost--;

    // Basis beweging
    let moveDir = 0;
    if (controls.left) { moveDir = -1; f.facing = -1; }
    if (controls.right) { moveDir = 1; f.facing = 1; }

    f.vx = moveDir * (f.data.speed * 0.12);
    f.x += f.vx;
    f.isMoving = moveDir !== 0;

    // Zwaartekracht & Jump
    f.vy -= 0.38;
    f.y += f.vy * 0.1;

    // Platform botsing
    f.isGrounded = false;
    activeArenaData.platforms.forEach(p => {
        const px = (p.x - 400) / 65;
        const py = -(p.y - 250) / 65;
        const halfW = (p.w / 65) / 2;
        if (f.x >= px - halfW && f.x <= px + halfW && f.y <= py + 0.3 && f.y >= py - 0.4 && f.vy <= 0) {
            f.y = py + 0.3;
            f.vy = 0;
            f.isGrounded = true;
        }
    });

    if (controls.jump && f.isGrounded) {
        f.vy = f.data.jump * 0.9;
        f.isGrounded = false;
    }

    // Grenscheck arena
    if (f.y < -5.0) {
        f.stocks--;
        f.percent = 0;
        f.x = f.playerIndex === 0 ? -3.5 : 3.5;
        f.y = 5.0;
        f.vy = 0;
    }

    f.rig.root.position.set(f.x, f.y, 0);
    animate3DCharacter(f.rig, f.animTick, f);
}

let lastFrameTime = performance.now();
function battleLoop(now) {
    if (!battleRunning) return;
    const dt = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    // Besturing Speler 1
    const p1Controls = {
        left: keysDown['KeyA'] || keysDown['ArrowLeft'],
        right: keysDown['KeyD'] || keysDown['ArrowRight'],
        jump: keysDown['KeyW'] || keysDown['ArrowUp'] || keysDown['Space']
    };
    updateFighter(p1Fighter, p2Fighter, p1Controls);

    // Besturing Speler 2 of CPU
    let p2Controls = {};
    if (gameMode === '2p') {
        p2Controls = {
            left: keysDown['KeyJ'],
            right: keysDown['KeyL'],
            jump: keysDown['KeyI']
        };
    } else {
        // Eenvoudige CPU AI
        const dx = p1Fighter.x - p2Fighter.x;
        p2Controls = {
            left: dx < -0.4,
            right: dx > 0.4,
            jump: Math.random() < 0.03 && p2Fighter.isGrounded
        };
    }
    updateFighter(p2Fighter, p1Fighter, p2Controls);

    if (battleRenderer && battleScene && battleCamera) {
        battleRenderer.render(battleScene, battleCamera);
    }

    requestAnimationFrame(battleLoop);
}

// Event Listeners voor toetsenbord
window.addEventListener('keydown', (e) => { keysDown[e.code] = true; });
window.addEventListener('keyup', (e) => { keysDown[e.code] = false; });

// Event Listeners voor Modus & Start
document.addEventListener('DOMContentLoaded', () => {
    const p1Btn = document.getElementById('target-p1-btn');
    const p2Btn = document.getElementById('target-p2-btn');
    if (p1Btn) p1Btn.addEventListener('click', () => setSelectorTarget(1));
    if (p2Btn) p2Btn.addEventListener('click', () => setSelectorTarget(2));

    const modeCpu = document.getElementById('mode-cpu-btn');
    const mode2p = document.getElementById('mode-2p-btn');
    if (modeCpu) modeCpu.addEventListener('click', () => {
        gameMode = 'cpu';
        document.getElementById('cpu-diff-wrapper').classList.remove('hidden');
        document.getElementById('p2-role-label').textContent = 'CPU Tegenstander';
        updateSelectionCards();
    });
    if (mode2p) mode2p.addEventListener('click', () => {
        gameMode = '2p';
        document.getElementById('cpu-diff-wrapper').classList.add('hidden');
        document.getElementById('p2-role-label').textContent = 'Speler 2';
        updateSelectionCards();
    });

    buildFranchiseTabs();
    buildRosterUI();
});