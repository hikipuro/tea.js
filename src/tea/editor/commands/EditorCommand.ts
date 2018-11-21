import * as fs from "fs";
import * as nodePath from "path";
import * as Electron from "electron";
import * as Tea from "../../Tea";
import { EventDispatcher } from "../../utils/EventDispatcher";
import { Editor } from "../Editor";
import { EditorMenu } from "../EditorMenu";
import { AppBuilder } from "./AppBuilder";
import { Translator } from "../translate/Translator";

var remote = null;
var Dialog = null;
if (Electron) {
	remote = Electron.remote;
	Dialog = remote.dialog;
}

declare global {
	interface Window {
		open(url: string, frameName?: string, features?: string): Electron.BrowserWindowProxy;
	}
}

export class EditorCommand extends EventDispatcher {
	editor: Editor;

	constructor() {
		super();
	}

	showPreferences(): void {
		window.open("", "preferences");
	}

	play(): void {
		var menu = EditorMenu.getMainMenu();
		var fileMenu = menu.getMenuItemById("File");
		if (fileMenu) {
			fileMenu.submenu.items.forEach((item: Electron.MenuItem) => {
				if (item.id === "App/Quit") {
					return;
				}
				item.enabled = false;
			});
		}

		var toolBox = this.editor.toolBox;
		var app = this.editor.status.app;
		app.isEditing = false;
		toolBox.play();
	}

	stop(): void {
		var menu = EditorMenu.getMainMenu();
		var fileMenu = menu.getMenuItemById("File");
		if (fileMenu) {
			fileMenu.submenu.items.forEach((item: Electron.MenuItem) => {
				if (item.id === "App/Quit") {
					return;
				}
				item.enabled = true;
			});
		}

		var toolBox = this.editor.toolBox;
		var app = this.editor.status.app;
		app.isEditing = true;
		this.reloadScene();
		toolBox.stop();
	}

	newScene(): void {
		if (this.editor.status.isChanged === false) {
			this.createNewScene();
			return;
		}
		this.showConfirmSaveSceneDialog((response: number) => {
			switch (response) {
				case 0: // Save
					this.once("save", (filename: string) => {
						if (filename != null) {
							this.createNewScene();
						}
					});
					this.saveScene();
					break;
				case 2: // Don't Save
					this.createNewScene();
					break;
			}
		});
	}

	openScene(): void {
		console.log("openScene");
		if (this.editor.status.isChanged === false) {
			this.showOpenSceneDialog();
			return;
		}
		this.showConfirmSaveSceneDialog((response: number) => {
			switch (response) {
				case 0: // Save
					this.once("save", (filename: string) => {
						if (filename != null) {
							this.showOpenSceneDialog();
						}
					});
					this.saveScene();
					break;
				case 2: // Don't Save
					this.showOpenSceneDialog();
					break;
			}
		});
	}

	saveScene(): void {
		console.log("saveScene");
		if (this.editor.status.isChanged === false) {
			this.emit("save", null);
			return;
		}
		if (this.editor.status.scenePath == null) {
			this.saveSceneAs();
			return;
		}
		this.saveSceneFile();
	}

	saveSceneAs(): void {
		console.log("saveSceneAs");
		var translator = Translator.getInstance();
		translator.basePath = "Dialogs/SaveScene";
		var defaultPath = nodePath.resolve("./assets/scene.json");
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.SaveDialogOptions = {
			defaultPath: defaultPath,
			title: translator.getText("Message"),
			message: translator.getText("Message"),
			filters: [
				{
					name: translator.getText("FileType"),
					extensions: ["json"]
				}
			]
		};
		Dialog.showSaveDialog(
			browserWindow, options,
			this.onCloseSaveSceneDialog
		);
	}

	newProject(): void {
		console.log("newProject");
		if (this.editor.status.isChanged === false) {
			this.openNewProjectWindow();
			return;
		}
		this.showConfirmSaveSceneDialog((response: number) => {
			switch (response) {
				case 0: // Save
					this.once("save", (filename: string) => {
						if (filename == null) {
							return;
						}
						this.openNewProjectWindow();
					});
					this.saveScene();
					break;
				case 2: // Don't Save
					this.openNewProjectWindow();
					break;
			}
		});
	}

	openProject(): void {
		console.log("openProject");
		if (this.editor.status.isChanged === false) {
			this.openNewProjectWindow("open");
			return;
		}
		this.showConfirmSaveSceneDialog((response: number) => {
			switch (response) {
				case 0: // Save
					this.once("save", (filename: string) => {
						if (filename == null) {
							return;
						}
						this.openNewProjectWindow("open");
					});
					this.saveScene();
					break;
				case 2: // Don't Save
					this.openNewProjectWindow("open");
					break;
			}
		});
	}

