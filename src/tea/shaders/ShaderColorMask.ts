import * as Tea from "../Tea";

export class ShaderColorMask extends Array<boolean> {
	static readonly className: string = "ShaderColorMask";

	constructor() {
		super(4);
		this[0] = true;
		this[1] = true;
		this[2] = true;
		this[3] = true;
	}

	get red(): boolean {
		return this[0];
	}
	set red(value: boolean) {
		if (value == null) {
			return;
		}
		this[0] = value;
	}

	get green(): boolean {
		return this[1];
	}
	set green(value: boolean) {
		if (value == null) {
			return;
		}
		this[1] = value;
	}

	get blue(): boolean {
		return this[2];
	}
	set blue(value: boolean) {
		if (value == null) {
			return;
		}
		this[2] = value;
	}

	get alpha(): boolean {
		return this[3];
	}
	set alpha(value: boolean) {
		if (value == null) {
			return;
		}
		this[3] = value;
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
