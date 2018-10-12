export enum TextAnchor {
	UpperLeft,
	UpperCenter,
	UpperRight,
	MiddleLeft,
	MiddleCenter,
	MiddleRight,
	LowerLeft,
	LowerCenter,
	LowerRight
}

export module TextAnchor {
	export function toString(value: number): string {
		return TextAnchor[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in TextAnchor) {
			if (typeof TextAnchor[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
