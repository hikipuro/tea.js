export enum ForceMode {
	Force,
	Acceleration,
	Impulse,
	VelocityChange
}

export module ForceMode {
	export function toString(value: number): string {
		return ForceMode[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ForceMode) {
			if (typeof ForceMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
