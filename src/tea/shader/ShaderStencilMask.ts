export class ShaderStencilMask {
	front: number;
	back: number;

	constructor() {
		this.front = ~0;
		this.back = ~0;
	}
}
