import * as fs from "fs";
import * as nodePath from "path";
import * as Electron from "electron";
var remote = null;
var Dialog = null;
if (Electron) {
	remote = Electron.remote;
	Dialog = remote.dialog;
}

declare module "fs" {
	function mkdirSync(path: string, mode?: any | number | string | null): void;
}
declare global {
	interface Window {
		open(url: string, frameName?: string, features?: string): Electron.BrowserWindowProxy;
	}
}

import * as Tea from "../../Tea";
import { EventDispatcher } from "../../utils/EventDispatcher";
import { Editor } from "../Editor";
import { EditorMenu } from "../EditorMenu";
import { HierarchyView } from "../HierarchyView";
import { InspectorView } from "../InspectorView";

export class EditorCommand extends EventDispatcher {
	editor: Editor;
	app: Tea.App;
	scene: Tea.Scene;
	hierarchyView: HierarchyView;
	inspectorView: InspectorView;

	constructor() {
		super();
	}

	showPreferences(): void {
		window.open("", "preferences");
	}

	play(): void {
		var menu = EditorMenu.getMainMenu();
		var fileMenu = menu.getMenuItemById("File");
		fileMenu.submenu.items.forEach((item: Electron.MenuItem) => {
			item.enabled = false;
		});

		var toolBox = this.editor.toolBox;
		this.scene.app.isEditing = false;
		toolBox.play();
	}

	stop(): void {
		var menu = EditorMenu.getMainMenu();
		var fileMenu = menu.getMenuItemById("File");
		fileMenu.submenu.items.forEach((item: Electron.MenuItem) => {
			item.enabled = true;
		});

		var toolBox = this.editor.toolBox;
		this.scene.app.isEditing = true;
		this.reloadScene();
		toolBox.stop();
	}

