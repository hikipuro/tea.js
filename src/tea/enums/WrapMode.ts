export enum WrapMode {
	Once,
	Loop,
	PingPong,
	Default,
	ClampForever
}

export module WrapMode {
	export function toString(value: number): string {
		return WrapMode[value];
	}

	export function fromString(key: string): WrapMode {
		var value = WrapMode[key];
		if (value == null) {
			return WrapMode.Default;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in WrapMode) {
			if (typeof WrapMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
