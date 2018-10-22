export enum ShaderBlendEquation {
	/** gl.FUNC_ADD */
	Add,
	/** gl.FUNC_SUBTRACT */
	Subtract,
	/** gl.FUNC_REVERSE_SUBTRACT */
	ReverseSubtract
}

export module ShaderBlendEquation {
	export function toString(value: number): string {
		return ShaderBlendEquation[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ShaderBlendEquation) {
			if (typeof ShaderBlendEquation[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
