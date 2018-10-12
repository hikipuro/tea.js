export enum CameraClearFlags {
	Skybox,
	SolidColor,
	Depth,
	Nothing
}

export module CameraClearFlags {
	export function toString(value: number): string {
		return CameraClearFlags[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in CameraClearFlags) {
			if (typeof CameraClearFlags[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
