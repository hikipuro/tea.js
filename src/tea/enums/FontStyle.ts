export enum FontStyle {
	Normal,
	Bold,
	Italic,
	BoldAndItalic
}

export module FontStyle {
	export function toString(value: number): string {
		return FontStyle[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in FontStyle) {
			if (typeof FontStyle[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
