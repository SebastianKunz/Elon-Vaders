/*
	The Ship is controlled by the player
*/
class Ship extends AImgEntity {

	constructor() {
		super(windowWidth / 2, windowHeight - 100 - 20, 5, 0, 0, 80, 100,
			loadImage('../res/musk.png'));
	}
}
