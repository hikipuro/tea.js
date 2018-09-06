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
}
