/*
	Helper functions
*/

// Checks if | x | and | y | are within the window
const isInBounds = (x: number, y: number) => {
	return x >= 0 && x <= windowWidth && y >= 0 && y <= windowHeight;
}