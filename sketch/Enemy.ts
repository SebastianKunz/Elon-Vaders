class Enemy {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
	r: number;
	dir: number;
	img: p5.Image;

	constructor(x: number, y: number) {
		this.x = x
		this.y = y;
		this.r = 20;
		this.dir = 1;
		this.speed = 5;
		this.img = loadImage('../res/alien.png');
		this.width = 50;
		this.height = 50;
	}

	move() {
		this.x += this.speed * this.dir;
	}

	shiftDown() {
		this.y += this.r;
		this.dir *= -1;
	}

	show() {
		image(this.img, this.x, this.y, this.width, this.height);
		// noFill();
		// stroke(2);
		// rect(this.x, this.y, this.width, this.height)
	}
}
