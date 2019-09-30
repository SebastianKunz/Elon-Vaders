class PowerUpFactory {
	constructor() {

	}

	createRandomPowerUp(x: number, y: number): APowerUp {
		const rand = Math.floor(random(0, 3))
		const speed = Math.floor(random(1, 4))
		switch (rand) {
			case 0:
				return new SpeedPowerUp(x, y, speed);

			case 1:
				return new LifeUp(x, y, speed);

			case 2:
				return new MoreAmmo(x, y, speed);

			default:
				break;
		}
	}
}