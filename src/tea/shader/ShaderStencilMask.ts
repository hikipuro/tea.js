export class ShaderStencilMask {
	front: number;
	back: number;

	constructor() {
		this.front = 0xFFFFFFFF;
		this.back = 0xFFFFFFFF;
	}
}
