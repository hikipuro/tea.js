import * as Electron from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

import { MenuItem, ipcMain, IpcMessageEvent, MenuItemConstructorOptions } from "electron";

module Settings {
	export const Title: string = "WebGL Test";
	export const Content: string = "../html/Main.html";
	export const DevTools: boolean = true;
}

declare module "electron" {
	interface MenuItem {
		id: string;
		submenu: Electron.Menu;
	}
}

export class MainWindow {
	public static Settings = Settings;
	public browserWindow: Electron.BrowserWindow = null;

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
		this.browserWindow = new Electron.BrowserWindow({
			title: Settings.Title,
			useContentSize: true,
			//width: this._config.window.width,
			//height: this._config.window.height,
			//x: this._config.window.x,
			//y: this._config.window.y,
			//minWidth: Constants.ScreenWidth,
			//minHeight: Constants.ScreenHeight,
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
		});

		this.browserWindow.loadURL(url.format({
			pathname: path.join(__dirname, Settings.Content),
			protocol: "file:",
			slashes: true,
		}), {
			/*
			postData: [{
				type: "rawData",
				bytes: Buffer.from("hello=world")
			}],
			*/
		});

		// resize
		this.browserWindow.on("resize", () => {
			if (this.browserWindow.isFullScreen()) {
				return;
			}
			if (this.browserWindow.isMaximized()) {
				return;
			}
			const size = this.browserWindow.getContentSize();
		});

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

}