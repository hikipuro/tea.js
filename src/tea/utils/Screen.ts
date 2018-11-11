import * as Tea from "../Tea";

/*
declare global {
	interface Document {
		fullscreenElement: Element;
		webkitFullscreenElement: Element;
		webkitExitFullscreen(): void;
	}
	interface HTMLElement {
		webkitRequestFullscreen(): void;
	}
}
//*/

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
		var element = document.fullscreenElement ||
			document.webkitFullscreenElement ||
			document["mozFullScreenElement"];
		return element != null;
	}
	static set fullscreen(value: boolean) {
		if (value) {
			var element = document.documentElement;
			var requestFullscreen = element.requestFullscreen ||
				element.webkitRequestFullscreen ||
				element["mozRequestFullscreen"];
			try {
				requestFullscreen.apply(element);
			} catch (e) {
				console.error(e);
			}
		} else {
			var exitFullscreen = document.exitFullscreen ||
				document.webkitExitFullscreen ||
				document["mozExitFullscreen"];
			try {
				exitFullscreen.apply(document);
			} catch (e) {
				console.error(e);
			}
		}
	}

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
