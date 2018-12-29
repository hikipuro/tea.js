export enum TextAlignment {
	Left,
	Center,
	Right
}

export module TextAlignment {
	export function toString(value: number): string {
		return TextAlignment[value];
	}

	export function fromString(key: string): TextAlignment {
		var value = TextAlignment[key];
		if (value == null) {
			return TextAlignment.Left;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in TextAlignment) {
			if (typeof TextAlignment[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
