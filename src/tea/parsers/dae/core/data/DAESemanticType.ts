export enum DAESemanticType {
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

export module DAESemanticType {
	export function toString(value: number): string {
		return DAESemanticType[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in DAESemanticType) {
			if (typeof DAESemanticType[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
