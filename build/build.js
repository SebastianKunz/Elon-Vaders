var AEntity = (function () {
    function AEntity(x, y, speed, xdir, ydir) {
        var _this = this;
        this.isDead = function () { return _this.dead; };
        this.getX = function () { return _this.x; };
        this.getY = function () { return _this.y; };
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dead = false;
        this.xdir = xdir;
        this.ydir = ydir;
    }
    AEntity.prototype.move = function () {
        this.x += this.speed * this.xdir;
        this.y -= this.speed * this.ydir;
        if (!isInBounds(this.x, this.y))
            this.dead = true;
    };
    AEntity.prototype.setXDir = function (dir) {
        this.xdir = dir;
    };
    AEntity.prototype.setYDir = function (dir) {
        this.ydir = dir;
    };
    AEntity.prototype.setSpeed = function (speed) {
        this.speed = speed;
    };
    AEntity.prototype.modSpeed = function (amount) {
        this.speed += amount;
    };
    AEntity.prototype.Dead = function () {
        this.dead = true;
    };
    return AEntity;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ARecEntity = (function (_super) {
    __extends(ARecEntity, _super);
    function ARecEntity(x, y, speed, xdir, ydir, width, height) {
        var _this = _super.call(this, x, y, speed, xdir, ydir) || this;
        _this.getWidth = function () { return _this.width; };
        _this.getHeight = function () { return _this.height; };
        _this.width = width;
        _this.height = height;
        return _this;
    }
    ARecEntity.prototype.hits = function (x, y, width, height, dir) {
        if (dir > 0)
            return this.y <= y + height && this.y >= y - height && this.x >= x && this.x <= x + width;
        else
            return this.y >= y && this.y <= y + height && this.x >= x && this.x <= x + width;
    };
    ARecEntity.prototype.move = function () {
        this.x += this.speed * this.xdir;
        this.y -= this.speed * this.ydir;
        if (!isInBounds(this.x, this.y))
            this.dead = true;
    };
    return ARecEntity;
}(AEntity));
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y, color, dir) {
        var _this = _super.call(this, x, y, 5, 0, dir, 5, 20) || this;
        _this.color = color;
        return _this;
    }
    Bullet.prototype.show = function () {
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    };
    return Bullet;
}(ARecEntity));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(x, y, type) {
        var _this = _super.call(this, x, y, 5, 1, 0, 50, 50) || this;
        _this.img = loadImage('../res/alien' + type + '.png');
        return _this;
    }
    Enemy.prototype.shiftDown = function () {
        this.y += this.height;
        this.xdir *= -1;
    };
    Enemy.prototype.show = function () {
        image(this.img, this.x, this.y, this.width, this.height);
    };
    return Enemy;
}(ARecEntity));
var shouldDisplay = true;
var Game = (function () {
    function Game() {
        var _this = this;
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.totalEnemiesAlive = 0;
        this.timeoutId = -1;
        this.powerUpId = -1;
        this.DEBUG = false;
        this.getScore = function () { return _this.score; };
        this.getLevel = function () { return _this.level; };
        this.getLives = function () { return _this.player.getLives(); };
        this.increaseLevel = function () { return _this.level++; };
        this.getTotalEnemiesAlive = function () { return _this.totalEnemiesAlive; };
        this.isGameOver = function () { return _this.gameOver; };
        this.gameIsOver = function () { _this.gameOver = true; };
        this.setPlayerXDir = function (dir) { return _this.player.setXDir(dir); };
        this.setPlayerYDir = function (dir) { return _this.player.setYDir(dir); };
        this.playerFire = function () {
            if (_this.bullets.length < _this.player.getMaxBullets()) {
                _this.bullets.push(_this.player.createBullet());
            }
        };
        this.restartSpawnPowerUp = function (ms) {
            if (_this.powerUpId === -1) {
                _this.powerUpId = setInterval(function () {
                    var x = random(SCREEN_OFFSET, windowWidth - SCREEN_OFFSET);
                    var y = random(0, 300);
                    _this.powerUps.push(_this.powerUpFactory.createRandomPowerUp(x, y));
                }, ms);
            }
            else {
                clearInterval(_this.powerUpId);
                _this.powerUpId = -1;
                _this.restartSpawnPowerUp(ms);
            }
        };
        this.spawnNextWave = function () {
            _this.resetDisplay();
            var maxEnemiesInRow = Math.floor((windowWidth - SCREEN_OFFSET * 2) / 50);
            var rows = _this.level > 8 ? 8 : _this.level;
            _this.enemies = new Array();
            for (var i = 0; i < rows; i++) {
                _this.enemies[i] = new Array();
                var type = Math.floor(random(1, 4));
                for (var k = 0; k < maxEnemiesInRow / 2; k++) {
                    _this.enemies[i][k] = new Enemy(k * 50 + SCREEN_OFFSET, 50 * (i + 1), type);
                    _this.totalEnemiesAlive++;
                }
            }
        };
        this.movePowerUps = function () {
            _this.powerUps.forEach(function (powerUp) {
                powerUp.show();
                if (powerUp.hits(_this.player.getX(), _this.player.getY(), _this.player.getWidth(), _this.player.getHeight(), -1)) {
                    powerUp.addEffect(_this.player);
                    powerUp.Dead();
                }
                powerUp.move();
            });
            _this.powerUps = _this.powerUps.filter(function (power) { return !power.isDead(); });
        };
        this.moveStars = function () {
            _this.stars.forEach(function (star) {
                star.show();
                star.move();
            });
        };
        this.movePlayer = function () {
            _this.player.show();
            _this.player.move();
        };
        this.moveEnemies = function () {
            var hitEdge = false;
            _this.enemies.forEach(function (enemyArr) {
                enemyArr.forEach(function (enemy) {
                    enemy.show();
                    if (random(0, 1000) <= 1) {
                        game.enemyBullets.push(new Bullet(enemy.getX(), enemy.getY(), color(255, 0, 0, 255), -1));
                    }
                    enemy.move();
                    if (enemy.getX() > windowWidth - enemy.getWidth() - SCREEN_OFFSET || enemy.getX() < SCREEN_OFFSET) {
                        hitEdge = true;
                    }
                    if (enemy.getY() + enemy.getHeight() >= windowHeight - PLAYER_SPACE_HEIGHT)
                        game.gameOver = true;
                });
            });
            game.enemies.forEach(function (enemyArr) {
                enemyArr.forEach(function (enemy) {
                    if (hitEdge)
                        enemy.shiftDown();
                });
            });
        };
        this.moveEnemyBullets = function () {
            for (var i = 0; i < _this.enemyBullets.length; i++) {
                var bullet = _this.enemyBullets[i];
                bullet.show();
                bullet.move();
                if (bullet.hits(_this.player.getX(), _this.player.getY(), _this.player.getWidth(), _this.player.getHeight(), -1)) {
                    bullet.Dead();
                    if (!_this.gameOver)
                        _this.player.decreaseLives();
                    if (_this.player.getLives() <= 0)
                        _this.gameOver = true;
                }
            }
            game.enemyBullets = game.enemyBullets.filter(function (bullet) { return !bullet.isDead(); });
        };
        this.movePlayerBullets = function () {
            for (var k = 0; k < game.bullets.length; k++) {
                var bullet = game.bullets[k];
                bullet.show();
                bullet.move();
                for (var i = 0; i < _this.enemies.length; i++) {
                    for (var j = 0; j < _this.enemies[i].length; j++) {
                        var enemy = _this.enemies[i][j];
                        if (bullet.hits(enemy.getX(), enemy.getY(), enemy.getWidth(), enemy.getHeight(), 1)) {
                            if (!_this.gameOver)
                                _this.score += 10;
                            ellipse(bullet.getX(), bullet.getY(), 6, 6);
                            _this.enemies[i].splice(j, 1);
                            _this.totalEnemiesAlive--;
                            _this.bullets.splice(k, 1);
                            break;
                        }
                    }
                }
                if (!isInBounds(bullet.getX(), bullet.getY()))
                    _this.bullets.splice(k, 1);
            }
        };
        this.player = new Player();
        this.bullets = new Array();
        this.enemyBullets = new Array();
        this.stars = new Array();
        for (var i = 0; i < 80; i++) {
            var x = random(0, windowWidth);
            var y = random(0, windowHeight);
            this.stars[i] = new Star(x, y, 1, 4, 8);
        }
        this.powerUpFactory = new PowerUpFactory();
        this.powerUps = new Array();
        this.heartImg = loadImage('../res/heart.png');
        this.timeoutId = -1;
        this.restartSpawnPowerUp(10000);
    }
    Game.prototype.getDisplayLevelDesc = function () {
        return this.shouldDisplayLevelDesc;
    };
    Game.prototype.resetDisplay = function () {
        shouldDisplay = true;
        if (this.timeoutId === -1) {
            this.timeoutId = setTimeout(function () {
                shouldDisplay = false;
            }, 3000);
        }
        else {
            clearTimeout(this.timeoutId);
            this.timeoutId = -1;
        }
    };
    return Game;
}());
var Player = (function () {
    function Player() {
        var _this = this;
        this.getLives = function () { return _this.lives; };
        this.increaseLives = function () { _this.lives++; };
        this.decreaseLives = function () { _this.lives--; };
        this.getMaxBullets = function () { return _this.maxBullets; };
        this.increaseMaxBullets = function () { _this.maxBullets++; };
        this.setXDir = function (dir) { return _this.ship.setXDir(dir); };
        this.setYDir = function (dir) { return _this.ship.setYDir(dir); };
        this.setSpeed = function (speed) { return _this.ship.setSpeed(speed); };
        this.modSpeed = function (amount) { return _this.ship.modSpeed(amount); };
        this.getX = function () { return _this.ship.getX(); };
        this.getY = function () { return _this.ship.getY(); };
        this.getWidth = function () { return _this.ship.getWidth(); };
        this.getHeight = function () { return _this.ship.getHeight(); };
        this.move = function () { return _this.ship.move(); };
        this.show = function () { return _this.ship.show(); };
        this.createBullet = function () {
            return new Bullet(_this.getX(), _this.getY(), color(255), 1);
        };
        this.ship = new Ship();
        this.maxBullets = 5;
        this.lives = 3;
    }
    return Player;
}());
var APowerUp = (function (_super) {
    __extends(APowerUp, _super);
    function APowerUp(x, y, speed, image) {
        var _this = _super.call(this, x, y, speed, 0, -1, 25, 25) || this;
        _this.image = image;
        return _this;
    }
    APowerUp.prototype.show = function () {
        image(this.image, this.x, this.y, this.width, this.height);
    };
    return APowerUp;
}(ARecEntity));
var PowerUpFactory = (function () {
    function PowerUpFactory() {
    }
    PowerUpFactory.prototype.createRandomPowerUp = function (x, y) {
        var rand = Math.floor(random(0, 3));
        switch (rand) {
            case 0:
                return new SpeedPowerUp(x, y, 1);
            case 1:
                return new LifeUp(x, y, 1);
            case 2:
                return new MoreAmmo(x, y, 1);
            default:
                break;
        }
        return new SpeedPowerUp(x, y, 1);
    };
    return PowerUpFactory;
}());
var SpeedPowerUp = (function (_super) {
    __extends(SpeedPowerUp, _super);
    function SpeedPowerUp(x, y, speed) {
        var _this = _super.call(this, x, y, speed, loadImage('../res/PowerUps/speed.png')) || this;
        _this.amount = 1;
        return _this;
    }
    SpeedPowerUp.prototype.addEffect = function (player) {
        player.modSpeed(this.amount);
    };
    return SpeedPowerUp;
}(APowerUp));
var LifeUp = (function (_super) {
    __extends(LifeUp, _super);
    function LifeUp(x, y, speed) {
        return _super.call(this, x, y, speed, loadImage('../res/PowerUps/life.png')) || this;
    }
    LifeUp.prototype.addEffect = function (player) {
        player.increaseLives();
    };
    return LifeUp;
}(APowerUp));
var MoreAmmo = (function (_super) {
    __extends(MoreAmmo, _super);
    function MoreAmmo(x, y, speed) {
        return _super.call(this, x, y, speed, loadImage('../res/PowerUps/ammo.png')) || this;
    }
    MoreAmmo.prototype.addEffect = function (player) {
        player.increaseMaxBullets();
    };
    return MoreAmmo;
}(APowerUp));
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship() {
        var _this = _super.call(this, windowWidth / 2, windowHeight - 100 - 20, 5, 0, 0, 80, 100) || this;
        _this.img = loadImage('../res/ship.png');
        return _this;
    }
    Ship.prototype.show = function () {
        image(this.img, this.x, this.y, this.width, this.height);
    };
    return Ship;
}(ARecEntity));
var Star = (function (_super) {
    __extends(Star, _super);
    function Star(x, y, radius1, radius2, npoints) {
        var _this = _super.call(this, x, y, random(1, 5), 0, -1) || this;
        _this.npoints = npoints;
        _this.radius1 = radius1;
        _this.radius2 = radius2;
        return _this;
    }
    Star.prototype.show = function () {
        fill(255);
        noStroke();
        var angle = TWO_PI / this.npoints;
        var halfAngle = angle / 2.0;
        beginShape();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = this.x + cos(a) * this.radius2;
            var sy = this.y + sin(a) * this.radius2;
            vertex(sx, sy);
            sx = this.x + cos(a + halfAngle) * this.radius1;
            sy = this.y + sin(a + halfAngle) * this.radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    };
    Star.prototype.move = function () {
        this.y += this.speed;
        if (this.y >= windowHeight) {
            this.y = random(0, 100);
        }
    };
    return Star;
}(AEntity));
var PLAYER_SPACE_HEIGHT = 250;
var ENEMY_SHOOT_CHANCE = 100;
var SPACE_BAR = 32;
var SCREEN_OFFSET = 20;
var getCookieByName = function (name) {
    var cookiestring = RegExp("" + name + "[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
};
var setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
var drawGameOverScreen = function () {
    var temp = parseInt(getCookieByName('highscore'));
    var highscore = isNaN(temp) ? 0 : temp;
    var score = game.getScore();
    if (score > highscore)
        setCookie('highscore', score, 1000);
    noStroke();
    textSize(64);
    fill(255, 0, 0, 255);
    text('GAME OVER', windowWidth / 2, windowHeight / 2);
    fill(255);
    textSize(32);
    text('Score: ' + game.getScore() + ' Highscore: ' + highscore, windowWidth / 2, windowHeight / 2 + 50);
    textSize(25);
    text('Hit space to restart', windowWidth / 2, windowHeight / 2 + 100);
};
var drawUi = function () {
    background(100);
    fill(38);
    rect(0, windowHeight - PLAYER_SPACE_HEIGHT, windowWidth, PLAYER_SPACE_HEIGHT);
    textSize(32);
    fill(255);
    text('Level: ' + game.getLevel(), windowWidth - 100, windowHeight - 20);
    textAlign(CENTER, CENTER);
    text(game.getScore(), windowWidth / 2, 20);
    for (var i = 0; i < game.getLives(); i++) {
        image(game.heartImg, 50 * i, windowHeight - 50, 50, 50);
    }
};
var displayLevelAndDesc = function () {
    var level = game.getLevel();
    if (!shouldDisplay)
        return;
    textAlign(CENTER, CENTER);
    textSize(64);
    fill(255);
    text('LEVEL ' + level, windowWidth / 2, windowHeight / 2);
};
var isInBounds = function (x, y) {
    return x >= 0 && x <= windowWidth && y >= 0 && y <= windowHeight;
};
var game;
function setup() {
    game = new Game();
    game.spawnNextWave();
    createCanvas(windowWidth, windowHeight);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    drawUi();
    game.moveStars();
    game.movePowerUps();
    game.movePlayer();
    game.moveEnemies();
    game.moveEnemyBullets();
    game.movePlayerBullets();
    if (game.getTotalEnemiesAlive() === 0) {
        game.increaseLevel();
        game.spawnNextWave();
    }
    if (game.isGameOver()) {
        game.setPlayerXDir(0);
        drawGameOverScreen();
    }
    else
        displayLevelAndDesc();
}
function keyReleased() {
    if (keyCode !== SPACE_BAR)
        game.setPlayerXDir(0);
}
function keyPressed() {
    if (game.isGameOver()) {
        if (keyCode === SPACE_BAR)
            window.location.reload();
        return;
    }
    if (keyCode === RIGHT_ARROW) {
        game.setPlayerXDir(1);
    }
    if (keyCode === LEFT_ARROW) {
        game.setPlayerXDir(-1);
    }
    if (keyCode === SPACE_BAR) {
        game.playerFire();
    }
}
//# sourceMappingURL=build.js.map