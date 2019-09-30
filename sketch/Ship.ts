class Ship extends AEntity {
	width: number;
	height: number;
	img: p5.Image;

	constructor() {
		super(windowWidth / 2, windowHeight - 100 - 20, 5, 0, 0);
		this.img = loadImage('../res/ship.png');
		this.width = 80;
		this.height = 100;
	}

	show() {
		image(this.img, this.x, this.y, this.width, this.height);
	}
}
