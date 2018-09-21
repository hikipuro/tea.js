import * as Tea from "../Tea";

export class ShaderSettings {
	enableBlend: boolean;
	enableCullFace: boolean;
	enableDither: boolean;
	enableDepthTest: boolean;
	//enablePolygonOffsetFill: boolean;
	//enableSampleCoverage: boolean;
	//enableScissorTest: boolean;
	enableStencilTest: boolean;
	colorWriteMask: Tea.ShaderColorMask;
	depthWriteMask: boolean;
	//stencilMask: Tea.ShaderStencilMask;
	cullFaceMode: Tea.ShaderFace;
	depthFunc: Tea.ShaderTestFunc;
	blend: Tea.ShaderBlend;
	stencil: Tea.ShaderStencil;

	constructor() {
		this.enableBlend = true;
		this.enableCullFace = true;
		this.enableDither = true;
		this.enableDepthTest = true;
		//this.enablePolygonOffsetFill = true;
		//this.enableSampleCoverage = true;
		//this.enableScissorTest = true;
		this.enableStencilTest = false;
		this.colorWriteMask = new Tea.ShaderColorMask();
		this.depthWriteMask = true;
		//this.stencilMask = new Tea.ShaderStencilMask();
		this.cullFaceMode = Tea.ShaderFace.Back;
		this.depthFunc = Tea.ShaderTestFunc.LEqual;
		this.blend = new Tea.ShaderBlend();
		this.stencil = new Tea.ShaderStencil();
	}

	toJSON(): Object {
		var json = {
			_type: "ShaderSettings",
			enableBlend: this.enableBlend,
			enableCullFace: this.enableCullFace,
			enableDither: this.enableDither,
			enableDepthTest: this.enableDepthTest,
			enableStencilTest: this.enableStencilTest,
			colorWriteMask: this.colorWriteMask,
			depthWriteMask: this.depthWriteMask,
			cullFaceMode: this.cullFaceMode,
			depthFunc: this.depthFunc,
			blend: this.blend,
			stencil: this.stencil
		};
		return json;
	}
}
