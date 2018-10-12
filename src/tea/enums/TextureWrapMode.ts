export enum TextureWrapMode {
	Repeat,
	Clamp,
	Mirror,
	//MirrorOnce
}

export module TextureWrapMode {
	export function toString(value: number): string {
		return TextureWrapMode[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in TextureWrapMode) {
			if (typeof TextureWrapMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
