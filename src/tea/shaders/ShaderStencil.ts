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
}
