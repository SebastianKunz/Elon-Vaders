/*
	Abstract class for entites.
	An entity is a game object. Bullets, Enemies, Ships are all entities
	and should inherite from this class.
*/
abstract class AEntity {
	protected x: number;
	protected y: number;
	protected speed: number;
	protected dead: boolean;
	protected xdir: number;
	protected ydir: number;

	constructor(x: number, y: number, speed: number, xdir: number, ydir: number) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.dead = false;
		this.xdir = xdir;
		this.ydir = ydir;
	}

	move() {
		this.x += this.speed * this.xdir;
		this.y -= this.speed * this.ydir;

		if (!isInBounds(this.x, this.y))
			this.dead = true;
	}

	setXDir(dir: number) {
		this.xdir = dir;
	}

	setYDir(dir: number) {
		this.ydir = dir;
	}

	setSpeed(speed: number) {
		this.speed = speed;
	}

	modSpeed(amount: number) {
		this.speed += amount;
	}

	isDead = () => this.dead;

	// Kills the Entity
	Dead() { this.dead = true; }

	getX = () => this.x;
	getY = () => this.y;

	abstract show() : void;
}
