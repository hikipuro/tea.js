import * as Tea from "../Tea";

export class ShaderBlend {
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
}
