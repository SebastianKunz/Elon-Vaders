/*
	The normal enemy
	Only has 1 life
*/
class Enemy extends AEnemy {

	constructor(x: number, y: number, type: number) {
		super(x, y, 5, 1, 0, ENEMY_SIZE, ENEMY_SIZE,
			loadImage('../res/a' + type + '.png'), 1, 1, 10);
	}

}