	reloadScene(): void {
		console.log("reloadScene", this.editor.status.scenePath);
		if (this.editor.status.scenePath == null) {
			return;
		}
		this.loadScene(this.editor.status.scenePath);
	}

	build(): void {
		console.log("build");
		if (this.editor.status.isChanged === false) {
			this.showSelectBuildTargetDialog();
			return;
		}
		this.showConfirmSaveSceneDialog((response: number) => {
			switch (response) {
				case 0: // Save
					this.once("save", (filename: string) => {
						if (filename == null) {
							return;
						}
						this.showSelectBuildTargetDialog();
					});
					this.saveScene();
					break;
				case 2: // Don't Save
					this.showSelectBuildTargetDialog();
					break;
			}
		});
	}

	loadScene(path: string): void {
		Tea.File.readText(path, (err, data) => {
			if (err) {
				console.error("EditorCommand.loadScene(): " + path);
				console.error(err);
				return;
			}
			var json = null;
			try {
				json = JSON.parse(data);
			} catch (err) {
				console.error("EditorCommand.loadScene(): " + path);
				console.error(err);
				return;
			}
			this.editor.status.scenePath = path;
			this.editor.status.isChanged = false;
			var app = this.editor.status.app;
			var prevScene = app.scene;
			var scene = app.createSceneFromJSON(json);
			app.scene = scene;
			this.editor.setScene(scene);
			if (prevScene) {
				prevScene.removeAllListeners("addChild");
				prevScene.removeAllListeners("removeChild");
				prevScene.destroy();
			}

			console.log("onload", app.isEditing, scene.isEditing);
		});
	}

	showConfirmSaveSceneDialog(callback: (response: number) => void): void {
		console.log("showConfirmSaveSceneDialog");
		var translator = Translator.getInstance();
		translator.basePath = "Dialogs/ConfirmSaveScene";
		var browserWindow = remote.getCurrentWindow();
		var buttons = [
			translator.getText("Buttons/Save"),
			translator.getText("Buttons/Cancel"),
			translator.getText("Buttons/DontSave")
		];
		var options: Electron.MessageBoxOptions = {
			type: "info",
			message: translator.getText("Message"),
			detail: translator.getText("Detail"),
			buttons: buttons,
			defaultId: 0
		};
		Dialog.showMessageBox(
			browserWindow, options,
			(response: number) => {
				callback(response);
			}
		);
	}

	protected createNewScene(): void {
		var scene = this.editor.status.scene;
		scene.removeAllListeners("addChild");
		scene.removeAllListeners("removeChild");
		scene.destroy();
		this.editor.status.scenePath = null;
		this.editor.status.isChanged = false;
		var app = this.editor.status.app;
		var scene = app.createScene();
		var camera = app.createCamera();
		var light = app.createDirectionalLight();
		scene.addChild(camera);
		scene.addChild(light);
		app.scene = scene;
		this.editor.setScene(scene);
	}

	protected showOpenSceneDialog(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Dialogs/OpenScene";
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
			title: translator.getText("Message"),
			message: translator.getText("Message"),
			properties: ["openFile"],
			filters: [
				{
					name: translator.getText("FileType"),
					extensions: ["json"]
				}
			]
		};
		Dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseOpenSceneDialog
		);
	}

	protected saveSceneFile(): void {
		var filename = this.editor.status.scenePath;
		var scene = this.editor.status.scene;
		var json = scene.toJSON();
		var text = JSON.stringify(json, null, "\t");
		if (text.indexOf("\r\n") <= 0) {
			text = text.replace(/\n/g, "\r\n");
		}
		Tea.File.writeText(filename, text, null);
		this.editor.status.isChanged = false;
		this.emit("save", filename);
	}

	protected openNewProjectWindow(tab: string = null): void {
		//window.open("", "newProject");
		Electron.ipcRenderer.sendSync(
			"showWindow", "newProject", tab
		);
		this.editor.status.isChanged = false;
		window.close();
	}

	protected showSelectBuildTargetDialog(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Dialogs/SelectBuildTarget";
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
			title: translator.getText("Message"),
			message: translator.getText("Message"),
			properties: [
				"openDirectory",
				"createDirectory"
			]
		};
		Dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseOpenDialogBuild
		);
	}

	protected onCloseOpenSceneDialog = (filePaths: string[]): void => {
		if (filePaths == null || filePaths.length < 1) {
			return;
		}
		this.loadScene(filePaths[0]);
	}

	protected onCloseSaveSceneDialog = (filename: string): void => {
		if (filename == null) {
			this.emit("save", null);
			return;
		}
		this.editor.status.scenePath = filename;
		this.saveSceneFile();
		console.log(filename);
	}

	protected onCloseOpenDialogBuild = (filePaths: string[]): void => {
		if (filePaths == null || filePaths.length < 1) {
			return;
		}
		var builder = new AppBuilder();
		builder.targetPath = filePaths[0];
		builder.build();
	}
}
