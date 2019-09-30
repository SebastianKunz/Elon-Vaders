const drawGameOverScreen = () => {
	let temp = parseInt(getCookieByName('highscore'));
	const highscore = isNaN(temp) ? 0 : temp;

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
	text('Hit space to restart', windowWidth / 2, windowHeight / 2 + 100)
}

const drawUi = () => {
	background(100);
	fill(38)
	rect(0, windowHeight - PLAYER_SPACE_HEIGHT, windowWidth, PLAYER_SPACE_HEIGHT);
	textSize(32);
	fill(255);
	text('Level: ' + game.getLevel(), windowWidth - 100, windowHeight - 20)
	textAlign(CENTER, CENTER);
	text(game.getScore(), windowWidth / 2, 20);
	for(let i = 0; i < game.lives; i++) {
		image(game.heartImg, 50 * i, windowHeight - 50, 50, 50)
	}
}
