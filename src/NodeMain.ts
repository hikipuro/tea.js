import * as Electron from "electron";

import { ipcMain, IpcMessageEvent } from "electron";
import { MainWindow } from "./MainWindow";

class NodeMain {
	protected _app: Electron.App = null;
	protected _mainWindow: MainWindow = null;

	constructor(app: Electron.App) {
		this._app = app;
		this.addAppEvents();
	}

	protected addAppEvents(): void {
		const app = this._app;
		app.once("ready", this.onReady);
		app.once("window-all-closed", this.onWindowAllClosed);
		app.on("browser-window-focus", (e: Event, window: Electron.BrowserWindow) => {
			if (this._mainWindow == null) {
				return;
			}
			this._mainWindow.send("MainWindow.focus");
		});
		app.on("browser-window-blur", () => {
			if (this._mainWindow == null) {
				return;
			}
			const window = Electron.BrowserWindow.getFocusedWindow();
			if (window == null) {
				this._mainWindow.send("MainWindow.blur");
			}
		});
	}
	
	protected removeAppEvents(): void {
		const app = this._app;
		app.removeAllListeners("ready");
		app.removeAllListeners("window-all-closed");
		app.removeAllListeners("browser-window-focus");
		app.removeAllListeners("browser-window-blur");
	}

	protected addIpcEvents(): void {
		// this log event can use in all windows
		ipcMain.on("App.log", (event: IpcMessageEvent, ...args: any[]) => {
			if (this._mainWindow != null) {
				this._mainWindow.log(...args);
			}
			if (event != null) {
				event.returnValue = null;
			}
		});
	}

	protected removeIpcEvents(): void {
		ipcMain.removeAllListeners("App.log");
	}

	protected onReady = () => {
		this.addIpcEvents();
		this._mainWindow = new MainWindow();
		this._mainWindow.browserWindow.once("ready-to-show", () => {
			this._mainWindow.show();
		});
		this._mainWindow.browserWindow.once("closed", () => {
			this._mainWindow.destroy();
		});
	}

	protected onWindowAllClosed = () => {
		this.removeAppEvents();
		this.removeIpcEvents();
		this._app.quit();
	}
}

let main: NodeMain;
main = new NodeMain(Electron.app);
