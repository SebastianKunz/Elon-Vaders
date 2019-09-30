class Bullet extends ARecEntity {
	color: p5.Color;

	constructor(x: number, y: number, color: p5.Color, dir: number) {
		super(x, y, 5, 0, dir, 5, 20);
		this.color = color;
	}

	show() {
		fill(this.color);
		noStroke();
		rect(this.x, this.y, this.width, this.height);
	}
}
