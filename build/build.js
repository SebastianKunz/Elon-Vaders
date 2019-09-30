var AEntity = (function () {
    function AEntity(x, y, speed, xdir, ydir) {
        var _this = this;
        this.isDead = function () { return _this.dead; };
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
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y, color, dir) {
        var _this = _super.call(this, x, y, 5, 0, dir) || this;
        _this.width = 5;
        _this.height = 20;
        _this.color = color;
        return _this;
    }
    Bullet.prototype.show = function () {
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    };
    Bullet.prototype.hits = function (x, y, width, height, dir) {
        if (dir > 0)
            return this.y <= y + height && this.y >= y - height && this.x >= x && this.x <= x + width;
        else
            return this.y >= y && this.y <= y + height && this.x >= x && this.x <= x + width;
    };
    return Bullet;
}(AEntity));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(x, y, type) {
        var _this = _super.call(this, x, y, 5, 1, 0) || this;
        _this.img = loadImage('../res/alien' + type + '.png');
        _this.width = 50;
        _this.height = 50;
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
}(AEntity));
var Game = (function () {
    function Game() {
        var _this = this;
        this.score = 0;
        this.maxBullets = 5;
        this.lives = 3;
        this.level = 1;
        this.gameOver = false;
        this.totalEnemiesAlive = 0;
        this.DEBUG = false;
        this.getScore = function () { return _this.score; };
        this.getLevel = function () { return _this.level; };
        this.increaseLevel = function () { return _this.level++; };
        this.getTotalEnemiesAlive = function () { return _this.totalEnemiesAlive; };
        this.isGameOver = function () { return _this.gameOver; };
        this.gameIsOver = function () { _this.gameOver = true; };
        this.spawnNextWave = function () {
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
                if (powerUp.hits(game.ship.x, game.ship.y, game.ship.width, game.ship.height)) {
                    powerUp.addEffect(game.ship);
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
        this.moveShip = function () {
            _this.ship.show();
            _this.ship.move();
        };
        this.moveEnemies = function () {
            var hitEdge = false;
            _this.enemies.forEach(function (enemyArr) {
                enemyArr.forEach(function (enemy) {
                    enemy.show();
                    if (random(0, 1000) <= 1) {
                        game.enemyBullets.push(new Bullet(enemy.x, enemy.y, color(255, 0, 0, 255), -1));
                    }
                    enemy.move();
                    if (enemy.x > windowWidth - enemy.width - SCREEN_OFFSET || enemy.x < SCREEN_OFFSET) {
                        hitEdge = true;
                    }
                    if (enemy.y + enemy.height >= windowHeight - PLAYER_SPACE_HEIGHT)
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
            for (var i = 0; i < game.enemyBullets.length; i++) {
                var bullet = game.enemyBullets[i];
                bullet.show();
                bullet.move();
                if (bullet.hits(game.ship.x, game.ship.y, game.ship.width, game.ship.height, -1)) {
                    bullet.dead = true;
                    if (!game.gameOver)
                        game.lives--;
                    if (game.lives <= 0)
                        game.gameOver = true;
                }
            }
            game.enemyBullets = game.enemyBullets.filter(function (bullet) { return !bullet.dead; });
        };
        this.movePlayerBullets = function () {
            for (var k = 0; k < game.bullets.length; k++) {
                var bullet = game.bullets[k];
                bullet.show();
                bullet.move();
                for (var i = 0; i < game.enemies.length; i++) {
                    for (var j = 0; j < game.enemies[i].length; j++) {
                        var enemy = game.enemies[i][j];
                        if (bullet.hits(enemy.x, enemy.y, enemy.width, enemy.height, 1)) {
                            ellipse(bullet.x, bullet.y, 6, 6);
                            game.enemies[i].splice(j, 1);
                            game.totalEnemiesAlive--;
                            game.bullets.splice(k, 1);
                            break;
                        }
                    }
                }
                if (!isInBounds(bullet.x, bullet.y))
                    game.bullets.splice(k, 1);
            }
        };
        this.ship = new Ship();
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
        this.powerUps[0] = this.powerUpFactory.createRandomPowerUp(300, 500);
    }
    return Game;
}());
var Player = (function () {
    function Player() {
    }
    return Player;
}());
var APowerUp = (function (_super) {
    __extends(APowerUp, _super);
    function APowerUp(x, y, speed, image) {
        var _this = _super.call(this, x, y, speed, 0, -1) || this;
        _this.width = 25;
        _this.height = 25;
        _this.image = image;
        return _this;
    }
    APowerUp.prototype.show = function () {
        image(this.image, this.x, this.y, this.width, this.height);
    };
    APowerUp.prototype.hits = function (x, y, width, height) {
        return this.y >= y && this.y <= y + height && this.x >= x && this.x <= x + width;
    };
    return APowerUp;
}(AEntity));
var PowerUpFactory = (function () {
    function PowerUpFactory() {
    }
    PowerUpFactory.prototype.createPowerUp = function (id) {
    };
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
        return _super.call(this, x, y, 1, loadImage('../res/PowerUps/speed.png')) || this;
    }
    SpeedPowerUp.prototype.addEffect = function (obj) {
        if (obj.speed)
            obj.speed += 1;
        else
            console.warn("obj does not have 'lives' attribute");
    };
    return SpeedPowerUp;
}(APowerUp));
var LifeUp = (function (_super) {
    __extends(LifeUp, _super);
    function LifeUp(x, y, speed) {
        return _super.call(this, x, y, speed, loadImage('../res/PowerUps/life.png')) || this;
    }
    LifeUp.prototype.addEffect = function (obj) {
        if (obj.lives)
            obj.lives += 1;
        else
            console.warn("obj does not have 'lives' attribute");
    };
    return LifeUp;
}(APowerUp));
var MoreAmmo = (function (_super) {
    __extends(MoreAmmo, _super);
    function MoreAmmo(x, y, speed) {
        return _super.call(this, x, y, speed, loadImage('../res/PowerUps/ammo.png')) || this;
    }
    MoreAmmo.prototype.addEffect = function (obj) {
        if (obj.maxBullets)
            obj.maxBullets += 1;
        else
            console.warn("obj does not have 'maxBullets' attribute");
    };
    return MoreAmmo;
}(APowerUp));
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship() {
        var _this = _super.call(this, windowWidth / 2, windowHeight - 100 - 20, 5, 0, 0) || this;
        _this.img = loadImage('../res/ship.png');
        _this.width = 80;
        _this.height = 100;
        return _this;
    }
    Ship.prototype.show = function () {
        image(this.img, this.x, this.y, this.width, this.height);
    };
    return Ship;
}(AEntity));
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
    if (game.getScore() > highscore)
        setCookie('highscore', game.score, 1000);
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
    for (var i = 0; i < game.lives; i++) {
        image(game.heartImg, 50 * i, windowHeight - 50, 50, 50);
    }
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
    game.movePowerUps();
    game.moveShip();
    game.moveEnemies();
    game.moveEnemyBullets();
    game.movePlayerBullets();
    if (game.totalEnemiesAlive === 0) {
        game.increaseLevel();
        game.spawnNextWave();
    }
    if (game.isGameOver()) {
        game.ship.setXDir(0);
        drawGameOverScreen();
    }
}
function keyReleased() {
    if (keyCode !== SPACE_BAR)
        game.ship.setXDir(0);
}
function keyPressed() {
    if (game.isGameOver()) {
        if (keyCode === SPACE_BAR)
            window.location.reload();
        return;
    }
    if (keyCode === RIGHT_ARROW) {
        game.ship.setXDir(1);
    }
    else if (keyCode === LEFT_ARROW) {
        game.ship.setXDir(-1);
    }
    if (keyCode === SPACE_BAR) {
        if (game.bullets.length < game.maxBullets)
            game.bullets.push(new Bullet(game.ship.x + game.ship.width / 2, game.ship.y, color(255), 1));
    }
}
//# sourceMappingURL=build.js.map