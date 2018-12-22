import * as Tea from "../Tea";

export class ShaderBlend {
	static readonly className: string = "ShaderBlend";
	srcRGB: Tea.ShaderBlendFunc;
	dstRGB: Tea.ShaderBlendFunc;
	srcAlpha: Tea.ShaderBlendFunc;
	dstAlpha: Tea.ShaderBlendFunc;
	equationRGB: Tea.ShaderBlendEquation;
	equationAlpha: Tea.ShaderBlendEquation;
	red: number;
	green: number;
	blue: number;
	alpha: number;

	constructor() {
		this.srcRGB = Tea.ShaderBlendFunc.One;
		this.dstRGB = Tea.ShaderBlendFunc.Zero;
		this.srcAlpha = Tea.ShaderBlendFunc.One;
		this.dstAlpha = Tea.ShaderBlendFunc.Zero;
		this.equationRGB = Tea.ShaderBlendEquation.Add;
		this.equationAlpha = Tea.ShaderBlendEquation.Add;
		this.red = 0;
		this.green = 0;
		this.blue = 0;
		this.alpha = 0;
	}

	static fromJSON(json: any): ShaderBlend {
		if (Tea.JSONUtil.isValidSceneJSON(json, ShaderBlend.className) === false) {
			return null;
		}
		var shaderBlend = new ShaderBlend();
		shaderBlend.srcRGB = Tea.ShaderBlendFunc[json.srcRGB as string];
		shaderBlend.dstRGB = Tea.ShaderBlendFunc[json.dstRGB as string];
		shaderBlend.srcAlpha = Tea.ShaderBlendFunc[json.srcAlpha as string];
		shaderBlend.dstAlpha = Tea.ShaderBlendFunc[json.dstAlpha as string];
		shaderBlend.equationRGB = Tea.ShaderBlendEquation[json.equationRGB as string];
		shaderBlend.equationAlpha = Tea.ShaderBlendEquation[json.equationAlpha as string];
		shaderBlend.red = json.red;
		shaderBlend.green = json.green;
		shaderBlend.blue = json.blue;
		shaderBlend.alpha = json.alpha;
		return shaderBlend;
	}

	toJSON(): Object {
		var json = {};
		json[Tea.JSONUtil.TypeName] = ShaderBlend.className;
		Object.assign(json, {
			srcRGB: Tea.ShaderBlendFunc.toString(this.srcRGB),
			dstRGB: Tea.ShaderBlendFunc.toString(this.dstRGB),
			srcAlpha: Tea.ShaderBlendFunc.toString(this.srcAlpha),
			dstAlpha: Tea.ShaderBlendFunc.toString(this.dstAlpha),
			equationRGB: Tea.ShaderBlendEquation.toString(this.equationRGB),
			equationAlpha: Tea.ShaderBlendEquation.toString(this.equationAlpha),
			red: this.red,
			green: this.green,
			blue: this.blue,
			alpha: this.alpha
		});
		return json;
	}
}
