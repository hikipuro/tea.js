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
}
