export enum ScreenOrientation {
	Portrait,
	PortraitUpsideDown,
	LandscapeLeft,
	LandscapeRight,
	AutoRotation
}

export module ScreenOrientation {
	export function toString(value: number): string {
		return ScreenOrientation[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ScreenOrientation) {
			if (typeof ScreenOrientation[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
