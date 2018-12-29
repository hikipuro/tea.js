export enum TextureDimension {
	Unknown,
	None,
	//Any,
	Tex2D,
	//Tex3D,
	//Cube,
	//Tex2DArray,
	//CubeArray
}

export module TextureDimension {
	export function toString(value: number): string {
		return TextureDimension[value];
	}

	export function fromString(key: string): TextureDimension {
		var value = TextureDimension[key];
		if (value == null) {
			return TextureDimension.None;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in TextureDimension) {
			if (typeof TextureDimension[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
