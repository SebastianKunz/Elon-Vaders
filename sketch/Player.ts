class Player {
	private lives: number;
	private maxBullets: number;
	private ship: Ship;

	getLives = () => this.lives;
	increaseLives = () => { this.lives++; }
	decreaseLives = () => { this.lives--; }
	getMaxBullets = () => this.maxBullets;
	increaseMaxBullets = () => { this.maxBullets++; }
	setXDir = (dir: number) => this.ship.setXDir(dir);
	setYDir = (dir: number) => this.ship.setYDir(dir);
	setSpeed = (speed: number) => this.ship.setSpeed(speed);
	modSpeed = (amount: number) => this.ship.modSpeed(amount);
	getX = () => this.ship.getX();
	getY = () => this.ship.getY();
	getWidth = () => this.ship.getWidth();
	getHeight = () => this.ship.getHeight();
	move = () => this.ship.move();
	show = () => this.ship.show();

	constructor() {
		this.ship = new Ship();
		this.maxBullets = 5;
		this.lives = 3;
	}

	createBullet = () => {
		return new Bullet(this.getX(), this.getY(), color(255), 1);
	}
}