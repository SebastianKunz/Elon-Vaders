let game: Game;

function setup() {

	game = new Game();
	game.spawnNextWave();
  createCanvas(windowWidth, windowHeight)
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

	if (game.totalEnemiesAlive === 0)
	{
		game.increaseLevel();
		game.spawnNextWave();
	}

	if (game.isGameOver())
	{
		game.ship.setXDir(0);
		drawGameOverScreen();
	}
}

function keyReleased() {
	if (keyCode !== SPACE_BAR)
		game.ship.setXDir(0)
}

function keyPressed() {
	if (game.isGameOver())
	{
		if (keyCode === SPACE_BAR)
			window.location.reload();
		return ;
	}

	if (keyCode === RIGHT_ARROW) {
		game.ship.setXDir(1)
	}
	else if (keyCode === LEFT_ARROW)
	{
		game.ship.setXDir(-1)
	}

	if (keyCode === SPACE_BAR)
	{
		if (game.bullets.length < game.maxBullets)
			game.bullets.push(new Bullet(game.ship.x + game.ship.width / 2, game.ship.y, color(255), 1));
	}
}
