export enum WeightedMode {
	None,
	In,
	Out,
	Both
}

export module WeightedMode {
	export function toString(value: number): string {
		return WeightedMode[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in WeightedMode) {
			if (typeof WeightedMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
