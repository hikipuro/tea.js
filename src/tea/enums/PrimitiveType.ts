export enum PrimitiveType {
	Null,
	Sphere,
	Capsule,
	Cylinder,
	Cube,
	Plane,
	Quad
}

export module PrimitiveType {
	export function toString(value: number): string {
		return PrimitiveType[value];
	}

	export function fromString(key: string): PrimitiveType {
		var value = PrimitiveType[key];
		if (value == null) {
			return PrimitiveType.Null;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in PrimitiveType) {
			if (typeof PrimitiveType[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
