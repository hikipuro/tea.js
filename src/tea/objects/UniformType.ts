export enum UniformType {
	Int,
	Float,
	Vector2,
	Vector4,
	Matrix,
	Color,
	FloatArray,
	Vector4Array,
	MatrixArray,
	ColorArray
}

export module UniformType {
	export function toString(value: number): string {
		return UniformType[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in UniformType) {
			if (typeof UniformType[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
