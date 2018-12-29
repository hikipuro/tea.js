export enum LightType {
	Directional,
	Point,
	Spot,
	//Area
}

export module LightType {
	export function toString(value: number): string {
		return LightType[value];
	}

	export function fromString(key: string): LightType {
		var value = LightType[key];
		if (value == null) {
			return LightType.Directional;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in LightType) {
			if (typeof LightType[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
