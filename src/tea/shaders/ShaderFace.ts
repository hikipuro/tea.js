export enum ShaderFace {
	/** gl.FRONT */
	Front,
	/** gl.BACK */
	Back,
	/** gl.FRONT_AND_BACK */
	FrontAndBack
}

export module ShaderFace {
	export function toString(value: number): string {
		return ShaderFace[value];
	}

	export function fromString(key: string): ShaderFace {
		var value = ShaderFace[key];
		if (value == null) {
			return ShaderFace.Front;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ShaderFace) {
			if (typeof ShaderFace[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
