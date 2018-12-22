import * as Tea from "../Tea";

export class ShaderSettings {
	static readonly className: string = "ShaderSettings";
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

	static fromJSON(json: any): ShaderSettings {
		if (Tea.JSONUtil.isValidSceneJSON(json, ShaderSettings.className) === false) {
			return null;
		}
		var shaderSettings = new ShaderSettings();
		shaderSettings.enableBlend = json.enableBlend;
		shaderSettings.enableCullFace = json.enableCullFace;
		shaderSettings.enableDither = json.enableDither;
		shaderSettings.enableDepthTest = json.enableDepthTest;
		shaderSettings.enableStencilTest = json.enableStencilTest;
		shaderSettings.colorWriteMask = Tea.ShaderColorMask.fromJSON(json.colorWriteMask);
		shaderSettings.depthWriteMask = json.depthWriteMask;
		shaderSettings.cullFaceMode = Tea.ShaderFace[json.cullFaceMode as string];
		shaderSettings.depthFunc = Tea.ShaderTestFunc[json.depthFunc as string];
		shaderSettings.blend = Tea.ShaderBlend.fromJSON(json.blend);
		shaderSettings.stencil = Tea.ShaderStencil.fromJSON(json.stencil);
		return shaderSettings;
	}

	toJSON(): Object {
		var json: any = {};
		json[Tea.JSONUtil.TypeName] = ShaderSettings.className;
		Object.assign(json, {
			enableBlend: this.enableBlend,
			enableCullFace: this.enableCullFace,
			enableDither: this.enableDither,
			enableDepthTest: this.enableDepthTest,
			enableStencilTest: this.enableStencilTest,
			colorWriteMask: this.colorWriteMask.toJSON(),
			depthWriteMask: this.depthWriteMask,
			cullFaceMode: Tea.ShaderFace.toString(this.cullFaceMode),
			depthFunc: Tea.ShaderTestFunc.toString(this.depthFunc),
			blend: this.blend.toJSON(),
			stencil: this.stencil.toJSON()
		});
		return json;
	}
}