	newScene(): void {
		if (this.editor.status.isChanged === false) {
			this.createNewScene();
			return;
		}
		this.showConfirmSaveDialog((response: string) => {
			switch (response) {
				case "Save":
					this.once("save", (filename: string) => {
						if (filename != null) {
							this.createNewScene();
						}
					});
					this.saveScene();
					break;
				case "Don't Save":
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
		this.showConfirmSaveDialog((response: string) => {
			switch (response) {
				case "Save":
					this.once("save", (filename: string) => {
						if (filename != null) {
							this.showOpenSceneDialog();
						}
					});
					this.saveScene();
					break;
				case "Don't Save":
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
		var defaultPath = nodePath.resolve("./assets/scene.json");
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.SaveDialogOptions = {
			defaultPath: defaultPath,
			title: "Save scene file",
			message: "Save scene file",
			filters: [
				{ name: "Scene File", extensions: ["json"] }
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
			window.open("", "newProject");
			return;
		}
		this.showConfirmSaveDialog((response: string) => {
			switch (response) {
				case "Save":
					this.once("save", (filename: string) => {
						if (filename != null) {
							window.open("", "newProject");
						}
					});
					this.saveScene();
					break;
				case "Don't Save":
					window.open("", "newProject");
					break;
			}
		});
	}

	openProject(): void {
		console.log("openProject");
		if (this.editor.status.isChanged === false) {
			this.showOpenProjectDialog();
			return;
		}
		this.showConfirmSaveDialog((response: string) => {
			switch (response) {
				case "Save":
					this.once("save", (filename: string) => {
						if (filename != null) {
							this.showOpenProjectDialog();
						}
					});
					this.saveScene();
					break;
				case "Don't Save":
					this.showOpenProjectDialog();
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
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
			title: "Select output folder",
			message: "Select output folder",
			properties: ["openDirectory", "createDirectory"]
		};
		Dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseOpenDialogBuild
		);
	}

	loadScene(path: string): void {
		Tea.File.readText(path, (err, data) => {
			if (err) {
				console.error("EditorCommand.openScene(): " + path);
				console.error(err);
				return;
			}
			var json = null;
			try {
				json = JSON.parse(data);
			} catch (err) {
				console.error("EditorCommand.openScene(): " + path);
				console.error(err);
				return;
			}
			this.editor.status.scenePath = path;
			this.editor.status.isChanged = false;
			var app = this.app;
			var scene = app.createSceneFromJSON(json);
			app.setScene(scene);
			this.editor.setScene(scene);

			console.log("onload", app.isEditing, scene.isEditing);
		});
	}

	protected createNewScene(): void {
		this.scene.destroy();
		this.editor.status.scenePath = null;
		this.editor.status.isChanged = false;
		var app = this.app;
		var scene = app.createScene();
		var camera = app.createCamera();
		var light = app.createDirectionalLight();
		scene.addChild(camera);
		scene.addChild(light);
		app.setScene(scene);
		this.editor.setScene(scene);
	}

	protected buildApp(targetPath: string): void {
		var appPath = Electron.remote.app.getAppPath();
		var srcPath = nodePath.join(appPath, "html/build.html");
		var path = nodePath.join(targetPath, "index.html");
		fs.copyFileSync(srcPath, path);

		srcPath = nodePath.join(appPath, "html/build.js");
		path = nodePath.join(targetPath, "tea.js");
		fs.copyFileSync(srcPath, path);

		path = nodePath.join(targetPath, "scene.json");
		var sceneData = this.scene.toJSON();
		fs.writeFileSync(path, JSON.stringify(sceneData, null, "\t"));

		var scripts = this.findScriptPaths(sceneData);
		//console.log(scripts);
		scripts.forEach((scriptPath: string) => {
			var path = nodePath.join(targetPath, scriptPath);
			var dirname = nodePath.dirname(path);
			if (fs.existsSync(dirname) === false) {
				fs.mkdirSync(dirname, { recursive: true });
			}
			fs.copyFileSync(scriptPath, path);
		});
	}

	protected showOpenSceneDialog(): void {
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
			title: "Open scene file",
			message: "Open scene file",
			properties: ["openFile"],
			filters: [
				{ name: "Scene File", extensions: ["json"] }
			]
		};
		Dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseOpenSceneDialog
		);
	}

	protected showOpenProjectDialog(): void {
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
			title: "Open project folder",
			message: "Open project folder",
			properties: ["openDirectory"],
			filters: [
			]
		};
		Dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseOpenSceneDialog
		);
	}

	protected showConfirmSaveDialog(callback: (response: string) => void): void {
		console.log("showConfirmSaveDialog");
		var browserWindow = remote.getCurrentWindow();
		var buttons = [
			"Save", "Cancel", "Don't Save"
		];
		var options: Electron.MessageBoxOptions = {
			type: "info",
			message: "Scene have been modified",
			detail: "Do you want to save?",
			buttons: buttons,
			defaultId: 0
		};
		Dialog.showMessageBox(
			browserWindow, options,
			(response: number) => {
				callback(buttons[response]);
			}
		);
	}

	protected saveSceneFile(): void {
		var filename = this.editor.status.scenePath;
		var json = this.scene.toJSON();
		var text = JSON.stringify(json, null, "\t");
		if (text.indexOf("\r\n") <= 0) {
			text = text.replace(/\n/g, "\r\n");
		}
		Tea.File.writeText(filename, text, null);
		this.editor.status.isChanged = false;
		this.emit("save", filename);
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
		this.buildApp(filePaths[0]);
	}

	protected findScriptPaths(data: any): Array<string> {
		var find = (children: Array<any>): Array<string> => {
			if (children == null || children.length <= 0) {
				return [];
			}
			var scripts = [];
			var length = children.length;
			for (var i = 0; i < length; i++) {
				var child = children[i];
				if (child._type !== "Object3D") {
					continue;
				}
				var components = child.components as Array<any>;
				if (components == null || components.length <= 0) {
					continue;
				}
				scripts.push.apply(scripts,
					components.filter((component: any) => {
						return component._type === "Script";
					}
				));
			}
			var paths = scripts.map((script: any) => {
				return script.path;
			});
			for (var i = 0; i < length; i++) {
				var child = children[i];
				paths.push.apply(paths, find(child.children));
			}
			return paths;
		};
		return find(data.children);
	}
}
