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
}
