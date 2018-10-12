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
