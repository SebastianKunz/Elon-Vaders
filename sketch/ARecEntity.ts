// Abstract class for Entities with rectangular hitbox.
// Classes with rectangular hitbox should inherite from this class.
abstract class ARecEntity extends AEntity {
	protected width: number;
	protected height: number;

	constructor(x: number, y: number, speed: number, xdir: number, ydir: number,
		width: number, height: number) {
		super(x, y, speed, xdir, ydir);
		this.width = width;
		this.height = height;
	}
	abstract show() : void;

	// checks wether two rectangles intersect
	hits(x: number, y: number, width: number, height: number, dir: number) {
		if (dir > 0)
			return this.y <= y + height && this.y >= y - height && this.x >= x && this.x <= x + width;
		else
			return this.y >= y && this.y <= y + height && this.x >= x && this.x <= x + width;
	}

	move() {
		// if (this.x <= SCREEN_OFFSET || this.x <= windowWidth - SCREEN_OFFSET - this.width)
		// {

			this.x += this.speed * this.xdir;
			this.y -= this.speed * this.ydir;

			if (!isInBounds(this.x, this.y))
				this.dead = true;
		//}
	}

	getWidth = () => this.width;
	getHeight = () => this.height;
}