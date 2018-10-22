import * as Tea from "../Tea";

export class ShaderStencil {
	frontFunc: Tea.ShaderTestFunc;
	frontRef: number;
	frontMask: number;
	backFunc: Tea.ShaderTestFunc;
	backRef: number;
	backMask: number;
	frontFail: Tea.ShaderStencilOp;
	frontZfail: Tea.ShaderStencilOp;
	frontZpass: Tea.ShaderStencilOp;
	backFail: Tea.ShaderStencilOp;
	backZfail: Tea.ShaderStencilOp;
	backZpass: Tea.ShaderStencilOp;

	constructor() {
		this.frontFunc = Tea.ShaderTestFunc.Never;
		this.frontRef = 0;
		this.frontMask = ~0;
		this.backFunc = Tea.ShaderTestFunc.Never;
		this.backRef = 0;
		this.backMask = ~0;
		this.frontFail = Tea.ShaderStencilOp.Keep;
		this.frontZfail = Tea.ShaderStencilOp.Keep;
		this.frontZpass = Tea.ShaderStencilOp.Keep;
		this.backFail = Tea.ShaderStencilOp.Keep;
		this.backZfail = Tea.ShaderStencilOp.Keep;
		this.backZpass = Tea.ShaderStencilOp.Keep;
	}

	set func(value: Tea.ShaderTestFunc) {
		this.frontFunc = value;
		this.backFunc = value;
	}

	set ref(value: number) {
		this.frontRef = value;
		this.backRef = value;
	}

	set mask(value: number) {
		this.frontMask = value;
		this.backMask = value;
	}

	set fail(value: Tea.ShaderStencilOp) {
		this.frontFail = value;
		this.backFail = value;
	}

	set zfail(value: Tea.ShaderStencilOp) {
		this.frontZfail = value;
		this.backZfail = value;
	}

	set zpass(value: Tea.ShaderStencilOp) {
		this.frontZpass = value;
		this.backZpass = value;
	}

	static fromJSON(json: any): ShaderStencil {
		if (json == null || json._type !== "ShaderStencil") {
			return null;
		}
		var shaderStencil = new ShaderStencil();
		shaderStencil.frontFunc = Tea.ShaderTestFunc[json.frontFunc as string];
		shaderStencil.frontRef = json.frontRef;
		shaderStencil.frontMask = json.frontMask;
		shaderStencil.backFunc = Tea.ShaderTestFunc[json.backFunc as string];
		shaderStencil.backRef = json.backRef;
		shaderStencil.backMask = json.backMask;
		shaderStencil.frontFail = Tea.ShaderStencilOp[json.frontFail as string];
		shaderStencil.frontZfail = Tea.ShaderStencilOp[json.frontZfail as string];
		shaderStencil.frontZpass = Tea.ShaderStencilOp[json.frontZpass as string];
		shaderStencil.backFail = Tea.ShaderStencilOp[json.backFail as string];
		shaderStencil.backZfail = Tea.ShaderStencilOp[json.backZfail as string];
		shaderStencil.backZpass = Tea.ShaderStencilOp[json.backZpass as string];
		return shaderStencil;
	}

	toJSON(): Object {
		var json = {
			_type: "ShaderStencil",
			frontFunc: Tea.ShaderTestFunc.toString(this.frontFunc),
			frontRef: this.frontRef,
			frontMask: this.frontMask,
			backFunc: Tea.ShaderTestFunc.toString(this.backFunc),
			backRef: this.backRef,
			backMask: this.backMask,
			frontFail: Tea.ShaderStencilOp.toString(this.frontFail),
			frontZfail: Tea.ShaderStencilOp.toString(this.frontZfail),
			frontZpass: Tea.ShaderStencilOp.toString(this.frontZpass),
			backFail: Tea.ShaderStencilOp.toString(this.backFail),
			backZfail: Tea.ShaderStencilOp.toString(this.backZfail),
			backZpass: Tea.ShaderStencilOp.toString(this.backZpass)
		};
		return json;
	}
}
