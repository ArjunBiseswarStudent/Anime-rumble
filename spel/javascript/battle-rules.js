/* Match rules shared by the simulation, HUD and result screen. */
(() => {
    const durationSeconds = 180;
    const health = fighter => Math.max(0, Math.min(100, 100 - fighter.damage));
    function isDefeated(fighter) {
        return health(fighter) <= 0 || fighter.x < -fighter.width || fighter.x > 960 || fighter.y > 630;
    }
    function chooseWinner(fighters) {
        const [a, b] = fighters;
        const difference = a.stocks - b.stocks;
        if (difference !== 0) return difference > 0 ? a : b;
        const healthDifference = health(a) - health(b);
        return Math.abs(healthDifference) < 0.001 ? null : healthDifference > 0 ? a : b;
    }
    const rules = { durationSeconds, health, isDefeated, chooseWinner };
    if (typeof module !== 'undefined' && module.exports) module.exports = rules;
    else window.BattleRules = rules;
})();
