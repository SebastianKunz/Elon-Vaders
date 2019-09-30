/*
	Boss has 3 lives
	Shoots faster
	Gives more score points
*/
class Boss extends AEnemy {

	constructor (x: number, y: number, type: number) {
		super(x, y, 10, 1, 0, BOSS_SIZE, BOSS_SIZE,
			loadImage('../res/a' + type + '.png'), 3, 100, 100);
	}
}
