class Enemy extends ARecEntity {
	private img: p5.Image;

	constructor(x: number, y: number, type: number) {
		super(x, y, 5, 1, 0, 50, 50);
		this.img = loadImage('../res/alien' + type + '.png');
	}

	shiftDown() {
		this.y += this.height;
		this.xdir *= -1;
	}

	show() {
		image(this.img, this.x, this.y, this.width, this.height);
		// if (DEBUG)
		// {
		// 	noFill();
		// 	stroke(2);
		// 	rect(this.x, this.y, this.width, this.height)
		// }
	}
}
