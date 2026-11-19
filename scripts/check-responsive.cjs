// Local, real-browser layout audit. Uses installed Chrome and no npm packages.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'anime-rumble-layout-'));
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sizes = [[1280,720,false], [1366,768,false], [1920,1080,false], [768,1024,true], [1024,768,true], [320,640,true], [360,740,true], [390,844,true], [430,932,true], [667,375,true], [740,360,true], [844,390,true], [2560,1080,false]];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
});
let chrome, sequence = 0, buffer = '', session;
const pending = new Map(), errors = [];
function command(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
        const id = ++sequence;
        const timeout = setTimeout(() => { pending.delete(id); reject(Error('CDP timeout: ' + method)); }, 30000);
        pending.set(id, { resolve, reject, timeout });
        chrome.stdio[3].write(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }) + '\0');
    });
}
const page = (method, params) => command(method, params, session);
async function evaluate(expression) {
    const result = await page('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
    return result.result.value;
}
async function settle() { await evaluate('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))'); }
async function navigate(url, selector) {
    await page('Page.navigate', { url });
    for (let attempt = 0; attempt < 60; attempt++) {
        if (await evaluate(`document.readyState === 'complete' && !!document.querySelector(${JSON.stringify(selector)})`)) return;
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    throw Error('Page did not become ready: ' + url);
}
async function audit(name) {
    const results = [];
    for (const [width, height, touch] of sizes) {
        await page('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: touch });
        await page('Emulation.setTouchEmulationEnabled', { enabled: touch });
        await settle();
        const result = await evaluate(`(() => {
            const selectors = ${JSON.stringify({ start: ['.press-start', '.start-footer'], select: ['.selection-stage', '.player-card', '.roster-panel', '.mode-panel'], controls: ['.controls-table', '.controls-footer'], intro: ['.intro-stage', '.intro-fighter', '.intro-tip'], battle: ['.battle-hud-overlay', '.hud-fighter', '.touch-player:not([hidden])', '.touch-player-buttons', '.touch-button', '#gameCanvas'], result: ['.result-panel'], maps: ['.maps-gallery', '.map-card'], specials: ['#move-catalog', 'article'] }[name.replace(/-2p$/, '')])};
            const problems = [];
            if (document.documentElement.scrollWidth > innerWidth + 1) problems.push('page horizontal overflow: ' + document.documentElement.scrollWidth);
            for (const selector of selectors) for (const el of document.querySelectorAll(selector)) {
                const rect = el.getBoundingClientRect(), style = getComputedStyle(el);
                if (!rect.width || style.display === 'none' || style.visibility === 'hidden') continue;
                if (rect.left < -1 || rect.right > innerWidth + 1) problems.push(selector + ': outside viewport');
                if (el.scrollWidth > el.clientWidth + 2 && !['auto','scroll','hidden','clip'].includes(style.overflowX)) problems.push(selector + ': internal horizontal overflow');
                if (selector === '.touch-button' && (rect.top < -1 || rect.bottom > innerHeight + 1)) problems.push(el.dataset.touchCode + ': outside viewport vertically');
                if (selector.startsWith('.intro-') && (rect.top < -1 || rect.bottom > innerHeight + 1)) problems.push(selector + ': outside viewport vertically');
                if (${JSON.stringify(name)} === 'start' && selector === '.press-start' && (rect.top < 0 || rect.bottom > innerHeight)) problems.push('start button outside viewport vertically');
            }
            const controls = document.querySelector('#touch-controls');
            const controlVisible = controls && getComputedStyle(controls).display !== 'none';
            return { problems, touchVisible: !!controlVisible, engine: typeof THREE !== 'undefined' };
        })()`);
        const row = { page: name, width, height, ...result };
        results.push(row);
        if ((width === 390 || width === 1366 || (width === 844 && height === 390)) && ['start','select','intro','battle'].includes(name)) {
            const shot = await page('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
            fs.writeFileSync(path.join(output, `${name}-${width}x${height}.png`), Buffer.from(shot.data, 'base64'));
        }
    }
    console.log(name + ': ' + JSON.stringify(results.filter(r => r.problems.length)));
    return results;
}
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--disable-extensions', '--disable-background-networking', '--remote-debugging-pipe', '--user-data-dir=' + path.join(output, 'profile')], { stdio: ['ignore','ignore','pipe','pipe','pipe'], windowsHide: true });
    chrome.on('error', error => { console.error(error.message); process.exitCode = 1; });
    chrome.stdio[4].on('data', chunk => {
        buffer += chunk.toString();
        let end;
        while ((end = buffer.indexOf('\0')) !== -1) {
            const message = JSON.parse(buffer.slice(0, end)); buffer = buffer.slice(end + 1);
            if (message.id && pending.has(message.id)) {
                const request = pending.get(message.id); pending.delete(message.id); clearTimeout(request.timeout);
                if (message.error) request.reject(Error(message.error.message)); else request.resolve(message.result);
            } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
        }
    });
    const { targetId } = await command('Target.createTarget', { url: 'about:blank' });
    session = (await command('Target.attachToTarget', { targetId, flatten: true })).sessionId;
    await page('Runtime.enable'); await page('Page.enable');
    const report = [];
    await navigate(base + '/spel/', '#press-start'); report.push(...await audit('start'));
    await navigate(base + '/spel/game.html', '.char-card');
    await evaluate("document.querySelector('.selection-settings').open = true"); report.push(...await audit('select'));
    await evaluate('showControlsGuide()'); report.push(...await audit('controls'));
    await evaluate("backFromControlsGuide(); setGameMode('2p'); showControlsGuide()"); report.push(...await audit('controls-2p'));
    const introOpenedAt = await evaluate("backFromControlsGuide(); setGameMode('cpu'); showControlsGuide(); window.ArenaMusic?.setMuted(true); document.querySelector('.controls-footer .start-btn').click(); performance.now()");
    const firstTip = await evaluate("document.getElementById('match-intro-tip').textContent");
    await evaluate(`window.observedIntroPhases = [new Set(), new Set()];
        function observeIntro() {
            if (document.getElementById('match-intro').classList.contains('hidden')) return;
            for (let index = 0; index < 2; index++) {
                const canvas = document.getElementById('p' + (index + 1) + '-intro-portrait-canvas');
                const intro = portraitViewers.get(canvas)?.intro;
                if (intro?.fighter.ultimateForm?.revealed && (intro.phase === 1 || intro.move)) {
                    window.observedIntroPhases[index].add(intro.phase);
                }
            }
            requestAnimationFrame(observeIntro);
        }
        requestAnimationFrame(observeIntro)`);
    report.push(...await audit('intro'));
    await evaluate(`new Promise((resolve, reject) => {
        const tip = document.getElementById('match-intro-tip');
        if (tip.textContent !== ${JSON.stringify(firstTip)}) return resolve(true);
        const observer = new MutationObserver(() => { observer.disconnect(); clearTimeout(timeout); resolve(true); });
        const timeout = setTimeout(() => { observer.disconnect(); reject(new Error('Intro tip did not rotate')); }, 5500);
        observer.observe(tip, { childList: true });
    })`);
    const engine = await evaluate("typeof THREE !== 'undefined'");
    await page('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
    if (engine) {
        await evaluate(`new Promise((resolve, reject) => {
            const poll = setInterval(() => {
                if (!gameRunning && performance.now() - ${introOpenedAt} < 15000) return;
                clearInterval(poll);
                if (!gameRunning || matchStartedAt - ${introOpenedAt} < 9900 ||
                    introTipTimer !== null || introStartTimer !== null ||
                    !document.getElementById('match-intro').classList.contains('hidden')) {
                    return reject(new Error('Intro did not start the battle automatically after 10 seconds'));
                }
                resolve(true);
            }, 100);
        })`);
        await new Promise(resolve => setTimeout(resolve, 500));
        await evaluate(`if (!window.observedIntroPhases.every(phases => [1, 2, 3].every(phase => phases.has(phase)))) {
            throw new Error('Intro did not showcase both ultimate forms and both specials');
        }
        if (fighters.some(fighter => fighter.ultimateForm)) throw new Error('Intro transformation carried into battle');`);
        await evaluate('gameRunning = false; cancelAnimationFrame(animationFrame)');
    } else await evaluate("document.getElementById('select-screen').classList.add('hidden'); document.getElementById('arena-screen').classList.remove('hidden')");
    report.push(...await audit('battle'));
    await evaluate('window.TouchControls.updateMode(true)'); report.push(...await audit('battle-2p'));
    if (engine) await evaluate('finishMatch(fighters[0])');
    else await evaluate("document.getElementById('result-overlay').classList.remove('hidden')");
    report.push(...await audit('result'));
    await navigate(base + '/spel/assest/maps/', '.map-card'); report.push(...await audit('maps'));
    await navigate(base + '/spel/assest/special-moves/', '#move-catalog article'); report.push(...await audit('specials'));
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ engine, errors, results: report }, null, 2));
    console.log(JSON.stringify({ output, engine, errors, checks: report.length, failures: report.filter(r => r.problems.length).length }));
    if (!engine || errors.length || report.some(row => row.problems.length)) process.exitCode = 1;
})().catch(error => { console.error(error.stack); process.exitCode = 1; }).finally(() => {
    chrome?.kill();
    server.close();
});
