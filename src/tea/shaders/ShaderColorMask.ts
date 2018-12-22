import * as Tea from "../Tea";

export class ShaderColorMask {
	static readonly className: string = "ShaderColorMask";
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
		if (Tea.JSONUtil.isValidSceneJSON(json, ShaderColorMask.className) === false) {
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
		var json = Tea.JSONUtil.createSceneJSON(ShaderColorMask.className);
		json.red = this.red;
		json.green = this.green;
		json.blue = this.blue;
		json.alpha = this.alpha;
		return json;
	}
}
