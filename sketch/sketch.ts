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

	game.moveStars();
	game.movePowerUps();
	game.movePlayer();

	game.moveEnemies();

	game.moveEnemyBullets();

	game.movePlayerBullets();

	if (game.getTotalEnemiesAlive() === 0)
	{
		game.increaseLevel();
		game.spawnNextWave();
	}

	if (game.isGameOver())
	{
		game.setPlayerXDir(0);
		drawGameOverScreen();
	}
	else
		displayLevelAndDesc();
}

function keyReleased() {
	if (keyCode !== SPACE_BAR)
		game.setPlayerXDir(0)
}

function keyPressed() {
	if (game.isGameOver())
	{
		if (keyCode === SPACE_BAR)
			window.location.reload();
		return ;
	}

	if (keyCode === RIGHT_ARROW) {
		game.setPlayerXDir(1)
	}
	if (keyCode === LEFT_ARROW)
	{
		game.setPlayerXDir(-1)
	}

	if (keyCode === SPACE_BAR)
	{
		game.playerFire();
	}
}
