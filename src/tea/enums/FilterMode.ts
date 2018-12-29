export enum FilterMode {
	Point,
	Bilinear,
	//Trilinear
}

export module FilterMode {
	export function toString(value: number): string {
		return FilterMode[value];
	}

	export function fromString(key: string): FilterMode {
		var value = FilterMode[key];
		if (value == null) {
			return FilterMode.Point;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in FilterMode) {
			if (typeof FilterMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
