export enum CameraStereoMode {
	SideBySide,
	TopAndBottom,
	LineByLine
}

export module CameraStereoMode {
	export function toString(value: number): string {
		return CameraStereoMode[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in CameraStereoMode) {
			if (typeof CameraStereoMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
