var Bullet = (function () {
    function Bullet(x, y, color, dir) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.r = 8;
        this.width = 5;
        this.height = 20;
        this.dir = dir;
        this.color = color;
    }
    Bullet.prototype.show = function () {
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    };
    Bullet.prototype.move = function () {
        this.y -= this.speed * this.dir;
    };
    Bullet.prototype.hits = function (x, y, width, height) {
        return this.y <= y && this.y >= y - height && this.x >= x && this.x <= x + width;
    };
    return Bullet;
}());
var Enemy = (function () {
    function Enemy(x, y) {
        this.x = x;
        this.y = y;
        this.r = 20;
        this.dir = 1;
        this.speed = 3;
        this.img = loadImage('../res/alien.png');
        this.width = 50;
        this.height = 50;
    }
    Enemy.prototype.move = function () {
        this.x += this.speed * this.dir;
    };
    Enemy.prototype.shiftDown = function () {
        this.y += this.r;
        this.dir *= -1;
    };
    Enemy.prototype.show = function () {
        image(this.img, this.x, this.y, this.width, this.height);
    };
    return Enemy;
}());
var Ship = (function () {
    function Ship() {
        this.speed = 5;
        this.dir = 0;
        this.img = loadImage('../res/ship.png');
        this.width = 80;
        this.height = 100;
        this.x = windowWidth / 2;
        this.y = windowHeight - this.height - 20;
    }
    Ship.prototype.move = function () {
        if (this.x > windowWidth)
            this.x -= 1;
        else if (this.x < 0)
            this.x += 1;
        else
            this.x += this.dir * this.speed;
    };
    Ship.prototype.show = function () {
        image(this.img, this.x, this.y, this.width, this.height);
    };
    Ship.prototype.setDir = function (dir) {
        this.dir = dir;
    };
    return Ship;
}());
var Star = (function () {
    function Star(x, y, radius1, radius2, npoints) {
        this.x = x;
        this.y = y;
        this.npoints = npoints;
        this.radius1 = radius1;
        this.radius2 = radius2;
        this.speed = getRandomNumber(1, 5);
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
            this.y = getRandomNumber(0, 100);
        }
    };
    return Star;
}());
var ship;
var enemies;
var bullets;
var enemyBullets;
var stars;
var score = 0;
var maxBullets = 5;
var lives = 3;
var level = 0;
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
function isInBounds(x, y) {
    return x >= 0 && x <= windowWidth && y >= 0 && y <= windowHeight;
}
function setup() {
    ship = new Ship();
    enemies = new Array();
    for (var i = 0; i < 10; i++)
        enemies[i] = new Enemy(i * 50 + 50, 50);
    bullets = new Array();
    enemyBullets = new Array();
    stars = new Array();
    for (var i = 0; i < 80; i++) {
        var x = Math.floor(getRandomNumber(0, windowWidth));
        var y = Math.floor(getRandomNumber(0, windowHeight));
        stars[i] = new Star(x, y, 1, 4, 8);
    }
    createCanvas(windowWidth, windowHeight);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    var hitEdge = false;
    background(100);
    textSize(32);
    fill(255);
    text(lives, 30, windowHeight - 20);
    text('Level: ' + level, windowWidth - 100, windowHeight - 20);
    textAlign(CENTER, CENTER);
    text(score, windowWidth / 2, 20);
    stars.forEach(function (star) {
        star.show();
        star.move();
    });
    ship.show();
    ship.move();
    enemies.forEach(function (enemy) {
        enemy.show();
        if (random(0, 1000) <= 1) {
            enemyBullets.push(new Bullet(enemy.x, enemy.y, color(255, 0, 0, 255), -1));
        }
        enemy.move();
        if (enemy.x > windowWidth || enemy.x < 0) {
            hitEdge = true;
        }
    });
    enemies.forEach(function (e) {
        if (hitEdge)
            e.shiftDown();
    });
    for (var i = 0; i < enemyBullets.length; i++) {
        var bullet = enemyBullets[i];
        bullet.show();
        bullet.move();
        if (bullet.hits(ship.x, ship.y, ship.width, ship.height)) {
            enemyBullets = [];
            lives--;
        }
    }
    for (var k = 0; k < bullets.length; k++) {
        var bullet = bullets[k];
        bullet.show();
        bullet.move();
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            if (bullet.hits(enemy.x, enemy.y, enemy.width, enemy.height)) {
                score += 10;
                ellipse(bullet.x, bullet.y, 6, 6);
                enemies.splice(i, 1);
                bullets.splice(k, 1);
                break;
            }
        }
        if (!isInBounds(bullet.x, bullet.y))
            bullets.splice(k, 1);
    }
}
function keyReleased() {
    if (keyCode !== 32)
        ship.setDir(0);
}
function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        ship.setDir(1);
    }
    else if (keyCode === LEFT_ARROW) {
        ship.setDir(-1);
    }
    if (keyCode === 32) {
        if (bullets.length < maxBullets)
            bullets.push(new Bullet(ship.x + ship.width / 2, ship.y, color(255), 1));
    }
}
//# sourceMappingURL=build.js.map