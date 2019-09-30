class Ship extends ARecEntity {
	private img: p5.Image;

	constructor() {
		super(windowWidth / 2, windowHeight - 100 - 20, 5, 0, 0, 80, 100);
		this.img = loadImage('../res/ship.png');
	}

	show() {
		image(this.img, this.x, this.y, this.width, this.height);
	}
}
