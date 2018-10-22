export enum ShaderBlendFunc {
	/** gl.ZERO */
	Zero,
	/** gl.ONE */
	One,
	/** gl.SRC_COLOR */
	SrcColor,
	/** gl.ONE_MINUS_SRC_COLOR */
	OneMinusSrcColor,
	/** gl.DST_COLOR */
	DstColor,
	/** gl.ONE_MINUS_DST_COLOR */
	OneMinusDstColor,
	/** gl.SRC_ALPHA */
	SrcAlpha,
	/** gl.ONE_MINUS_SRC_ALPHA */
	OneMinusSrcAlpha,
	/** gl.DST_ALPHA */
	DstAlpha,
	/** gl.ONE_MINUS_DST_ALPHA */
	OneMinusDstAlpha,
	/** gl.CONSTANT_COLOR */
	ConstantColor,
	/** gl.ONE_MINUS_CONSTANT_COLOR */
	OneMinusConstantColor,
	/** gl.CONSTANT_ALPHA */
	ConstantAlpha,
	/** gl.ONE_MINUS_CONSTANT_ALPHA */
	OneMinusConstantAlpha,
	/** gl.SRC_ALPHA_SATURATE */
	SrcAlphaSaturate
}

export module ShaderBlendFunc {
	export function toString(value: number): string {
		return ShaderBlendFunc[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ShaderBlendFunc) {
			if (typeof ShaderBlendFunc[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
