
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
}