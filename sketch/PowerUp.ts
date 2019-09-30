abstract class APowerUp extends AEntity {
	protected image: p5.Image;
	width: number;
	height: number;

	constructor (x: number, y: number, speed: number, image: p5.Image) {
		super(x, y, speed, 0, -1);
		this.width = 25;
		this.height = 25;
		this.image = image;
	}

	show() {
		image(this.image, this.x, this.y, this.width, this.height);
	}

	hits(x: number, y: number, width: number, height: number) {
		return this.y >= y && this.y <= y + height && this.x >= x && this.x <= x + width;
	}

	abstract addEffect(obj: any) : void;
}

class PowerUpFactory {
	constructor() {

	}

	createPowerUp(id: number) {

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
	constructor (x: number, y: number, speed: number) {
		super(x, y, 1, loadImage('../res/PowerUps/speed.png'));
	}

	addEffect(obj: any) {
		if (obj.speed)
			obj.speed += 1;
		else
			console.warn("obj does not have 'lives' attribute");
	}
}

class LifeUp extends APowerUp {
	constructor (x: number, y: number, speed: number) {
		super(x, y, speed, loadImage('../res/PowerUps/life.png'));
	}

	addEffect(obj: any) {
		if (obj.lives)
			obj.lives += 1;
		else
			console.warn("obj does not have 'lives' attribute");
	}
}

class MoreAmmo extends APowerUp {
	constructor (x: number, y: number, speed: number) {
		super(x, y, speed, loadImage('../res/PowerUps/ammo.png'));
	}

	addEffect(obj: any) {
		if (obj.maxBullets)
			obj.maxBullets += 1;
		else
			console.warn("obj does not have 'maxBullets' attribute");
	}
}