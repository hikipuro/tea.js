export enum TextVerticalAlignment {
	Top,
	Middle,
	Bottom
}

export module TextVerticalAlignment {
	export function toString(value: number): string {
		return TextVerticalAlignment[value];
	}

	export function fromString(key: string): TextVerticalAlignment {
		var value = TextVerticalAlignment[key];
		if (value == null) {
			return TextVerticalAlignment.Top;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in TextVerticalAlignment) {
			if (typeof TextVerticalAlignment[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
