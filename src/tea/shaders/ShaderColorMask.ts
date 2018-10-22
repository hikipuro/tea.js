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

	static fromJSON(json: any): ShaderColorMask {
		if (json == null || json._type !== "ShaderColorMask") {
			return null;
		}
		var shaderColorMask = new ShaderColorMask();
		shaderColorMask.red = json.red;
		shaderColorMask.green = json.green;
		shaderColorMask.blue = json.blue;
		shaderColorMask.alpha = json.alpha;
		return shaderColorMask;
	}

	set(value: boolean): void {
		this.red = value;
		this.green = value;
		this.blue = value;
		this.alpha = value;
	}

	toJSON(): Object {
		var json = {
			_type: "ShaderColorMask",
			red: this.red,
			green: this.green,
			blue: this.blue,
			alpha: this.alpha
		};
		return json;
	}
}
