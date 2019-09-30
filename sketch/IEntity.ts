interface IEntity {
	// x coordinate of Entity
	x: number;
	// y coordinate of Entity
	y: number;

	// move by amount x and y
	move(x: number, y: number): void;

	// draws entity to canvas
	show(): void
}