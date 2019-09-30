abstract class APowerUp extends ARecEntity {
	protected image: p5.Image;

	constructor (x: number, y: number, speed: number, image: p5.Image) {
		super(x, y, speed, 0, -1, 25, 25);
		this.image = image;
	}

	show() {
		image(this.image, this.x, this.y, this.width, this.height);
	}

	abstract addEffect(player: Player) : void;
}

class PowerUpFactory {
	constructor() {

	}

	createRandomPowerUp(x: number, y: number): APowerUp {
		const rand = Math.floor(random(0, 3))
		switch (rand) {
			case 0:
				return new SpeedPowerUp(x, y, 1);

			case 1:
				return new LifeUp(x, y, 1);

			case 2:
				return new MoreAmmo(x, y, 1);

			default:
				break;
		}
		return new SpeedPowerUp(x, y, 1);
	}
}

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

class LifeUp extends APowerUp {
	constructor (x: number, y: number, speed: number) {
		super(x, y, speed, loadImage('../res/PowerUps/life.png'));
	}

	addEffect(player: Player) {
		player.increaseLives();
	}
}

class MoreAmmo extends APowerUp {
	constructor (x: number, y: number, speed: number) {
		super(x, y, speed, loadImage('../res/PowerUps/ammo.png'));
	}

	addEffect(player: Player) {
		player.increaseMaxBullets();
	}
}