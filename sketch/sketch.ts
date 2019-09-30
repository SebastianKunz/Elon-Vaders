let ship: Ship;
let enemies: Array<Enemy>;
let bullets: Array<Bullet>;
let enemyBullets: Array<Bullet>;
let stars: Array<Star>;
let score = 0;
let maxBullets = 5;
let lives = 3;
let level = 1;
let gameOver = false;

function getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function isInBounds(x: number, y: number) {
	return x >= 0 && x <= windowWidth && y >= 0 && y <= windowHeight;
}

function setup() {
		ship = new Ship();

		spawnNextWave();

		bullets = new Array<Bullet>();
		enemyBullets = new Array<Bullet>();

		stars = new Array<Star>();
		for (let i = 0; i < 80; i++)
		{
			const x = Math.floor(getRandomNumber(0, windowWidth));
			const y = Math.floor(getRandomNumber(0, windowHeight));
			stars[i] = new Star(x, y, 1, 4, 8);
		}

    createCanvas(windowWidth, windowHeight)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

const drawUi = () => {
	background(100);
	fill(38)
	rect(0, windowHeight - PLAYER_SPACE_HEIGHT, windowWidth, PLAYER_SPACE_HEIGHT);
	textSize(32);
	fill(255);
	text('Level: ' + level, windowWidth - 100, windowHeight - 20)
	textAlign(CENTER, CENTER);
	text(score, windowWidth / 2, 20);
	text(lives, 20, windowHeight - 20);
}

const spawnNextWave = () => {
	enemies = new Array<Enemy>();
	for (let i = 0; i < 10 * level; i++)
		enemies[i] = new Enemy(i * 50 + 50, 50);
}

function draw() {
	drawUi();

	let hitEdge = false;

	stars.forEach( star => {
			star.show();
			star.move();
		}
	);

	ship.show();
	ship.move();

	enemies.forEach(enemy => {
		enemy.show();

		// let enemy shoot randomly
		if (random(0, 1000) <= 1) {
			enemyBullets.push(new Bullet(enemy.x, enemy.y, color(255, 0, 0, 255), -1));
		}

		enemy.move();
		if (enemy.x > windowWidth - enemy.width - SCREEN_OFFSET || enemy.x < SCREEN_OFFSET) {
			hitEdge = true;
		}

		if (enemy.y + enemy.height >= windowHeight - PLAYER_SPACE_HEIGHT)
			gameOver = true;
	});

	enemies.forEach( e => {
		if (hitEdge)
			e.shiftDown();
	});

	for (let i = 0; i < enemyBullets.length; i++) {
		const bullet = enemyBullets[i];

		bullet.show();
		bullet.move();

		if (bullet.hits(ship.x, ship.y, ship.width, ship.height))
		{
			lives--;
			if (lives <= 0)
				gameOver = true;
		}
	}

	for (let k = 0; k < bullets.length; k++) {
		const bullet = bullets[k];
		bullet.show();
		bullet.move();

		for (let i = 0; i < enemies.length; i++) {
			const enemy = enemies[i];
			if (bullet.hits(enemy.x, enemy.y, enemy.width, enemy.height))
			{
				// remove bullet and enemy from array
				if (!gameOver)
					score += 10;
				ellipse(bullet.x, bullet.y, 6, 6);
				enemies.splice(i, 1);
				bullets.splice(k, 1);

				break ;
			}
		}

		if (!isInBounds(bullet.x, bullet.y))
			bullets.splice(k, 1);
	}

	if (enemies.length === 0)
	{
		level++;
		spawnNextWave();
	}

	// draw GameOver screen
	if (gameOver)
	{
		let temp = parseInt(getCookieByName('highscore'));
		const highscore = isNaN(temp) ? 0 : temp;

		if (score > highscore)
			setCookie('highscore', score, 1000);
		textSize(64);
		fill(255, 0, 0, 255);
		text('GAME OVER', windowWidth / 2, windowHeight / 2);
		fill(255);
		textSize(32);
		text('Score: ' + score + ' Highscore: ' + highscore, windowWidth / 2, windowHeight / 2 + 50);
		textSize(25);
		text('Hit space to restart', windowWidth / 2, windowHeight / 2 + 100)
	}
}

function keyReleased() {
	if (keyCode !== SPACE_BAR)
		ship.setDir(0)
}

function keyPressed() {
	if (gameOver)
	{
		if (keyCode === SPACE_BAR)
			window.location.reload();
		return ;
	}

	if (keyCode === RIGHT_ARROW) {
		ship.setDir(1)
	}
	else if (keyCode === LEFT_ARROW)
	{
		ship.setDir(-1)
	}

	if (keyCode === SPACE_BAR)
	{
		if (bullets.length < maxBullets)
			bullets.push(new Bullet(ship.x + ship.width / 2, ship.y, color(255), 1));
	}
}
