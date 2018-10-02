import * as Tea from "../Tea";

export class Screen {
	static get dpi(): number {
		return window.devicePixelRatio;
	}

	static get width(): number {
		return window.screen.width;
	}

	static get height(): number {
		return window.screen.height;
	}

	static get fullscreen(): boolean {
		return document.webkitIsFullScreen;
	}

	/*
	static set fullscreen(value: boolean) {
		document.webkitIsFullScreen = value;
	}
	*/

	static get orientation(): Tea.ScreenOrientation {
		if (screen["orientation"] == null) {
			return Tea.ScreenOrientation.AutoRotation;
		}
		switch (screen["orientation"]["type"]) {
			case "portrait-primary":
				return Tea.ScreenOrientation.Portrait;
			case "portrait-secondary":
				return Tea.ScreenOrientation.PortraitUpsideDown;
			case "landscape-primary":
				return Tea.ScreenOrientation.LandscapeLeft;
			case "landscape-secondary":
				return Tea.ScreenOrientation.LandscapeRight;
		}
		return Tea.ScreenOrientation.AutoRotation;
	}
}
