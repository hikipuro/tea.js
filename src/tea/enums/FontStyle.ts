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

	export function fromString(key: string): FontStyle {
		var value = FontStyle[key];
		if (value == null) {
			return FontStyle.Normal;
		}
		return value;
	}

	export function toCssString(value: FontStyle): string {
		switch (value) {
			case FontStyle.Normal:
				return "";
			case FontStyle.Bold:
				return "bold";
			case FontStyle.Italic:
				return "italic";
			case FontStyle.BoldAndItalic:
				return "bold italic";
		}
		return "";
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
