/*
	All Global variables that are needed by the game
*/
class Game {
	ship: Ship;
	player: Player;
	private powerUpFactory: PowerUpFactory;
	private powerUps: Array<APowerUp>;
	enemies: Array<Array<Enemy>>;
	bullets: Array<Bullet>;
	enemyBullets: Array<Bullet>;
	private stars: Array<Star>;
	private score = 0;
	maxBullets = 5;
	lives = 3;
	private level = 1;
	private gameOver = false;
	totalEnemiesAlive = 0;


	heartImg: p5.Image;

	DEBUG = false;

	constructor() {
		this.ship = new Ship();
		this.bullets = new Array<Bullet>();
		this.enemyBullets = new Array<Bullet>();

		this.stars = new Array<Star>();
		for (let i = 0; i < 80; i++)
		{
			const x = random(0, windowWidth);
			const y = random(0, windowHeight);
			this.stars[i] = new Star(x, y, 1, 4, 8);
		}
		this.powerUpFactory = new PowerUpFactory();
		this.powerUps = new Array<APowerUp>();
		this.heartImg = loadImage('../res/heart.png');
		this.powerUps[0] = this.powerUpFactory.createRandomPowerUp(300, 500);
	}

	getScore = () => this.score;
	getLevel = () => this.level;
	increaseLevel = () => this.level++;
	getTotalEnemiesAlive = () => this.totalEnemiesAlive;
	isGameOver = () => this.gameOver;
	// finishes the game
	gameIsOver = () => { this.gameOver = true; };

	spawnNextWave = () => {
		const maxEnemiesInRow = Math.floor((windowWidth - SCREEN_OFFSET * 2) / 50);
		const rows = this.level > 8 ? 8 : this.level;
		this.enemies = new Array<Array<Enemy>>();
		for (let i = 0; i < rows; i++) {
			this.enemies[i] = new Array<Enemy>();
			const type = Math.floor(random(1, 4));
			for (let k = 0; k < maxEnemiesInRow / 2; k++) {
				this.enemies[i][k] = new Enemy(k * 50 + SCREEN_OFFSET, 50 * (i + 1), type);
				this.totalEnemiesAlive++;
			}
		}
	}

	movePowerUps = () => {
		this.powerUps.forEach(powerUp => {
			powerUp.show();
			if (powerUp.hits(game.ship.x, game.ship.y, game.ship.width, game.ship.height))
			{
				powerUp.addEffect(game.ship);
				powerUp.Dead();
			}

			powerUp.move();
		});

		this.powerUps = this.powerUps.filter( power => !power.isDead());
	}

	moveStars = () => {
		this.stars.forEach( star => {
				star.show();
				star.move();
			}
		);
	}

	moveShip = () => {
		this.ship.show();
		this.ship.move();
	}

	moveEnemies = () => {
		let hitEdge = false;
		this.enemies.forEach(enemyArr => {
			enemyArr.forEach( enemy => {
				enemy.show();

				// let enemy shoot randomly
				if (random(0, 1000) <= 1) {
					game.enemyBullets.push(new Bullet(enemy.x, enemy.y, color(255, 0, 0, 255), -1));
				}

				enemy.move();
				if (enemy.x > windowWidth - enemy.width - SCREEN_OFFSET || enemy.x < SCREEN_OFFSET) {
					hitEdge = true;
				}

				if (enemy.y + enemy.height >= windowHeight - PLAYER_SPACE_HEIGHT)
					game.gameOver = true;
			})
	});

	game.enemies.forEach( enemyArr => {
		enemyArr.forEach( enemy => {
			if (hitEdge)
				enemy.shiftDown();
		});
	});
	}

	moveEnemyBullets = () => {
		for (let i = 0; i < game.enemyBullets.length; i++) {
			const bullet = game.enemyBullets[i];

			bullet.show();
			bullet.move();

			if (bullet.hits(game.ship.x, game.ship.y, game.ship.width, game.ship.height, -1))
			{
				bullet.dead = true;
				if (!game.gameOver)
					game.lives--;

				if (game.lives <= 0)
					game.gameOver = true;
			}
		}

		game.enemyBullets = game.enemyBullets.filter(bullet => !bullet.dead);
	}

	movePlayerBullets = () => {
		for (let k = 0; k < game.bullets.length; k++) {
			const bullet = game.bullets[k];
			bullet.show();
			bullet.move();

			for (let i = 0; i < game.enemies.length; i++) {
				for (let j = 0; j < game.enemies[i].length; j++) {
					const enemy = game.enemies[i][j];
					if (bullet.hits(enemy.x, enemy.y, enemy.width, enemy.height, 1))
					{
						// remove bullet and enemy from array
						// if (!game.gameOver)
						// 	game.score += 10;
						ellipse(bullet.x, bullet.y, 6, 6);
						game.enemies[i].splice(j, 1);
						game.totalEnemiesAlive--;
						game.bullets.splice(k, 1);

						break ;
					}
				}
			}

			if (!isInBounds(bullet.x, bullet.y))
				game.bullets.splice(k, 1);
		}
	}
}
