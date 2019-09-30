/*
	Abstract class for PowerUps.
	Child classes have to implement addEffect(player: Player)
*/
abstract class APowerUp extends AImgEntity {

	constructor (x: number, y: number, speed: number, img: p5.Image) {
		super(x, y, speed, 0, -1, 50, 50, img);
	}

	abstract addEffect(player: Player) : void;
}

/*
	SpeedPowerUp: increases player speed
*/
class SpeedPowerUp extends APowerUp {
	amount: number;

	constructor (x: number, y: number, speed: number) {
		super(x, y, speed, loadImage('../res/PowerUps/speed.png'));
		this.amount = 1;
	}

	addEffect(player: Player) {
		player.modSpeed(this.amount);
	}
}

/*
	LifeUp: increases player lives
*/
class LifeUp extends APowerUp {
	constructor (x: number, y: number, speed: number) {
		super(x, y, speed, loadImage('../res/PowerUps/life.png'));
	}

	addEffect(player: Player) {
		player.increaseLives();
	}
}
/*
	MoreAmmo: increases players maxBullets
*/
class MoreAmmo extends APowerUp {
	constructor (x: number, y: number, speed: number) {
		super(x, y, speed, loadImage('../res/PowerUps/ammo.png'));
	}

	addEffect(player: Player) {
		player.increaseMaxBullets();
	}
}