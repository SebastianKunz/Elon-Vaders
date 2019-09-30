// Star class doesn't have a hitbox, so it can directly inherite from AEntity
class Star extends AEntity {
	npoints: number;
	radius1: number;
	radius2: number;

	constructor(x: number, y: number, radius1: number, radius2: number, npoints: number) {
		super(x, y, random(1, 5), 0, -1);
		this.npoints = npoints;
		this.radius1 = radius1;
		this.radius2 = radius2;
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
			this.y = random(0, 100);
		}
	}
}
