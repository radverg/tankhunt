var HealthBar_CL = (function () {
    function HealthBar_CL(group, offsetY, barThickness) {
        if (barThickness === void 0) { barThickness = 13; }
        this.group = group;
        this.backgroundSpr = group.create(0, offsetY, "blackRect");
        this.backgroundSpr.anchor.setTo(0.5);
        this.backgroundSpr.width = 180;
        this.backgroundSpr.height = barThickness;
        group.add(this.backgroundSpr);
        this.healthSpr = group.create(-this.backgroundSpr.width / 2, this.backgroundSpr.y, "whiteRect");
        this.healthSpr.anchor.setTo(0, 0.5);
        this.healthSpr.width = this.backgroundSpr.width;
        this.healthSpr.height = this.backgroundSpr.height * 0.7;
        this.healthSpr.tint = 0x1eaf05;
        group.add(this.healthSpr);
        var text = group.game.make.text(0, offsetY, "undefined");
        text.fontSize = 13;
        text.fill = "white";
        this.textRep = text;
        text.anchor.setTo(0.5, 0.35);
        group.add(text);
    }
    HealthBar_CL.prototype.updateHealthBar = function (maxHealth, health, maxMaxHealth) {
        if (health === void 0) { health = maxHealth; }
        var healthRatio = health / maxHealth;
        var barColor = (maxMaxHealth) ? Color.Spectrum[Math.floor(Color.Spectrum.length * ((maxHealth - 0.0001) / maxMaxHealth))] :
            Color.Spectrum[Math.floor(Color.Spectrum.length * (healthRatio - 0.00001))];
        this.healthSpr.tint = barColor;
        this.healthSpr.width = this.backgroundSpr.width * healthRatio;
        this.textRep.text = "".concat(health.toFixed(0), " / ").concat(maxHealth.toFixed(0));
    };
    return HealthBar_CL;
}());
