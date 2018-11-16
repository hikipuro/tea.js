import * as Electron from "electron";
import * as fs from "fs";

import { ipcMain, IpcMessageEvent } from "electron";
import { MainWindow } from "./MainWindow";
import { NewProjectWindow } from "./NewProjectWindow";

module Config {
	export const runElectron: boolean = true;
	export const isDebug: boolean = false;
}

declare module "electron" {
	interface MenuItem {
		id: string;
		submenu: Electron.Menu;
	}
}

class NodeMain {
	app: Electron.App;
	mainWindow: MainWindow;
	newProjectWindow: NewProjectWindow;

	constructor(app: Electron.App) {
		//app.commandLine.appendSwitch("force-gpu-rasterization");
		//app.commandLine.appendSwitch("ignore-gpu-blacklist");
		//console.log(app.getGPUFeatureStatus());
		this.app = app;
		this.addAppEvents();
	}

	protected addAppEvents(): void {
		const app = this.app;
		app.once("ready", this.onReady);
		app.once("window-all-closed", this.onWindowAllClosed);
	}
	
	protected removeAppEvents(): void {
		const app = this.app;
		app.removeAllListeners("ready");
		app.removeAllListeners("window-all-closed");
	}

	protected addIpcEvents(): void {
		ipcMain.on("chdir", (event: IpcMessageEvent, path: string) => {
			console.log("ipcMain.chdir", path);
			if (fs.existsSync(path) === false) {
				event.returnValue = null;
				return;
			}
			process.chdir(path);
			event.returnValue = null;
		});
		ipcMain.on("showWindow", (event: IpcMessageEvent, name: string) => {
			console.log("ipcMain.showWindow", name);
			switch (name) {
				case "main":
					this.showMainWindow();
					break;
			}
			event.returnValue = null;
		});
		ipcMain.on("getConfig", (event: IpcMessageEvent) => {
			event.returnValue = Config;
		});
	}

	protected removeIpcEvents(): void {
		ipcMain.removeAllListeners("chdir");
		ipcMain.removeAllListeners("showWindow");
		ipcMain.removeAllListeners("getConfig");
	}

	protected showMainWindow(): void {
		if (this.mainWindow != null) {
			this.mainWindow.focus();
			return;
		}
		this.mainWindow = new MainWindow();
		this.mainWindow.browserWindow.once("close", () => {
			console.log("close mainWindow");
			this.mainWindow = null;
		});
		this.mainWindow.show();
	}

	protected showNewProjectWindow(): void {
		if (this.newProjectWindow != null) {
			this.newProjectWindow.focus();
			return;
		}
		this.newProjectWindow = new NewProjectWindow();
		this.newProjectWindow.browserWindow.once("close", () => {
			console.log("close newProjectWindow");
			this.newProjectWindow = null;
		});
		this.newProjectWindow.show();
	}

	protected createProjectMenu(): Electron.Menu {
		var template: Electron.MenuItemConstructorOptions[] = [];
		if (process.platform === "darwin") {
			template.push(
				{
					label: this.app.getName(),
					submenu: [
						{ role: "about" },
						{ type: "separator" },
						{ role: "services", submenu: [] },
						{ type: "separator" },
						{ role: "hide" },
						{ role: "hideothers" },
						{ role: "unhide" },
						{ type: "separator" },
						{ role: "quit" }
					]
				}
			);
		}
		return Electron.Menu.buildFromTemplate(template);
	}

	protected onReady = () => {
		this.addIpcEvents();
		if (Config.isDebug) {
			this.showMainWindow();
			return;
		}
		var menu = this.createProjectMenu();
		Electron.Menu.setApplicationMenu(menu);
		this.showNewProjectWindow();
	}

	protected onWindowAllClosed = () => {
		console.log("onWindowAllClosed");
		this.removeAppEvents();
		this.removeIpcEvents();
		this.app.quit();
	}
}

class WebServer {
	constructor() {
		var express = require("express");
		var app = express();
		app.use("/", express.static("html"));

		var server = app.listen(3000, () => {
			var host = "localhost";
			var port = server.address().port;
			console.log('Example app listening at http://%s:%s', host, port);
		});
	}
}

if (Config.runElectron) {
	let main: NodeMain;
	main = new NodeMain(Electron.app);
} else {
	let server: WebServer;
	server = new WebServer();
}
