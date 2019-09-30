// See AZImgEntity for filename explanation

/*
	Base class for Enemies
*/
class Enemy extends AImgEntity {
	private lives: number;
	private shootSpeed: number;
	private reward: number;

	constructor(x: number, y: number, speed: number,
		xdir: number, ydir: number, width: number, height: number,
			img: p5.Image, lives: number, shootSpeed: number, reward: number) {
		super(x, y, speed, xdir, ydir, width, height, img);
				this.lives = lives;
				this.shootSpeed = shootSpeed;
				this.reward = reward;
	}

	getLives = () => this.lives;
	decreaseLives = () => {
		this.lives--;
		if (this.lives <= 0)
			this.dead = true;
	}

	getShootSpeed = () => this.shootSpeed;

	getReward = () => this.reward;
}
