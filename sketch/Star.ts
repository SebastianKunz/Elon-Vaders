class Star {
	x: number;
	y: number;
	npoints: number;
	radius1: number;
	radius2: number;
	speed: number;

	constructor(x: number, y: number, radius1: number, radius2: number, npoints: number) {
		this.x = x;
		this.y = y;
		this.npoints = npoints;
		this.radius1 = radius1;
		this.radius2 = radius2;
		this.speed = getRandomNumber(1, 5);
	}

	show() {
		fill(255);
		noStroke();
		let angle = TWO_PI / this.npoints;
		let halfAngle = angle / 2.0;
		beginShape();
		for (let a = 0; a < TWO_PI; a += angle) {
			let sx = this.x + cos(a) * this.radius2;
			let sy = this.y + sin(a) * this.radius2;
			vertex(sx, sy);
			sx = this.x + cos(a + halfAngle) * this.radius1;
			sy = this.y + sin(a + halfAngle) * this.radius1;
			vertex(sx, sy);
		}
		endShape(CLOSE);
	}

	move() {
		this.y += this.speed;

		if (this.y >= windowHeight) {
			this.y = getRandomNumber(0, 100);
		}
	}
}
