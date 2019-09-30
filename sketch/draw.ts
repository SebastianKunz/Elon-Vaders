const drawGameOverScreen = () => {
	let temp = parseInt(getCookieByName('highscore'));
	const highscore = isNaN(temp) ? 0 : temp;

	const score = game.getScore();

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
	text('Hit space to restart', windowWidth / 2, windowHeight / 2 + 100)
}

/*
	Draws Ui Elements
	Level, Lives, Score
*/
const drawUi = () => {
	background(100);
	fill(38)
	rect(0, windowHeight - PLAYER_SPACE_HEIGHT, windowWidth, PLAYER_SPACE_HEIGHT);
	textSize(32);
	fill(255);
	text('Level: ' + game.getLevel(), windowWidth - 100, windowHeight - 20)
	textAlign(CENTER, CENTER);
	text(game.getScore(), windowWidth / 2, 20);
	for(let i = 0; i < game.getLives(); i++) {
		image(game.heartImg, 50 * i, windowHeight - 50, 50, 50)
	}
}

const displayLevelAndDesc = () => {
	if (!shouldDisplay)
		return;

	const level = game.getLevel();
	const desc = game.getDesc();

	textAlign(CENTER, CENTER);
	textSize(64);
	fill(255);
	text('LEVEL ' + level, windowWidth / 2, windowHeight / 2);
	textSize(32);
	text(desc, windowWidth / 2, windowHeight / 2 + 50);
}
