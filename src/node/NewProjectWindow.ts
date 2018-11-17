import * as Electron from "electron";
import * as nodePath from "path";
import * as url from "url";

module Settings {
	export const Title: string = "Tea.js";
	export const Content: string = "../html/newProject.html";
	export const DevTools: boolean = false;
	export const Width: number = 420;
	export const Height: number = 220;
}

export class NewProjectWindow {
	browserWindow: Electron.BrowserWindow;
	isReady: boolean;
	defaultTab: string;

	constructor(parent: Electron.BrowserWindow = null, defaultTab: string = "new") {
		this.isReady = false;
		this.defaultTab = defaultTab;
		this.initWindow(parent);
	}

	show(): void {
		if (this.browserWindow.isDestroyed()) {
			return;
		}
		if (this.isReady) {
			this.browserWindow.show();
			return;
		}
		this.browserWindow.once("ready-to-show", () => {
			this.browserWindow.show();
		});
	}

	focus(): void {
		if (this.browserWindow.isDestroyed()) {
			return;
		}
		this.browserWindow.focus();
	}

	protected initWindow(parent: Electron.BrowserWindow): void {
		var options: Electron.BrowserWindowConstructorOptions = {
			//modal: true,
			title: Settings.Title,
			width: Settings.Width,
			height: Settings.Height,
			center: true,
			resizable: false,
			maximizable: false,
			minimizable: false,
			fullscreenable: false,
			//skipTaskbar: true,
			useContentSize: true,
			show: false
		};

		if (parent) {
			options.parent = parent;
			var rect = parent.getBounds();
			var x = rect.x + rect.width / 2;
			var y = rect.y + rect.height / 3;
			options.x = x - options.width / 2;
			options.y = y - options.height / 2;
			options.x = Math.floor(options.x);
			options.y = Math.floor(options.y);
		}

		this.browserWindow = new Electron.BrowserWindow(options);
		var window = this.browserWindow;
		window.once("ready-to-show", () => {
			this.isReady = true;
		});
		window.once("show", () => {
			if (Settings.DevTools) {
				this.browserWindow.webContents.openDevTools();
			}
		});
		window.once("closed", () => {
			this.browserWindow.destroy();
			//this.browserWindow = null;
		});
		window.setMenu(null);
		window.loadURL(url.format({
			pathname: nodePath.join(__dirname, Settings.Content),
			protocol: "file:",
			slashes: true,
			hash: this.defaultTab
		}));
	}
}
