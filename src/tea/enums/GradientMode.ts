export enum GradientMode {
	Blend,
	Fixed
}

export module GradientMode {
	export function toString(value: number): string {
		return GradientMode[value];
	}

	export function fromString(key: string): GradientMode {
		var value = GradientMode[key];
		if (value == null) {
			return GradientMode.Blend;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in GradientMode) {
			if (typeof GradientMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
