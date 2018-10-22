export enum ShaderStencilOp {
	/** gl.ZERO */
	Zero,
	/** gl.KEEP */
	Keep,
	/** gl.REPLACE */
	Replace,
	/** gl.INCR */
	Incr,
	/** gl.INCR_WRAP */
	IncrWrap,
	/** gl.DECR */
	Decr,
	/** gl.DECR_WRAP */
	DecrWrap,
	/** gl.INVERT */
	Invert
}

export module ShaderStencilOp {
	export function toString(value: number): string {
		return ShaderStencilOp[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ShaderStencilOp) {
			if (typeof ShaderStencilOp[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
