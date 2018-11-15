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
import { Editor } from "../Editor";
import { HierarchyView } from "../HierarchyView";
import { InspectorView } from "../InspectorView";
import { EventDispatcher } from "../../utils/EventDispatcher";

export class EditorCommand extends EventDispatcher {
	editor: Editor;
	app: Tea.App;
	scene: Tea.Scene;
	hierarchyView: HierarchyView;
	inspectorView: InspectorView;

	scenePath: string;
	protected _isChanged: boolean;

	constructor() {
		super();
		this.scenePath = null;
		this._isChanged = false;
		this.updateWindowTitle();
	}

	get isChanged(): boolean {
		return this._isChanged;
	}
	set isChanged(value: boolean) {
		if (this.app.isEditing === false) {
			return;
		}
		if (this._isChanged === value) {
			return;
		}
		this._isChanged = value;
		this.updateWindowTitle();
	}

	showPreferences(): void {
		window.open("", "preferences");
	}

	newScene(force: boolean = false): void {
		if (force === false && this._isChanged) {
			this.showConfirmSaveDialog((response: string) => {
				switch (response) {
					case "Save":
						this.once("save", (filename: string) => {
							if (filename != null) {
								this.newScene();
							}
						});
						this.saveScene();
						break;
					case "Don't Save":
						this.newScene(true);
						break;
				}
			});
			return;
		}
		this.scene.destroy();
		this.scenePath = null;
		this.isChanged = false;
		var app = this.app;
		var scene = app.createScene();
		var camera = app.createCamera();
		var light = app.createDirectionalLight();
		scene.addChild(camera);
		scene.addChild(light);
		app.setScene(scene);
		this.editor.setScene(scene);
	}

	openScene(force: boolean = false): void {
		console.log("openScene");
		if (force === false && this._isChanged) {
			this.showConfirmSaveDialog((response: string) => {
				switch (response) {
					case "Save":
						this.once("save", (filename: string) => {
							if (filename != null) {
								this.openScene();
							}
						});
						this.saveScene();
						break;
					case "Don't Save":
						this.openScene(true);
						break;
				}
			});
			return;
		}
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
			properties: ["openFile"],
			filters: [
				{ name: "Scene File", extensions: ["json"] }
			]
		};
		Dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseOpenDialog
		);
	}

	saveScene(): void {
		console.log("saveScene");
		if (this._isChanged === false) {
			this.emit("save", null);
			return;
		}
		if (this.scenePath == null) {
			this.saveSceneAs();
			return;
		}
		this.saveSceneFile();
	}

	saveSceneAs(): void {
		console.log("saveSceneAs");
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.SaveDialogOptions = {
			defaultPath: ".",
			filters: [
				{ name: "Scene File", extensions: ["json"] }
			]
		};
		Dialog.showSaveDialog(
			browserWindow, options,
			this.onCloseSaveDialog
		);
	}

	reloadScene(): void {
		if (this.scenePath == null) {
			return;
		}
		this.loadScene(this.scenePath);
	}

	build(): void {
		console.log("build");
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
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
			this.scenePath = path;
			this.isChanged = false;
			var app = this.app;
			var scene = app.createSceneFromJSON(json);
			app.setScene(scene);
			this.editor.setScene(scene);

			console.log("onload", app.isEditing, scene.isEditing);
		});
	}

	protected buildApp(targetPath: string): void {
		var path = nodePath.join(targetPath, "index.html");
		fs.copyFileSync("html/build.html", path);

		path = nodePath.join(targetPath, "tea.js");
		fs.copyFileSync("html/build.js", path);

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

	protected updateWindowTitle(): void {
		if (remote == null || remote.getCurrentWindow == null) {
			return;
		}
		var window = remote.getCurrentWindow();
		var title = window.getTitle();
		var suffix = title.substr(-2);
		if (this._isChanged) {
			if (suffix !== " *") {
				title += " *";
				window.setTitle(title);
			}
		} else {
			if (suffix === " *") {
				title = title.substr(0, title.length - 2);
				window.setTitle(title);
			}
		}
	}

	protected saveSceneFile(): void {
		var filename = this.scenePath;
		var json = this.scene.toJSON();
		var text = JSON.stringify(json, null, "\t");
		if (text.indexOf("\r\n") <= 0) {
			text = text.replace(/\n/g, "\r\n");
		}
		Tea.File.writeText(filename, text, null);
		this.isChanged = false;
		this.emit("save", filename);
	}

	protected onCloseOpenDialog = (filePaths: string[]): void => {
		if (filePaths == null || filePaths.length < 1) {
			return;
		}
		this.loadScene(filePaths[0]);
	}

	protected onCloseSaveDialog = (filename: string): void => {
		if (filename == null) {
			this.emit("save", null);
			return;
		}
		this.scenePath = filename;
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
