export enum ShaderTestFunc {
	/** gl.NEVER */
	Never,
	/** gl.LESS */
	Less,
	/** gl.EQUAL */
	Equal,
	/** gl.LEQUAL */
	LEqual,
	/** gl.GREATER */
	Greater,
	/** gl.NOTEQUAL */
	NotEqual,
	/** gl.GEQUAL */
	GEqual,
	/** gl.ALWAYS */
	Always
}

export module ShaderTestFunc {
	export function toString(value: number): string {
		return ShaderTestFunc[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ShaderTestFunc) {
			if (typeof ShaderTestFunc[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
