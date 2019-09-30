class Bullet {
	x: number;
	y: number;
	speed: number;
	// radius
	r: number;
	width: number;
	height: number;
	dir: number;
	color: p5.Color;

	constructor(x: number, y: number, color: p5.Color, dir: number) {
		this.x = x;
		this.y = y;
		this.speed = 5;
		this.r = 8;
		this.width = 5;
		this.height = 20;
		this.dir = dir;
		this.color = color;
	}

	show() {
		fill(this.color);
		noStroke();
		rect(this.x, this.y, this.width, this.height);
	}

	move() {
		this.y -= this.speed * this.dir
	}

	// checks wether two rectangles intersect
	hits(x: number, y: number, width: number, height: number) {
		return this.y <= y && this.y >= y - height && this.x >= x && this.x <= x + width;
	}
}