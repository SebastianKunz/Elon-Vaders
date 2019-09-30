class Ship {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
	dir: number;
	img: p5.Image;

	constructor() {
		this.speed = 5;
		this.dir = 0;
		this.img = loadImage('../res/ship.png');
		this.width = 80;
		this.height = 100;
		this.x = windowWidth / 2;
		this.y = windowHeight - this.height - 20;
	}

	move() {
		if (this.x > windowWidth - this.width - SCREEN_OFFSET)
			this.x -= 1;
		else if (this.x < SCREEN_OFFSET)
			this.x += 1;
		else
			this.x += this.dir * this.speed;
	}

	show() {
		image(this.img, this.x, this.y, this.width, this.height);
		// stroke(2);
		// noFill();
		// rect(this.x, this.y, this.width, this.height);
	}

	setDir(dir: number) {
		this.dir = dir;
	}
}