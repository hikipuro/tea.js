export enum DAESemantic {
	BINORMAL,
	COLOR,
	CONTINUITY,
	IMAGE,
	INPUT,
	IN_TANGENT,
	INTERPOLATION,
	INV_BIND_MATRIX,
	JOINT,
	LINEAR_STEPS,
	MORPH_TARGET,
	MORPH_WEIGHT,
	NORMAL,
	OUTPUT,
	OUT_TANGENT,
	POSITION,
	TANGENT,
	TEXBINORMAL,
	TEXCOORD,
	TEXTANGENT,
	UV,
	VERTEX,
	WEIGHT,
}

export module DAESemantic {
	export function toString(value: number): string {
		return DAESemantic[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in DAESemantic) {
			if (typeof DAESemantic[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
