import * as Electron from "electron";
import * as nodePath from "path";
import * as url from "url";
import * as fs from "fs";
import { EditorSettings } from "./tea/editor/EditorSettings";

module Settings {
	export const Title: string = "WebGL Test";
	export const Content: string = "../html/index.html";
	export const DevTools: boolean = false;
	export const Preferences: string = "../html/preferences.html";
}

declare module "electron" {
	interface MenuItem {
		id: string;
		submenu: Electron.Menu;
	}
}

export class MainWindow {
	public static Settings = Settings;
	browserWindow: Electron.BrowserWindow;
	preferencesWindow: Electron.BrowserWindow;

	constructor(parent: Electron.BrowserWindow = null) {
		this.initWindow(parent);
		this.initMenu();
		this.addIpcEvents();
	}

	public show(): void {
		this.browserWindow.show();
		if (Settings.DevTools) {
			this.browserWindow.webContents.openDevTools();
		}
	}

	public destroy(): void {
		this.browserWindow.destroy();
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
			var window = settings.window;
			options.x = window.x;
			options.y = window.y;
			options.width = window.width;
			options.height = window.height;
		}

		this.browserWindow = new Electron.BrowserWindow(options);
		this.browserWindow.loadURL(url.format({
			pathname: nodePath.join(__dirname, Settings.Content),
			protocol: "file:",
			slashes: true,
		}));
		
		// fullscreen
		this.browserWindow.on("enter-full-screen", () => {
			this.browserWindow.setAutoHideMenuBar(true);
			//this.browserWindow.setMenuBarVisibility(false);
		});
		this.browserWindow.on("leave-full-screen", () => {
			this.browserWindow.setAutoHideMenuBar(false);
			this.browserWindow.setMenuBarVisibility(true);
		});

		this.browserWindow.once("close", () => {
			this.removeIpcEvents();
		});

		this.browserWindow.webContents.on("new-window", (
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
	}

	protected initMenu(): void {
	}

	protected addIpcEvents(): void {
	}

	protected removeIpcEvents(): void {
	}

	protected setWindowSize(width: number, height: number): void {
		this.browserWindow.setContentSize(width, height, false);
	}

	protected showPreferencesWindow(options: Electron.BrowserWindowConstructorOptions): void {
		Object.assign(options, {
			//modal: true,
			parent: this.browserWindow,
			width: 400,
			height: 200,
			center: true,
			resizable: false,
			maximizable: false,
			minimizable: false,
			fullscreenable: false,
			skipTaskbar: true,
			useContentSize: true,
			show: false
		});
		var window = new Electron.BrowserWindow(options);
		window.once("ready-to-show", () => {
			window.show();
		});
		window.once("close", () => {
			this.preferencesWindow = null;
		});
		window.loadURL(url.format({
			pathname: nodePath.join(__dirname, Settings.Preferences),
			protocol: "file:",
			slashes: true,
		}));
		this.preferencesWindow = window;
	}
}