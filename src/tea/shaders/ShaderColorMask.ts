export class ShaderColorMask {
	red: boolean;
	green: boolean;
	blue: boolean;
	alpha: boolean;

	constructor() {
		this.red = true;
		this.green = true;
		this.blue = true;
		this.alpha = true;
	}

	set(value: boolean): void {
		this.red = value;
		this.green = value;
		this.blue = value;
		this.alpha = value;
	}
}
