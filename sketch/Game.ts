let shouldDisplay = true;

/*
	Singletone Game class
	Controls game logic and game data
*/
class Game {
	private player: Player;
	private powerUpFactory: PowerUpFactory;
	private powerUps: Array<APowerUp>;
	private enemies: Array<Array<Enemy>>;
	private bullets: Array<Bullet>;
	private enemyBullets: Array<Bullet>;
	private stars: Array<Star>;
	private score = 0;
	private level = 1;
	private gameOver = false;
	private totalEnemiesAlive = 0;
	private static instance: Game = null;

	// desc that is displayed at the beginning of a wave
	private desc: string;

	private timeoutId = -1;
	private powerUpId = -1;

	heartImg: p5.Image;

	DEBUG = false;

	static getInstance = () => {
		if (Game.instance === null)
			return new Game();
		return Game.instance;
	}

	private constructor() {
		this.player = new Player();
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

		this.timeoutId = -1;
		this.restartSpawnPowerUp(POWER_UP_SPAWN_TIME);
		this.desc = ""
	}

	getScore = () => this.score;
	getLevel = () => this.level;
	getLives = () => this.player.getLives();
	increaseLevel = () => this.level++;
	getTotalEnemiesAlive = () => this.totalEnemiesAlive;
	isGameOver = () => this.gameOver;
	// finishes the game
	gameIsOver = () => { this.gameOver = true; };

	setPlayerXDir = (dir: number) => this.player.setXDir(dir);
	setPlayerYDir = (dir: number) => this.player.setYDir(dir);

	getDesc = () => this.desc;

	playerFire = () => {
		if (this.bullets.length < this.player.getMaxBullets()) {
			this.bullets.push(this.player.createBullet());
		}
	}

	/*
		At the beginning of a new wave, there is a short message with the current level
		and a short description (how many enemies or boss level).
		This function sets a timeout with | ms |, to hide the display.
	*/
	private resetDisplay(ms: number) {
		shouldDisplay = true;

		if (this.timeoutId === -1)
		{
			this.timeoutId = setTimeout( () => {
				shouldDisplay = false;
			}, ms);

		}
		else
		{
			clearTimeout(this.timeoutId);
			this.timeoutId = -1;
		}
	}
	// starts a loop to spawn powerUps every | ms |
	private restartSpawnPowerUp = (ms: number) => {
		if (this.powerUpId === -1)
		{
			this.powerUpId = setInterval(() => {
				const x = random(SCREEN_OFFSET, windowWidth - SCREEN_OFFSET);
				const y = random(0, 300);
				this.powerUps.push(this.powerUpFactory.createRandomPowerUp(x, y));
			}, ms);
		}
		else {
			clearInterval(this.powerUpId);
			this.powerUpId = -1;
			this.restartSpawnPowerUp(ms);
		}
	}

	/*
		Every new Wave enemies are spawned based on the level (the higher the more difficult).
		Every BOSS_EVERY_X_LEVEL Levels there is a Boss wave. Bosses shoot faster and have more lives,
		but theire hitbox is bigger.
	*/
	spawnNextWave = () => {
		this.resetDisplay(DISPLAY_DURATION);
		const isBossLevel = this.level % 5 === 0;
		// allow max 4 rows of enemies
		const rows = this.level > 4 ? 4 : this.level;
		this.enemies = new Array<Array<Enemy>>();
		if (isBossLevel)
		{
			const maxEnemiesInRow = Math.floor((windowWidth - SCREEN_OFFSET * 2) / BOSS_SIZE);
			const amount = this.level / BOSS_EVERY_X_LEVEL > maxEnemiesInRow
				? maxEnemiesInRow : this.level / BOSS_EVERY_X_LEVEL;
			for (let i = 0; i < 1; i++) {
				this.enemies[i] = new Array<Boss>();
				const type = Math.floor(random(1, 4));
				for (let k = 0; k < amount; k++) {
					this.enemies[i][k] = new Boss(BOSS_SIZE * k + SCREEN_OFFSET, 50 * (i + 1), type);
					this.totalEnemiesAlive++;
				}
			}
			this.desc = "Boss Level"
		}
		else
		{
			const maxEnemiesInRow = Math.floor((windowWidth - SCREEN_OFFSET * 2) / ENEMY_SIZE);
			for (let i = 0; i < rows; i++) {
				this.enemies[i] = new Array<Enemy>();
				const type = Math.floor(random(1, 4));
				for (let k = 0; k < maxEnemiesInRow / 2; k++) {
					this.enemies[i][k] = new AI(ENEMY_SIZE * k + SCREEN_OFFSET, 50 * (i + 1), type);
					this.totalEnemiesAlive++;
				}
			}
			this.desc = this.totalEnemiesAlive + ' enemies'
		}
	}

	movePowerUps = () => {
		this.powerUps.forEach(powerUp => {
			powerUp.show();
			if (powerUp.hits(this.player.getX(), this.player.getY(), this.player.getWidth(), this.player.getHeight(), -1))
			{
				powerUp.addEffect(this.player);
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

	movePlayer = () => {
		this.player.show();
		this.player.move();
	}

	moveEnemies = () => {
		let hitEdge = false;
		this.enemies.forEach(enemyArr => {
			enemyArr.forEach( enemy => {
				enemy.show();

				// let enemy shoot randomly
				if (random(0, 1000) <= enemy.getShootSpeed()) {
					game.enemyBullets.push(new Bullet(enemy.getX(), enemy.getY(), color(255, 0, 0, 255), -1));
				}

				enemy.move();
				if (enemy.getX() > windowWidth - enemy.getWidth() - SCREEN_OFFSET || enemy.getX() <= SCREEN_OFFSET) {
					hitEdge = true;
				}

				if (enemy.getY() + enemy.getHeight() >= windowHeight - PLAYER_SPACE_HEIGHT)
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
		for (let i = 0; i < this.enemyBullets.length; i++) {
			const bullet = this.enemyBullets[i];

			bullet.show();
			bullet.move();

			if (bullet.hits(this.player.getX(), this.player.getY(), this.player.getWidth(), this.player.getHeight(), -1))
			{
				bullet.Dead();
				if (!this.gameOver)
					this.player.decreaseLives();

				if (this.player.getLives() <= 0)
					this.gameOver = true;
			}
		}

		game.enemyBullets = game.enemyBullets.filter(bullet => !bullet.isDead());
	}

	movePlayerBullets = () => {
		for (let k = 0; k < game.bullets.length; k++) {
			const bullet = game.bullets[k];
			bullet.show();
			bullet.move();

			for (let i = 0; i < this.enemies.length; i++) {
				for (let j = 0; j < this.enemies[i].length; j++) {
					const enemy = this.enemies[i][j];
					if (bullet.hits(enemy.getX(), enemy.getY(), enemy.getWidth(), enemy.getHeight(), 1)) {
						// remove bullet and enemy from array
						bullet.Dead();

						enemy.decreaseLives();

						if (enemy.isDead())
						{
							if (!this.gameOver)
								this.score += enemy.getReward();
							this.enemies[i].splice(j, 1);
							this.totalEnemiesAlive--;
							this.bullets.splice(k, 1);
						}
						break ;
					}

				if (!isInBounds(bullet.getX(), bullet.getY()))
					this.bullets.splice(k, 1);
				}
			}
		}
	}
}
