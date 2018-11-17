import * as Electron from "electron";
import * as nodePath from "path";
import * as url from "url";
import { EditorSettings } from "../tea/editor/EditorSettings";

module Settings {
	export const Title: string = "Tea.js";
	export const Content: string = "../html/index.html";
	export const DevTools: boolean = true;
	export const Preferences: string = "../html/preferences.html";
	export const NewProject: string = "../html/newproject.html";
}

export class MainWindow {
	public static Settings = Settings;
	browserWindow: Electron.BrowserWindow;
	isReady: boolean;
	preferencesWindow: Electron.BrowserWindow;

	constructor(parent: Electron.BrowserWindow = null) {
		this.isReady = false;
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

	public log(...args: any[]): void {
		this.send("MainWindow.log", ...args);
	}

	public send(channel: string, ...args: any[]): void {
		if (this.browserWindow.isDestroyed()) {
			return;
		}
		const webContents = this.browserWindow.webContents;
		webContents.send(channel, ...args);
	}

	protected initWindow(parent: Electron.BrowserWindow): void {
		var options: Electron.BrowserWindowConstructorOptions = {
			title: Settings.Title,
			useContentSize: true,
			acceptFirstMouse: true,
			//titleBarStyle: "hidden",
			show: false,
			//icon: "../icon.png",
			webPreferences: {
				//webgl: false,
				//experimentalFeatures: true,
				//experimentalCanvasFeatures: true
				//nodeIntegration: false
			}
		};

		var settings = EditorSettings.getInstance();
		if (settings.exists()) {
			settings.load();
			options.x = settings.window.x;
			options.y = settings.window.y;
			options.width = settings.window.width;
			options.height = settings.window.height;
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
		// fullscreen
		window.on("enter-full-screen", () => {
			this.browserWindow.setAutoHideMenuBar(true);
			//this.browserWindow.setMenuBarVisibility(false);
		});
		window.on("leave-full-screen", () => {
			this.browserWindow.setAutoHideMenuBar(false);
			this.browserWindow.setMenuBarVisibility(true);
		});
		window.webContents.on("new-window", (
			event: any, url: string, frameName: string, disposition: string,
			options: any, additionalFeatures: string[], referrer: Electron.Referrer): void =>
		{
			//console.log("new-window", url, frameName, disposition, options, additionalFeatures, referrer);
			if (frameName === "preferences") {
				event.preventDefault();
				if (this.preferencesWindow == null) {
					this.showPreferencesWindow(options);
					event.newGuest = this.preferencesWindow;
				} else {
					this.preferencesWindow.focus();
				}
			}
		});
		window.loadURL(url.format({
			pathname: nodePath.join(__dirname, Settings.Content),
			protocol: "file:",
			slashes: true,
		}));
	}

	protected setWindowSize(width: number, height: number): void {
		this.browserWindow.setContentSize(width, height, false);
	}

	protected showPreferencesWindow(options: Electron.BrowserWindowConstructorOptions): void {
		var rect = this.browserWindow.getBounds();
		var x = rect.x + rect.width / 2;
		var y = rect.y + rect.height / 3;

		Object.assign(options, {
			//modal: true,
			parent: this.browserWindow,
			x: x,
			y: y,
			width: 400,
			height: 200,
			center: true,
			resizable: false,
			maximizable: false,
			minimizable: false,
			fullscreenable: false,
			skipTaskbar: true,
			useContentSize: true,
			type: "toolbar",
			show: false
		});
		
		options.x -= options.width / 2;
		options.y -= options.height / 2;
		options.x = Math.floor(options.x);
		options.y = Math.floor(options.y);
		
		var window = new Electron.BrowserWindow(options);
		window.once("ready-to-show", () => {
			window.show();
		});
		window.once("close", () => {
			this.preferencesWindow = null;
		});
		window.setMenu(null);
		window.loadURL(url.format({
			pathname: nodePath.join(__dirname, Settings.Preferences),
			protocol: "file:",
			slashes: true,
		}));
		this.preferencesWindow = window;
	}
}
