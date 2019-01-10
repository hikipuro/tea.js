import * as Electron from "electron";
import * as Tea from "../../Tea";
import { EventDispatcher } from "../../utils/EventDispatcher";
import { Editor } from "../Editor";
import { EditorMenu } from "../EditorMenu";
import { AppBuilder } from "./AppBuilder";
import { Translator } from "../translate/Translator";
import { LocalFile } from "../LocalFile";
import { EditorSceneLoader } from "../EditorSceneLoader";

const remote = Electron.remote;
const Dialog = remote.dialog;

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
			var items = fileMenu.submenu.items;
			items.forEach((item: Electron.MenuItem) => {
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
			var items = fileMenu.submenu.items;
			items.forEach((item: Electron.MenuItem) => {
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
		var defaultPath = LocalFile.resolve("./assets/scene.json");
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
		var data = LocalFile.readText(path);
		if (data == null) {
			console.error("EditorCommand.loadScene(): " + path);
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
		var editor = this.editor;
		editor.status.scenePath = path;
		editor.status.isChanged = false;
		var app = this.editor.status.app;
		var prevScene = app.scene;
		var selectedObjectPath = "";
		var object3d = editor.hierarchyView.getSelectedObject();
		if (object3d) {
			selectedObjectPath = object3d.path;
		}
		EditorSceneLoader.load(app, json, (scene: Tea.Scene) => {
			app.scene = scene;
			editor.setScene(scene);
			if (prevScene) {
				prevScene.removeAllListeners("addChild");
				prevScene.removeAllListeners("removeChild");
				prevScene.destroy();
			}
			setTimeout(() => {
				var object3d = app.scene.findChild(selectedObjectPath);
				editor.hierarchyView.selectObject(object3d);
			}, 100);
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
			defaultId: 0,
			cancelId: 1
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
		this.resolveSceneDataPath(json);
		var text = JSON.stringify(json, null, "\t");
		if (text.indexOf("\r\n") <= 0) {
			text = text.replace(/\n/g, "\r\n");
		}
		LocalFile.writeText(filename, text);
		this.editor.status.isChanged = false;
		this.emit("save", filename);
	}

	protected resolveSceneDataPath(json: any): void {
		if (json == null) {
			return;
		}
		var forEachComponents = (components: any) => {
			if (components == null || components.length <= 0) {
				return;
			}
			components.forEach((component: any) => {
				if (component == null) {
					return;
				}
				var type = component[Tea.JSONUtil.TypeName];
				switch (type) {
					case "Script":
						component.path = this.resolveAssetsPath(component.path);
						//console.log(component.path);
						break;
					case "Image":
						component.url = this.resolveAssetsPath(component.url);
						break;
				}
				if (component.material != null) {
					component.material.textures.forEach((texture: any) => {
						if (texture == null
						||  texture.value == null
						||  texture.value.url == null) {
							return;
						}
						var url = this.resolveAssetsPath(texture.value.url);
						//console.log("Texture", texture.value.url, url);
						texture.value.url = url;
					});
				}
			});
		};
		var forEachChildren = (children: any) => {
			if (children == null || children.length <= 0) {
				return;
			}
			children.forEach((child: any) => {
				if (child == null) {
					return;
				}
				//console.log(child.name);
				forEachComponents(child.components);
				forEachChildren(child.children);
			});
		};
		forEachChildren(json.children);
		return;
	}

	protected resolveAssetsPath(path: string): string {
		if (path == null || path === "") {
			return path;
		}
		if (path.indexOf("/") === 0 || path.match(/^[a-z]:\\/i)) {
			path = LocalFile.relativeFromAssets(path);
		}
		path = path.replace(/\\/g, "/");
		return path;
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
