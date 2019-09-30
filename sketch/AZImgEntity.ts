// The file is named AZImgEntity on purpose, becuase the compiler needs to compile ARecEntity first
// This is a hacky way, I should rather specify the compilation order in tsconfig.json

/*
	Implementation of ARecEntity.
	This class needs an image.
	Show function renders the image.
*/
class AImgEntity extends ARecEntity {
	protected img: p5.Image;

	constructor(x: number, y: number, speed: number, xdir: number, ydir: number,
		width: number, height: number, img: p5.Image) {
			super(x, y, speed, xdir, ydir, width, height);
			this.img = img;
	}

	show() {
		if (!this.dead)
			image(this.img, this.x, this.y, this.width, this.height);
	}
}