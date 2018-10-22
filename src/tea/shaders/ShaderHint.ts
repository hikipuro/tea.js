export enum ShaderHint {
	/** gl.DONT_CARE */
	DontCare,
	/** gl.FASTEST */
	Fastest,
	/** gl.NICEST */
	Nicest
}

export module ShaderHint {
	export function toString(value: number): string {
		return ShaderHint[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ShaderHint) {
			if (typeof ShaderHint[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
