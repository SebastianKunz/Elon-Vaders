class Bullet extends AEntity {
	width: number;
	height: number;
	color: p5.Color;
	dead: boolean;

	constructor(x: number, y: number, color: p5.Color, dir: number) {
		super(x, y, 5, 0, dir);
		this.width = 5;
		this.height = 20;
		this.color = color;
	}

	show() {
		fill(this.color);
		noStroke();
		rect(this.x, this.y, this.width, this.height);
	}

	// checks wether two rectangles intersect
	hits(x: number, y: number, width: number, height: number, dir: number) {
		if (dir > 0)
			return this.y <= y + height && this.y >= y - height && this.x >= x && this.x <= x + width;
		else
			return this.y >= y && this.y <= y + height && this.x >= x && this.x <= x + width;
	}
}